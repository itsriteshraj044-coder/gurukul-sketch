import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import type { Artwork } from '../data/artworks';
import { categoryById } from '../data/categories';
import { ease } from '../utils/motion';
import '../styles/gallery.css';

type Props = {
  items: Artwork[];
  onOpen: (index: number) => void;
  /** Number of images to load eagerly (above the fold). */
  eager?: number;
  className?: string;
};

const ROW = 8;

function columnsFor(width: number) {
  if (width < 340) return 1;
  if (width < 760) return 2;
  if (width < 1180) return 3;
  if (width < 2100) return 4;
  return 5;
}

/**
 * Masonry-style grid built on CSS Grid (not CSS columns) so Framer Motion can
 * animate items smoothly when the filter changes. Each item's row span is
 * derived from the artwork's real proportions, so nothing is distorted and
 * space is reserved before the image loads.
 */
export function MasonryGrid({ items, onOpen, eager = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ cols: 3, col: 300, gap: 18 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth;
      const cols = columnsFor(width);
      const gap = cols <= 2 ? 10 : 18;
      const col = (width - gap * (cols - 1)) / cols;
      setLayout((prev) => (prev.cols === cols && Math.abs(prev.col - col) < 0.5 ? prev : { cols, col, gap }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { cols, col, gap } = layout;

  // True masonry: each item goes into the shortest column (or pair of columns
  // for very wide pieces), with explicit grid coordinates, so no holes appear.
  const placed = useMemo(() => {
    const heights = new Array<number>(cols).fill(0);
    const rowsFor = (ratio: number, span: number) =>
      Math.max(1, Math.round((col * span + gap * (span - 1)) / ratio / (ROW + gap) + gap / (ROW + gap)));
    const bestSlot = (span: number) => {
      let bestCol = 0;
      let bestTop = Infinity;
      for (let c = 0; c <= cols - span; c++) {
        const top = Math.max(...heights.slice(c, c + span));
        if (top < bestTop) {
          bestTop = top;
          bestCol = c;
        }
      }
      const waste = heights.slice(bestCol, bestCol + span).reduce((sum, h) => sum + (bestTop - h), 0);
      return { bestCol, bestTop, waste };
    };
    return items.map((art) => {
      const ratio = art.width / art.height;
      let span = ratio > 1.9 && cols >= 3 ? 2 : 1;
      let rows = rowsFor(ratio, span);
      let { bestCol, bestTop, waste } = bestSlot(span);
      // A wide piece that would leave a big hole falls back to a single column.
      if (span === 2 && waste > rows * 0.4) {
        span = 1;
        rows = rowsFor(ratio, 1);
        ({ bestCol, bestTop, waste } = bestSlot(1));
      }
      for (let c = bestCol; c < bestCol + span; c++) heights[c] = bestTop + rows;
      return { art, span, gridColumn: `${bestCol + 1} / span ${span}`, gridRow: `${bestTop + 1} / span ${rows}` };
    });
  }, [items, cols, col, gap]);

  return (
    <LayoutGroup>
      <div
        ref={ref}
        className={`masonry ${className}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, columnGap: gap, rowGap: gap, gridAutoRows: ROW }}
      >
        <AnimatePresence mode="popLayout">
          {placed.map(({ art, span, gridColumn, gridRow }, i) => {
            const cat = categoryById(art.category);
            return (
              <motion.figure
                layout
                key={art.id}
                className="masonry-item"
                style={{ gridColumn, gridRow }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.55, ease: ease.out, layout: { duration: 0.6, ease: ease.out } }}
              >
                <button
                  type="button"
                  className="masonry-btn"
                  data-cursor="view"
                  onClick={() => onOpen(i)}
                  aria-label={`View “${art.title}” larger`}
                >
                  <img
                    src={cols >= 3 && span === 1 ? (art.thumbnail ?? art.image) : art.image}
                    srcSet={art.thumbnail ? `${art.thumbnail} 720w, ${art.image} 1600w` : undefined}
                    sizes={`(max-width: 760px) ${Math.round(100 / Math.min(cols, 2))}vw, ${Math.round((100 / cols) * span)}vw`}
                    alt={art.alt ?? art.title}
                    width={art.width}
                    height={art.height}
                    loading={i < eager ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <figcaption className="masonry-caption">
                    {cat && (
                      <span className="tag" style={{ color: cat.accent }}>
                        <span className="tag-dot" /> {cat.label}
                      </span>
                    )}
                    <span className="masonry-title">{art.title}</span>
                  </figcaption>
                </button>
              </motion.figure>
            );
          })}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
