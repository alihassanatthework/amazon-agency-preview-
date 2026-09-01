import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

export interface Point { month: string; current: number; prior?: number }

interface Props {
  data: Point[];
  animate: boolean;
  /** Defaults to Aloha Bay's own $k formatting — override for non-dollar series. */
  yTickFormatter?: (v: number) => string;
  /** Off for series where the numbers are an index, not a real unit (default on). */
  showYAxis?: boolean;
  showTooltip?: boolean;
  /** Visible point markers — off by default (Aloha Bay's 8-point line stays bare). */
  showDots?: boolean;
}

/**
 * §19.5 — Recharts is loaded only on routes that chart, so the chart lives in
 * its own lazily-imported module rather than in the main bundle.
 *
 * §9.10 — redrawn in the brand palette from the Aloha Bay Seller Central data.
 * The raw screenshot is never published: it carries Amazon trade dress, client
 * data and screenshot artefacts.
 *
 * Every other case study reuses this exact component/configuration rather
 * than a separate chart implementation — only the formatter/axis/dot options
 * above differ, and only when a case study's data actually calls for it.
 */
export default function CaseChart({
  data, animate,
  yTickFormatter = (v: number) => `$${Math.round(v / 1000)}k`,
  showYAxis = true, showTooltip = true, showDots = false,
}: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: showYAxis ? -12 : 8 }}>
        <CartesianGrid stroke="rgba(142,145,136,.12)" vertical={false} />
        <XAxis dataKey="month" stroke="#8E9188" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} interval={0} />
        {showYAxis && (
          <YAxis stroke="#8E9188" tickLine={false} axisLine={false} width={54} tick={{ fontSize: 12 }}
                 tickFormatter={yTickFormatter} />
        )}
        {showTooltip && (
          <Tooltip
            contentStyle={{ background: '#131711', border: '1px solid #2A3124', borderRadius: 8, color: '#C7C9C1', fontSize: 13 }}
            formatter={(v) => [yTickFormatter(Number(v)), ''] as [string, string]}
          />
        )}
        {/* Prior period in sage at 60%, current in the logo green. A series
            with no `prior` values simply draws no second line. */}
        <Line type="monotone" dataKey="prior" stroke="#6F9A6B" strokeWidth={2} strokeOpacity={.6}
              dot={showDots ? { r: 4, fill: '#6F9A6B', strokeWidth: 0 } : false}
              isAnimationActive={animate} animationDuration={1400} />
        <Line type="monotone" dataKey="current" stroke="#8AB04B" strokeWidth={2.5}
              dot={showDots ? { r: 4, fill: '#8AB04B', strokeWidth: 0 } : false}
              isAnimationActive={animate} animationDuration={1400} />
      </LineChart>
    </ResponsiveContainer>
  );
}
