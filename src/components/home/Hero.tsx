import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { RevealText } from '../RevealText';
import { useGsap } from '../../hooks/useGsap';
import { useAppReady } from '../../hooks/AppReady';
import { gsap, ScrollTrigger } from '../../utils/gsap';
import { allowRichMotion, prefersReducedMotion } from '../../utils/motion';
import { artworkById } from '../../data/artworks';

const main = artworkById('pencil-portrait');
const second = artworkById('bridal-couple-portrait');
const third = artworkById('gond-deer-tree');

const styles = [
  { label: 'Pencil', color: 'var(--c-navy)' },
  { label: 'Portraits', color: 'var(--c-royal)' },
  { label: 'Couples', color: 'var(--c-red)' },
  { label: 'Folk art', color: 'var(--c-purple)' },
  { label: 'Murals', color: 'var(--c-orange)' },
];

/**
 * Signature hero. Motion layers:
 *  - entrance timeline (GSAP): words → copy → artwork unmask → pencil line → notes
 *  - scroll (GSAP ScrollTrigger scrub): artwork layers drift at different depths
 *  - pointer (GSAP quickTo): layers tilt toward the cursor (desktop only)
 * Each layer has an outer `.hero-depth` (scroll + pointer) and an inner
 * `figure` (entrance), so no two animations fight over one property.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const { ready } = useAppReady();

  useGsap(ref, ({ reduced }) => {
    if (reduced) return;
    const q = gsap.utils.selector(ref);

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
    tl.from(q('.hero-eyebrow'), { y: 20, autoAlpha: 0, duration: 0.8 })
      .from(q('.hero-title .reveal-word-inner'), { yPercent: 118, rotate: 3, duration: 1.25, stagger: 0.07 }, '-=0.5')
      .from(q('.hero-underline path'), { strokeDashoffset: 420, duration: 1.1, ease: 'power2.inOut' }, '-=0.55')
      .from(q('.hero-sub'), { y: 24, autoAlpha: 0, duration: 0.9 }, '-=0.9')
      .from(q('.hero-ctas > *'), { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, '-=0.7')
      .from(q('.hero-styles li'), { y: 12, autoAlpha: 0, duration: 0.6, stagger: 0.05 }, '-=0.6')
      .fromTo(
        q('.hero-main'),
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.inOut', clearProps: 'clipPath' },
        0.25,
      )
      .from(q('.hero-main img'), { scale: 1.35, duration: 1.9, ease: 'power3.out' }, 0.25)
      .fromTo(
        q('.hero-second, .hero-third'),
        { clipPath: 'inset(0% 0% 100% 0%)', y: 40 },
        { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.3, stagger: 0.18, ease: 'power4.inOut', clearProps: 'clipPath' },
        0.85,
      )
      .from(q('.hero-link'), { strokeDashoffset: 1, duration: 1.4, stagger: 0.25, ease: 'power2.inOut' }, 1.4)
      .from(q('.hero-pin'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.12, ease: 'back.out(3)' }, 1.5)
      .from(q('.hero-spark, .hero-pin-halo'), { autoAlpha: 0, duration: 0.6 }, 2.6)
      .from(q('.hero-note, .hero-label'), { autoAlpha: 0, y: 14, rotate: -4, duration: 0.8, stagger: 0.12 }, 1.5)
      .from(q('.scroll-indicator'), { autoAlpha: 0, duration: 0.8 }, 1.8);
    tlRef.current = tl;

    // Scroll: layers drift at different depths as the hero leaves the screen.
    const depths: [string, number][] = [
      ['.hero-depth--main', -8],
      ['.hero-depth--second', -22],
      ['.hero-depth--third', -34],
    ];
    const scrollCfg = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.6 };
    depths.forEach(([sel, amount]) => {
      gsap.to(q(sel), { yPercent: allowRichMotion() ? amount : amount / 3, ease: 'none', scrollTrigger: scrollCfg });
    });
    gsap.to(q('.hero-copy'), { yPercent: 10, autoAlpha: 0.2, ease: 'none', scrollTrigger: { ...scrollCfg, start: '30% top' } });

    // Pointer: gentle depth response, desktop with a mouse only.
    if (!allowRichMotion()) return;
    const layers = q('[data-depth]').map((el) => ({
      depth: parseFloat((el as HTMLElement).dataset.depth ?? '0'),
      x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
    }));
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        l.x(nx * l.depth);
        l.y(ny * l.depth);
      });
    };
    const node = ref.current!;
    node.addEventListener('pointermove', onMove);
    return () => node.removeEventListener('pointermove', onMove);
  });

  useEffect(() => {
    if (ready) tlRef.current?.play();
  }, [ready]);

  // Keep the three threads pinned to the frames: third → main, main → second, third → second.
  const linksRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = linksRef.current;
    const art = svg?.parentElement;
    if (!svg || !art) return;
    const frames = ['.hero-main', '.hero-second', '.hero-third'].map((sel) => art.querySelector<HTMLElement>(sel));
    const threads = Array.from(svg.querySelectorAll<SVGGElement>('.hero-thread')).map((g) => ({
      paths: Array.from(g.querySelectorAll<SVGPathElement>('path')),
      dots: Array.from(g.querySelectorAll<SVGCircleElement>('circle')),
    }));
    if (frames.some((f) => !f)) return;
    const [mainEl, secondEl, thirdEl] = frames as HTMLElement[];
    const TUCK = 10; // thread ends just under the frame edge
    const GAP = 9; // pin sits on the thread, just outside the edge
    const sway = !prefersReducedMotion();

    type Pt = { x: number; y: number };
    const bez = (p: Pt[], t: number): Pt => {
      const u = 1 - t;
      const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
      return { x: a * p[0].x + b * p[1].x + c * p[2].x + d * p[3].x, y: a * p[0].y + b * p[1].y + c * p[2].y + d * p[3].y };
    };
    // Point where the curve crosses `axis = value` near its start (fromEnd=false) or end (fromEnd=true).
    // Pins are placed there, so they always sit exactly on the drawn thread.
    const crossing = (p: Pt[], axis: 'x' | 'y', value: number, fromEnd: boolean): Pt => {
      let lo = fromEnd ? 0.5 : 0;
      let hi = fromEnd ? 1 : 0.5;
      const at = (t: number) => bez(p, t)[axis] - value;
      const sLo = Math.sign(at(lo));
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        if (Math.sign(at(mid)) === sLo) lo = mid;
        else hi = mid;
      }
      return bez(p, (lo + hi) / 2);
    };
    const f = (n: number) => n.toFixed(1);

    const update = (time = 0) => {
      const a = art.getBoundingClientRect();
      const box = (el: HTMLElement) => {
        const b = el.getBoundingClientRect();
        return { l: b.left - a.left, t: b.top - a.top, r: b.right - a.left, b: b.bottom - a.top, w: b.width, h: b.height };
      };
      const M = box(mainEl);
      const S = box(secondEl);
      const T = box(thirdEl);
      const W = a.width;
      // Gentle string-like sway of the control points.
      const sw = (phase: number) => (sway ? Math.sin(time * 1.1 + phase) * W * 0.018 : 0);

      // Each thread leaves and enters a frame at a right angle, so the ends run straight through the pins.
      const tx = T.l + T.w * 0.32;
      const y1 = M.t + M.h * 0.36;
      const c1: Pt[] = [
        { x: tx, y: T.t + TUCK },
        { x: tx + sw(0), y: T.t - W * 0.24 },
        { x: M.l - W * 0.2, y: y1 + sw(1.3) },
        { x: M.l + TUCK, y: y1 },
      ];
      const y2 = M.t + M.h * 0.42;
      const sx = S.l + S.w * 0.62;
      const c2: Pt[] = [
        { x: M.r - TUCK, y: y2 },
        { x: M.r + W * 0.22, y: y2 + sw(2.1) },
        { x: sx + sw(2.9), y: S.t - W * 0.2 },
        { x: sx, y: S.t + TUCK },
      ];
      const bx = T.l + T.w * 0.5;
      const y3 = S.t + S.h * 0.78;
      const c3: Pt[] = [
        { x: bx, y: T.b - TUCK },
        { x: bx + sw(3.7), y: T.b + W * 0.22 },
        { x: S.l - W * 0.22, y: y3 + sw(4.4) },
        { x: S.l + TUCK, y: y3 },
      ];

      const pins: [Pt, Pt][] = [
        [crossing(c1, 'y', T.t - GAP, false), crossing(c1, 'x', M.l - GAP, true)],
        [crossing(c2, 'x', M.r + GAP, false), crossing(c2, 'y', S.t - GAP, true)],
        [crossing(c3, 'y', T.b + GAP, false), crossing(c3, 'x', S.l - GAP, true)],
      ];

      [c1, c2, c3].forEach((c, i) => {
        const d = `M${f(c[0].x)},${f(c[0].y)} C${f(c[1].x)},${f(c[1].y)} ${f(c[2].x)},${f(c[2].y)} ${f(c[3].x)},${f(c[3].y)}`;
        threads[i].paths.forEach((p) => p.setAttribute('d', d));
        const [p0, p1] = pins[i];
        // circles: halo, halo, pin, pin
        [p0, p1, p0, p1].forEach((pt, k) => {
          threads[i].dots[k].setAttribute('cx', f(pt.x));
          threads[i].dots[k].setAttribute('cy', f(pt.y));
        });
      });
    };

    update();
    const ro = new ResizeObserver(() => update(gsap.ticker.time));
    ro.observe(art);
    if (prefersReducedMotion()) return () => ro.disconnect();

    // Frames move (entrance, scroll parallax, pointer), so follow them every frame while the hero is on screen.
    let ticking = false;
    const start = () => { if (!ticking) { gsap.ticker.add(update); ticking = true; } };
    const stop = () => { if (ticking) { gsap.ticker.remove(update); ticking = false; } };
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? start() : stop()),
    });
    if (st.isActive) start();
    return () => {
      stop();
      st.kill();
      ro.disconnect();
    };
  }, []);

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Custom sketch &amp; art studio</p>
          <div className="hero-title-wrap">
            <RevealText as="h1" id="hero-title" className="display-hero hero-title" lines={['Your Memories,', '*Beautifully*', '*Drawn.*']} trigger="none" />
            <svg className="hero-underline" viewBox="0 0 420 24" preserveAspectRatio="none" aria-hidden="true">
              <path d="M4 16 C 90 6, 180 4, 270 10 S 380 18, 416 8" fill="none" stroke="var(--c-gold)" strokeWidth="5" strokeLinecap="round" strokeDasharray="420" />
            </svg>
          </div>
          <p className="lead hero-sub">
            Turn your favourite photographs into timeless, hand-crafted sketch art, created especially for you.
          </p>
          <div className="btn-row hero-ctas">
            <Link to="/custom-sketches#enquiry" className="btn">
              Create Your Custom Sketch <ArrowUpRight size={16} className="btn-icon" aria-hidden />
            </Link>
            <Link to="/gallery" className="btn btn--ghost">Explore Our Gallery</Link>
          </div>
          <ul className="hero-styles" aria-label="Styles we create">
            {styles.map((s) => (
              <li key={s.label} style={{ ['--dot' as string]: s.color }}>{s.label}</li>
            ))}
          </ul>
        </div>

        <div className="hero-art">
          {/* Connectors: geometry is measured from the three frames, so the threads stay attached while they move. */}
          <svg className="hero-links" ref={linksRef} aria-hidden="true">
            {[1, 2, 3].map((n) => (
              <g key={n} className={`hero-thread hero-thread--${n}`}>
                <path className="hero-link" pathLength={1} strokeDasharray="1" />
                <path className="hero-spark" pathLength={1} />
                <circle className="hero-pin-halo" r="4.5" />
                <circle className="hero-pin-halo" r="4.5" />
                <circle className="hero-pin" r="4.5" />
                <circle className="hero-pin" r="4.5" />
              </g>
            ))}
          </svg>

          <div className="hero-depth hero-depth--main" data-depth="14">
            <figure className="hero-main art-frame">
              <div className="hero-main-media">
                <img src={main.image} alt={main.alt} width={main.width} height={main.height} fetchPriority="high" decoding="async" />
              </div>
            </figure>
            <div className="hero-label">
              <span className="hero-label-num">No. 01</span>
              <span className="hero-label-title">{main.title}</span>
              <span className="hero-label-meta">{main.medium}</span>
            </div>
          </div>

          <div className="hero-depth hero-depth--second" data-depth="30">
            <figure className="hero-second art-frame">
              <img src={second.thumbnail} alt={second.alt} width={second.width} height={second.height} decoding="async" />
            </figure>
          </div>

          <div className="hero-depth hero-depth--third" data-depth="44">
            <figure className="hero-third art-frame">
              <img src={third.thumbnail} alt={third.alt} width={third.width} height={third.height} decoding="async" />
            </figure>
          </div>

          <p className="hero-note hand hero-note--1" aria-hidden="true">
            graphite, by hand
            <svg viewBox="0 0 60 40" width="52" height="34" fill="none">
              <path d="M4 6 C 20 4, 40 12, 50 32 M50 32 l-10 -3 M50 32 l2 -10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </p>
          <p className="hero-note hand hero-note--2" aria-hidden="true">painted in colour</p>
        </div>
      </div>

      <a href="#collection" className="scroll-indicator">
        <span>Scroll</span>
        <span className="scroll-indicator-line" aria-hidden="true" />
      </a>
    </section>
  );
}
