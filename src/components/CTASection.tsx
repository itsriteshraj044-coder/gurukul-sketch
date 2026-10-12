import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { RevealText } from './RevealText';
import { VideoFrame } from './VideoFrame';
import { WhatsAppGlyph } from './WhatsAppButton';
import { whatsappLink, defaultWhatsappMessage } from '../utils/whatsapp';
import { usePageMotion } from '../hooks/usePageMotion';

type Props = {
  title?: string[];
  text?: string;
  /** Optional media: a studio video, or an image. */
  video?: { src: string; poster: string; label: string };
  image?: { src: string; alt: string; width: number; height: number };
  secondary?: 'whatsapp' | 'gallery';
};

/** Closing conversion block shared by every page. */
export function CTASection({
  title = ['Let’s Turn Your Favourite', '*Memory Into Art.*'],
  text = 'Tell us about the sketch you have in mind, and let’s create something personal.',
  video,
  image,
  secondary = 'whatsapp',
}: Props) {
  const ref = useRef<HTMLElement>(null);
  usePageMotion(ref);

  return (
    <section className="cta section" ref={ref} aria-labelledby="cta-title" data-motion-scope>
      <div className="container cta-grid">
        <div className="cta-copy">
          <p className="eyebrow" data-reveal>Start your commission</p>
          <RevealText lines={title} as="h2" className="h2 cta-title" id="cta-title" />
          <p className="lead" data-reveal>{text}</p>
          <div className="btn-row" data-reveal>
            <Link to="/custom-sketches#enquiry" className="btn">
              Request a Custom Sketch <ArrowUpRight size={16} className="btn-icon" aria-hidden />
            </Link>
            {secondary === 'whatsapp' ? (
              <a className="btn btn--whatsapp" href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer">
                <WhatsAppGlyph /> Chat on WhatsApp
              </a>
            ) : (
              <Link to="/gallery" className="btn btn--ghost">Explore the Gallery</Link>
            )}
          </div>
        </div>
        {(video || image) && (
          <div className="cta-media">
            <span className="cta-scribble" aria-hidden>
              <svg viewBox="0 0 220 220" fill="none">
                <path
                  d="M30 120c10-60 70-95 120-80s60 80 20 110-110 30-130-20c-10-28 8-60 40-72"
                  stroke="var(--c-gold)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div className="art-frame cta-frame" data-speed="0.12">
              {video ? (
                <VideoFrame src={video.src} poster={video.poster} label={video.label} />
              ) : (
                image && <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" />
              )}
            </div>
            <p className="hand cta-hand">every line, by hand</p>
          </div>
        )}
      </div>
    </section>
  );
}
