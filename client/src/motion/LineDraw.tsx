import { useReveal } from './useReveal';

interface LineDrawProps {
  className?: string;
  vertical?: boolean;
  delay?: number;
}

/**
 * Line-draw — a 1px amber rule scales from scaleX(0) to 1 from the left edge
 * over motion-reveal. Used for eyebrow rules, section dividers and row separators.
 */
export function LineDraw({ className, vertical = false, delay = 0 }: LineDrawProps) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-line-draw={vertical ? 'vertical' : ''}
      className={[className, revealed ? 'is-revealed' : ''].filter(Boolean).join(' ')}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
      aria-hidden="true"
    />
  );
}
