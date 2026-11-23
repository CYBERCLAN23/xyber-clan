import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap, EASE, reducedMotion } from '../../lib/motion';
import { useT, T } from '../../lib/content';
import { useLenis } from '../../lib/SmoothScroll';
import Link from '../ui/Link';
import copy from './copy';
import { ArrowGlyph, ChoiceList, Chips, FieldError, MailGlyph, PhoneInput, Pill, ReturnGlyph, TextArea, TextInput, WhatsAppGlyph, useKeyboardInset } from './fields';
import { LETTERS, openExternal, clearSaved, isEmpty, loadSaved, phoneString, resolve, save, validEmail, validPhone } from './utils';

/*
 * FlowForm — one question per screen.
 *
 * Step shape:
 *   { id, kind: 'choice' | 'text' | 'textarea' | 'email' | 'phone' | 'group',
 *     multi, required (default true), title, pre, help, note   (node or (answers, ctx) => node)
 *     label (plain string for summaries), reviewLabel (node),
 *     options: [{ value, label (node), text (plain), sub }],
 *     fields (group): [{ id, kind, label, labelText, placeholder, required, autoComplete, options }],
 *     placeholder, autoComplete, inputMode, showIf(answers), validate(answers, m) => { id: message } }
 */

function fieldError(kind, value, required, m) {
  if (isEmpty(value)) return required ? m.errRequired : null;
  if (kind === 'email' && !validEmail(value)) return m.errEmail;
  if (kind === 'phone' && !validPhone(value)) return m.errPhone;
  return null;
}

function validateStep(step, answers, m) {
  const errs = {};
  if (step.kind === 'choice') {
    const req = step.required !== false;
    if (req && isEmpty(answers[step.id])) errs[step.id] = step.multi ? m.errChoose : m.errRequired;
  } else if (step.kind === 'group') {
    step.fields.forEach((f) => {
      if (f.kind === 'chips') return;
      const e = fieldError(f.kind, answers[f.id], f.required === true, m);
      if (e) errs[f.id] = e;
    });
  } else {
    const e = fieldError(step.kind, answers[step.id], step.required !== false, m);
    if (e) errs[step.id] = e;
  }
  const extra = step.validate?.(answers, m);
  return extra ? { ...extra, ...errs } : errs;
}

/** Plain-text value of one answer. */
function plainValue(def, value) {
  if (isEmpty(value)) return '';
  if (def.kind === 'phone') return phoneString(value);
  if (def.options) {
    const list = Array.isArray(value) ? value : [value];
    return list.map((v) => def.options.find((o) => o.value === v)?.text ?? v).join(', ');
  }
  return String(value).trim();
}

/** Summary rows for review, aside and hand-off: [{ id, stepId, label, labelNode, value }]. */
export function buildRows(steps, answers) {
  const rows = [];
  steps.forEach((s) => {
    if (s.kind === 'group') {
      s.fields.forEach((f) => rows.push({ id: f.id, stepId: s.id, label: f.labelText, labelNode: f.reviewLabel ?? f.label, value: plainValue(f, answers[f.id]) }));
    } else {
      rows.push({ id: s.id, stepId: s.id, label: s.label, labelNode: s.reviewLabel ?? s.label, value: plainValue(s, answers[s.id]) });
    }
  });
  return rows;
}

