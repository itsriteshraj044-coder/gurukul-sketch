import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { MasonryGrid } from '../components/MasonryGrid';
import { Lightbox } from '../components/Lightbox';
import { CTASection } from '../components/CTASection';
import { VideoFrame } from '../components/VideoFrame';
import { usePageMotion } from '../hooks/usePageMotion';
import { artworks } from '../data/artworks';
import { categories, categoryById } from '../data/categories';
import '../styles/gallery.css';
import '../styles/pages.css';


export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [params, setParams] = useSearchParams();
  const [lightbox, setLightbox] = useState<number | null>(null);
  usePageMotion(ref);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    artworks.forEach((a) => map.set(a.category, (map.get(a.category) ?? 0) + 1));
    return map;
  }, []);

  const filters = useMemo(
    () => [
      { id: 'all', label: 'All Artwork', accent: 'var(--c-navy)', count: artworks.length },
      ...categories
        .filter((c) => !c.hideWhenEmpty || (counts.get(c.id) ?? 0) > 0)
        .map((c) => ({ id: c.id, label: c.label, accent: c.accent, count: counts.get(c.id) ?? 0 })),
    ],
    [counts],
  );

  const requested = params.get('category') ?? 'all';
  const active = requested === 'all' || categoryById(requested) ? requested : 'all';
  const items = useMemo(() => (active === 'all' ? artworks : artworks.filter((a) => a.category === active)), [active]);
  const activeCat = categoryById(active);

  const select = (id: string) => {
    setLightbox(null);
    setParams(id === 'all' ? {} : { category: id }, { replace: true, preventScrollReset: true });
  };

  return (
    <div ref={ref} data-motion-scope>
      <Seo
        title="Gallery: Sketches, Portraits, Folk Art & Murals"
        description="Browse GURUKUL Sketch artwork: pencil sketches, couple and heritage portraits, Gond-inspired folk art, nameplates and hand-painted wall murals."
      />
      <PageHero
        className="gallery-hero"
        eyebrow="The gallery"
        title={['A Gallery of', '*Personal Stories.*']}
        intro="Explore the different styles of custom sketch art and discover the one that speaks to you."
        media={
          <div className="gh-video">
            <div className="art-frame gh-video-frame media" data-clip>
              <div className="clip-inner">
                <VideoFrame
                  src="/video/watercolour-session.mp4"
                  poster="/video/watercolour-session-poster.webp"
                  label="Watercolour washes being laid down in a sketchbook"
                />
              </div>
            </div>
            <p className="hand gh-note" data-reveal>every piece starts on a blank page</p>
          </div>
        }
      />

      <section className="section gallery-body" aria-labelledby="gallery-heading">
        <div className="container">
          <div className="gallery-toolbar">
            <h2 id="gallery-heading" className="h3">
              {activeCat ? activeCat.label : 'All artwork'}
              <span className="gallery-total"> · {items.length} {items.length === 1 ? 'piece' : 'pieces'}</span>
            </h2>
            <LayoutGroup id="filters">
              <div className="filters" role="group" aria-label="Filter artwork by category">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="filter-btn"
                    aria-pressed={active === f.id}
                    onClick={() => select(f.id)}
                    style={{ ['--accent' as string]: f.accent }}
                  >
                    {active === f.id && (
                      <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 36 }} />
                    )}
                    {f.id !== 'all' && <span className="filter-dot" aria-hidden />}
                    {f.label}
                    <span className="filter-count">{f.count}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>

          {activeCat && <p className="gallery-blurb">{activeCat.blurb}</p>}

          {items.length > 0 ? (
            <MasonryGrid items={items} onOpen={setLightbox} eager={4} />
          ) : (
            <div className="gallery-empty" role="status">
              <ImageOff size={32} aria-hidden />
              <h3 className="h3">No {activeCat?.label.toLowerCase() ?? 'artwork'} in the gallery yet</h3>
              <p className="muted">Every piece is made to order. Tell us what you have in mind and we can create the first one for you.</p>
              <div className="btn-row">
                <Link to="/custom-sketches#enquiry" className="btn">
                  Request this style <ArrowUpRight size={16} className="btn-icon" aria-hidden />
                </Link>
                <button type="button" className="btn btn--ghost" onClick={() => select('all')}>Show all artwork</button>
              </div>
            </div>
          )}
        </div>
        <Lightbox items={items} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
      </section>

      <CTASection
        title={['Seen a style you love?', '*Let’s make yours.*']}
        text="Share a photograph and a few words about the person, the moment or the wall, and we will shape the piece around it."
        video={{ src: '/video/studio-palette.mp4', poster: '/video/studio-palette-poster.webp', label: 'Watercolour palettes and sketchbooks on a studio table' }}
      />
    </div>
  );
}
