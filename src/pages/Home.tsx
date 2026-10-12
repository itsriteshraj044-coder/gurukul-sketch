import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Brush, Camera, ClipboardCheck, Gift, HeartHandshake, Layers, ScanEye, Sparkles, SwatchBook, MessagesSquare } from 'lucide-react';
import { Seo } from '../components/Seo';
import { Hero } from '../components/home/Hero';
import { RevealText } from '../components/RevealText';
import { ArtworkCard } from '../components/ArtworkCard';
import { BeforeAfter } from '../components/BeforeAfter';
import { MasonryGrid } from '../components/MasonryGrid';
import { Lightbox } from '../components/Lightbox';
import { TestimonialSlider } from '../components/TestimonialSlider';
import { CTASection } from '../components/CTASection';
import { usePageMotion } from '../hooks/usePageMotion';
import { useGsap } from '../hooks/useGsap';
import { gsap } from '../utils/gsap';
import { artworkById } from '../data/artworks';
import { categoryById, type CategoryId } from '../data/categories';
import { testimonials } from '../data/testimonials';
import { transformation } from '../data/transformation';
import { site } from '../config/site';
import '../styles/home.css';

/** Homepage category cards: each uses a different artwork from the hero and portfolio below. */
const collection: { category: CategoryId; art: string; area: string; title?: string }[] = [
  { category: 'couples', art: 'watercolour-couple-portrait', area: 'a', title: 'Couple Sketches' },
  { category: 'portraits', art: 'heritage-portrait', area: 'b', title: 'Portrait Sketches' },
  { category: 'pencil', art: 'floral-line-art-mural', area: 'c', title: 'Pencil & Line Art' },
  { category: 'murals', art: 'community-doodle-mural', area: 'd' },
  { category: 'folk', art: 'gond-tree-of-life', area: 'e' },
  { category: 'decor', art: 'family-nameplate', area: 'f', title: 'Special Occasion Pieces' },
];

const portfolioIds = [
  'pink-city-mural',
  'cherry-blossom-mural',
  'cafe-doodle-mural',
  'botanical-leaves-mural',
  'floral-panel-wall',
  'arch-botanical-mural',
  'dining-hall-mural',
  'restaurant-foliage-mural',
];
const portfolio = portfolioIds.map(artworkById);
const studioShot = artworkById('mural-in-progress');

const steps = [
  { icon: SwatchBook, title: 'Choose Your Sketch Style', text: 'Pencil, charcoal, a colour portrait, folk art or a full wall: pick the look that suits your story.', color: 'var(--c-royal)' },
  { icon: Camera, title: 'Share Your Photograph', text: 'Send one clear photo or a few. We will tell you if anything else would help the likeness.', color: 'var(--c-orange)' },
  { icon: ClipboardCheck, title: 'Confirm Your Requirements', text: 'Size, medium, people and the little details to include are agreed with you before work begins.', color: 'var(--c-green-deep)' },
  { icon: Gift, title: 'Receive Your Artwork', text: 'Your finished piece, made by hand for you and ready to frame, gift or hang.', color: 'var(--c-red)' },
];

