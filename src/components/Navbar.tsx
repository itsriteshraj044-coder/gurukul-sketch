import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X, MessageCircle } from 'lucide-react';
import { Logo } from './Logo';
import { ScrollTrigger } from '../utils/gsap';
import { useScrollLock } from '../hooks/SmoothScroll';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { whatsappLink, defaultWhatsappMessage } from '../utils/whatsapp';
import { site } from '../config/site';
import { ease } from '../utils/motion';

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/custom-sketches', label: 'Custom Sketches' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
] as const;

const menuColors = ['var(--c-royal)', 'var(--c-orange)', 'var(--c-green)', 'var(--c-red)', 'var(--c-purple)'];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);

  // Re-uses ScrollTrigger's scroll handling instead of adding another listener.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 40,
      end: 'max',
      onToggle: (self) => setScrolled(self.isActive),
    });
    setScrolled(window.scrollY > 40);
    return () => st.kill();
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  useScrollLock(open);
  useFocusTrap(panelRef, open, () => setOpen(false));

  return (
    <header className={`nav ${scrolled || open ? 'is-solid' : ''}`}>
      <div className="nav-inner container">
        <Logo className="nav-logo" />

        <nav className="nav-links" aria-label="Main">
          <ul>
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} className="nav-link">
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="nav-active"
                          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <Link to="/custom-sketches#enquiry" className="btn btn--small nav-cta">
            Order Your Sketch <ArrowUpRight size={16} className="btn-icon" aria-hidden />
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'grid' }}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <div className="mobile-menu-inner container">
              <div className="mobile-menu-top">
                <Logo className="nav-logo" onClick={() => setOpen(false)} />
                <button type="button" className="nav-toggle" aria-label="Close menu" onClick={() => setOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <motion.ul
                className="mobile-links"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } }, hidden: {} }}
              >
                {navLinks.map((l, i) => (
                  <motion.li
                    key={l.to}
                    variants={{
                      hidden: { y: '110%', opacity: 0 },
                      show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: ease.out } },
                    }}
                  >
                    <NavLink to={l.to} end={l.to === '/'} className="mobile-link" style={{ ['--accent' as string]: menuColors[i] }}>
                      <span className="mobile-link-num">0{i + 1}</span>
                      {l.label}
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div
                className="mobile-menu-foot"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.5 } }}
                exit={{ opacity: 0 }}
              >
                <Link to="/custom-sketches#enquiry" className="btn">
                  Order Your Sketch <ArrowUpRight size={16} className="btn-icon" aria-hidden />
                </Link>
                <a className="btn btn--ghost" href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} aria-hidden /> WhatsApp
                </a>
                <p className="mobile-menu-mail">
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </header>
  );
}
