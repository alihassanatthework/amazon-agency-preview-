export const ArrowRight = ({ className = 'arrow' }: { className?: string }) => (
  <svg className={className} width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
    <path d="M1 5h11M8.5 1.5 12 5 8.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Check = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 14 11" fill="none" aria-hidden="true">
    <path d="M1 5.5 5 9.5 13 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Dash = () => (
  <svg width="12" height="2" viewBox="0 0 12 2" fill="none" aria-hidden="true">
    <path d="M1 1h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 4v3.5M7 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
export const Phone = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M3.7 1.3a1.2 1.2 0 0 1 1.7.3l1.2 1.7a1.2 1.2 0 0 1-.2 1.6l-.8.6a8 8 0 0 0 3.9 3.9l.6-.8a1.2 1.2 0 0 1 1.6-.2l1.7 1.2a1.2 1.2 0 0 1 .3 1.7l-.8 1.1a2 2 0 0 1-2.3.7C7.6 12.3 3.7 8.4 2 4.4a2 2 0 0 1 .7-2.3l1-.8Z" />
  </svg>
);
