import type { ReactNode } from 'react';
import { useReveal } from './useReveal';

interface MaskWipeProps {
  children: ReactNode;
  className?: string;
  /** Retract the covering panel sideways rather than upward. */
  fromLeft?: boolean;
}

/**
 * Mask-wipe — the parent clips, the child starts at scale 1.08 / translateY 4%,
 * and a covering panel retracts over motion-mask while the image settles to 1.
 */
export function MaskWipe({ children, className, fromLeft = false }: MaskWipeProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={[
        'mask-wipe',
        fromLeft ? 'mask-wipe--fromLeft' : '',
        className,
        revealed ? 'is-revealed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mask-wipe__inner">{children}</div>
    </div>
  );
}
