import { Link } from 'react-router-dom';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Counter, EmberWipe, Reveal, RevealGroup, useInView } from '../../../motion';
import { Section, Container } from '../../../components/layout/Section';
import { ArrowRight } from '../../../components/ui/Icon';

/**
 * H8 / §9.10 — specific evidence. The chart is redrawn in the brand palette
 * from the Aloha Bay Seller Central data; the raw screenshot is never
 * published (Amazon trade dress, client data, poor quality).
 *
 * Series: current period lime-500, prior period sage at 60%, ash gridlines.
 */
const DATA = [
  { month: 'Jan', current: 8_420,  prior: 3_180 },
  { month: 'Feb', current: 9_860,  prior: 3_640 },
  { month: 'Mar', current: 12_340, prior: 4_010 },
  { month: 'Apr', current: 14_920, prior: 4_880 },
  { month: 'May', current: 18_460, prior: 5_640 },
  { month: 'Jun', current: 22_180, prior: 6_920 },
  { month: 'Jul', current: 26_540, prior: 8_130 },
  { month: 'Aug', current: 30_348, prior: 9_460 },
];

const METRICS = [
  { to: 3,      suffix: '×',  label: 'sales increase' },
  { to: 14,     suffix: '%',  label: 'ACOS, while raising prices' },
  { to: 30_348, prefix: '$',  label: 'ordered product sales, YTD' },
  { to: 1_424,  suffix: '',   label: 'units sold' },
];

export function CaseStudyFeature() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Section surface="obsidian" className="case" aria-labelledby="case-title">
      <Container>
        <div className="case__grid">
          <div className="case__chart-col" ref={ref}>
            <EmberWipe className="case__panel">
              <div className="case__panel-inner">
                <p className="caption case__chart-label">Ordered product sales — year on year</p>
                <div className="case__chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DATA} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                      <CartesianGrid stroke="rgba(142,145,136,.12)" vertical={false} />
                      <XAxis dataKey="month" stroke="#8E9188" tickLine={false} axisLine={false}
                             tick={{ fontSize: 12 }} />
                      <YAxis stroke="#8E9188" tickLine={false} axisLine={false} width={54}
                             tick={{ fontSize: 12 }}
                             tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
                      <Tooltip
                        contentStyle={{ background: '#131711', border: '1px solid #2A3124',
                                        borderRadius: 8, color: '#C7C9C1', fontSize: 13 }}
                        formatter={(v) => [`$${Number(v).toLocaleString()}`, ''] as [string, string]}
                      />
                      <Line type="monotone" dataKey="prior" stroke="#6F9A6B" strokeWidth={2}
                            strokeOpacity={0.6} dot={false} isAnimationActive={inView} animationDuration={1400} />
                      <Line type="monotone" dataKey="current" stroke="#8AB04B" strokeWidth={2.5}
                            dot={false} isAnimationActive={inView} animationDuration={1400} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="case__legend">
                  <span><i style={{ background: '#8AB04B' }} />This year</span>
                  <span><i style={{ background: '#6F9A6B', opacity: .6 }} />Prior year</span>
                </div>
              </div>
            </EmberWipe>
          </div>

          <div className="case__body">
            <Reveal delay={200}>
              <p className="eyebrow">Case study</p>
              <h2 className="display-l" id="case-title">Aloha Bay</h2>
              <p className="body case__narrative">
                A supplements and wellness brand whose Amazon presence had plateaued.
                Advertising was spending against its own branded search, listings were
                incomplete, and Subscribe &amp; Save was unconfigured. We rebuilt the
                catalogue structure, restructured advertising against contribution
                margin, and opened the programs the account was eligible for but had
                never used.
              </p>
            </Reveal>

            <RevealGroup className="case__metrics" stagger={90}>
              {METRICS.map((m) => (
                <div key={m.label}>
                  <p className="case__metric-value">
                    <Counter to={m.to} prefix={m.prefix} suffix={m.suffix} affixClassName="case__metric-affix" />
                  </p>
                  <p className="caption">{m.label}</p>
                </div>
              ))}
            </RevealGroup>

            <Reveal className="case__link">
              <Link className="link" to="/results/aloha-bay">Read the full case study<ArrowRight /></Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
