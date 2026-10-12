import { useRef } from 'react';
import { Ear, PenTool, ScanSearch, MessageSquareHeart, ClipboardCheck, Eye, Images } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { RevealText } from '../components/RevealText';
import { VideoFrame } from '../components/VideoFrame';
import { CTASection } from '../components/CTASection';
import { usePageMotion } from '../hooks/usePageMotion';
import { useGsap } from '../hooks/useGsap';
import { gsap } from '../utils/gsap';
import { allowRichMotion } from '../utils/motion';
import { artworkById } from '../data/artworks';
import '../styles/pages.css';

const heroMain = artworkById('heritage-portrait');
const heroSide = artworkById('gond-tree-of-life');
const storyArt = artworkById('restaurant-foliage-mural');
const detailArt = artworkById('bridal-couple-portrait');
const personalA = artworkById('family-nameplate');
const personalB = artworkById('floral-panel-wall');

const approach = [
  { icon: Ear, title: 'We listen first', text: 'Who is in the photograph, what the moment meant, where the piece will live. The story shapes the artwork.' },
  { icon: ScanSearch, title: 'We study the reference', text: 'Proportion, light and expression are worked out from your photo before the first confident line goes down.' },
  { icon: PenTool, title: 'We build it by hand', text: 'Layer by layer, in graphite, charcoal or paint, refining until the likeness and the feeling both hold.' },
];

const commitments = [
  { icon: MessageSquareHeart, text: 'We take the time to understand what the artwork means to you.' },
  { icon: ClipboardCheck, text: 'Size, medium and details are agreed with you before work begins.' },
  { icon: Eye, text: 'We pay attention to the small things that make a portrait feel like the person.' },
  { icon: Images, text: 'Your photographs are treated with care and used for your artwork.' },
];

