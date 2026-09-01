import { lazy, Suspense } from 'react';
import type { CaseStudyGraph as GraphConfig } from '../../data/caseStudies';
const CaseChart = lazy(() => import('../../pages/Home/sections/CaseChart'));

/**
 * The exact same line-chart component/configuration Aloha Bay uses — same
 * grid, axis, tooltip and line styling — fed whatever confirmed points a
 * case study actually has. No bars, no fabricated data points.
 */
export function CaseStudyGraph({ graph, animate }: { graph: GraphConfig; animate: boolean }) {
  const data = graph.points.map((p) => ({ month: p.label, current: p.value }));

  return (
    <div className="csg">
      <p className="caption case__chart-label">{graph.caption}</p>
      <div className="case__chart">
        <Suspense fallback={<div className="skeleton case__chart-skeleton" />}>
          <CaseChart
            data={data} animate={animate}
            yTickFormatter={graph.yTickFormatter}
            showYAxis={graph.showYAxis ?? true}
            showTooltip={graph.showTooltip ?? true}
            showDots
          />
        </Suspense>
      </div>
      {graph.callout && <p className="csg__callout">{graph.callout}</p>}
    </div>
  );
}
