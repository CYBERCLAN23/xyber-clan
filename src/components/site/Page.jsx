import Meta from '../Meta';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import ContactDock from './ContactDock';
import { SplitText, Reveal } from '../ui/Reveal';
import { T } from '../../lib/content';

/**
 * Shared page frame: head tags, navigation, main landmark, footer, contact dock.
 *   <Page title="Team" description="…" overHero>…sections…</Page>
 */
export default function Page({ title, description, keywords, overHero = false, footer = true, dock = true, children, className = '' }) {
  return (
    <>
      <Meta title={title} description={description} keywords={keywords} />
      <SiteNav overHero={overHero} />
      <main id="main" tabIndex={-1} className={`outline-none ${className}`}>
        {children}
      </main>
      {footer && <SiteFooter />}
      {dock && <ContactDock />}
    </>
  );
}

/**
 * Standard inner-page opening: a very large title, a lead set beside it on wide
 * screens, and an optional slot (actions, filters, a figure) below.
 *   <PageIntro titleKey="teamPage.title" leadKey="teamPage.subtitle" />
 */
export function PageIntro({ titleKey, leadKey, title, lead, children, className = '' }) {
  return (
    <header className={`shell pt-[calc(var(--nav-h)+clamp(56px,9vw,150px))] pb-[clamp(56px,7vw,112px)] ${className}`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap)]">
        <SplitText k={titleKey} text={title} as="h1" immediate delay={0.15} className="t-display lg:col-span-8" />
        {(leadKey || lead) && (
          <Reveal className="lg:col-span-4 lg:pb-3" delay={0.5}>
            {leadKey ? <T k={leadKey} as="p" className="t-lead text-ink-2" /> : <p className="t-lead text-ink-2">{lead}</p>}
          </Reveal>
        )}
      </div>
      {children && <div className="mt-12">{children}</div>}
    </header>
  );
}
