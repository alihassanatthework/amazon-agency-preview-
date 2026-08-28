import type { CSSProperties } from 'react';
import { useInView } from './useInView';

export function LineDraw(
  { className, vertical, delay = 0, style }:
  { className?: string; vertical?: boolean; delay?: number; style?: CSSProperties },
) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      data-line={vertical ? 'y' : ''}
      aria-hidden="true"
      className={[className, inView ? 'is-in' : ''].filter(Boolean).join(' ')}
      style={{ ...style, ...(delay ? { ['--d' as string]: `${delay}ms` } : null) }}
    />
  );
}
