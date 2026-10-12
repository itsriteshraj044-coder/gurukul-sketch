/**
 * Central business configuration.
 * Every value marked TODO is a placeholder — replace it with the real detail
 * before going live. See README › "Contact details".
 */
export const site = {
  name: 'GURUKUL Sketch',
  shortDescription: 'Custom sketches, portraits and wall art, drawn from your photographs.',
  /** Production URL without trailing slash. Read from VITE_SITE_URL. */
  url: (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, ''),

  contact: {
    /** TODO: WhatsApp number in international format, digits only — e.g. '919876543210'. */
    whatsappNumber: '',
    /** TODO: phone number as it should be displayed. */
    phoneDisplay: '+91 XXXXX XXXXX',
    /** TODO: phone number for tel: links, e.g. '+919876543210'. Leave empty to hide the call link. */
    phoneHref: '',
    /** TODO: enquiry email address. */
    email: 'hello@your-domain.example',
    /** TODO: studio / postal address. */
    address: '[Your studio address]',
    /** TODO: when you usually reply. */
    responseNote: '[Your working hours]',
  },

  /** TODO: full profile URLs. Empty entries are hidden automatically. */
  social: {
    instagram: '',
    facebook: '',
    youtube: '',
    pinterest: '',
  },

  /** Set to false once the testimonials in src/data/testimonials.ts are real customer words. */
  testimonialsAreSamples: true,
} as const;

/** Fields still holding placeholder text — logged in development so they are not forgotten. */
export function unconfiguredFields(): string[] {
  const missing: string[] = [];
  if (!site.contact.whatsappNumber) missing.push('contact.whatsappNumber');
  if (site.contact.phoneDisplay.includes('X')) missing.push('contact.phoneDisplay');
  if (site.contact.email.endsWith('.example')) missing.push('contact.email');
  if (site.contact.address.startsWith('[')) missing.push('contact.address');
  if (site.contact.responseNote.startsWith('[')) missing.push('contact.responseNote');
  if (!site.url) missing.push('VITE_SITE_URL');
  return missing;
}
