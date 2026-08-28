import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', on);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return matches;
}
