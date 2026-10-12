import { useEffect, useRef, useState } from 'react';
import { gsap } from '../utils/gsap';
import { hasFinePointer, prefersReducedMotion } from '../utils/motion';

/**
 * A soft follower ring that grows into a "View" badge over artwork
 * (any element with data-cursor="view"). The native cursor stays visible,
 * so nothing about normal pointing is taken away. Mouse devices only.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [enabled] = useState(() => hasFinePointer() && !prefersReducedMotion());

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!visible) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        visible = true;
      }
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      const next = target?.dataset.cursor ?? '';
      el.classList.toggle('is-view', next === 'view');
      el.classList.toggle('is-link', !next && !!(e.target as Element | null)?.closest('a, button, [role="slider"]'));
      setLabel((prev) => (prev === next ? prev : next));
    };
    const leave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      visible = false;
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <span className="cursor-label">{label === 'view' ? 'View' : ''}</span>
    </div>
  );
}