export default function FlowForm({
  id,
  heading,
  steps: allSteps,
  initialAnswers,
  intro,
  labels = {},
  channels = [],
  onSubmit,
  consent,
  nextSteps = [],
  successName,
  asideEmpty,
}) {
  const { tr, lang, isEditing } = useT();
  const c = copy[lang] || copy.en;
  const m = useMemo(() => {
    const out = {};
    Object.keys(c).forEach((k) => { out[k] = tr(`flowUi.${k}`, c[k]); });
    return out;
  }, [c, tr]);
  const U = (k) => <T k={`flowUi.${k}`} fb={c[k]} />;
  const lenis = useLenis();

  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) savedRef.current = loadSaved(id);
  const hasSaved = !!savedRef.current && Object.values(savedRef.current.answers).some((v) => !isEmpty(v));

  const [answers, setAnswers] = useState(() => ({ ...(initialAnswers || {}) }));
  const [errors, setErrors] = useState({});
  const [screen, setScreen] = useState(() => {
    if (hasSaved) return { type: 'resume' };
    if (intro) return { type: 'intro' };
    return { type: 'step', id: null };
  });
  const [fromReview, setFromReview] = useState(false);
  const [announce, setAnnounce] = useState('');

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const visible = useMemo(() => allSteps.filter((s) => !s.showIf || s.showIf(answers)), [allSteps, answers]);
  const visibleFor = useCallback((a) => allSteps.filter((s) => !s.showIf || s.showIf(a)), [allSteps]);

  const current = screen.type === 'step' ? visible.find((s) => s.id === screen.id) || visible[0] : null;
  const index = current ? visible.indexOf(current) : -1;
  const rows = useMemo(() => buildRows(visible, answers), [visible, answers]);
  const ctx = { tr, lang, m };

  // ── Autosave ──
  useEffect(() => {
    if (screen.type === 'resume' || screen.type === 'success') return;
    const any = Object.keys(answers).some((k) => !isEmpty(answers[k]) && !(initialAnswers && initialAnswers[k] === answers[k]));
    if (any) save(id, answers, current?.id ?? screen.type);
  }, [answers, screen, current, id, initialAnswers]);

  // ── Screen transitions ──
  const stage = useRef(null);
  const root = useRef(null);
  const dirRef = useRef(1);
  const busy = useRef(false);
  const firstRender = useRef(true);
  const pickTimer = useRef(null);
  const animate = !isEditing && !reducedMotion();

  const go = useCallback(
    (next, dir = 1) => {
      if (busy.current) return;
      clearTimeout(pickTimer.current);
      dirRef.current = dir;
      const commit = () => {
        busy.current = false;
        setErrors({});
        setScreen(next);
      };
      const parts = stage.current ? stage.current.querySelectorAll('.js-rise') : [];
      if (!animate || !parts.length) return commit();
      busy.current = true;
      gsap.to(parts, { y: dir > 0 ? -44 : 44, opacity: 0, duration: 0.28, ease: 'power2.in', stagger: 0.025, onComplete: commit });
      return undefined;
    },
    [animate],
  );

  const screenKey = screen.type === 'step' ? `step:${current?.id}` : screen.type;
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const parts = el.querySelectorAll('.js-rise');
    const isFirst = firstRender.current;
    firstRender.current = false;

    if (!isFirst) {
      const top = root.current ? root.current.getBoundingClientRect().top + window.scrollY : 0;
      if (window.scrollY > top + 4) {
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      }
    }
    if (animate && parts.length) {
      const d = dirRef.current;
      gsap.fromTo(parts, { y: d > 0 ? 64 : -48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: EASE.out, stagger: 0.06, delay: isFirst ? 0.25 : 0, clearProps: 'transform,opacity' });
    }
    if (isFirst) return;
    // Focus: the first field for typed answers, the picked (or first) option for choices, else the heading.
    const target =
      el.querySelector('[data-autofocus]') ||
      el.querySelector('[role="radio"][aria-checked="true"],[role="checkbox"][aria-checked="true"]') ||
      el.querySelector('[data-opt="0"]') ||
      el.querySelector('h1');
    target?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenKey]);

  useEffect(() => () => clearTimeout(pickTimer.current), []);

  // Announce the new screen to screen readers.
  useEffect(() => {
    if (screen.type === 'step' && current) setAnnounce(`${m.question} ${index + 1} ${m.of} ${visible.length}. ${current.label || ''}`);
    else if (screen.type === 'review') setAnnounce(m.reviewTitle);
    else if (screen.type === 'success') setAnnounce(m.successTitle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenKey]);

  // ── Navigation ──
  const firstStep = () => visibleFor(answersRef.current)[0];

  const ok = useCallback(() => {
    if (screen.type !== 'step' || !current || busy.current) return;
    const a = answersRef.current;
    const errs = validateStep(current, a, m);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      const node = stage.current?.querySelector(`#flow-${firstKey}`) || stage.current?.querySelector('[data-opt="0"]');
      node?.focus({ preventScroll: false });
      return;
    }
    const list = visibleFor(a);
    if (fromReview) {
      const pending = list.find((s) => list.indexOf(s) > list.indexOf(current) && Object.keys(validateStep(s, a, m)).length);
      if (pending) go({ type: 'step', id: pending.id }, 1);
      else {
        setFromReview(false);
        go({ type: 'review' }, 1);
      }
      return;
    }
    const i = list.indexOf(current);
    const next = list[i + 1];
    go(next ? { type: 'step', id: next.id } : { type: 'review' }, 1);
  }, [screen.type, current, m, visibleFor, fromReview, go]);

  const back = useCallback(() => {
    if (busy.current) return;
    const list = visibleFor(answersRef.current);
    if (screen.type === 'review') return go({ type: 'step', id: list[list.length - 1].id }, -1);
    if (screen.type !== 'step' || !current) return undefined;
    const i = list.indexOf(current);
    if (i > 0) return go({ type: 'step', id: list[i - 1].id }, -1);
    if (intro) return go({ type: 'intro' }, -1);
    return undefined;
  }, [screen.type, current, intro, visibleFor, go]);

  const setValue = (key, value) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const pick = useCallback(
    (step, value) => {
      if (step.multi) {
        setAnswers((a) => {
          const cur = Array.isArray(a[step.id]) ? a[step.id] : [];
          const nextVal = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value];
          return { ...a, [step.id]: nextVal };
        });
        setErrors({});
        return;
      }
      const nextAnswers = { ...answersRef.current, [step.id]: value };
      answersRef.current = nextAnswers;
      setAnswers(nextAnswers);
      setErrors({});
      clearTimeout(pickTimer.current);
      if (step.autoAdvance !== false && !isEditing) pickTimer.current = setTimeout(() => ok(), 320);
    },
    [isEditing, ok],
  );

  // ── Keyboard: Enter = OK, letters pick, ↑/↓ move ──
  useEffect(() => {
    const onKey = (e) => {
      if (isEditing || e.defaultPrevented) return;
      const t = e.target;
      if (t?.isContentEditable) return;
      const tag = t?.tagName;
      const inField = (tag === 'INPUT' && !['button', 'checkbox', 'radio', 'submit'].includes(t.type)) || tag === 'TEXTAREA' || tag === 'SELECT';
      const inFlow = t === document.body || t === document.documentElement || root.current?.contains(t);
      if (!inFlow || screen.type !== 'step' || !current) return;

      if (e.key === 'Enter') {
        if (e.isComposing) return;
        if (tag === 'TEXTAREA' && e.shiftKey) return;
        // In a multi-select, Enter on an option moves on (Space toggles it).
        const multiOpt = tag === 'BUTTON' && t.dataset?.opt != null && current.kind === 'choice' && current.multi;
        if ((tag === 'BUTTON' || tag === 'A') && !multiOpt && !(e.metaKey || e.ctrlKey)) return;
        e.preventDefault();
        ok();
        return;
      }
      if (inField || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const opt = t?.closest?.('[data-opt]');
        if (opt) {
          const all = [...stage.current.querySelectorAll('[data-opt]')];
          const i = all.indexOf(opt) + (e.key === 'ArrowDown' ? 1 : -1);
          if (all[i]) { e.preventDefault(); all[i].focus(); return; }
        }
        e.preventDefault();
        if (e.key === 'ArrowUp') back();
        else ok();
        return;
      }
      if (current.kind === 'choice' && /^[a-z]$/i.test(e.key)) {
        const i = LETTERS.indexOf(e.key.toUpperCase());
        const opt = current.options[i];
        if (!opt) return;
        e.preventDefault();
        pick(current, opt.value);
        const btn = stage.current?.querySelector(`[data-opt="${i}"]`);
        btn?.focus({ preventScroll: true });
        if (btn && animate) gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: EASE.spring, clearProps: 'transform' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isEditing, screen.type, current, ok, back, pick, animate]);

  // ── Submit / hand-off ──
  const submitted = useRef(false);
  const send = (channel) => {
    const a = answersRef.current;
    const r = buildRows(visibleFor(a), a);
    if (!submitted.current) {
      submitted.current = true;
      try {
        Promise.resolve(onSubmit?.(r, a, channel.kind)).catch(() => {});
      } catch {
        /* never block the hand-off */
      }
    }
    openExternal(channel.href(r, a));
    clearSaved(id);
    if (screen.type !== 'success') go({ type: 'success' }, 1);
  };

  const resume = () => {
    const s = savedRef.current;
    const a = { ...(initialAnswers || {}), ...s.answers };
    answersRef.current = a;
    setAnswers(a);
    const list = visibleFor(a);
    const at = list.find((x) => x.id === s.at);
    go(at ? { type: 'step', id: at.id } : s.at === 'review' ? { type: 'review' } : { type: 'step', id: list[0].id }, 1);
  };
  const restart = () => {
    clearSaved(id);
    const a = { ...(initialAnswers || {}) };
    answersRef.current = a;
    setAnswers(a);
    go(intro ? { type: 'intro' } : { type: 'step', id: firstStep().id }, 1);
  };

  const editFrom = (stepId) => {
    setFromReview(true);
    go({ type: 'step', id: stepId }, -1);
  };

  // ── Progress ──
  const total = visible.length;
  const progress =
    screen.type === 'success' ? 1 : screen.type === 'review' ? 0.96 : screen.type === 'step' ? (index + 0.35) / (total + 0.4) : 0.02;

  const bar = useRef(null);
  useKeyboardInset(bar);

  const optional = current && (current.kind === 'group' ? false : current.required === false);
  const currentEmpty = current && (current.kind === 'group' ? false : isEmpty(answers[current.id]));
  const isLast = index === total - 1;
  const okLabel = optional && currentEmpty ? U('skip') : isLast && labels.submit ? labels.submit : labels.ok ?? U('ok');

  // ── Render helpers ──
  const errId = (k) => `flow-${k}-err`;
  const renderInput = (step) => {
    const k = step.id;
    const err = errors[k];
    const common = {
      id: `flow-${k}`,
      'data-autofocus': true,
      'aria-labelledby': `flow-title-${step.id}`,
      'aria-describedby': [step.help ? `flow-help-${step.id}` : null, errId(k)].filter(Boolean).join(' '),
      'aria-invalid': err ? true : undefined,
      'aria-required': step.required !== false || undefined,
      placeholder: step.placeholder,
    };
    if (step.kind === 'choice') {
      return (
        <>
          <ChoiceList
            name={k}
            options={step.options}
            value={answers[k]}
            multi={step.multi}
            onPick={(v) => pick(step, v)}
            labelledBy={`flow-title-${step.id}`}
            describedBy={errId(k)}
            invalid={!!err}
            columns={step.columns}
          />
          <FieldError id={errId(k)} message={err} />
        </>
      );
    }
    if (step.kind === 'textarea') {
      return (
        <>
          <TextArea {...common} value={answers[k] || ''} maxLength={step.maxLength ?? 3000} onChange={(e) => setValue(k, e.target.value)} />
          <FieldError id={errId(k)} message={err} />
        </>
      );
    }
    if (step.kind === 'phone') {
      return (
        <>
          <PhoneInput {...common} value={answers[k]} codeLabel={m.countryCode} describedBy={common['aria-describedby']} invalid={!!err} onChange={(v) => setValue(k, v)} />
          <FieldError id={errId(k)} message={err} />
        </>
      );
    }
    if (step.kind === 'group') {
      return (
        <div className="grid max-w-[44rem] gap-5">
          {step.fields.map((f, fi) => {
            const fe = errors[f.id];
            const labelId = `flow-label-${f.id}`;
            const fprops = {
              id: `flow-${f.id}`,
              compact: true,
              'aria-labelledby': labelId,
              'aria-describedby': [f.help ? `flow-fhelp-${f.id}` : null, errId(f.id)].filter(Boolean).join(' '),
              'aria-invalid': fe ? true : undefined,
              'aria-required': f.required || undefined,
              placeholder: f.placeholder,
              autoComplete: f.autoComplete,
              ...(fi === 0 ? { 'data-autofocus': true } : {}),
            };
            return (
              <div key={f.id}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <label id={labelId} htmlFor={`flow-${f.id}`} className="text-[1rem] font-medium text-ink">
                    {f.label}
                  </label>
                  {!f.required && f.kind !== 'chips' && <span className="t-small text-ink-3">{U('optional')}</span>}
                </div>
                {f.kind === 'chips' ? (
                  <Chips options={f.options} value={answers[f.id]} onPick={(v) => setValue(f.id, v)} labelledBy={labelId} />
                ) : f.kind === 'phone' ? (
                  <PhoneInput {...fprops} value={answers[f.id]} codeLabel={m.countryCode} describedBy={fprops['aria-describedby']} invalid={!!fe} required={f.required} onChange={(v) => setValue(f.id, v)} />
                ) : (
                  <TextInput
                    {...fprops}
                    type={f.kind === 'email' ? 'email' : f.kind === 'url' ? 'url' : 'text'}
                    inputMode={f.kind === 'email' ? 'email' : f.kind === 'url' ? 'url' : undefined}
                    value={answers[f.id] || ''}
                    maxLength={f.maxLength ?? 300}
                    onChange={(e) => setValue(f.id, e.target.value)}
                  />
                )}
                {f.help && <p id={`flow-fhelp-${f.id}`} className="t-small mt-2 text-ink-3">{f.help}</p>}
                {f.kind !== 'chips' && <FieldError id={errId(f.id)} message={fe} />}
              </div>
            );
          })}
          {errors[step.id] && <FieldError id={errId(step.id)} message={errors[step.id]} />}
        </div>
      );
    }
    return (
      <>
        <TextInput
          {...common}
          type={step.kind === 'email' ? 'email' : 'text'}
          inputMode={step.kind === 'email' ? 'email' : step.inputMode}
          autoComplete={step.autoComplete}
          value={answers[k] || ''}
          maxLength={step.maxLength ?? 200}
          onChange={(e) => setValue(k, e.target.value)}
        />
        <FieldError id={errId(k)} message={err} />
      </>
    );
  };

  const okRow = (
    <div className="flex items-center gap-4">
      <Pill size="lg" onClick={ok} className="min-w-[8.5rem]">
        <span>{okLabel}</span>
        <ArrowGlyph className="h-4 w-4" />
      </Pill>
      <span className="hidden items-center gap-1.5 text-[0.9rem] text-ink-3 md:inline-flex">
        <ReturnGlyph className="h-4 w-4" />
        {current?.kind === 'textarea' ? U('newline') : U('pressEnter')}
      </span>
    </div>
  );

  const ChannelButtons = ({ compact = false }) => (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${compact ? '' : 'mt-2'}`}>
      {channels.map((ch, i) => (
        <Pill key={ch.kind} variant={i === 0 ? 'primary' : 'secondary'} size={compact ? 'md' : 'lg'} onClick={() => send(ch)} className="w-full sm:w-auto">
          {ch.kind === 'whatsapp' ? <WhatsAppGlyph className="h-5 w-5" /> : <MailGlyph className="h-5 w-5" />}
          <span>{ch.label}</span>
        </Pill>
      ))}
    </div>
  );

  // ── Aside (wide screens): the brief taking shape ──
  // Only answers to questions already reached (defaults on later questions stay hidden).
  const reached = new Set(visible.slice(0, screen.type === 'step' ? index + 1 : visible.length).map((s) => s.id));
  const answered = rows.filter((r) => r.value && reached.has(r.stepId));
  const aside = (() => {
    if (screen.type === 'success') {
      return (
        <div className="relative flex h-full min-h-[30rem] items-end justify-center overflow-hidden rounded-media bg-cyan p-10">
          <img src="/brand/mascot.webp" alt="" width="494" height="483" className="js-mascot w-[78%] max-w-[22rem]" />
        </div>
      );
    }
    if (screen.type === 'review' && nextSteps.length) {
      return (
        <div className="rounded-card bg-paper-2 p-8 xl:p-10">
          <p className="t-small font-medium text-ink-3">{U('nextTitle')}</p>
          <ol className="mt-6 grid gap-4">
            {nextSteps.map((s, i) => (
              <li key={i} className="flex gap-4 text-[1.02rem] leading-snug text-ink">
                <span className="tabular w-5 shrink-0 font-medium text-accent">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    }
    if (screen.type === 'intro' || screen.type === 'resume') {
      return (
        <div className="rounded-card bg-paper-2 p-8 xl:p-10">
          <p className="t-small font-medium text-ink-3">{U('whatWeAsk')}</p>
          <ol className="mt-6 grid gap-3">
            {visible.map((s, i) => (
              <li key={s.id} className="flex gap-4 text-[1.02rem] leading-snug text-ink">
                <span className="tabular w-6 shrink-0 text-ink-3">{i + 1}</span>
                <span>{s.reviewLabel ?? s.label}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    }
    return (
      <div className="rounded-card bg-paper-2 p-8 xl:p-10">
        <p className="t-small font-medium text-ink-3">{U('yourBrief')}</p>
        {answered.length === 0 ? (
          <div className="mt-6 grid gap-6">
            <p className="t-body text-ink-2">{U('briefEmpty')}</p>
            {asideEmpty}
          </div>
        ) : (
          <dl className="mt-6 grid gap-5">
            {answered.map((r) => (
              <div key={r.id} className={`transition-opacity duration-500 ${current && r.stepId === current.id ? 'opacity-100' : 'opacity-80'}`}>
                <dt className="t-small text-ink-3">{r.labelNode}</dt>
                <dd className="mt-1 line-clamp-3 whitespace-pre-line text-[1.02rem] leading-snug text-ink">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    );
  })();

  // Gentle float for the mascot.
  useEffect(() => {
    if (screen.type !== 'success' || !animate) return undefined;
    const el = root.current?.querySelectorAll('.js-mascot');
    if (!el?.length) return undefined;
    const tw = gsap.fromTo(el, { y: 40, rotate: -4, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1.1, ease: EASE.spring, delay: 0.2 });
    const bob = gsap.to(el, { y: -10, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.3 });
    return () => { tw.kill(); bob.kill(); };
  }, [screen.type, animate]);

  // ── Screens ──
  let body = null;
  if (screen.type === 'resume') {
    const n = Object.values(savedRef.current?.answers || {}).filter((v) => !isEmpty(v)).length;
    body = (
      <>
        <h1 tabIndex={-1} className="js-rise t-headline outline-none">{U('resumeTitle')}</h1>
        <p className="js-rise t-lead mt-5 max-w-[36rem] text-ink-2">{U('resumeLead')}</p>
        <p className="js-rise t-small mt-3 text-ink-3"><span className="tabular">{n}</span> {U('resumeCount')}</p>
        <div className="js-rise mt-10 flex flex-col gap-3 sm:flex-row">
          <Pill size="lg" onClick={resume} className="w-full sm:w-auto"><span>{U('resumeContinue')}</span><ArrowGlyph className="h-4 w-4" /></Pill>
          <Pill size="lg" variant="secondary" onClick={restart} className="w-full sm:w-auto">{U('resumeRestart')}</Pill>
        </div>
      </>
    );
  } else if (screen.type === 'intro') {
    body = (
      <>
        {intro.badge && <p className="js-rise t-small font-medium text-ink-3">{intro.badge}</p>}
        <h1 tabIndex={-1} className="js-rise t-display mt-4 outline-none">{intro.title}</h1>
        {intro.lead && <p className="js-rise t-lead mt-6 max-w-[38rem] text-ink-2">{intro.lead}</p>}
        <div className="js-rise mt-10">
          <Pill size="lg" onClick={() => go({ type: 'step', id: firstStep().id }, 1)} className="w-full sm:w-auto">
            <span>{intro.start}</span>
            <ArrowGlyph className="h-4 w-4" />
          </Pill>
        </div>
        <div className="js-rise mt-14 rounded-card bg-paper-2 p-6 lg:hidden">
          <p className="t-small font-medium text-ink-3">{U('whatWeAsk')}</p>
          <ol className="mt-4 grid gap-2.5">
            {visible.map((s, i) => (
              <li key={s.id} className="flex gap-3 text-[1rem] leading-snug text-ink">
                <span className="tabular w-6 shrink-0 text-ink-3">{i + 1}</span>
                <span>{s.reviewLabel ?? s.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </>
    );
  } else if (screen.type === 'step' && current) {
    const pre = resolve(current.pre, answers, ctx);
    const help = resolve(current.help, answers, ctx);
    const note = resolve(current.note, answers, ctx);
    body = (
      <>
        <p className="js-rise t-small mb-5 flex items-center gap-2 text-ink-3">
          <span className="tabular font-medium text-accent">{index + 1}</span>
          <ArrowGlyph className="h-3.5 w-3.5 text-accent" />
          {optional && <span>{U('optional')}</span>}
        </p>
        {pre && <p className="js-rise t-lead mb-3 text-ink-2">{pre}</p>}
        <h1 id={`flow-title-${current.id}`} tabIndex={-1} className="js-rise t-headline max-w-[22ch] outline-none xl:text-[3.6rem]">
          {resolve(current.title, answers, ctx)}
        </h1>
        {help && (
          <p id={`flow-help-${current.id}`} className="js-rise t-lead mt-5 max-w-[40rem] text-ink-2">
            {help}
          </p>
        )}
        <div className="js-rise mt-9 md:mt-11">{renderInput(current)}</div>
        {note && <div className="js-rise t-small mt-4 max-w-[40rem] text-ink-3">{note}</div>}
        <div className="js-rise mt-8 hidden md:block">{okRow}</div>
      </>
    );
  } else if (screen.type === 'review') {
    body = (
      <>
        <h1 tabIndex={-1} className="js-rise t-headline outline-none">{labels.reviewTitle ?? U('reviewTitle')}</h1>
        <p className="js-rise t-lead mt-5 max-w-[38rem] text-ink-2">{labels.reviewLead ?? U('reviewLead')}</p>
        <dl className="js-rise mt-10 grid gap-2.5">
          {rows.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 rounded-[18px] bg-paper-2 px-5 py-4 md:grid-cols-[minmax(0,15rem)_1fr_auto]">
              <dt className="t-small col-span-1 pt-0.5 text-ink-3 md:col-span-1">{r.labelNode}</dt>
              <dd className={`col-span-2 row-start-2 whitespace-pre-line break-words text-[1.05rem] leading-snug md:col-span-1 md:col-start-2 md:row-start-1 ${r.value ? 'text-ink' : 'text-ink-3'}`}>
                {r.value || U('skipped')}
              </dd>
              <dd className="col-start-2 row-start-1 md:col-start-3">
                <button
                  type="button"
                  onClick={() => editFrom(r.stepId)}
                  aria-label={`${m.edit}: ${r.label}`}
                  className="inline-flex h-9 items-center rounded-full bg-paper px-4 text-[0.9rem] font-medium text-ink transition-colors hover:bg-paper-3"
                >
                  {U('edit')}
                </button>
              </dd>
            </div>
          ))}
        </dl>
        <div className="js-rise mt-10 grid gap-5">
          {consent && <p className="t-small max-w-[40rem] text-ink-2">{consent}</p>}
          <ChannelButtons />
          {channels.length > 1 && <p className="t-small max-w-[34rem] text-ink-3">{U('reviewHow')}</p>}
          <div>
            <button type="button" onClick={back} className="inline-flex h-11 items-center gap-2 rounded-full px-1 text-[0.95rem] font-medium text-ink-2 transition-colors hover:text-ink">
              <ArrowGlyph dir="left" className="h-4 w-4" />
              {labels.backToEdit ?? U('back')}
            </button>
          </div>
        </div>
      </>
    );
  } else if (screen.type === 'success') {
    const name = successName?.(answers);
    body = (
      <>
        <img src="/brand/mascot.webp" alt="" width="494" height="483" className="js-rise js-mascot mb-8 w-36 lg:hidden" />
        <h1 tabIndex={-1} className="js-rise t-headline max-w-[18ch] outline-none">
          {name ? <T k="flowUi.successTitleName" fb={c.successTitleName.replace('{name}', name)} /> : U('successTitle')}
        </h1>
        <p className="js-rise t-lead mt-5 max-w-[38rem] text-ink-2">{U('successLead')}</p>
        {nextSteps.length > 0 && (
          <ol className="js-rise mt-10 grid max-w-[40rem] gap-3">
            {nextSteps.map((s, i) => (
              <li key={i} className="flex gap-4 rounded-[18px] bg-paper-2 px-5 py-4 text-[1.05rem] leading-snug">
                <span className="tabular w-5 shrink-0 font-medium text-accent">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        )}
        {channels.length > 0 && (
          <div className="js-rise mt-10 grid gap-3">
            <p className="t-small text-ink-3">{U('successNotOpened')}</p>
            <ChannelButtons compact />
          </div>
        )}
        <div className="js-rise mt-10">
          <Link to="/" className="group inline-flex h-11 items-center gap-2 text-[1rem] font-medium text-ink underline decoration-ink-3 underline-offset-4 hover:decoration-ink">
            {labels.returnHome ?? U('returnHome')}
          </Link>
        </div>
      </>
    );
  }

  const showBar = screen.type === 'step';
  const canBack = screen.type === 'step' && (index > 0 || !!intro);

  return (
    <section ref={root} data-flow={id} className="relative min-h-[100svh] pt-[var(--nav-h)]">
      {/* Progress: the brand spark filling its track */}
      <div className="shell pt-4 md:pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {canBack && (
              <button type="button" onClick={back} className="hidden h-9 shrink-0 items-center gap-2 rounded-full bg-paper-2 pl-3 pr-4 text-[0.92rem] font-medium text-ink transition-colors hover:bg-paper-3 md:inline-flex">
                <ArrowGlyph dir="left" className="h-4 w-4" />
                {labels.back ?? U('back')}
              </button>
            )}
            <p className="t-small truncate font-medium text-ink-2">{heading}</p>
          </div>
          {screen.type === 'step' && (
            <p className="t-small shrink-0 tabular text-ink-3">
              {index + 1} {U('of')} {total}
            </p>
          )}
        </div>
        <div
          role="progressbar"
          aria-label={m.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-paper-3"
        >
          <div
            className="h-full min-w-[2.6rem] rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--brand-cyan)_0%,transparent),var(--brand-cyan)_70%)] transition-[width] duration-[900ms] ease-[var(--ease-out)]"
            style={{ width: `${Math.max(progress * 100, 3)}%` }}
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announce}</p>

      <div className="shell grid gap-[var(--gap)] pb-36 pt-10 md:pb-24 md:pt-14 lg:grid-cols-12 lg:pt-16">
        <div ref={stage} data-flow-stage className="flex flex-col justify-start md:min-h-[calc(100svh-var(--nav-h)-14rem)] md:justify-center lg:col-span-7 lg:min-h-[calc(100svh-var(--nav-h)-12rem)]">
          <div key={screenKey}>{body}</div>
        </div>
        <aside aria-label={screen.type === 'success' ? undefined : m.yourBrief} aria-hidden={screen.type === 'success' || undefined} className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-[calc(var(--nav-h)+2rem)] max-h-[calc(100svh-var(--nav-h)-4rem)] overflow-auto rounded-card" data-lenis-prevent>
            {aside}
          </div>
        </aside>
      </div>

      {/* Phone action bar: stays above the keyboard */}
      {showBar && (
        <div ref={bar} className="fixed inset-x-0 bottom-0 z-[700] bg-paper px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 md:hidden">
          <div className="flex gap-2.5">
            {canBack && (
              <button type="button" onClick={back} aria-label={m.back} className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-paper-2 text-ink active:scale-95">
                <ArrowGlyph dir="left" className="h-5 w-5" />
              </button>
            )}
            <Pill size="lg" onClick={ok} className="flex-1">
              <span>{okLabel}</span>
              <ArrowGlyph className="h-4 w-4" />
            </Pill>
          </div>
        </div>
      )}
    </section>
  );
}
