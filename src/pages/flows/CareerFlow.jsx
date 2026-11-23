import { useMemo } from 'react';
import Page from '../../components/site/Page';
import FlowForm from '../../components/flow/FlowForm';
import { emptyPhone, phoneString } from '../../components/flow/utils';
import { useT, T } from '../../lib/content';
import { saveLead } from '../../lib/leads';
import copy from './copy';
import { CAREER_STEPS, CAREER_STEPS_FR, CAREER_UI, EMAIL } from './data';

/** Community Manager application: the original questions and rules, one per screen. */
export default function CareerFlow() {
  const { tr, lang } = useT();
  const c = (copy[lang] || copy.en).career;
  const ui = CAREER_UI[lang] || CAREER_UI.en;
  const fr = lang === 'fr';

  // Text of each step in the active language (EN data unchanged, FR mirror).
  const local = (s) => {
    if (!fr) return s;
    const x = CAREER_STEPS_FR[s.id] || {};
    return {
      ...s,
      question: x.question ?? s.question,
      subtitle: x.subtitle ?? s.subtitle,
      badge: x.badge ?? s.badge,
      placeholder: x.placeholder ?? s.placeholder,
      options: s.options?.map((o, i) => ({ ...o, label: x.options?.[i] ?? o.label })),
      fields: s.fields?.map((f, i) => ({ ...f, label: x.fields?.[i] ?? f.label })),
    };
  };

  const welcome = local(CAREER_STEPS[0]);
  const plainLabel = (s) => tr(`careerForm.steps.${s.id}.label`, s.question.replace(/\?$/, ''));

  const steps = useMemo(
    () =>
      CAREER_STEPS.slice(1).map((raw) => {
        const s = local(raw);
        const base = {
          id: s.id,
          label: plainLabel(s),
          reviewLabel: <T k={`careerForm.steps.${s.id}.label`} fb={s.question.replace(/\?$/, '')} />,
          title: <T k={`careerForm.steps.${s.id}.question`} fb={s.question} />,
          help: s.subtitle ? <T k={`careerForm.steps.${s.id}.subtitle`} fb={s.subtitle} /> : null,
        };
        if (s.type === 'choice' || s.type === 'multiselect') {
          return {
            ...base,
            kind: 'choice',
            multi: s.type === 'multiselect',
            columns: s.options.length > 4 ? 2 : 1,
            options: s.options.map((o, i) => {
              const text = tr(`careerForm.steps.${s.id}.options.${i}`, o.label);
              return { value: raw.options[i].label, label: <T k={`careerForm.steps.${s.id}.options.${i}`} fb={o.label} />, text };
            }),
          };
        }
        if (s.type === 'fields') {
          // Every profile link is required, as in the original form.
          return {
            ...base,
            kind: 'group',
            fields: s.fields.map((f, i) => ({
              id: `${s.id}_field_${i}`,
              kind: 'text',
              required: true,
              label: <T k={`careerForm.steps.${s.id}.fields.${i}.label`} fb={f.label} />,
              labelText: tr(`careerForm.steps.${s.id}.fields.${i}.label`, f.label),
              placeholder: f.placeholder,
              autoComplete: 'url',
            })),
          };
        }
        if (s.type === 'textarea') return { ...base, kind: 'textarea', placeholder: s.placeholder };
        if (s.inputType === 'email') return { ...base, kind: 'email', placeholder: s.placeholder, autoComplete: 'email' };
        if (s.inputType === 'tel') return { ...base, kind: 'phone', placeholder: c.phonePlaceholder };
        return { ...base, kind: 'text', placeholder: s.placeholder, autoComplete: s.id === 'fullName' ? 'name' : s.id === 'location' ? 'address-level2' : undefined };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, tr],
  );

  // Same text the original form put in the email.
  const message = (rows) => {
    let text = `===========================================\n`;
    text += `COMMUNITY MANAGER APPLICATION - XYBERCLAN\n`;
    text += `===========================================\n\n`;
    rows.forEach((r) => {
      text += `${String(r.label).replace(/\?$/, '').trim().toUpperCase()}:\n> ${r.value || 'N/A'}\n\n`;
    });
    text += `-------------------------------------------\n`;
    text += `Submitted via XyberClan Careers Portal\n`;
    text += `===========================================`;
    return text;
  };

  const channels = [
    {
      kind: 'email',
      label: <T k="careerForm.summary.send" fb={ui.send} />,
      href: (rows, a) => {
        const subject = `Community Manager Application: ${String(a.fullName || '').trim() || 'New Applicant'}`;
        return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message(rows))}`;
      },
    },
  ];

  const onSubmit = (rows, a) =>
    saveLead('career', {
      type: 'community-manager',
      name: a.fullName,
      email: a.email,
      phone: phoneString(a.phone),
      title: 'Community Manager',
      channel: 'email',
      details: rows.map((r) => [r.label, r.value]),
    });

  const C = (k) => <T k={`flows.career.${k}`} fb={c[k]} />;

  return (
    <Page title={tr('flows.career.metaTitle', c.metaTitle)} description={tr('flows.career.metaDescription', c.metaDescription)} footer={false} dock={false}>
      <FlowForm
        id="career-community-manager"
        heading={C('heading')}
        steps={steps}
        initialAnswers={{ phone: emptyPhone() }}
        intro={{
          badge: <T k={`careerForm.steps.${welcome.id}.badge`} fb={welcome.badge} />,
          title: <T k={`careerForm.steps.${welcome.id}.question`} fb={welcome.question} />,
          lead: <T k={`careerForm.steps.${welcome.id}.subtitle`} fb={welcome.subtitle} />,
          start: <T k="careerForm.ui.startApplication" fb={ui.startApplication} />,
        }}
        labels={{
          ok: <T k="careerForm.ui.next" fb={ui.next} />,
          submit: <T k="careerForm.ui.submit" fb={ui.submit} />,
          back: <T k="careerForm.ui.back" fb={ui.back} />,
          reviewTitle: <T k="careerForm.summary.title" fb={ui.summaryTitle} />,
          reviewLead: <T k="careerForm.summary.subtitle" fb={ui.summarySubtitle} />,
          backToEdit: <T k="careerForm.summary.backToEdit" fb={ui.backToEdit} />,
          returnHome: <T k="careerForm.summary.returnHome" fb={ui.returnHome} />,
        }}
        channels={channels}
        onSubmit={onSubmit}
        nextSteps={[C('next1'), C('next2'), C('next3')]}
        successName={(a) => String(a.fullName || '').trim().split(/\s+/)[0]}
      />
    </Page>
  );
}
