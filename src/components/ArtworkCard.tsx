import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ease } from '../utils/motion';
import '../styles/gallery.css';

type Props = {
  to: string;
  image: string;
  alt: string;
  index: number;
  title: string;
  text: string;
  accent: string;
  className?: string;
  /** Width / height of the image, used to reserve space. */
  width: number;
  height: number;
};

/**
 * Editorial category card. GSAP unmasks the media box on scroll (data-clip on
 * `.card-media`, scale on `.clip-inner`); Framer Motion handles the hover lift
 * on the outer link; the image zoom is plain CSS. No two systems share an
 * element/property.
 */
export function ArtworkCard({ to, image, alt, index, title, text, accent, className = '', width, height }: Props) {
  return (
    <motion.div
      className={`art-card ${className}`}
      style={{ ['--accent' as string]: accent }}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate="rest"
    >
      <Link to={to} className="art-card-link" data-cursor="view">
        <motion.div
          className="art-card-lift"
          variants={{ rest: { y: 0 }, hover: { y: -8 } }}
          transition={{ duration: 0.5, ease: ease.out }}
        >
          <div className="card-media media" data-clip>
            <div className="clip-inner">
              <img src={image} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="art-card-body">
            <span className="art-card-num">{String(index).padStart(2, '0')}</span>
            <div className="art-card-text">
              <h3 className="art-card-title">
                <motion.span
                  className="art-card-mark"
                  variants={{ rest: { scaleX: 0.35 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.5, ease: ease.out }}
                  aria-hidden
                />
                {title}
              </h3>
              <p>{text}</p>
            </div>
            <span className="art-card-cta">
              View collection <ArrowUpRight size={16} aria-hidden />
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
