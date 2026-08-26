import { Children, cloneElement, isValidElement } from 'react';
import type { ElementType, ReactElement, ReactNode } from 'react';
import { useReveal } from './useReveal';

interface RevealGroupProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Cascade between siblings. 80ms is the token default. */
  stagger?: number;
  [key: string]: unknown;
}

/**
 * Rise-stagger — rise applied to children with a cascade in DOM order.
 * The delay is capped at 400ms total so content is never gated behind motion.
 */
export function RevealGroup({
  as,
  children,
  className,
  stagger = 80,
  ...rest
}: RevealGroupProps) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, revealed } = useReveal<HTMLDivElement>();

  const staggered = Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ style?: React.CSSProperties }>;
    return cloneElement(el, {
      style: {
        ...el.props.style,
        ['--reveal-delay' as string]: `${Math.min(i * stagger, 400)}ms`,
      },
    });
  });

  return (
    <Tag
      ref={ref}
      data-reveal-group=""
      className={[className, revealed ? 'is-revealed' : ''].filter(Boolean).join(' ')}
      {...rest}
    >
      {staggered}
    </Tag>
  );
}
