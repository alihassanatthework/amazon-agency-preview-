import type { ElementType } from 'react';
import { useReveal } from './useReveal';
import { useReducedMotion } from './useReducedMotion';

interface WordRiseProps {
  /** One entry per line. Real authored breaks, not measured ones. */
  lines: string[];
  as?: ElementType;
  className?: string;
  id?: string;
  /** Cascade between lines. */
  stagger?: number;
  /** Skip the observer — used by on-load entrance sequences. */
  immediate?: boolean;
}

/**
 * Word-rise — the headline is split by line and each line rises from a clipped
 * container at a 60ms cascade. Permitted on the hero headline and the two
 * largest section headlines only; overuse cheapens it.
 */
export function WordRise({
  lines,
  as,
  className,
  id,
  stagger = 60,
  immediate = false,
}: WordRiseProps) {
  const Tag = (as ?? 'h2') as ElementType;
  const reduced = useReducedMotion();
  const { ref, revealed } = useReveal<HTMLHeadingElement>({ immediate });

  // With motion off the headline is plain text — no clipping wrappers at all.
  if (reduced) {
    return (
      <Tag className={className} id={id}>
        {lines.map((line, i) => (
          <span key={line}>
            {line}
            {i < lines.length - 1 ? <br /> : null}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      id={id}
      className={[className, revealed ? 'is-revealed' : ''].filter(Boolean).join(' ')}
    >
      {lines.map((line, i) => (
        <span className="line-clip" key={line}>
          <span style={{ ['--reveal-delay' as string]: `${i * stagger}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
