import { site } from '../config/site';

/**
 * Builds a wa.me link. With no number configured, WhatsApp opens its
 * contact picker with the message pre-filled instead of a dead link.
 */
export function whatsappLink(message = ''): string {
  const number = site.contact.whatsappNumber.replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return number ? `https://wa.me/${number}${text}` : `https://wa.me/${text}`;
}

export const defaultWhatsappMessage =
  'Hello GURUKUL Sketch! I would like to know more about a custom sketch.';
