import { useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import type { Testimonial } from '../data/testimonials';
import { ease } from '../utils/motion';

type Props = { items: Testimonial[]; isSample: boolean };

/** Swipeable, keyboard-operable testimonial carousel. No auto-advance, so readers set the pace. */
export function TestimonialSlider({ items, isSample }: Props) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const go = (step: number) => setState(([i]) => [(i + step + items.length) % items.length, step]);
  const t = items[index];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  };

  if (!t) return null;

  return (
    <div
      className="tslider"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {isSample && (
        <p className="tslider-sample">
          <span className="tag-dot" /> Sample reviews: placeholder text until real customer words are added
        </p>
      )}
      <div className="tslider-stage">
        <Quote className="tslider-mark" size={56} aria-hidden />
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.blockquote
            key={t.id}
            className="tslider-quote"
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -40 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: ease.out }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
          >
            <p>{t.quote}</p>
            <footer>
              <cite>{t.name}</cite>
              <span>{t.context}</span>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>
      <div className="tslider-controls">
        <div className="tslider-dots" role="group" aria-label="Choose testimonial">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              className={`tslider-dot ${i === index ? 'is-active' : ''}`}
              aria-label={`Show testimonial ${i + 1}`}
              aria-current={i === index}
              onClick={() => setState([i, i > index ? 1 : -1])}
            />
          ))}
        </div>
        <div className="tslider-arrows">
          <button type="button" className="round-btn" onClick={() => go(-1)} aria-label="Previous testimonial">
            <ArrowLeft size={18} />
          </button>
          <button type="button" className="round-btn" onClick={() => go(1)} aria-label="Next testimonial">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
