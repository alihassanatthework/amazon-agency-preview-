import { Hero } from '../sections/home/Hero';
import { LogoBand } from '../sections/home/LogoBand';
import { KpiBand } from '../sections/home/KpiBand';
import { Solutions } from '../sections/home/Solutions';
import { Approach } from '../sections/home/Approach';
import { VideoProof } from '../sections/home/VideoProof';
import { CaseStudies } from '../sections/home/CaseStudies';
import { Comparison } from '../sections/home/Comparison';
import { About } from '../sections/home/About';
import { ContactCta } from '../sections/home/ContactCta';
import { StickyCta } from '../sections/home/StickyCta';

/**
 * Homepage — twelve blocks arranged as a single argument:
 * claim → proof → method → evidence → contrast → identity → action.
 *
 * Background values alternate so no two adjacent sections share one, which
 * produces separation without dividers or decorative shapes between sections.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoBand />
      <KpiBand />
      <Solutions />
      <Approach />
      <VideoProof />
      <CaseStudies />
      <Comparison />
      <About />
      <ContactCta />
      <StickyCta />
    </>
  );
}
