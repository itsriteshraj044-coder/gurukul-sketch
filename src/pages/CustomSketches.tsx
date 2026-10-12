import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, MessageCircle, Ruler, ShieldCheck } from 'lucide-react';
import { Seo } from '../components/Seo';
import { PageHero } from '../components/PageHero';
import { RevealText } from '../components/RevealText';
import { EnquiryForm } from '../components/EnquiryForm';
import { usePageMotion } from '../hooks/usePageMotion';
import { useSmoothScroll } from '../hooks/SmoothScroll';
import { sketchStyles } from '../data/sketchStyles';
import { artworkById } from '../data/artworks';
import { whatsappLink, defaultWhatsappMessage } from '../utils/whatsapp';
import { ease } from '../utils/motion';
import '../styles/pages.css';

const heroMain = artworkById('watercolour-couple-portrait');
const heroSide = artworkById('gond-tree-of-life');

export default function CustomSketches() {
  const ref = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const { scrollTo } = useSmoothScroll();
  const initial = params.get('style');
  const [preset, setPreset] = useState<{ style: string; nonce: number } | undefined>(
    initial && sketchStyles.some((s) => s.id === initial) ? { style: initial, nonce: 0 } : undefined,
  );
  usePageMotion(ref);

  const choose = (id: string) => {
    setPreset({ style: id, nonce: Date.now() });
    const target = document.getElementById('enquiry');
    if (target) scrollTo(target, { offset: -90 });
  };

  return (
    <div ref={ref} data-motion-scope>
      <Seo
        title="Order a Custom Sketch or Portrait"
        description="Request a personalised pencil sketch, charcoal portrait, couple or family portrait, folk art piece or wall mural. Share your photo and requirements in a few simple steps."
      />
      <PageHero
        className="custom-hero"
        eyebrow="Custom sketches"
        title={['Your Photo.', 'Your Story.', '*Your Custom Sketch.*']}
        intro={
          <p>
            Choose a style, share a photograph and tell us what matters to you. We will confirm the details with you
            before anything is drawn, so the finished piece is exactly what you hoped for.
          </p>
        }
        media={
          <div className="ch-compose">
            <div className="ch-main media" data-clip>
              <div className="clip-inner">
                <img src={heroMain.image} alt={heroMain.alt} width={heroMain.width} height={heroMain.height} fetchPriority="high" />
              </div>
            </div>
            <div className="ch-side art-frame" data-speed="0.25">
              <img src={heroSide.thumbnail} alt={heroSide.alt} width={heroSide.width} height={heroSide.height} />
            </div>
            <p className="hand ch-note" data-reveal>from photo… to keepsake</p>
          </div>
        }
      >
        <div className="btn-row">
          <a href="#enquiry" className="btn" onClick={(e) => { e.preventDefault(); scrollTo('#enquiry', { offset: -90 }); }}>
            Start your enquiry <ArrowDown size={16} className="btn-icon" aria-hidden />
          </a>
          <a className="btn btn--ghost" href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} aria-hidden /> Ask a question first
          </a>
        </div>
      </PageHero>

      {/* ---------- Styles ---------- */}
      <section className="section section--cream" aria-labelledby="styles-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>Artwork styles</p>
              <RevealText lines={['Pick the style that', '*fits your story.*']} className="h2" id="styles-title" />
            </div>
            <p className="lead" data-reveal>
              Not sure which to choose? Pick the closest one and mention it in your requirements; we are happy to advise.
            </p>
          </div>
          <ul className="styles-grid" data-reveal-stagger>
            {sketchStyles.map((s, i) => (
              <motion.li
                key={s.id}
                className="style-card"
                style={{ ['--accent' as string]: s.accent }}
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <div className="style-card-media media">
                  {s.image ? (
                    <motion.img
                      src={s.image}
                      alt={s.imageAlt ?? ''}
                      loading="lazy"
                      variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                      transition={{ duration: 0.8, ease: ease.out }}
                    />
                  ) : (
                    <div className="style-card-tile" aria-hidden>
                      <span className="style-card-initial">{s.title.charAt(0)}</span>
                      <span className="hand">made to order</span>
                    </div>
                  )}
                  <span className="style-card-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="style-card-body">
                  <h3 className="style-card-title">{s.title}</h3>
                  <p>{s.summary}</p>
                  <p className="style-card-best"><span>Lovely for</span> {s.bestFor}</p>
                  <div className="style-card-actions">
                    <button type="button" className="btn btn--small" onClick={() => choose(s.id)}>
                      Choose this style
                    </button>
                    {s.galleryCategory && (
                      <Link to={`/gallery?category=${s.galleryCategory}`} className="text-link">
                        See examples <ArrowUpRight size={14} aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Enquiry ---------- */}
      <section className="section enquiry" id="enquiry" aria-labelledby="enquiry-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow" data-reveal>Request your artwork</p>
              <RevealText lines={['Let’s plan', '*your piece together.*']} className="h2" id="enquiry-title" />
            </div>
            <ul className="enquiry-assure" data-reveal-stagger>
              <li><Ruler size={18} aria-hidden /> Size, medium and details are confirmed with you before work begins.</li>
              <li><ShieldCheck size={18} aria-hidden /> Share one photo or several; we will tell you if anything else would help.</li>
            </ul>
          </div>
          <div data-reveal>
            <EnquiryForm preset={preset} />
          </div>
        </div>
      </section>
    </div>
  );
}
