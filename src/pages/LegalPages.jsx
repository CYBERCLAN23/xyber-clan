import { useRef, useState } from 'react';
import Page from '../components/site/Page';
import Button from '../components/ui/Button';
import Link from '../components/ui/Link';
import { SplitText, Reveal } from '../components/ui/Reveal';
import { T, useT } from '../lib/content';
import { useScrollTo } from '../lib/SmoothScroll';
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion';

const EMAIL = 'xyberclandev@gmail.com';

/* Local copy (EN/FR). Every string renders through <T>, so it stays editable in the CMS. */
const COPY = {
  en: {
    updated: 'Last updated: July 4, 2026',
    contents: 'On this page',
    progress: 'Reading progress',
    back: 'Back to Home',
    help: 'Questions about this document?',
    helpText: 'Write to us and a member of the team will answer you directly.',
    email: 'Email us',
    privacy: {
      title: 'Privacy Policy',
      lead: 'How XyberClan collects, uses and protects the information you share with us.',
      meta: 'Privacy Policy for XyberClan, a cybersecurity and tech innovation startup. Learn how we collect, use, and protect your data across our digital solutions.',
      other: 'Read the Terms of Service',
      sections: [
        { id: 'information', title: 'Information We Collect', body: 'We collect information you provide when using our contact forms, project inquiry forms, and career application forms. This includes your name, email address, phone number, and project details.' },
        { id: 'use', title: 'How We Use Your Information', body: 'We use your information to respond to inquiries, process project requests, evaluate job applications, and improve our services. We do not sell your personal data to third parties.' },
        { id: 'protection', title: 'Data Protection', body: 'We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.' },
        { id: 'contact', title: 'Contact', body: `For privacy-related inquiries, contact us at ${EMAIL}.` },
      ],
    },
    terms: {
      title: 'Terms of Service',
      lead: 'The terms that govern the use of our website and the services we deliver.',
      meta: 'Terms of Service for XyberClan, a cybersecurity and tech innovation startup. Understand the terms governing the use of our digital solutions and services.',
      other: 'Read the Privacy Policy',
      sections: [
        { id: 'services', title: 'Services', body: 'XyberClan provides web development, cybersecurity consulting, UI/UX design, and related digital services. Project scope, deliverables, and timelines are defined in individual service agreements.' },
        { id: 'intellectual-property', title: 'Intellectual Property', body: 'Upon full payment, clients retain ownership of the final deliverables. XyberClan reserves the right to display completed work in its portfolio unless otherwise agreed.' },
        { id: 'liability', title: 'Limitation of Liability', body: 'XyberClan shall not be liable for indirect, incidental, or consequential damages arising from the use of our services or website.' },
        { id: 'contact', title: 'Contact', body: `For questions about these terms, contact us at ${EMAIL}.` },
      ],
    },
  },
  fr: {
    updated: 'Dernière mise à jour : 4 juillet 2026',
    contents: 'Sur cette page',
    progress: 'Progression de lecture',
    back: "Retour à l'accueil",
    help: 'Une question sur ce document ?',
    helpText: "Écrivez-nous : un membre de l'équipe vous répondra directement.",
    email: 'Nous écrire',
    privacy: {
      title: 'Politique de confidentialité',
      lead: 'Comment XyberClan collecte, utilise et protège les informations que vous nous confiez.',
      meta: 'Politique de confidentialité de XyberClan, startup de cybersécurité et d’innovation technologique. Découvrez comment nous collectons, utilisons et protégeons vos données.',
      other: "Lire les Conditions d'utilisation",
      sections: [
        { id: 'information', title: 'Informations collectées', body: 'Nous collectons les informations que vous fournissez via nos formulaires de contact, de demande de projet et de candidature. Cela comprend votre nom, votre adresse e-mail, votre numéro de téléphone et les détails de votre projet.' },
        { id: 'use', title: 'Utilisation de vos informations', body: 'Nous utilisons vos informations pour répondre à vos demandes, traiter vos projets, évaluer les candidatures et améliorer nos services. Nous ne vendons pas vos données personnelles à des tiers.' },
        { id: 'protection', title: 'Protection des données', body: 'Nous appliquons des mesures de sécurité conformes aux standards du secteur pour protéger vos informations personnelles. Toutefois, aucune méthode de transmission sur Internet n’est sûre à 100 %.' },
        { id: 'contact', title: 'Contact', body: `Pour toute question relative à la confidentialité, écrivez-nous à ${EMAIL}.` },
      ],
    },
    terms: {
      title: "Conditions d'utilisation",
      lead: 'Les conditions qui encadrent l’utilisation de notre site et des services que nous fournissons.',
      meta: 'Conditions d’utilisation de XyberClan, startup de cybersécurité et d’innovation technologique. Les conditions qui régissent l’utilisation de nos solutions et services numériques.',
      other: 'Lire la Politique de confidentialité',
      sections: [
        { id: 'services', title: 'Services', body: 'XyberClan fournit des services de développement web, de conseil en cybersécurité, de design UI/UX et des services numériques associés. Le périmètre, les livrables et les délais de chaque projet sont définis dans des contrats de service individuels.' },
        { id: 'intellectual-property', title: 'Propriété intellectuelle', body: 'Après paiement intégral, le client devient propriétaire des livrables finaux. XyberClan se réserve le droit de présenter les travaux réalisés dans son portfolio, sauf accord contraire.' },
        { id: 'liability', title: 'Limitation de responsabilité', body: 'XyberClan ne saurait être tenue responsable des dommages indirects, accessoires ou consécutifs résultant de l’utilisation de nos services ou de notre site.' },
        { id: 'contact', title: 'Contact', body: `Pour toute question sur ces conditions, écrivez-nous à ${EMAIL}.` },
      ],
    },
  },
};

