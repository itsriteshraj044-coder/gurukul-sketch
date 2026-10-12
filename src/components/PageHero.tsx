import type { ReactNode } from 'react';
import { RevealText } from './RevealText';

type Props = {
  eyebrow: string;
  title: string[];
  intro: ReactNode;
  children?: ReactNode;
  /** Artwork composition rendered on the right / below. */
  media?: ReactNode;
  className?: string;
};

/** Shared header for inner pages: editorial headline on the left, artwork on the right. */
export function PageHero({ eyebrow, title, intro, children, media, className = '' }: Props) {
  return (
    <section className={`page-hero ${className}`}>
      <div className="container page-hero-grid">
        <div className="page-hero-copy">
          <p className="eyebrow" data-reveal>{eyebrow}</p>
          <RevealText lines={title} as="h1" className="h1 page-hero-title" />
          <div className="lead page-hero-intro" data-reveal>{intro}</div>
          {children && <div data-reveal>{children}</div>}
        </div>
        {media && <div className="page-hero-media">{media}</div>}
      </div>
    </section>
  );
}
