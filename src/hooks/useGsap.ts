import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap } from '../utils/gsap';
import { prefersReducedMotion } from '../utils/motion';

/**
 * Runs GSAP code inside a gsap.context scoped to `scope`, and reverts every
 * tween + ScrollTrigger it created on unmount (safe under React Strict Mode).
 * The callback receives `reduced` so it can skip or simplify motion.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (ctx: { reduced: boolean }) => void | (() => void),
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    if (!scope.current) return;
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup({ reduced: prefersReducedMotion() });
    }, scope);
    return () => {
      if (typeof cleanup === 'function') cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