const reasons = [
  { icon: HeartHandshake, title: 'Personalized artwork', text: 'Every piece starts from your photographs and your story, never from a template.' },
  { icon: Layers, title: 'Multiple sketch styles', text: 'Graphite, charcoal, colour portraits, Gond-inspired folk art and hand-painted walls.' },
  { icon: ScanEye, title: 'Attention to detail', text: 'Jewellery, fabric, a familiar smile. The small things are where a likeness lives.' },
  { icon: Sparkles, title: 'Made for meaningful occasions', text: 'Weddings, anniversaries, birthdays, tributes, farewells and new homes.' },
  { icon: Brush, title: 'Built around your requirements', text: 'Size, medium and composition are shaped by what you ask for.' },
  { icon: MessagesSquare, title: 'Personal, simple ordering', text: 'Talk to us directly on WhatsApp or through a short guided form.' },
];

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  usePageMotion(ref);

  // Process: the connecting line draws itself as the section scrolls through.
  useGsap(processRef, ({ reduced }) => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    const line = { ease: 'none', scrollTrigger: { trigger: '.process-list', start: 'top 75%', end: 'bottom 55%', scrub: 0.5 } };
    mm.add('(min-width: 960px)', () => {
      gsap.fromTo('.process-progress', { scaleX: 0 }, { scaleX: 1, ...line });
    });
    mm.add('(max-width: 959.98px)', () => {
      gsap.fromTo('.process-progress', { scaleY: 0 }, { scaleY: 1, ...line });
    });
    gsap.from('.process-step', {
      y: 50,
      autoAlpha: 0,
      duration: 1,
      stagger: 0.16,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.process-list', start: 'top 80%', once: true },
    });
    gsap.from('.process-num', {
      scale: 0.4,
      rotate: -20,
      duration: 0.9,
      stagger: 0.16,
      ease: 'back.out(2)',
      scrollTrigger: { trigger: '.process-list', start: 'top 80%', once: true },
    });
    return () => mm.revert();
  });

  return (
    <div ref={ref} data-motion-scope>
      <Seo
        title="GURUKUL Sketch | Custom Sketches, Portraits & Wall Art from Your Photos"
        description="Turn your favourite photographs into hand-crafted pencil sketches, painted portraits, folk art and murals, made especially for you by GURUKUL Sketch."
      />
      <Hero />

      {/* ---------- Featured collection ---------- */}
      <section className="section" id="collection" aria-labelledby="collection-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>The collection</p>
              <RevealText lines={['Every Sketch', '*Tells a Story.*']} className="h2" id="collection-title" />
            </div>
            <p className="lead" data-reveal>
              From quiet graphite studies to walls full of colour, each style has its own way of holding a memory.
              Choose one to see more of it.
            </p>
          </div>
          <div className="collection-grid">
            {collection.map((c, i) => {
              const cat = categoryById(c.category)!;
              const art = artworkById(c.art);
              return (
                <ArtworkCard
                  key={c.category}
                  className={`area-${c.area}`}
                  to={`/gallery?category=${c.category}`}
                  image={c.area === 'a' || c.area === 'd' ? art.image : (art.thumbnail ?? art.image)}
                  width={art.width}
                  height={art.height}
                  alt={art.alt ?? art.title}
                  index={i + 1}
                  title={c.title ?? cat.label}
                  text={cat.blurb}
                  accent={cat.accent}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Before / after ---------- */}
      <section className="section section--cream transform" aria-labelledby="transform-title">
        <div className="container transform-grid">
          <div className="transform-copy">
            <p className="eyebrow" data-reveal>From photo to keepsake</p>
            <RevealText lines={['A photograph', 'remembers.', '*Art feels.*']} className="h2" id="transform-title" />
            <p className="lead" data-reveal>
              Drag the handle to compare. A sketch starts with structure, proportion and light; colour, texture and
              all the small details are layered in until the piece feels like the people in it.
            </p>
            <ul className="transform-points" data-reveal-stagger>
              <li><span style={{ background: 'var(--c-royal)' }} />Expression and likeness first</li>
              <li><span style={{ background: 'var(--c-orange)' }} />Light, shadow and skin tones</li>
              <li><span style={{ background: 'var(--c-green)' }} />Jewellery, fabric and hair, in detail</li>
            </ul>
          </div>
          <div className="transform-media" data-reveal>
            <BeforeAfter data={transformation} />
          </div>
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="section process" ref={processRef} aria-labelledby="process-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>How it works</p>
              <RevealText lines={['Four simple steps', 'to *your artwork.*']} className="h2" id="process-title" />
            </div>
            <p className="lead" data-reveal>
              No complicated checkout. You tell us what you have in mind, we confirm the details together, and the
              drawing begins.
            </p>
          </div>
          <div className="process-list">
            <span className="process-track" aria-hidden="true">
              <span className="process-progress" />
            </span>
            <ol className="process-steps">
            {steps.map((s, i) => (
              <li className="process-step" key={s.title} style={{ ['--accent' as string]: s.color }}>
                <span className="process-num" aria-hidden="true">{i + 1}</span>
                <s.icon className="process-icon" size={22} aria-hidden />
                <h3 className="h3">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p>{s.text}</p>
              </li>
            ))}
            </ol>
          </div>
          <div className="process-cta" data-reveal>
            <Link to="/custom-sketches#enquiry" className="btn">
              Start with step one <ArrowUpRight size={16} className="btn-icon" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Why choose ---------- */}
      <section className="section section--cream why" aria-labelledby="why-title">
        <div className="container why-grid">
          <div className="why-media">
            <div className="why-frame media" data-clip>
              <div className="clip-inner">
                <img src={studioShot.image} alt={studioShot.alt} width={studioShot.width} height={studioShot.height} loading="lazy" />
              </div>
            </div>
            <p className="hand why-note" data-reveal>painted on site, one stroke at a time</p>
          </div>
          <div className="why-copy">
            <p className="eyebrow" data-reveal>Why GURUKUL Sketch</p>
            <RevealText lines={['Made by hand.', '*Made for you.*']} className="h2" id="why-title" />
            <ul className="why-list" data-reveal-stagger>
              {reasons.map((r, i) => (
                <li key={r.title}>
                  <span className="why-icon" style={{ color: ['var(--c-royal)', 'var(--c-orange)', 'var(--c-purple)', 'var(--c-red)', 'var(--c-green-deep)', 'var(--c-navy)'][i] }}>
                    <r.icon size={20} aria-hidden />
                  </span>
                  <div>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Featured portfolio ---------- */}
      <section className="section portfolio" aria-labelledby="portfolio-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>Featured portfolio</p>
              <RevealText lines={['Walls, portraits', '& *everything between.*']} className="h2" id="portfolio-title" />
            </div>
            <div data-reveal>
              <p className="lead">A few recent pieces, from café walls to keepsake portraits. Tap any artwork to see it larger.</p>
              <Link to="/gallery" className="text-link portfolio-link">
                View All Artwork <ArrowUpRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
          <div data-reveal>
            <MasonryGrid items={portfolio} onOpen={setLightbox} />
          </div>
        </div>
        <Lightbox items={portfolio} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="section section--cream testimonials" aria-labelledby="testimonials-title">
        <div className="container testimonials-grid">
          <div>
            <p className="eyebrow" data-reveal>Kind words</p>
            <RevealText lines={['Stories from', '*our customers.*']} className="h2" id="testimonials-title" />
          </div>
          <div data-reveal>
            <TestimonialSlider items={testimonials} isSample={site.testimonialsAreSamples} />
          </div>
        </div>
      </section>

      <CTASection
        video={{ src: '/video/pencil-study.mp4', poster: '/video/pencil-study-poster.webp', label: 'A pencil study being shaded in the studio' }}
      />
    </div>
  );
}
