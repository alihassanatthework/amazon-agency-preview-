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

/**
 * §19.3 — per-route title, description, canonical, OG and Twitter tags plus
 * optional Schema.org JSON-LD.
 */
export function Seo({ route, title, description, noindex, schema }: Props) {
  useEffect(() => {
    document.title = title;
    const url = `https://blazonpros.com${route === '/' ? '' : route}`;

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
