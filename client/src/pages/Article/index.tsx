import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Reveal } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { CtaSection } from '../../components/common/CtaSection';
import { Seo } from '../../components/common/Seo';
import { ArrowRight } from '../../components/ui/Icon';
import { articles } from '../../data/articles';
import NotFound from '../NotFound';

/** §10.7 — long-form template with a reading-progress bar. Motion is
 *  deliberately restrained: movement during reading is an irritant. */
export default function Article() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug && a.status === 'published');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!article) return <NotFound />;

  return (
    <>
      <Seo
        route={`/insights/${article.slug}`} title={`${article.title} — BLAZON`}
        description={article.excerpt}
        schema={{
          '@context': 'https://schema.org', '@type': 'Article',
          headline: article.title, description: article.excerpt,
          author: { '@type': 'Organization', name: 'BLAZON' },
          publisher: { '@type': 'Organization', name: 'BLAZON' },
        }}
      />
      <span className="reading-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />

      <Section surface="obsidian" className="article">
        <Container>
          <Reveal className="article__head">
            <p className="eyebrow">Insights</p>
            <h1 className="display-l">{article.title}</h1>
            <p className="caption article__meta">
              {article.readingMinutes} min read · BLAZON
              {article.originalSource && <> · originally published at {article.originalSource}</>}
            </p>
          </Reveal>

          <div className="article__body">
            {article.body.map((block, i) =>
              block.type === 'h2'
                ? <h2 className="heading-s article__h2" key={i}>{block.text}</h2>
                : <p className="body-l" key={i}>{block.text}</p>,
            )}
          </div>

          <Reveal className="article__back">
            <Link className="link" to="/insights">All insights<ArrowRight /></Link>
          </Reveal>
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
