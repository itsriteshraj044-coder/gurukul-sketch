import { createElement, useRef, type ElementType } from 'react';
import { useGsap } from '../hooks/useGsap';
import { gsap } from '../utils/gsap';

type Props = {
  /** One string per visual line. Wrap words in *asterisks* to set them in italic. */
  lines: string[];
  as?: ElementType;
  className?: string;
  id?: string;
  /**
   * "scroll": reveals itself when scrolled into view.
   * "none": renders the split markup only; a parent timeline animates
   * `.reveal-word-inner` (used by the hero).
   */
  trigger?: 'scroll' | 'none';
  delay?: number;
};

type Word = { text: string; italic: boolean };

function parseLine(line: string): Word[] {
  const words: Word[] = [];
  line.split(/(\*[^*]+\*)/g).forEach((chunk) => {
    if (!chunk) return;
    const italic = chunk.startsWith('*') && chunk.endsWith('*');
    const clean = italic ? chunk.slice(1, -1) : chunk;
    clean.split(/(\s+)/).forEach((w) => {
      if (w.trim()) words.push({ text: w, italic });
    });
  });
  return words;
}

/**
 * Headline that reveals word-by-word from behind a mask.
 * Screen readers get the plain sentence via aria-label; the split spans are hidden from them.
 */
export function RevealText({ lines, as = 'h2', className, id, trigger = 'scroll', delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const plain = lines.map((l) => l.replace(/\*/g, '')).join(' ');

  useGsap(
    ref,
    ({ reduced }) => {
      if (trigger !== 'scroll' || reduced || !ref.current) return;
      const words = ref.current.querySelectorAll('.reveal-word-inner');
      if (!words.length) return;
      gsap.from(words, {
        yPercent: 115,
        rotate: 2,
        duration: 1.05,
        delay,
        stagger: 0.055,
        ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
      });
    },
    [],
  );

  return createElement(
    as,
    { ref, className, id, 'aria-label': plain },
    lines.map((line, li) => (
      <span className="reveal-line" key={li} aria-hidden="true">
        {parseLine(line).map((w, wi, arr) => {
          const inner = <span className="reveal-word-inner">{w.text}</span>;
          return (
            <span className="reveal-word" key={wi}>
              {w.italic ? <em>{inner}</em> : inner}
              {wi < arr.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </span>
    )),
  );
}
