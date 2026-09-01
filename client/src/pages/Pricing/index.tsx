import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Counter, Reveal, RevealGroup } from '../../motion';
import { Section, Container } from '../../components/layout/Section';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { PageHero } from '../../components/layout/PageHero';
import { CtaSection } from '../../components/common/CtaSection';
import { FaqAccordion } from '../../components/common/FaqAccordion';
import { Seo } from '../../components/common/Seo';
import { TiltCard } from '../../components/common/TiltCard';
import { Check } from '../../components/ui/Icon';
import { included } from '../../data/services';
import { site } from '../../data/site';

/**
 * §10.4 — two models, six tiers each, from the pricing spreadsheet.
 *
 * Q-06 note: the blueprint records Model 2's flat fees as truncated. In the
 * archive's copy every cell is legible and Model 2 mirrors Model 1's
 * after-3-months structure. These are transcribed, not assumed.
 */
type Model = 'getting_started' | 'operating';

interface Tier {
  name: string; skuMin: number; skuMax: number | null;
  introFee?: number; base?: number; flat?: number;
  quoteOnly?: boolean; featured?: boolean;
}

const TIERS: Record<Model, Tier[]> = {
  getting_started: [
    { name: 'Extra Small', skuMin: 1,   skuMax: 5,   introFee: 750,  base: 500,  flat: 1500 },
    { name: 'Small',       skuMin: 10,  skuMax: 25,  introFee: 1000, base: 500,  flat: 1500 },
    { name: 'Medium',      skuMin: 26,  skuMax: 100, introFee: 1500, base: 750,  flat: 1875, featured: true },
    { name: 'Large',       skuMin: 101, skuMax: 250, introFee: 2000, base: 750,  flat: 2500 },
    { name: 'Extra Large', skuMin: 251, skuMax: 500, introFee: 2500, base: 1250, flat: 3125 },
    { name: 'Custom',      skuMin: 501, skuMax: null, quoteOnly: true },
  ],
  operating: [
    { name: 'Extra Small', skuMin: 1,   skuMax: 5,   base: 500,  flat: 1500 },
    { name: 'Small',       skuMin: 10,  skuMax: 25,  base: 500,  flat: 1500 },
    { name: 'Medium',      skuMin: 26,  skuMax: 100, base: 750,  flat: 1875, featured: true },
    { name: 'Large',       skuMin: 101, skuMax: 250, base: 750,  flat: 2500 },
    { name: 'Extra Large', skuMin: 251, skuMax: 500, base: 1250, flat: 3125 },
    { name: 'Custom',      skuMin: 501, skuMax: null, quoteOnly: true },
  ],
};

const MODELS: { id: Model; label: string; blurb: string }[] = [
  { id: 'getting_started', label: 'Getting started on Amazon',
    blurb: 'BLAZON runs the launch strategy and expertise. You manage the day-to-day once the store is live.' },
  { id: 'operating', label: 'Operating your Amazon store',
    blurb: 'You are already selling everything on Amazon and want BLAZON to run the day-to-day.' },
];

