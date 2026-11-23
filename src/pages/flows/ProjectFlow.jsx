import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Page from '../../components/site/Page';
import FlowForm from '../../components/flow/FlowForm';
import { stripLead, emptyPhone, phoneString, isEmpty } from '../../components/flow/utils';
import { useT, T } from '../../lib/content';
import { translations } from '../../translations';
import { saveLead } from '../../lib/leads';
import copy from './copy';
import { EMAIL, WHATSAPP_PROJECT } from './data';

const SERVICES = ['web', 'mobile', 'design', 'cybersec', 'hardware', 'training'];
const ALIASES = { cybersecurity: 'cybersec', security: 'cybersec', secu: 'cybersec', app: 'mobile', apps: 'mobile', uiux: 'design', network: 'hardware' };
const TIMELINE = ['asap', 'weeks', 'month', 'months', 'flexible'];
const BUDGET = ['under100k', 'range1', 'range2', 'over1m', 'notSure'];
const MAX_DETAILED = 2;

/** The first two services picked, in the order they were picked. */
const detailed = (a) => (Array.isArray(a.services) ? a.services.slice(0, MAX_DETAILED) : []);

export default function ProjectFlow() {
  const { t, tr, lang } = useT();
  const f = t.form;
  const en = translations.en.form;
  const c = (copy[lang] || copy.en).project;
  const P = (k) => <T k={`flows.project.${k}`} fb={c[k]} />;
  const [params] = useSearchParams();

  const initialAnswers = useMemo(() => {
    const raw = String(params.get('service') || '').toLowerCase().trim();
    const key = ALIASES[raw] || raw;
    return { services: SERVICES.includes(key) ? [key] : [], contactPhone: emptyPhone(), contactChannel: 'whatsapp' };
  }, [params]);

  const q = (k) => stripLead(tr(`form.questions.${k}`));

  const steps = useMemo(() => {
    const list = [];
    list.push({
      id: 'services',
      kind: 'choice',
      multi: true,
      label: f.projectType,
      reviewLabel: <T k="form.projectType" />,
      title: <T k="form.questions.projectType" fb={q('projectType')} />,
      help: P('servicesHelp'),
      note: (a) => (Array.isArray(a.services) && a.services.length > MAX_DETAILED ? P('servicesMore') : null),
      options: SERVICES.map((key) => ({ value: key, label: f.options[key], text: f.options[key] })),
      columns: 2,
    });

    // Follow-up questions for (up to) two of the chosen services.
    SERVICES.forEach((svc) => {
      (f.serviceQuestions[svc] || []).forEach((sq, i) => {
        const enOpts = en.serviceQuestions[svc]?.[i]?.options || sq.options;
        list.push({
          id: sq.id,
          kind: 'choice',
          multi: !!sq.multi,
          label: stripLead(sq.question),
          reviewLabel: stripLead(sq.question),
          title: <T k={`form.serviceQuestions.${svc}.${i}.question`} fb={stripLead(tr(`form.serviceQuestions.${svc}.${i}.question`, sq.question))} />,
          pre: f.options[svc],
          help: sq.multi ? P('servicesHelp') : null,
          options: sq.options.map((label, oi) => ({ value: enOpts[oi] ?? label, label, text: label })),
          showIf: (a) => detailed(a).includes(svc),
        });
      });
    });

    list.push(
      {
        id: 'projectName',
        kind: 'text',
        required: false,
        label: f.projectName,
        reviewLabel: <T k="form.projectName" />,
        title: <T k="form.questions.projectName" fb={q('projectName')} />,
        help: P('projectNameHelp'),
        placeholder: f.placeholders.projectName,
        autoComplete: 'organization',
        maxLength: 200,
      },
      {
        id: 'description',
        kind: 'textarea',
        required: false,
        label: f.description,
        reviewLabel: <T k="form.description" />,
        title: <T k="form.questions.description" fb={q('description')} />,
        help: P('descriptionHelp'),
        note: P('descriptionNote'),
        placeholder: f.placeholders.description,
        maxLength: 3000,
      },
      {
        id: 'timeline',
        kind: 'choice',
        label: f.timeline,
        reviewLabel: <T k="form.timeline" />,
        title: <T k="form.questions.timeline" fb={q('timeline')} />,
        options: TIMELINE.map((key) => ({ value: key, label: f.options[key], text: f.options[key] })),
      },
      {
        id: 'budget',
        kind: 'choice',
        label: f.budget,
        reviewLabel: <T k="form.budget" />,
        title: <T k="form.questions.budget" fb={q('budget')} />,
        options: BUDGET.map((key) => ({ value: key, label: f.options[key], text: f.options[key] })),
        note: P('budgetNote'),
      },
      {
        id: 'contactName',
        kind: 'text',
        label: f.contactLabels.name,
        reviewLabel: <T k="form.contactLabels.name" />,
        title: P('nameTitle'),
        placeholder: f.placeholders.contactName,
        autoComplete: 'name',
        maxLength: 120,
      },
      {
        id: 'contact',
        kind: 'group',
        label: f.contactInfo,
        pre: (a) => {
          const first = String(a.contactName || '').trim().split(/\s+/)[0];
          return first ? <T k="flows.project.contactPre" fb={c.contactPre.replace('{name}', first)} /> : null;
        },
        title: <T k="form.questions.contact" fb={q('contact')} />,
        help: P('contactHelp'),
        fields: [
          { id: 'contactPhone', kind: 'phone', label: P('phoneLabel'), labelText: c.phoneLabel, placeholder: '6XX XX XX XX' },
          { id: 'contactEmail', kind: 'email', label: <T k="form.contactLabels.email" />, labelText: f.contactLabels.email, placeholder: f.placeholders.contactEmail, autoComplete: 'email' },
          {
            id: 'contactChannel',
            kind: 'chips',
            label: P('channelLabel'),
            labelText: c.channelLabel,
            options: [
              { value: 'whatsapp', label: c.channelWhatsApp, text: c.channelWhatsApp },
              { value: 'email', label: c.channelEmail, text: c.channelEmail },
              { value: 'call', label: c.channelCall, text: c.channelCall },
            ],
          },
          { id: 'contactCompany', kind: 'text', label: P('companyLabel'), labelText: c.companyLabel, autoComplete: 'organization' },
        ],
        // At least one way to reply; each one is checked for format by the engine.
        validate: (a) => (isEmpty(a.contactPhone) && isEmpty(a.contactEmail) ? { contactPhone: tr('flows.project.errContact', c.errContact) } : null),
      },
    );
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, t]);

  const channelText = (a) => ({ whatsapp: c.channelWhatsApp, email: c.channelEmail, call: c.channelCall })[a.contactChannel] || '';

  // Same shape as the original form's summary.
  const message = (rows, a) => {
    let text = `*NEW PROJECT REQUEST* 🚀\n\n`;
    rows
      .filter((r) => !['contactName', 'contactPhone', 'contactEmail', 'contactChannel', 'contactCompany'].includes(r.id))
      .forEach((r) => {
        text += `*${r.label}:* ${r.value || 'N/A'}\n`;
      });
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `*CONTACT INFO:*\n`;
    text += `👤 ${String(a.contactName || '').trim()}\n`;
    if (phoneString(a.contactPhone)) text += `📱 ${phoneString(a.contactPhone)}\n`;
    if (String(a.contactEmail || '').trim()) text += `✉️ ${String(a.contactEmail).trim()}\n`;
    if (String(a.contactCompany || '').trim()) text += `🏢 ${String(a.contactCompany).trim()}\n`;
    if (channelText(a)) text += `💬 ${c.channelLabel}: ${channelText(a)}\n`;
    return text;
  };

  const channels = [
    { kind: 'whatsapp', label: <T k="flowUi.sendWhatsApp" fb={tr('form.sendWhatsApp')} />, href: (rows, a) => `https://wa.me/${WHATSAPP_PROJECT}?text=${encodeURIComponent(message(rows, a))}` },
    {
      kind: 'email',
      label: <T k="flowUi.sendEmail" fb={tr('form.sendEmail')} />,
      href: (rows, a) => {
        const subject = `New Project: ${String(a.projectName || '').trim() || String(a.contactName || '').trim()}`;
        return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message(rows, a))}`;
      },
    },
  ];

  const onSubmit = (rows, a) =>
    saveLead('project', {
      name: a.contactName,
      email: a.contactEmail,
      phone: phoneString(a.contactPhone),
      company: a.contactCompany,
      channel: a.contactChannel,
      title: a.projectName,
      services: (a.services || []).map((k) => en.options[k] || k).join(', '),
      timeline: en.options[a.timeline] || a.timeline,
      budget: en.options[a.budget] || a.budget,
      details: rows.map((r) => [r.label, r.value]),
    });

  return (
    <Page title={tr('flows.project.metaTitle', c.metaTitle)} description={tr('flows.project.metaDescription', c.metaDescription)} footer={false} dock={false}>
      <FlowForm
        id="project"
        heading={P('heading')}
        steps={steps}
        initialAnswers={initialAnswers}
        labels={{ reviewTitle: <T k="form.summaryTitle" />, reviewLead: <T k="form.summaryDesc" />, backToEdit: <T k="form.backToEdit" />, returnHome: <T k="form.backToHome" /> }}
        channels={channels}
        onSubmit={onSubmit}
        consent={
          <>
            {P('consentBefore')}{' '}
            <a href="/privacy" target="_blank" rel="noopener" className="font-medium text-ink underline decoration-ink-3 underline-offset-4 hover:decoration-ink">
              {P('consentLink')}
            </a>
            .
          </>
        }
        nextSteps={[P('next1'), P('next2'), P('next3')]}
        successName={(a) => String(a.contactName || '').trim().split(/\s+/)[0]}
        asideEmpty={<p className="t-body text-ink-2">{P('asideTalk')}</p>}
      />
    </Page>
  );
}
