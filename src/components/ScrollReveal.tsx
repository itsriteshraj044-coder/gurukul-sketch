import { createElement, useRef, type ReactNode } from 'react';
import { useGsap } from '../hooks/useGsap';
import { gsap } from '../utils/gsap';

type Props = {
  children: ReactNode;
  className?: string;
  /** Reveal direct children one after another instead of the block as a whole. */
  stagger?: boolean;
  y?: number;
  delay?: number;
  as?: 'div' | 'section' | 'ul' | 'ol' | 'aside';
};

/** Standalone scroll reveal for a single block (for markup outside page-level data attributes). */
export function ScrollReveal({ children, className, stagger = false, y = 40, delay = 0, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, ({ reduced }) => {
    if (reduced || !ref.current) return;
    const targets = stagger ? Array.from(ref.current.children) : ref.current;
    gsap.from(targets, {
      y,
      autoAlpha: 0,
      duration: 1,
      delay,
      stagger: stagger ? 0.11 : 0,
      ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
    });
  });

  return createElement(Tag, { ref, className }, children);
}
