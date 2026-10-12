import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/manrope';
import '@fontsource/caveat/500.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/sections.css';
import App from './App';
import { unconfiguredFields } from './config/site';

if (import.meta.env.DEV) {
  const missing = unconfiguredFields();
  if (missing.length) {
    console.info(`[GURUKUL Sketch] Placeholder settings still to fill in (src/config/site.ts / .env): ${missing.join(', ')}`);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
