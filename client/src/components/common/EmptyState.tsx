import type { ReactNode } from 'react';

/**
 * §19.1 — an empty state always carries explanatory copy plus a recovery
 * action. At launch Results has one case study and Team has none, so these are
 * the realistic condition rather than an edge case.
 */
export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <h3 className="heading-s">{title}</h3>
      <p className="body-s">{body}</p>
      {action}
    </div>
  );
}
