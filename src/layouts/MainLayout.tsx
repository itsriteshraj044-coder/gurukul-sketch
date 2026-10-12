import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Preloader } from '../components/Preloader';
import { CustomCursor } from '../components/CustomCursor';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { useSmoothScroll } from '../hooks/SmoothScroll';
import { useAppReady } from '../hooks/AppReady';
import { ScrollTrigger } from '../utils/gsap';
import { ease } from '../utils/motion';

const PRELOADER_KEY = 'gs-intro-seen';

function PageFallback() {
  return (
    <div className="page-fallback" role="status" aria-live="polite">
      <span className="page-fallback-line" />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

export function MainLayout({ showIntro }: { showIntro: boolean }) {
  const location = useLocation();
  const outlet = useOutlet();
  const { scrollTo } = useSmoothScroll();
  const { setReady } = useAppReady();
  const [intro, setIntro] = useState(showIntro);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(PRELOADER_KEY, '1');
    } catch {
      /* storage unavailable: fine, intro just plays again next time */
    }
    setIntro(false);
    setReady(true);
  }, [setReady]);

  // Recalculate trigger positions once a new page (and its fonts) has laid out,
  // then honour any #hash in the URL. The target page mounts only after the
  // exit transition and its lazy chunk, so the hash target is polled for.
  const lastPath = useRef(location.pathname);
  useEffect(() => {
    let frame = 0;
    let cancelled = false;
    // Arriving from another page: jump straight to the anchor. Same page: glide.
    const crossPage = lastPath.current !== location.pathname;
    lastPath.current = location.pathname;
    const started = performance.now();
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    document.fonts?.ready.then(() => !cancelled && ScrollTrigger.refresh());

    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const seek = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el && performance.now() - started > 450) {
          ScrollTrigger.refresh();
          scrollTo(el, { offset: -90, immediate: crossPage });
          return;
        }
        if (performance.now() - started < 4000) frame = requestAnimationFrame(seek);
      };
      frame = requestAnimationFrame(seek);
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(refresh);
    };
  }, [location.pathname, location.hash, location.key, scrollTo]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      {intro && <Preloader onDone={finishIntro} />}
      <Navbar />
      <AnimatePresence mode="wait" onExitComplete={() => scrollTo(0, { immediate: true })}>
        <motion.main
          id="main"
          key={location.pathname}
          tabIndex={-1}
          className="main"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } }}
          exit={{ opacity: 0, y: -16, transition: { duration: 0.35, ease: ease.inOut } }}
        >
          <Suspense fallback={<PageFallback />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
      <CustomCursor />
    </>
  );
}

export { PRELOADER_KEY };
