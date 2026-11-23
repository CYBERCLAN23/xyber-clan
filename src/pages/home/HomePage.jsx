import Page from '../../components/site/Page';
import { useT } from '../../lib/content';
import Hero, { Statement } from './Hero';
import About from './About';
import Services from './Services';
import TeamTeaser from './TeamTeaser';
import Stats from './Stats';
import Testimonials from './Testimonials';
import Trust from './Trust';
import Process from './Process';
import Faq from './Faq';
import Newsletter from './Newsletter';
import Cta from './Cta';
import ExitOffer from './ExitOffer';

/** Home: the offer, the proof, then the way in. */
export default function HomePage() {
  const { tr } = useT();
  return (
    <Page overHero title={tr('hero.slogan').replace(/\.$/, '')} description={tr('hero.subtitle')}>
      <Hero />
      <Statement />
      <About />
      <Services />
      <TeamTeaser />
      <Stats />
      <Testimonials />
      <Trust />
      <Process />
      <Faq />
      <Newsletter />
      <Cta />
      <div className="sr-only">
        <p>{tr('seo.paragraph')}</p>
      </div>
      <ExitOffer />
    </Page>
  );
}
