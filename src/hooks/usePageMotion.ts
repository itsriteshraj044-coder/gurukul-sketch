import type { RefObject } from 'react';
import { useGsap } from './useGsap';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { allowRichMotion } from '../utils/motion';

/**
 * Declarative scroll motion for a page. Mark elements with:
 *
 *  data-reveal             fade + rise when scrolled into view
 *  data-reveal-stagger     its direct children reveal one after another
 *  data-clip               artwork reveal: the box unmasks upward while its
 *                          `.clip-inner` child settles from a slight zoom
 *  data-speed="0.15"       parallax drift (desktop / fine pointer only)
 *
 * The scope element must carry `data-motion-scope`; elements belonging to a
 * nested scope (e.g. a shared CTA block with its own hook) are skipped so
 * nothing is animated twice. Everything is reverted on unmount, and with
 * reduced motion nothing is ever hidden.
 */
export function usePageMotion(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGsap(
    scope,
    ({ reduced }) => {
      if (reduced) return;
      const root = scope.current;
      if (!root) return;
      const own = (sel: string) =>
        Array.from(root.querySelectorAll<HTMLElement>(sel)).filter((el) => el.closest('[data-motion-scope]') === root);
      const reveals = own('[data-reveal]');

      if (reveals.length) gsap.set(reveals, { y: 42, autoAlpha: 0 });
      ScrollTrigger.batch(reveals, {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { y: 42, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out', overwrite: true },
          ),
      });

      own('[data-reveal-stagger]').forEach((group) => {
        gsap.from(group.children, {
          y: 36,
          autoAlpha: 0,
          duration: 0.95,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 86%', once: true },
        });
      });

      own('[data-clip]').forEach((el) => {
        const inner = el.querySelector('.clip-inner');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        tl.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' },
        );
        if (inner) tl.fromTo(inner, { scale: 1.22 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
      });

      if (allowRichMotion()) {
        own('[data-speed]').forEach((el) => {
          const speed = parseFloat(el.dataset.speed ?? '0');
          if (!speed) return;
          gsap.fromTo(
            el,
            { yPercent: speed * 50 },
            {
              yPercent: speed * -50,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          );
        });
      }
    },
    deps,
  );
}