const studioClips = [
  { src: '/video/studio-wide.mp4', poster: '/video/studio-wide-poster.webp', label: 'Young artists painting at easel-lined tables in the studio', wide: true },
  { src: '/video/studio-palette.mp4', poster: '/video/studio-palette-poster.webp', label: 'Watercolour palettes and sketchbooks on a studio table', wide: false },
  { src: '/video/watercolour-session.mp4', poster: '/video/watercolour-session-poster.webp', label: 'Watercolour washes being laid down in a sketchbook', wide: true },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLElement>(null);
  usePageMotion(ref);

  // Attention to detail: the image slowly zooms in as you scroll, like leaning in.
  useGsap(detailRef, ({ reduced }) => {
    if (reduced) return;
    gsap.fromTo(
      '.detail-zoom',
      { scale: 1 },
      { scale: 1.35, ease: 'none', scrollTrigger: { trigger: '.detail-stage', start: 'top 80%', end: 'bottom 20%', scrub: 0.6 } },
    );
  });

  // Studio reel drifts sideways with scroll (no pinning; normal scrolling is never blocked).
  useGsap(reelRef, ({ reduced }) => {
    if (reduced) return;
    const amount = allowRichMotion() ? 18 : 8;
    gsap.fromTo(
      '.reel-track',
      { xPercent: amount / 2 },
      { xPercent: -amount, ease: 'none', scrollTrigger: { trigger: reelRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } },
    );
  });

  return (
    <div ref={ref} data-motion-scope>
      <Seo
        title="About Us: Art That Makes Memories Last"
        description="GURUKUL Sketch turns meaningful photographs and personal moments into hand-made sketches, portraits, folk art and murals, with care for every detail."
      />
      <PageHero
        className="about-hero"
        eyebrow="About GURUKUL Sketch"
        title={['Art That Makes', '*Memories Last.*']}
        intro={
          <p>
            We transform meaningful photographs and personal moments into custom artwork: pencil and charcoal
            portraits, couple paintings, folk art and hand-painted walls, each made for one person, one family or one place.
          </p>
        }
        media={
          <div className="ah-compose">
            <div className="ah-main media" data-clip>
              <div className="clip-inner">
                <img src={heroMain.image} alt={heroMain.alt} width={heroMain.width} height={heroMain.height} fetchPriority="high" />
              </div>
            </div>
            <div className="ah-side art-frame" data-speed="0.3">
              <img src={heroSide.thumbnail} alt={heroSide.alt} width={heroSide.width} height={heroSide.height} />
            </div>
            <span className="ah-stripe stripe-bar" aria-hidden />
          </div>
        }
      />

      {/* ---------- Our story ---------- */}
      <section className="section section--cream" aria-labelledby="story-title">
        <div className="container story-grid">
          <div className="story-media media" data-clip>
            <div className="clip-inner">
              <img src={storyArt.image} alt={storyArt.alt} width={storyArt.width} height={storyArt.height} loading="lazy" />
            </div>
          </div>
          <div className="story-copy">
            <p className="eyebrow" data-reveal>Our story</p>
            <RevealText lines={['More than a file', '*on your phone.*']} className="h2" id="story-title" />
            <div className="story-text" data-reveal>
              <p className="lead">
                GURUKUL Sketch exists for a simple reason: the photographs we treasure deserve more than a place in a
                camera roll.
              </p>
              <p>
                A portrait drawn by hand slows a moment down. It asks someone to look closely at a face, a gesture, the
                way two people lean into each other, and to put that on paper or on a wall with care. That same care
                goes into every commission, whether it is a single pencil portrait, a couple painting for a wedding, a
                Gond-inspired folk piece or a mural for a café.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Creative approach ---------- */}
      <section className="section" aria-labelledby="approach-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>Our creative approach</p>
              <RevealText lines={['Look closely.', '*Then draw.*']} className="h2" id="approach-title" />
            </div>
            <p className="lead" data-reveal>
              Good likeness is rarely about copying a photo line for line. It is about noticing what makes a person
              recognisable, and keeping it.
            </p>
          </div>
          <ol className="approach-list" data-reveal-stagger>
            {approach.map((a, i) => (
              <li key={a.title}>
                <span className="approach-num">0{i + 1}</span>
                <a.icon size={24} aria-hidden className="approach-icon" />
                <h3 className="h3">{a.title}</h3>
                <p>{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Attention to detail ---------- */}
      <section className="section section--cream detail" ref={detailRef} aria-labelledby="detail-title">
        <div className="container detail-grid">
          <div className="detail-copy">
            <p className="eyebrow" data-reveal>Attention to detail</p>
            <RevealText lines={['The small things', '*are the whole thing.*']} className="h2" id="detail-title" />
            <p className="lead" data-reveal>
              The shine on a necklace, the fold of a saree, mehendi on a hand, the light catching someone’s hair. These
              are the details people notice first when they see a portrait of someone they love.
            </p>
            <p className="hand detail-hand" data-reveal>keep scrolling, lean in ↓</p>
          </div>
          <div className="detail-stage media" data-reveal>
            <img
              className="detail-zoom"
              src={detailArt.image}
              alt={`Detail of ${detailArt.title}: ${detailArt.alt}`}
              width={detailArt.width}
              height={detailArt.height}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ---------- Personalized artwork ---------- */}
      <section className="section" aria-labelledby="personal-title">
        <div className="container personal-grid">
          <div className="personal-copy">
            <p className="eyebrow" data-reveal>Personalized artwork</p>
            <RevealText lines={['Made for one home,', '*one story.*']} className="h2" id="personal-title" />
            <p className="lead" data-reveal>
              A family nameplate for the front door. Floral panels for a quiet corner. A portrait sized for the wall above
              the sofa. Each piece is planned around the people and the place it is made for.
            </p>
          </div>
          <div className="personal-media">
            <div className="personal-a media" data-clip>
              <div className="clip-inner">
                <img src={personalA.image} alt={personalA.alt} width={personalA.width} height={personalA.height} loading="lazy" />
              </div>
            </div>
            <div className="personal-b media" data-clip data-speed="0.2">
              <div className="clip-inner">
                <img src={personalB.thumbnail} alt={personalB.alt} width={personalB.width} height={personalB.height} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Value of handmade ---------- */}
      <section className="section section--cream handmade" ref={reelRef} aria-labelledby="handmade-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>The value of handmade art</p>
              <RevealText lines={['A filter takes a second.', '*This takes care.*']} className="h2" id="handmade-title" />
            </div>
            <p className="lead" data-reveal>
              Every stroke in a hand-made piece is a decision someone made while looking at your photograph. That is what
              gives it warmth no filter can copy, and why it becomes something to keep.
            </p>
          </div>
        </div>
        <div className="reel" aria-label="Moments from the studio">
          <div className="reel-track">
            {studioClips.map((c) => (
              <figure key={c.src} className={`reel-item ${c.wide ? 'reel-item--wide' : ''}`}>
                <VideoFrame src={c.src} poster={c.poster} label={c.label} />
              </figure>
            ))}
          </div>
        </div>
        <p className="container reel-caption hand">moments from the studio</p>
      </section>

      {/* ---------- Commitment ---------- */}
      <section className="section commitment" aria-labelledby="commit-title">
        <div className="container commit-grid">
          <div>
            <p className="eyebrow" data-reveal>Our commitment</p>
            <RevealText lines={['To every customer,', '*every time.*']} className="h2" id="commit-title" />
          </div>
          <ul className="commit-list" data-reveal-stagger>
            {commitments.map((c, i) => (
              <li key={c.text} style={{ ['--accent' as string]: ['var(--c-royal)', 'var(--c-green-deep)', 'var(--c-orange)', 'var(--c-purple)'][i] }}>
                <c.icon size={22} aria-hidden />
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        title={['Ready to see your', 'memory *drawn by hand?*']}
        text="Browse the gallery for inspiration, or tell us about your idea and we will take it from there."
        secondary="gallery"
        image={{ src: artworkById('watercolour-couple-portrait').thumbnail!, alt: artworkById('watercolour-couple-portrait').alt!, width: 1080, height: 732 }}
      />
    </div>
  );
}
