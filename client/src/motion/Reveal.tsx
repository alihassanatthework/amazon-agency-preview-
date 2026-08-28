import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from './useInView';

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  style?: CSSProperties;
  [k: string]: unknown;
}

/** Rise — opacity 0→1, translateY 28px→0. Never fades alone. */
export function Reveal({ as, children, className, delay = 0, immediate, style, ...rest }: Props) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, inView } = useInView<HTMLDivElement>(immediate);
  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={[className, inView ? 'is-in' : ''].filter(Boolean).join(' ')}
      style={{ ...style, ...(delay ? { ['--d' as string]: `${Math.min(delay, 400)}ms` } : null) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
