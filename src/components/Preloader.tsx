import { useEffect, useRef } from 'react';
import { gsap } from '../utils/gsap';
import { logoUrl } from './Logo';

/**
 * Short brand intro on the first visit of a session: the logo is "drawn in"
 * behind a pencil line, then the curtain lifts. Capped at ~1.6s and skipped
 * for reduced-motion users or repeat visits (handled by the caller).
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onDone });
      tl.fromTo('.pre-logo', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power2.inOut' })
        .fromTo('.pre-pencil', { xPercent: 0, left: '0%' }, { left: '100%', duration: 0.9, ease: 'power2.inOut' }, 0)
        .to('.pre-pencil', { autoAlpha: 0, duration: 0.2 })
        .to(el, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' }, '+=0.15');
    }, el);
    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="preloader" ref={ref} aria-hidden="true">
      <div className="pre-mark">
        <img className="pre-logo" src={logoUrl} alt="" width={992} height={293} />
        <span className="pre-pencil" />
      </div>
    </div>
  );
}
