import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, limit, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Meta from '../../components/Meta';
import Logo from '../../brand/Logo';
import { useT } from '../../lib/content';
import { ADMIN_BASE } from '../../config/adminPath';
import { LEAD_FLOWS, LEAD_STATUSES, leadDetails } from '../../lib/leads';

// Operator copy (not CMS content).
const COPY = {
  en: {
    title: 'Leads',
    lead: 'Every request sent from Start a project, Careers and Partners.',
    back: 'Back to the editor',
    all: 'All',
    flows: { project: 'Projects', career: 'Careers', partnership: 'Partnerships' },
    flowOne: { project: 'Project', career: 'Career', partnership: 'Partnership' },
    statuses: { new: 'New', contacted: 'Contacted', won: 'Won', lost: 'Lost' },
    filterFlow: 'Filter by form',
    filterStatus: 'Filter by status',
    loading: 'Loading leads…',
    errorTitle: 'Leads could not be loaded.',
    errorBody: 'Check that you are signed in and that the latest Firestore rules (with the leads collection) are deployed.',
    retry: 'Try again',
    emptyTitle: 'No leads yet.',
    emptyBody: 'New requests from Start a project, Careers and Partners appear here the moment they are sent.',
    noMatch: 'No leads match these filters.',
    clear: 'Clear filters',
    pick: 'Select a lead to see every answer.',
    answers: 'Answers',
    status: 'Status',
    reply: 'Reply',
    whatsapp: 'Reply on WhatsApp',
    email: 'Reply by email',
    copyPhone: 'Copy number',
    copied: 'Copied',
    received: 'Received',
    page: 'Sent from',
    language: 'Language',
    prefers: 'Prefers',
    saveError: 'Status not saved. Try again.',
    list: 'Leads list',
    close: 'Back to list',
    greeting: (name) => `Hello ${name}, this is XyberClan. Thank you for your request.`,
    subject: 'Your request to XyberClan',
  },
  fr: {
    title: 'Demandes',
    lead: 'Toutes les demandes envoyées depuis Démarrer un projet, Carrières et Partenaires.',
    back: 'Retour à l’éditeur',
    all: 'Toutes',
    flows: { project: 'Projets', career: 'Carrières', partnership: 'Partenariats' },
    flowOne: { project: 'Projet', career: 'Carrière', partnership: 'Partenariat' },
    statuses: { new: 'Nouvelle', contacted: 'Contactée', won: 'Gagnée', lost: 'Perdue' },
    filterFlow: 'Filtrer par formulaire',
    filterStatus: 'Filtrer par statut',
    loading: 'Chargement des demandes…',
    errorTitle: 'Impossible de charger les demandes.',
    errorBody: 'Vérifiez que vous êtes connecté et que les dernières règles Firestore (avec la collection leads) sont déployées.',
    retry: 'Réessayer',
    emptyTitle: 'Aucune demande pour l’instant.',
    emptyBody: 'Les nouvelles demandes de Démarrer un projet, Carrières et Partenaires apparaissent ici dès leur envoi.',
    noMatch: 'Aucune demande ne correspond à ces filtres.',
    clear: 'Effacer les filtres',
    pick: 'Choisissez une demande pour voir toutes les réponses.',
    answers: 'Réponses',
    status: 'Statut',
    reply: 'Répondre',
    whatsapp: 'Répondre sur WhatsApp',
    email: 'Répondre par email',
    copyPhone: 'Copier le numéro',
    copied: 'Copié',
    received: 'Reçue',
    page: 'Envoyée depuis',
    language: 'Langue',
    prefers: 'Préfère',
    saveError: 'Statut non enregistré. Réessayez.',
    list: 'Liste des demandes',
    close: 'Retour à la liste',
    greeting: (name) => `Bonjour ${name}, ici XyberClan. Merci pour votre demande.`,
    subject: 'Votre demande à XyberClan',
  },
};

const STATUS_DOT = {
  new: 'bg-cyan',
  contacted: 'bg-blue',
  won: 'bg-ink',
  lost: 'bg-ink-3',
};

const toDate = (ts) => (ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : null);

