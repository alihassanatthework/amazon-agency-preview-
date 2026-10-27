import { useEffect } from 'react';

interface Props {
  route: string;
  title: string;
  description?: string;
  noindex?: boolean;
  schema?: Record<string, unknown>;
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([k, v]) => k !== 'content' && el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('content', attrs.content);
}

/** Canonical origin for absolute URLs in canonical, OG and Twitter tags. */
const ORIGIN = 'https://blazonpros.com';

/**
 * §19.3 — per-route title, description, canonical, OG and Twitter tags plus
 * optional Schema.org JSON-LD.
 */
export function Seo({ route, title, description, noindex, schema }: Props) {
  useEffect(() => {
    document.title = title;
    const url = `${ORIGIN}${route === '/' ? '' : route}`;

    if (description) {
      upsertMeta('meta[name="description"]', { name: 'description', content: description });
      upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
      upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    }
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'BLAZON' });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    // twitter:card above is summary_large_image, which requires an image —
    // without one every shared link previewed as a blank card.
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: `${ORIGIN}/og-image.png` });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: 'BLAZON' });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: `${ORIGIN}/og-image.png` });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' });

    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;

    const id = 'blazon-schema';
    document.getElementById(id)?.remove();
    if (schema) {
      const s = document.createElement('script');
      s.id = id; s.type = 'application/ld+json';
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    }
  }, [route, title, description, noindex, schema]);

  return null;
}