function LegalDocument({ doc, otherPath }) {
  const root = useRef(null);
  const { lang, tr, isEditing } = useT();
  const copy = COPY[lang] || COPY.en;
  const d = copy[doc];
  const base = `legal.${doc}`;
  const [active, setActive] = useState(0);
  const scrollTo = useScrollTo();

  // Contents: the section in view lights up; the spark pill fills as you read.
  useGSAP(() => {
    const sections = gsap.utils.toArray('[data-legal-section]', root.current);
    sections.forEach((el, i) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => self.isActive && setActive(i),
        onLeaveBack: i === 0 ? () => setActive(0) : undefined,
      });
    });
    const fill = root.current.querySelector('[data-legal-progress]');
    if (fill && !reducedMotion()) {
      gsap.fromTo(fill, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current.querySelector('[data-legal-article]'), start: 'top 45%', end: 'bottom 60%', scrub: 0.4 },
      });
    }
  }, { scope: root, dependencies: [isEditing, lang, doc] });

  const go = (e, i, id) => {
    e.preventDefault();
    setActive(i);
    scrollTo(`#${id}`, { offset: -120 });
  };

  return (
    <Page title={tr(`${base}.title`, d.title)} description={tr(`${base}.meta`, d.meta)}>
      <div ref={root}>
        <header className="shell pt-[calc(var(--nav-h)+clamp(56px,9vw,150px))] pb-[clamp(56px,7vw,112px)]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap)]">
            {isEditing ? (
              <T k={`${base}.title`} fb={d.title} as="h1" className="t-display lg:col-span-8" />
            ) : (
              <SplitText text={tr(`${base}.title`, d.title)} as="h1" immediate delay={0.15} className="t-display lg:col-span-8" />
            )}
            <Reveal className="flex flex-col gap-4 lg:col-span-4 lg:pb-3" delay={0.45}>
              <T k={`${base}.lead`} fb={d.lead} as="p" className="t-lead text-ink-2" />
              <T k="legal.updated" fb={copy.updated} as="p" className="t-small text-ink-3" />
            </Reveal>
          </div>
        </header>

        <div className="shell grid gap-y-12 pb-[var(--section)] lg:grid-cols-12 lg:gap-x-[var(--gap)]">
          <aside className="lg:col-span-3">
            <nav aria-label={tr('legal.contents', copy.contents)} className="lg:sticky lg:top-[calc(var(--nav-h)+40px)]">
              <T k="legal.contents" fb={copy.contents} as="p" className="t-small mb-4 text-ink-3" />
              <ol className="flex flex-col gap-1">
                {d.sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => go(e, i, s.id)}
                      aria-current={active === i ? 'true' : undefined}
                      className={`group -mx-3 flex items-center gap-3 rounded-full px-3 py-2 transition-colors duration-300 hover:bg-paper-2 ${active === i ? 'text-ink' : 'text-ink-3 hover:text-ink-2'}`}
                    >
                      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500 ease-[var(--ease-spring)] ${active === i ? 'scale-100 bg-cyan' : 'scale-50 bg-ink-3'}`} />
                      <span className="tabular text-ink-3">{i + 1}.</span>
                      <span>{tr(`${base}.s${i + 1}.title`, s.title)}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-8 hidden lg:block" aria-hidden="true" title={copy.progress}>
                <span className="block h-1.5 w-full overflow-hidden rounded-full bg-paper-3">
                  <span data-legal-progress className="block h-full w-full origin-left rounded-full bg-cyan" />
                </span>
              </div>
            </nav>
          </aside>

          <article data-legal-article className="lg:col-span-8 lg:col-start-5">
            <div className="max-w-[68ch]">
              {d.sections.map((s, i) => (
                <Reveal
                  as="section"
                  key={s.id}
                  id={s.id}
                  data-legal-section
                  aria-labelledby={`${s.id}-title`}
                  className="scroll-mt-32 pb-[clamp(48px,6vw,88px)]"
                >
                  <h2 id={`${s.id}-title`} className="t-title mb-5 flex gap-3">
                    <span className="tabular text-ink-3">{i + 1}.</span>
                    <T k={`${base}.s${i + 1}.title`} fb={s.title} />
                  </h2>
                  <T k={`${base}.s${i + 1}.body`} fb={s.body} as="p" className="text-[1.0625rem] leading-[1.7] text-ink-2 md:text-[1.125rem]" multiline />
                </Reveal>
              ))}
            </div>

            <Reveal className="grid gap-8 rounded-card bg-paper-2 p-[clamp(24px,3.4vw,48px)] md:grid-cols-[1fr_auto] md:items-end">
              <div className="flex max-w-[44ch] flex-col gap-3">
                <T k="legal.help" fb={copy.help} as="h2" className="t-title" />
                <T k="legal.helpText" fb={copy.helpText} as="p" className="t-small text-ink-2" />
                <a href={`mailto:${EMAIL}`} className="t-small w-fit text-accent underline decoration-[1.5px] underline-offset-4 transition-colors hover:text-ink">{EMAIL}</a>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href={`mailto:${EMAIL}`}><T k="legal.email" fb={copy.email} /></Button>
                <Button to={otherPath} variant="secondary" arrow={false}><T k={`${base}.other`} fb={d.other} /></Button>
              </div>
            </Reveal>

            <Link to="/" className="t-small group mt-10 inline-flex items-center gap-2 rounded-full py-2 text-ink-2 transition-colors hover:text-ink">
              <span aria-hidden="true" className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-x-1">&larr;</span>
              <T k="legal.back" fb={copy.back} />
            </Link>
          </article>
        </div>
      </div>
    </Page>
  );
}

const PrivacyPage = () => <LegalDocument doc="privacy" otherPath="/terms" />;
const TermsPage = () => <LegalDocument doc="terms" otherPath="/privacy" />;

export { PrivacyPage, TermsPage };
