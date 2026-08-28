import type { ElementType, ReactNode } from 'react';

export type Surface = 'obsidian' | 'carbon' | 'bone' | 'linen' | 'void';

interface Props {
  surface?: Surface;
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: 'default' | 'emphasis' | 'compact' | 'quiet';
  id?: string;
  [k: string]: unknown;
}

/**
 * §12.2 — `surface` drives every colour decision inside via custom properties.
 * This is the mechanism that makes dark and light sections work without any
 * duplicated component variants.
 */
export function Section({ surface = 'obsidian', children, className, as, size = 'default', ...rest }: Props) {
  const Tag = (as ?? 'section') as ElementType;
  return (
    <Tag
      data-surface={surface}
      className={['section', size !== 'default' ? `section--${size}` : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={['container', className].filter(Boolean).join(' ')}>{children}</div>;
}
