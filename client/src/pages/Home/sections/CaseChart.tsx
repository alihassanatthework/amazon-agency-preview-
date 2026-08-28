import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

export interface Point { month: string; current: number; prior: number }

/**
 * §19.5 — Recharts is loaded only on routes that chart, so the chart lives in
 * its own lazily-imported module rather than in the main bundle.
 *
 * §9.10 — redrawn in the brand palette from the Aloha Bay Seller Central data.
 * The raw screenshot is never published: it carries Amazon trade dress, client
 * data and screenshot artefacts.
 */
export default function CaseChart({ data, animate }: { data: Point[]; animate: boolean }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="rgba(142,145,136,.12)" vertical={false} />
        <XAxis dataKey="month" stroke="#8E9188" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <YAxis stroke="#8E9188" tickLine={false} axisLine={false} width={54} tick={{ fontSize: 12 }}
               tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
        <Tooltip
          contentStyle={{ background: '#131711', border: '1px solid #2A3124', borderRadius: 8, color: '#C7C9C1', fontSize: 13 }}
          formatter={(v) => [`$${Number(v).toLocaleString()}`, ''] as [string, string]}
        />
        {/* Prior period in sage at 60%, current in the logo green. */}
        <Line type="monotone" dataKey="prior" stroke="#6F9A6B" strokeWidth={2} strokeOpacity={.6}
              dot={false} isAnimationActive={animate} animationDuration={1400} />
        <Line type="monotone" dataKey="current" stroke="#8AB04B" strokeWidth={2.5}
              dot={false} isAnimationActive={animate} animationDuration={1400} />
      </LineChart>
    </ResponsiveContainer>
  );
}
