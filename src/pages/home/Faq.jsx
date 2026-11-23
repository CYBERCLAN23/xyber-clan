import { useId, useState } from 'react';
import Button from '../../components/ui/Button';
import { Reveal, SplitText } from '../../components/ui/Reveal';
import { T, useT } from '../../lib/content';
import { faqs, WHATSAPP_QUESTION } from './faqData';

/** Plus made of two pill strokes; opening turns them into the X of the mark. */
function Toggle({ open }) {
  return (
    <span
      aria-hidden="true"
      className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-500 ease-[var(--ease-out)] md:h-12 md:w-12 ${open ? 'bg-cyan text-on-cyan' : 'bg-paper text-ink group-hover:bg-ink group-hover:text-paper'}`}
    >
      <span className={`absolute h-[3px] w-[18px] rounded-full bg-current transition-transform duration-[650ms] ease-[var(--ease-spring)] ${open ? 'rotate-45' : 'rotate-0'}`} />
      <span className={`absolute h-[3px] w-[18px] rounded-full bg-current transition-transform duration-[650ms] ease-[var(--ease-spring)] ${open ? 'rotate-[135deg]' : 'rotate-90'}`} />
    </span>
  );
}

function Item({ n, open, onToggle, editing }) {
  const uid = useId().replace(/:/g, '');
  const btnId = `faq-q-${uid}`;
  const panelId = `faq-a-${uid}`;
  const question = <T k={`faq.items.${n}.question`} className="t-title min-w-0 flex-1" />;

  return (
    <li className={`rounded-card transition-colors duration-500 ease-[var(--ease-out)] ${open ? 'bg-paper-2' : 'bg-transparent hover:bg-paper-2'}`}>
      <h3 className="m-0">
        {editing ? (
          <div className="flex w-full items-center gap-6 px-5 py-6 md:px-8">{question}</div>
        ) : (
          <button
            id={btnId}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className="group flex w-full items-center gap-6 rounded-card px-5 py-6 text-left md:px-8 md:py-7"
          >
            {question}
            <Toggle open={open} />
          </button>
        )}
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={editing ? undefined : btnId}
        className={`grid transition-[grid-template-rows,visibility] duration-[600ms] ease-[var(--ease-out)] ${open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden">
          <T
            k={`faq.items.${n}.answer`}
            as="p"
            multiline
            className={`t-body max-w-[62ch] px-5 pb-7 text-ink-2 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] md:px-8 md:pb-9 md:pr-24 ${open ? 'translate-y-0 opacity-100 delay-100' : '-translate-y-2 opacity-0'}`}
          />
        </div>
      </div>
    </li>
  );
}

/** FAQ: every answer one tap away; one open at a time. */
export default function Faq() {
  const { isEditing } = useT();
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="section">
      <div className="shell grid gap-y-8 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <T k="faq.badge" as="p" className="t-small text-ink-3 lg:col-span-3 lg:pt-5" />
        <SplitText id="faq-title" k="faq.title" as="h2" className="t-display max-lg:text-[clamp(2rem,8.6vw,3.4rem)] lg:col-span-9" />
      </div>

      <div className="shell mt-[clamp(48px,6vw,96px)] grid gap-y-12 lg:grid-cols-12 lg:gap-x-[var(--gap)]">
        <Reveal className="flex flex-col items-start gap-8 lg:col-span-3 lg:sticky lg:top-[calc(var(--nav-h)+32px)] lg:self-start">
          <T k="faq.subtitle" as="p" className="t-lead text-ink-2" />
          <div className="flex flex-col items-start gap-4 rounded-card bg-paper-2 p-6">
            <T k="faq.ctaText" as="p" className="t-body" />
            <Button href={WHATSAPP_QUESTION} variant="primary" size="sm"><T k="faq.ctaButton" /></Button>
          </div>
        </Reveal>

        <Reveal as="ul" stagger={0.06} className="flex flex-col gap-1.5 lg:col-span-9">
          {faqs.map((_, n) => (
            <Item
              key={n}
              n={n}
              editing={isEditing}
              open={isEditing || open === n}
              onToggle={() => setOpen((cur) => (cur === n ? -1 : n))}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
