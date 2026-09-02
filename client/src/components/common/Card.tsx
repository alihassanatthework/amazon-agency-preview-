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
 * Universal Card component — the single source of truth for card styling across the website.
 * All cards (problems, services, pricing, testimonials, etc.) use this component.
 * Provides consistent: background, border, radius, padding, shadows, hover effects, transitions.
 * Automatically handles pointer-tilt interaction for interactive cards.
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

  const baseClasses = 'card';
  const interactiveClasses = interactive ? 'card--interactive' : '';
  const accentClasses = accent ? 'card--accent' : '';
  const noteClasses = note ? 'case-card--note' : '';

  const allClasses = [baseClasses, interactiveClasses, accentClasses, noteClasses, className]
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