function when(ts, lang) {
  const d = toDate(ts);
  if (!d) return '';
  const diff = (Date.now() - d.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
  if (diff < 60) return rtf.format(0, 'second');
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute');
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour');
  if (diff < 86400 * 7) return rtf.format(-Math.round(diff / 86400), 'day');
  return d.toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' });
}

const fullDate = (ts, lang) => toDate(ts)?.toLocaleString(lang, { dateStyle: 'medium', timeStyle: 'short' }) || '';

function Chip({ on, onClick, children, count }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-[0.9rem] font-medium transition-colors ${on ? 'bg-ink text-paper' : 'bg-paper-2 text-ink hover:bg-paper-3'}`}
    >
      {children}
      {count != null && <span className={`tabular text-[0.82rem] ${on ? 'text-paper/70' : 'text-ink-3'}`}>{count}</span>}
    </button>
  );
}

export default function LeadsInbox() {
  const { lang } = useT();
  const c = COPY[lang] || COPY.en;
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [state, setState] = useState('loading'); // loading | ready | error
  const [attempt, setAttempt] = useState(0);
  const [flow, setFlow] = useState('all');
  const [status, setStatus] = useState('all');
  const [openId, setOpenId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [copied, setCopied] = useState(false);
  const detailRef = useRef(null);

  useEffect(() => {
    setState('loading');
    let unsub = () => {};
    try {
      const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'), limit(500));
      unsub = onSnapshot(
        q,
        (snap) => {
          setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setState('ready');
        },
        () => setState('error'),
      );
    } catch {
      setState('error');
    }
    return () => unsub();
  }, [attempt]);

  const counts = useMemo(() => {
    const byFlow = { all: leads.length };
    const byStatus = { all: 0 };
    LEAD_FLOWS.forEach((f) => { byFlow[f] = leads.filter((l) => l.flow === f).length; });
    const inFlow = flow === 'all' ? leads : leads.filter((l) => l.flow === flow);
    byStatus.all = inFlow.length;
    LEAD_STATUSES.forEach((s) => { byStatus[s] = inFlow.filter((l) => (l.status || 'new') === s).length; });
    return { byFlow, byStatus };
  }, [leads, flow]);

  const shown = useMemo(
    () => leads.filter((l) => (flow === 'all' || l.flow === flow) && (status === 'all' || (l.status || 'new') === status)),
    [leads, flow, status],
  );
  const open = leads.find((l) => l.id === openId) || null;

  useEffect(() => {
    if (open) detailRef.current?.focus({ preventScroll: true });
    setSaveError(false);
    setCopied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  const setLeadStatus = async (id, next) => {
    setSaving(true);
    setSaveError(false);
    try {
      await updateDoc(doc(db, 'leads', id), { status: next });
    } catch {
      setSaveError(true);
    }
    setSaving(false);
  };

  // Links are opened from buttons: the editor blocks plain anchors while editing.
  const openUrl = (url) => {
    if (url.startsWith('mailto:')) window.location.href = url;
    else window.open(url, '_blank', 'noopener,noreferrer');
  };
  const first = (name) => String(name || '').trim().split(/\s+/)[0] || '';
  const waUrl = (l) => `https://wa.me/${String(l.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(c.greeting(first(l.name)))}`;
  const mailUrl = (l) => `mailto:${l.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(`${c.greeting(first(l.name))}\n\n`)}`;
  const copyPhone = async (l) => {
    try {
      await navigator.clipboard.writeText(l.phone);
      setCopied(true);
    } catch {
      /* clipboard blocked */
    }
  };

  const summary = (l) => l.title || l.services || l.type || leadDetails(l)[0]?.[1] || '';

  const detail = open && (
    <div ref={detailRef} tabIndex={-1} aria-labelledby="lead-name" className="rounded-card bg-paper-2 p-6 outline-none md:p-8">
      <button type="button" onClick={() => setOpenId(null)} className="mb-5 inline-flex h-9 items-center gap-2 rounded-full bg-paper px-4 text-[0.9rem] font-medium lg:hidden">
        <svg viewBox="0 0 16 16" className="h-4 w-4 rotate-180" aria-hidden="true"><path d="M2 8h11M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {c.close}
      </button>
      <p className="t-small text-ink-3">
        {c.flowOne[open.flow] || open.flow}
        {open.type ? ` · ${open.type}` : ''}
      </p>
      <h2 id="lead-name" className="t-title mt-1 break-words">{open.name || open.email || open.phone || '—'}</h2>
      <p className="t-small mt-1 text-ink-2">
        {c.received} {fullDate(open.createdAt, lang)}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {open.phone && (
          <button type="button" onClick={() => openUrl(waUrl(open))} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.95rem] font-medium text-paper transition-colors hover:bg-cyan hover:text-on-cyan">
            {c.whatsapp}
          </button>
        )}
        {open.email && (
          <button type="button" onClick={() => openUrl(mailUrl(open))} className={`inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.95rem] font-medium transition-colors ${open.phone ? 'bg-paper text-ink hover:bg-paper-3' : 'bg-ink text-paper hover:bg-cyan hover:text-on-cyan'}`}>
            {c.email}
          </button>
        )}
        {open.phone && (
          <button type="button" onClick={() => copyPhone(open)} className="inline-flex h-11 items-center rounded-full bg-paper px-5 text-[0.95rem] font-medium text-ink transition-colors hover:bg-paper-3">
            {copied ? c.copied : c.copyPhone}
          </button>
        )}
      </div>

      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[0.95rem]">
        {open.phone && (<><dt className="text-ink-3">WhatsApp</dt><dd className="tabular break-all">{open.phone}</dd></>)}
        {open.email && (<><dt className="text-ink-3">Email</dt><dd className="break-all">{open.email}</dd></>)}
        {open.channel && (<><dt className="text-ink-3">{c.prefers}</dt><dd>{open.channel}</dd></>)}
        {open.lang && (<><dt className="text-ink-3">{c.language}</dt><dd className="uppercase">{open.lang}</dd></>)}
        {open.page && (<><dt className="text-ink-3">{c.page}</dt><dd className="break-all text-ink-2">{open.page.replace(/^https?:\/\//, '')}</dd></>)}
      </dl>

      <fieldset className="mt-7">
        <legend className="t-small mb-2 text-ink-3">{c.status}</legend>
        <div className="flex flex-wrap gap-2" aria-busy={saving || undefined}>
          {LEAD_STATUSES.map((s) => (
            <Chip key={s} on={(open.status || 'new') === s} onClick={() => setLeadStatus(open.id, s)}>
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} />
              {c.statuses[s]}
            </Chip>
          ))}
        </div>
        <p role="status" className="t-small mt-2 min-h-[1.4em] text-[#b42318] dark:text-[#ff9b8f]">{saveError ? c.saveError : ''}</p>
      </fieldset>

      <h3 className="t-small mt-6 font-medium text-ink-3">{c.answers}</h3>
      <dl className="mt-3 grid gap-1.5">
        {leadDetails(open).map(([label, value], i) => (
          <div key={i} className="grid gap-1 rounded-[14px] bg-paper px-4 py-3 md:grid-cols-[minmax(0,13rem)_1fr] md:gap-4">
            <dt className="text-[0.88rem] text-ink-3">{label}</dt>
            <dd className={`whitespace-pre-line break-words text-[0.98rem] ${value ? 'text-ink' : 'text-ink-3'}`}>{value || '—'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <div className="min-h-screen bg-paper pb-32 text-ink">
      <Meta title={c.title} />
      <header className="shell flex items-center justify-between gap-4 py-5">
        <div className="flex items-center gap-3">
          <Logo variant="symbol" decorative className="h-8 w-auto" />
          <span className="t-small text-ink-3">XyberClan</span>
        </div>
        <button type="button" onClick={() => navigate(ADMIN_BASE)} className="inline-flex h-10 items-center rounded-full bg-paper-2 px-4 text-[0.92rem] font-medium transition-colors hover:bg-paper-3">
          {c.back}
        </button>
      </header>

      <main id="main" className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6 pt-6 md:pt-10">
          <div>
            <h1 className="t-headline">{c.title}</h1>
            <p className="t-small mt-2 text-ink-2">{c.lead}</p>
          </div>
          {state === 'ready' && (
            <p className="t-small tabular text-ink-3">
              {counts.byStatus.new} {c.statuses.new.toLowerCase()} · {leads.length}
            </p>
          )}
        </div>

        <div className="grid gap-3 pb-6">
          <div role="group" aria-label={c.filterFlow} className="flex flex-wrap gap-2">
            <Chip on={flow === 'all'} onClick={() => setFlow('all')} count={state === 'ready' ? counts.byFlow.all : null}>{c.all}</Chip>
            {LEAD_FLOWS.map((f) => (
              <Chip key={f} on={flow === f} onClick={() => setFlow(f)} count={state === 'ready' ? counts.byFlow[f] : null}>{c.flows[f]}</Chip>
            ))}
          </div>
          <div role="group" aria-label={c.filterStatus} className="flex flex-wrap gap-2">
            <Chip on={status === 'all'} onClick={() => setStatus('all')} count={state === 'ready' ? counts.byStatus.all : null}>{c.all}</Chip>
            {LEAD_STATUSES.map((s) => (
              <Chip key={s} on={status === s} onClick={() => setStatus(s)} count={state === 'ready' ? counts.byStatus[s] : null}>
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} />
                {c.statuses[s]}
              </Chip>
            ))}
          </div>
        </div>

        {state === 'loading' && (
          <div role="status" aria-busy="true" className="grid gap-1.5 lg:w-5/12">
            <span className="sr-only">{c.loading}</span>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[4.5rem] animate-pulse rounded-[16px] bg-paper-2" style={{ animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        )}

        {state === 'error' && (
          <div role="alert" className="max-w-[40rem] rounded-card bg-paper-2 p-6 md:p-8">
            <p className="t-title">{c.errorTitle}</p>
            <p className="t-small mt-2 text-ink-2">{c.errorBody}</p>
            <button type="button" onClick={() => setAttempt((n) => n + 1)} className="mt-5 inline-flex h-11 items-center rounded-full bg-ink px-5 text-[0.95rem] font-medium text-paper">
              {c.retry}
            </button>
          </div>
        )}

        {state === 'ready' && leads.length === 0 && (
          <div className="max-w-[40rem] rounded-card bg-paper-2 p-6 md:p-8">
            <p className="t-title">{c.emptyTitle}</p>
            <p className="t-small mt-2 text-ink-2">{c.emptyBody}</p>
          </div>
        )}

        {state === 'ready' && leads.length > 0 && (
          <div className="grid gap-[var(--gap)] lg:grid-cols-12">
            <section aria-label={c.list} className={`lg:col-span-5 ${open ? 'hidden lg:block' : ''}`}>
              {shown.length === 0 ? (
                <div className="rounded-card bg-paper-2 p-6">
                  <p className="t-body">{c.noMatch}</p>
                  <button type="button" onClick={() => { setFlow('all'); setStatus('all'); }} className="mt-4 inline-flex h-10 items-center rounded-full bg-paper px-4 text-[0.92rem] font-medium">
                    {c.clear}
                  </button>
                </div>
              ) : (
                <ul className="grid gap-1.5">
                  {shown.map((l) => {
                    const st = l.status || 'new';
                    const on = l.id === openId;
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          aria-current={on || undefined}
                          onClick={() => setOpenId(l.id)}
                          className={`grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-[16px] px-4 py-3 text-left transition-colors ${on ? 'bg-paper-3' : 'bg-paper-2 hover:bg-paper-3'}`}
                        >
                          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[st]}`} />
                          <span className="min-w-0">
                            <span className={`block truncate text-[1rem] ${st === 'new' ? 'font-semibold' : 'font-medium'}`}>{l.name || l.email || l.phone || '—'}</span>
                            <span className="block truncate text-[0.88rem] text-ink-3">
                              {c.flowOne[l.flow] || l.flow} · {c.statuses[st]}
                              {summary(l) ? ` · ${summary(l)}` : ''}
                            </span>
                          </span>
                          <span className="tabular text-[0.82rem] text-ink-3">{when(l.createdAt, lang)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
            <section aria-label={c.answers} className={`lg:col-span-7 ${open ? '' : 'hidden lg:block'}`}>
              <div className="lg:sticky lg:top-6">
                {detail || (
                  <div className="grid min-h-[16rem] place-items-center rounded-card bg-paper-2 p-8 text-center">
                    <p className="t-body max-w-[22rem] text-ink-2">{c.pick}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
