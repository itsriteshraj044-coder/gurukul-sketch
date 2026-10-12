import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Seo } from '../components/Seo';
import '../styles/pages.css';

export default function NotFound() {
  return (
    <section className="notfound">
      <Seo title="Page not found" description="This page could not be found." />
      <div className="container">
        <p className="hand notfound-hand">hmm, this page is still a blank canvas…</p>
        <h1 className="h1">Page not found</h1>
        <p className="lead">The page you were looking for doesn’t exist or has moved.</p>
        <div className="btn-row">
          <Link to="/" className="btn">Back to home <ArrowUpRight size={16} className="btn-icon" aria-hidden /></Link>
          <Link to="/gallery" className="btn btn--ghost">Browse the gallery</Link>
        </div>
      </div>
    </section>
  );
}
