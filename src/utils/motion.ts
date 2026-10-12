export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Parallax and pointer effects are reserved for larger, fine-pointer screens. */
export const allowRichMotion = (): boolean =>
  !prefersReducedMotion() && hasFinePointer() && window.innerWidth >= 900;

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};
