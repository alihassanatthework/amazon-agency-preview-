import { Hero } from './sections/Hero';
import { ClientMarquee } from './sections/ClientMarquee';
import { StatBand } from './sections/StatBand';
import { Problem } from './sections/Problem';
import { Services } from './sections/Services';
import { Differentiator } from './sections/Differentiator';
import { Comparison } from './sections/Comparison';
import { CaseStudyFeature } from './sections/CaseStudy';
import { Testimonials } from './sections/Testimonials';
import { Process } from './sections/Process';
import { CtaSection } from '../../components/common/CtaSection';
import { StickyCta } from '../../components/common/StickyCta';
import { Seo } from '../../components/common/Seo';

/**
 * Homepage — thirteen blocks as one continuous argument:
 * claim → proof → problem → method → thesis → contrast → evidence →
 * voices → process → action.
 *
 * Background rhythm (§9.1):
 * obsidian → carbon → obsidian → BONE → obsidian → carbon → BONE →
 * obsidian → carbon → BONE → obsidian → void.
 * The three light sections sit at roughly the 30%, 55% and 80% marks and break
 * the darkness into digestible movements.
 */
export default function Home() {
  return (
    <>
      <Seo
        route="/"
        title="BLAZON — Amazon account management & growth agency"
        description="BLAZON manages Amazon for brands that are tired of guessing. 80+ brands, 4+ years, a US-based team of 9. Get a free 60-minute audit."
      />
      <Hero />
      <ClientMarquee />
      <StatBand />
      <Problem />
      <Services />
      <Differentiator />
      <Comparison />
      <CaseStudyFeature />
      <Testimonials />
      <Process />
      <CtaSection magnetic />
      <StickyCta />
    </>
  );
}
