import type { ComponentPropsWithRef, ElementType } from 'react';
import { useTilt } from '../../motion';

type TiltCardProps<T extends ElementType> = { as?: T } & Omit<ComponentPropsWithRef<T>, 'as'>;

/**
 * Wraps any element/component (div, article, figure, react-router Link, …)
 * with the same subtle pointer-tilt used across the site's card grids.
 * Centralised so every card gets identical, one-tuned interaction instead of
 * each section re-wiring useTilt by hand.
 */
export function TiltCard<T extends ElementType = 'div'>({ as, style, ...rest }: TiltCardProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  const tilt = useTilt<HTMLElement>();
  return (
    <Tag
      ref={tilt.ref}
      style={{ ...(style as object), ...tilt.style }}
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      {...rest}
    />
  );
}
