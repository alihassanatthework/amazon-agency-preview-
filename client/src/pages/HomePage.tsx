import { Hero } from '../sections/home/Hero';
import { LogoBand } from '../sections/home/LogoBand';
import { KpiBand } from '../sections/home/KpiBand';

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
    </>
  );
}
