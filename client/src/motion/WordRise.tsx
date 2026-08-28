import type { ElementType, ReactNode } from 'react';
import { useInView } from './useInView';
import { useReducedMotion } from './useReducedMotion';

interface Props {
  lines: (string | ReactNode)[];
  as?: ElementType;
  className?: string;
  id?: string;
  stagger?: number;
  immediate?: boolean;
}

/**
 * Word-rise — each authored line rises from a clipped container at a 70ms
 * cascade. Permitted twice per page maximum; overuse destroys its impact.
 */
export function WordRise({ lines, as, className, id, stagger = 70, immediate }: Props) {
  const Tag = (as ?? 'h2') as ElementType;
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLHeadingElement>(immediate);

  if (reduced) {
    return (
      <Tag className={className} id={id}>
        {lines.map((l, i) => (
          <span key={i}>{l}{i < lines.length - 1 ? <br /> : null}</span>
        ))}
      </Tag>
    );
  }
  return (
    <Tag ref={ref} id={id} className={[className, inView ? 'is-in' : ''].filter(Boolean).join(' ')}>
      {lines.map((l, i) => (
        <span className="line-clip" key={i}>
          <span style={{ ['--d' as string]: `${i * stagger}ms` }}>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
