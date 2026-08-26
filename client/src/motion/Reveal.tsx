import type { ElementType, ReactNode } from 'react';
import { useReveal } from './useReveal';

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Delay before this element rises. Nothing waits longer than 400ms. */
  delay?: number;
  [key: string]: unknown;
}

/**
 * Rise — opacity 0→1, translateY 24px→0 over motion-reveal.
 * Never fades alone: opacity is always paired with a transform.
 */
export function Reveal({ as, children, className, delay = 0, ...rest }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={[className, revealed ? 'is-revealed' : ''].filter(Boolean).join(' ')}
      style={delay ? ({ '--reveal-delay': `${Math.min(delay, 400)}ms` } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
