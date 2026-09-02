import type { ComponentPropsWithRef, ElementType } from 'react';
import { useTilt } from '../../motion';

type CardProps<T extends ElementType> = {
  as?: T;
  children: React.ReactNode;
  interactive?: boolean;
  accent?: boolean;
  note?: boolean;
} & Omit<ComponentPropsWithRef<T>, 'as'>;

/**
 * Universal Card component — the single source of truth for card styling
 * across the website. Every card (problems, services, pricing, testimonials,
 * case studies, forms, stats) is this component.
 *
 * All visual treatment lives in the `.card` rules in styles/base.css, which
 * read the `--card-*` tokens in styles/tokens.css. Those tokens are
 * surface-independent, so a card looks identical on a light section and a
 * dark one. Pages may pass `className` for LAYOUT only — grid position,
 * width, gap, direction. A page that needs a different colour, border,
 * shadow or hover is a bug in the token set, not a reason for a local
 * override.
 *
 * Content roles for card children, so pages never restate a colour:
 *   card__strong   heading-coloured inline text
 *   card__meta     muted secondary text
 *   card__eyebrow  accent label
 *   card__accent   accent text
 *   card__figure   accent numeral / figure
 *   card__icon     accent icon
 *   card__badge    accent badge
 *   card__rule     hairline divider
 */
export function Card<T extends ElementType = 'div'>({
  as,
  children,
  interactive = false,
  accent = false,
  note = false,
  className = '',
  style,
  ...rest
}: CardProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const tilt = useTilt<HTMLElement>();

  const allClasses = [
    'card',
    interactive && 'card--interactive',
    accent && 'card--accent',
    note && 'card--note',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={tilt.ref}
      className={allClasses}
      style={{ ...(style as object), ...tilt.style }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}
