import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../utils/gsap';
import { prefersReducedMotion } from '../utils/motion';

type ScrollApi = {
  /** Jump or glide to a position / element. Works with or without Lenis. */
  scrollTo: (target: number | string | HTMLElement, opts?: { immediate?: boolean; offset?: number }) => void;
  /** Lock page scrolling (menus, lightboxes). Calls are reference-counted. */
  lock: () => void;
  unlock: () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

/**
 * One Lenis instance, driven by GSAP's ticker so that Lenis and ScrollTrigger
 * share a single animation loop. Disabled entirely for reduced-motion users.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const locks = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, autoRaf: false });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo(target, opts = {}) {
        const lenis = lenisRef.current;
        if (lenis) {
          // Page height may have just changed (route swap): refresh Lenis' scroll limit first.
          lenis.resize();
          lenis.scrollTo(target, { immediate: opts.immediate, offset: opts.offset ?? 0, force: true });
          return;
        }
        const behavior: ScrollBehavior = opts.immediate || prefersReducedMotion() ? 'auto' : 'smooth';
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior });
        } else {
          const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
          if (!el) return;
          const top = el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0);
          window.scrollTo({ top, behavior });
        }
      },
      lock() {
        locks.current += 1;
        if (locks.current === 1) {
          lenisRef.current?.stop();
          document.documentElement.classList.add('is-locked');
        }
      },
      unlock() {
        locks.current = Math.max(0, locks.current - 1);
        if (locks.current === 0) {
          lenisRef.current?.start();
          document.documentElement.classList.remove('is-locked');
        }
      },
    }),
    [],
  );

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export function useSmoothScroll(): ScrollApi {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useSmoothScroll must be used inside SmoothScrollProvider');
  return ctx;
}

/** Locks page scroll while `active` is true. */
export function useScrollLock(active: boolean) {
  const { lock, unlock } = useSmoothScroll();
  useEffect(() => {
    if (!active) return;
    lock();
    return unlock;
  }, [active, lock, unlock]);
}
