import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.webp';

/**
 * Brand logo. To replace it, overwrite src/assets/logo.webp with a transparent
 * WEBP/PNG (or change the import to an .svg). Always place it on a light surface:
 * the lettering is knocked out of the colour blocks.
 */
export const LOGO_RATIO = 992 / 293;

export function Logo({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label="GURUKUL Sketch, home" onClick={onClick}>
      <img src={logoUrl} alt="GURUKUL Sketch" width={992} height={293} decoding="async" />
    </Link>
  );
}

export { logoUrl };
