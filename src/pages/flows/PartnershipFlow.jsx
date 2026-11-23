import { useSearchParams } from 'react-router-dom';
import Page from '../../components/site/Page';
import FlowForm from '../../components/flow/FlowForm';
import { emptyPhone, phoneString } from '../../components/flow/utils';
import { useT, T } from '../../lib/content';
import { translations } from '../../translations';
import { saveLead } from '../../lib/leads';
import copy from './copy';
import { EMAIL, WHATSAPP_PARTNERS } from './data';

const TYPES = ['partner', 'sponsor'];

/** Partner / sponsor request (/partners/apply?type=partner|sponsor). */
export default function PartnershipFlow() {
  const { t, tr, lang } = useT();
  const [params] = useSearchParams();
  const raw = String(params.get('type') || '').toLowerCase();
  const type = TYPES.includes(raw) ? raw : 'partner';
  const formKey = `${type}Form`;
  const form = t.partnersPage[formKey];
  const enForm = translations.en.partnersPage[formKey];
  const c = (copy[lang] || copy.en).partnership;
  const X = (k) => <T k={`flows.partnership.${k}`} fb={c[k]} />;
  const base = `partnersPage.${formKey}.steps`;

  const steps = form.steps.map((s, i) => {
    const common = {
      id: s.id,
      label: tr(`${base}.${i}.question`, s.question).replace(/\?$/, ''),
      reviewLabel: <T k={`${base}.${i}.question`} />,
      title: <T k={`${base}.${i}.question`} />,
    };
    if (s.options) {
      return {
        ...common,
        kind: 'choice',
        options: s.options.map((o, oi) => ({ value: enForm.steps[i]?.options?.[oi] ?? o, label: o, text: o })),
      };
    }
    if (s.fields) {
      // Name, phone and email: all three required, as before.
      const kinds = ['text', 'phone', 'email'];
      const auto = ['name', undefined, 'email'];
      return {
        ...common,
        kind: 'group',
        fields: s.fields.map((label, fi) => ({
          id: `${s.id}_field_${fi}`,
          kind: kinds[fi] || 'text',
          required: true,
          label,
          labelText: label,
          placeholder: fi === 1 ? '6XX XX XX XX' : label,
          autoComplete: auto[fi],
        })),
      };
    }
    // As before: name questions get one line, the others a free text area.
    return s.id.toLowerCase().includes('name')
      ? { ...common, kind: 'text', placeholder: s.placeholder, autoComplete: 'organization' }
      : { ...common, kind: 'textarea', placeholder: s.placeholder };
  });

  const contactStep = form.steps.find((s) => s.fields);
  const contactId = contactStep?.id || 'contact';

  // Same layout as the original summary.
  const message = (rows, a) => {
    let text = `===========================================\n`;
    text += `NEW ${type.toUpperCase()} INQUIRY - XYBERCLAN\n`;
    text += `===========================================\n\n`;
    steps.forEach((s) => {
      if (s.kind === 'group') return;
      const row = rows.find((r) => r.id === s.id);
      text += `${s.label.trim().toUpperCase()}:\n> ${row?.value || 'N/A'}\n\n`;
    });
    text += `-------------------------------------------\n`;
    text += `CONTACT REPRESENTATIVE\n`;
    text += `-------------------------------------------\n`;
    text += `NAME: ${String(a[`${contactId}_field_0`] || '').trim() || 'N/A'}\n`;
    text += `PHONE: ${phoneString(a[`${contactId}_field_1`]) || 'N/A'}\n`;
    text += `EMAIL: ${String(a[`${contactId}_field_2`] || '').trim() || 'N/A'}\n`;
    text += `-------------------------------------------\n`;
    text += `Generated via XyberClan Network Interface\n`;
    text += `===========================================`;
    return text;
  };

  const orgId = form.steps[1]?.id;
  const channels = [
    {
      kind: 'whatsapp',
      label: <T k="flowUi.sendWhatsApp" fb={tr('form.sendWhatsApp')} />,
      href: (rows, a) => `https://wa.me/${WHATSAPP_PARTNERS}?text=${encodeURIComponent(message(rows, a))}`,
    },
    {
      kind: 'email',
      label: <T k="flowUi.sendEmail" fb={tr('form.sendEmail')} />,
      href: (rows, a) => {
        const subject = `[${type.toUpperCase()}] Request: ${String(a[orgId] || '').trim() || 'New Application'}`;
        return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message(rows, a))}`;
      },
    },
  ];

  const onSubmit = (rows, a, kind) =>
    saveLead('partnership', {
      type,
      name: a[`${contactId}_field_0`],
      phone: phoneString(a[`${contactId}_field_1`]),
      email: a[`${contactId}_field_2`],
      company: a[orgId],
      title: a[orgId],
      channel: kind,
      timeline: a.timeline,
      details: rows.map((r) => [r.label, r.value]),
    });

  return (
    <Page title={tr('flows.partnership.metaTitle', c.metaTitle)} description={tr('flows.partnership.metaDescription', c.metaDescription)} footer={false} dock={false}>
      <FlowForm
        key={type}
        id={`partnership-${type}`}
        heading={<T k={`partnersPage.${formKey}.title`} />}
        steps={steps}
        initialAnswers={{ [`${contactId}_field_1`]: emptyPhone() }}
        intro={{
          badge: X(type === 'partner' ? 'badgePartner' : 'badgeSponsor'),
          title: <T k={`partnersPage.${formKey}.title`} />,
          lead: (
            <>
              <T k={`partnersPage.${formKey}.subtitle`} /> {X(type === 'partner' ? 'leadPartner' : 'leadSponsor')}
            </>
          ),
          start: X('start'),
        }}
        labels={{ reviewTitle: <T k="form.summaryTitle" />, reviewLead: <T k="form.summaryDesc" />, backToEdit: <T k="form.backToEdit" />, ok: <T k="form.next" />, submit: <T k="form.submit" />, back: <T k="form.previous" /> }}
        channels={channels}
        onSubmit={onSubmit}
        nextSteps={[X('next1'), X('next2'), X('next3')]}
        successName={(a) => String(a[`${contactId}_field_0`] || '').trim().split(/\s+/)[0]}
      />
    </Page>
  );
}
