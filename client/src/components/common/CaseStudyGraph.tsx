import { lazy, Suspense } from 'react';
import type { CaseStudyGraph as GraphConfig } from '../../data/caseStudies';
const CaseChart = lazy(() => import('../../pages/Home/sections/CaseChart'));

/**
 * The exact same two-line chart component/configuration Aloha Bay uses —
 * same grid, axis, tooltip, line colours and legend treatment — fed
 * whatever confirmed points a case study actually has. A study without a
 * real baseline/prior-period series simply omits `prior` and `legend`,
 * which draws one line and no legend rather than a fabricated comparison.
 */
export function CaseStudyGraph({ graph, animate }: { graph: GraphConfig; animate: boolean }) {
  const data = graph.points.map((p) => ({ month: p.label, current: p.current, prior: p.prior }));

  return (
    <div className="csg">
      <p className="caption case__chart-label">{graph.title}</p>
      <div className="case__chart">
        <Suspense fallback={<div className="skeleton case__chart-skeleton" />}>
          <CaseChart
            data={data} animate={animate}
            yTickFormatter={graph.yTickFormatter}
            showYAxis={graph.showYAxis ?? true}
            showTooltip={graph.showTooltip ?? true}
            showDots={graph.showDots ?? false}
          />
        </Suspense>
      </div>
      {graph.legend && (
        <div className="case__legend">
          <span><i style={{ background: '#8AB04B' }} />{graph.legend.current}</span>
          {graph.legend.prior && <span><i style={{ background: '#6F9A6B', opacity: .6 }} />{graph.legend.prior}</span>}
        </div>
      )}
      {graph.callout && <p className="csg__callout">{graph.callout}</p>}
    </div>
  );
}
