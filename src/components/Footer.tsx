import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';
import { navLinks } from './Navbar';
import { site } from '../config/site';
import { whatsappLink, defaultWhatsappMessage } from '../utils/whatsapp';
import { categories } from '../data/categories';
import { artworks } from '../data/artworks';

const socialLabels: Record<keyof typeof site.social, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  pinterest: 'Pinterest',
};

export function Footer() {
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);
  const galleryCats = categories.filter((c) => artworks.some((a) => a.category === c.id));

  return (
    <footer className="footer">
      <div className="stripe-bar footer-stripe" aria-hidden />
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo className="footer-logo" />
            <p className="footer-statement">
              Your photographs, your stories, <em>drawn by hand.</em>
            </p>
            <Link to="/custom-sketches#enquiry" className="btn">
              Request a Custom Sketch <ArrowUpRight size={16} className="btn-icon" aria-hidden />
            </Link>
          </div>

          <nav className="footer-col" aria-label="Footer">
            <h2 className="footer-heading">Explore</h2>
            <ul>
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h2 className="footer-heading">Gallery</h2>
            <ul>
              {galleryCats.map((c) => (
                <li key={c.id}>
                  <Link to={`/gallery?category=${c.id}`} className="text-link">{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Get in touch</h2>
            <ul className="footer-contact">
              <li>
                <a href={whatsappLink(defaultWhatsappMessage)} target="_blank" rel="noopener noreferrer" className="text-link">
                  <MessageCircle size={16} aria-hidden /> Chat on WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="text-link">
                  <Mail size={16} aria-hidden /> {site.contact.email}
                </a>
              </li>
              <li>
                {site.contact.phoneHref ? (
                  <a href={`tel:${site.contact.phoneHref}`} className="text-link">
                    <Phone size={16} aria-hidden /> {site.contact.phoneDisplay}
                  </a>
                ) : (
                  <span className="footer-plain"><Phone size={16} aria-hidden /> {site.contact.phoneDisplay}</span>
                )}
              </li>
              <li>
                <span className="footer-plain"><MapPin size={16} aria-hidden /> {site.contact.address}</span>
              </li>
            </ul>
            {socials.length > 0 && (
              <ul className="footer-social">
                {socials.map((k) => (
                  <li key={k}>
                    <a href={site.social[k]} target="_blank" rel="noopener noreferrer" className="text-link">
                      {socialLabels[k]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {site.name}. All artwork shown is the studio's own work.</p>
          <p className="hand footer-hand">made with pencils, paint &amp; patience</p>
        </div>
      </div>
    </footer>
  );
}
