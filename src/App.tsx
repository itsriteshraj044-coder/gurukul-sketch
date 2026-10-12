import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { MainLayout, PRELOADER_KEY } from './layouts/MainLayout';
import { SmoothScrollProvider } from './hooks/SmoothScroll';
import { AppReadyProvider } from './hooks/AppReady';
import { prefersReducedMotion } from './utils/motion';

const Home = lazy(() => import('./pages/Home'));
const Gallery = lazy(() => import('./pages/Gallery'));
const CustomSketches = lazy(() => import('./pages/CustomSketches'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function shouldShowIntro(): boolean {
  if (prefersReducedMotion()) return false;
  try {
    return !sessionStorage.getItem(PRELOADER_KEY);
  } catch {
    return false;
  }
}

export default function App() {
  const showIntro = shouldShowIntro();
  return (
    <MotionConfig reducedMotion="user">
      <AppReadyProvider initial={!showIntro}>
        <SmoothScrollProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout showIntro={showIntro} />}>
                <Route index element={<Home />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="custom-sketches" element={<CustomSketches />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SmoothScrollProvider>
      </AppReadyProvider>
    </MotionConfig>
  );
}