export default function Pricing() {
  const [model, setModel] = useState<Model>('operating');
  const [skus, setSkus] = useState('');
  const [revenue, setRevenue] = useState('');

  const tiers = TIERS[model];

  /**
   * A real calculation from published rates — never a projection of results.
   * The source sheet has no band for 6–9 SKUs, so that is surfaced rather than
   * silently rounded into a neighbouring tier.
   */
  const result = useMemo(() => {
    const n = parseInt(skus, 10);
    if (!skus || Number.isNaN(n) || n < 1) return null;
    const tier = tiers.find((t) => n >= t.skuMin && (t.skuMax === null || n <= t.skuMax));
    if (!tier) return { gap: true as const };
    const rev = parseFloat(revenue.replace(/[^0-9.]/g, ''));
    const perf = Number.isNaN(rev) ? null : rev * 0.05;
    return { tier, perf };
  }, [skus, revenue, tiers]);

  return (
    <>
      <Seo
        route="/pricing" title="Pricing — BLAZON Amazon management"
        description="Transparent Amazon management pricing by catalogue size. $750–$3,500/month plus 5% of growth above your baseline. Three-month minimum, then month to month."
      />
      <PageHero
        eyebrow="Pricing"
        headline={['Priced by catalogue size.', 'Published, not hidden.']}
        lead="Pricing is determined mainly by catalogue size. Every tier is a choice between a lower base fee plus 5% of growth, or a flat fee — so you can pick the structure that suits your cash flow."
      />

      <Section surface="obsidian">
        <Container>
          <Reveal className="tabs" role="tablist" aria-label="Pricing model">
            {MODELS.map((m) => (
              <button
                key={m.id} role="tab" type="button"
                aria-selected={model === m.id} className={`tabs__tab${model === m.id ? ' is-active' : ''}`}
                onClick={() => setModel(m.id)}
              >
                {m.label}
              </button>
            ))}
          </Reveal>
          <Reveal delay={80}><p className="body pricing__blurb">{MODELS.find((m) => m.id === model)!.blurb}</p></Reveal>

          <RevealGroup className="pricing__grid" stagger={80} key={model}>
            {tiers.map((t) => (
              <TiltCard as="article" className={`pricing__tier card${t.featured ? ' card--accent is-featured' : ''}`} key={t.name}>
                {t.featured && <span className="pricing__flag">Most common</span>}
                <h3 className="heading-s">{t.name}</h3>
                <p className="caption pricing__skus">
                  {t.skuMax === null ? `${t.skuMin}+ SKUs` : `${t.skuMin}–${t.skuMax} SKUs`}
                </p>

                {t.quoteOnly ? (
                  <p className="pricing__quote">Call for a quote</p>
                ) : (
                  <>
                    {t.introFee && (
                      <p className="pricing__intro">
                        <span className="pricing__figure">
                          <Counter to={t.introFee} prefix="$" affixClassName="pricing__affix" />
                        </span>
                        <span className="caption">/month for the first 3 months</span>
                      </p>
                    )}
                    <div className="pricing__choice">
                      <p className="caption">{t.introFee ? 'After 3 months, choose:' : 'Choose:'}</p>
                      <p className="body-s"><strong>${t.base}/month</strong> plus 5% of gross sales{model === 'operating' ? ' above your average monthly sales' : ''}</p>
                      <p className="caption pricing__or">— or —</p>
                      <p className="body-s"><strong>${t.flat}/month</strong> flat</p>
                    </div>
                  </>
                )}
                <Link className="btn btn--secondary btn--sm pricing__cta" to="/get-started">Get a free audit</Link>
              </TiltCard>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="carbon">
        <Container>
          <SectionHeader
            eyebrow="Tier finder"
            headline={['Find your tier.']}
            lead="Enter your catalogue size and current monthly Amazon revenue. This is arithmetic on our published rates — it does not forecast a sales increase."
          />
          <Reveal className="calc card">
            <div className="calc__inputs">
              <div className="field">
                <label className="field__label" htmlFor="skus">Number of SKUs</label>
                <input className="input" id="skus" type="number" min={1} inputMode="numeric"
                       value={skus} onChange={(e) => setSkus(e.target.value)} placeholder="e.g. 45" />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="rev">
                  Monthly Amazon revenue <span className="optional">(optional)</span>
                </label>
                <input className="input" id="rev" type="text" inputMode="decimal"
                       value={revenue} onChange={(e) => setRevenue(e.target.value)} placeholder="e.g. 40000" />
              </div>
            </div>

            <div className="calc__out" aria-live="polite">
              {!result && <p className="body-s calc__hint">Enter a SKU count to see your tier.</p>}
              {result && 'gap' in result && (
                <p className="body-s calc__hint">
                  Our published bands don’t cover that catalogue size — give us a call on{' '}
                  <a className="link link--inline" href={site.phoneHref}>{site.phone}</a> and we’ll quote it directly.
                </p>
              )}
              {result && 'tier' in result && result.tier && (
                <>
                  <p className="caption">Your tier</p>
                  <p className="calc__tier">{result.tier.name}</p>
                  {result.tier.quoteOnly ? (
                    <p className="body-s">Above 500 SKUs we quote individually. Call {site.phone}.</p>
                  ) : (
                    <div className="calc__compare">
                      <div>
                        <p className="caption">Base plus performance</p>
                        <p className="calc__figure">
                          ${result.tier.base}
                          {result.perf !== null && <span className="calc__plus"> + ${Math.round(result.perf).toLocaleString()}</span>}
                        </p>
                        <p className="caption">
                          {result.perf !== null ? 'per month at the revenue entered' : 'plus 5% of gross sales'}
                        </p>
                      </div>
                      <div>
                        <p className="caption">Flat fee</p>
                        <p className="calc__figure">${result.tier.flat}</p>
                        <p className="caption">per month, no performance component</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section surface="bone">
        <Container>
          <SectionHeader eyebrow="What's included" headline={['Included every month.']} />
          <RevealGroup className="incl__grid" stagger={80}>
            {included.map((b) => (
              <TiltCard as="div" className="incl__block card" key={b.group}>
                <h3 className="heading-s">{b.group}</h3>
                <ul>{b.items.map((i) => (
                  <li key={i}><span className="incl__tick" aria-hidden="true"><Check size={12} /></span>{i}</li>
                ))}</ul>
              </TiltCard>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section surface="obsidian">
        <Container>
          <SectionHeader eyebrow="Terms" headline={['The commitment, plainly.']} />
          <FaqAccordion items={[
            { q: 'Is there a minimum term?', a: 'Three calendar months, because significant work is fronted to produce faster results. After that the agreement automatically becomes month-to-month and you can cancel at any time by emailing your account manager.' },
            { q: 'What does the 5% apply to?', a: 'Gross sales above your average monthly sales — so it is a share of the growth, not a share of the business you already had. It is charged once the calendar month is complete.' },
            { q: 'Is advertising management included?', a: 'Yes, up to $3,000/month in ad spend. Above that we hand off to a specialist partner rather than pretend otherwise. We also recommend an ad budget of 5–10% of monthly gross sales.' },
            { q: 'Does this cover international marketplaces?', a: 'Prices are based on Amazon US management only. International marketplaces are quoted separately.' },
            { q: 'Can pricing be customised?', a: `Yes. Flexible and custom pricing is available — call ${site.phone} to discuss your specific situation.` },
          ]} />
        </Container>
      </Section>

      <CtaSection />
    </>
  );
}
