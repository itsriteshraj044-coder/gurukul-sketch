import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import type { Artwork } from '../data/artworks';
import { categoryById } from '../data/categories';
import { useScrollLock } from '../hooks/SmoothScroll';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { ease } from '../utils/motion';
import '../styles/gallery.css';

type Props = {
  items: Artwork[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

/**
 * Artwork detail view: arrows / swipe / keyboard to browse, Escape or a
 * click on the backdrop to close. Rendered in a portal so page transforms
 * never affect its fixed positioning.
 */
export function Lightbox({ items, index, onClose, onChange }: Props) {
  const open = index !== null && !!items[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(0);

  useScrollLock(open);
  useFocusTrap(dialogRef, open, onClose);

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setDirection(step);
      onChange((index + step + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, go]);

  // Warm the cache for neighbours so browsing feels instant.
  useEffect(() => {
    if (index === null || items.length < 2) return;
    [1, -1].forEach((s) => {
      const n = items[(index + s + items.length) % items.length];
      const img = new Image();
      img.src = n.image;
    });
  }, [index, items]);

  const art = open ? items[index] : null;
  const cat = art ? categoryById(art.category) : undefined;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 400) go(-1);
  };

  return createPortal(
    <AnimatePresence>
      {art && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            ref={dialogRef}
            className="lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <div className="lightbox-bar">
              <span className="lightbox-count" aria-live="polite">
                {String(index! + 1).padStart(2, '0')} <span>/ {String(items.length).padStart(2, '0')}</span>
              </span>
              <button type="button" className="lightbox-icon" onClick={onClose} aria-label="Close artwork view" data-autofocus>
                <X size={22} />
              </button>
            </div>

            <div
              className="lightbox-stage"
              onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
              }}
            >
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.img
                  key={art.id}
                  src={art.image}
                  alt={art.alt ?? art.title}
                  width={art.width}
                  height={art.height}
                  className="lightbox-img"
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.98 }),
                    center: { opacity: 1, x: 0, scale: 1 },
                    exit: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.98 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: ease.out }}
                  drag={items.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.35}
                  onDragEnd={onDragEnd}
                  draggable={false}
                  onClick={(e) => {
                    // The <img> box fills the stage (object-fit: contain), so a click on
                    // the empty letterbox area around the artwork still counts as "outside".
                    const img = e.currentTarget;
                    if (!img.naturalWidth) return;
                    const r = img.getBoundingClientRect();
                    const scale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
                    const w = img.naturalWidth * scale;
                    const h = img.naturalHeight * scale;
                    const left = r.left + (r.width - w) / 2;
                    const top = r.top + (r.height - h) / 2;
                    if (e.clientX < left || e.clientX > left + w || e.clientY < top || e.clientY > top + h) onClose();
                  }}
                />
              </AnimatePresence>
              {items.length > 1 && (
                <>
                  <button type="button" className="lightbox-nav lightbox-prev" onClick={() => go(-1)} aria-label="Previous artwork">
                    <ArrowLeft size={20} />
                  </button>
                  <button type="button" className="lightbox-nav lightbox-next" onClick={() => go(1)} aria-label="Next artwork">
                    <ArrowRight size={20} />
                  </button>
                </>
              )}
            </div>

            <motion.div
              key={`${art.id}-info`}
              className="lightbox-info"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <div>
                {cat && (
                  <span className="tag" style={{ color: cat.accent }}>
                    <span className="tag-dot" /> {cat.label}
                  </span>
                )}
                <h2 id="lightbox-title" className="lightbox-title">{art.title}</h2>
                {art.medium && <p className="lightbox-medium">{art.medium}</p>}
              </div>
              {art.description && <p className="lightbox-desc">{art.description}</p>}
              <Link to="/custom-sketches#enquiry" className="btn btn--light btn--small" onClick={onClose}>
                Request something similar <ArrowUpRight size={16} className="btn-icon" aria-hidden />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
