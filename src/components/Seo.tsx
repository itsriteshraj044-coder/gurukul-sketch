import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../config/site';

type Props = { title: string; description: string; image?: string };

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Per-page title, description, social tags and canonical URL (when VITE_SITE_URL is set). */
export function Seo({ title, description, image = '/og-image.jpg' }: Props) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = pathname === '/' ? title : `${title} | ${site.name}`;
    document.title = fullTitle;
    const abs = (p: string) => (site.url ? `${site.url}${p}` : p);
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', abs(image));
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    if (site.url) setMeta('property', 'og:url', abs(pathname));
    setCanonical(site.url ? abs(pathname) : null);
  }, [title, description, image, pathname]);

  return null;
}
