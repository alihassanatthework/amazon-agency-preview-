import { Children, cloneElement, isValidElement } from 'react';
import type { CSSProperties, ElementType, ReactElement, ReactNode } from 'react';
import { useInView } from './useInView';

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  stagger?: number;
  [k: string]: unknown;
}

/** Rise-stagger — 80ms cascade, capped at 400ms so nothing gates reading. */
export function RevealGroup({ as, children, className, stagger = 80, ...rest }: Props) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, inView } = useInView<HTMLDivElement>();
  const kids = Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ style?: CSSProperties }>;
    return cloneElement(el, {
      style: { ...el.props.style, ['--d' as string]: `${Math.min(i * stagger, 400)}ms` },
    });
  });
  return (
    <Tag ref={ref} data-reveal-group="" className={[className, inView ? 'is-in' : ''].filter(Boolean).join(' ')} {...rest}>
      {kids}
    </Tag>
  );
}
