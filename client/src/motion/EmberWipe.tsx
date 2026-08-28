import type { ReactNode } from 'react';
import { useInView } from './useInView';

/** The signature reveal — a mask retracts while a lime edge travels ahead. */
export function EmberWipe({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={['ember-wipe', className, inView ? 'is-in' : ''].filter(Boolean).join(' ')}>
      <div className="ember-wipe__inner">{children}</div>
    </div>
  );
}
