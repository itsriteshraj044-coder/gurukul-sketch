import type { CategoryId } from './categories';

/**
 * Styles customers can order on the Custom Sketches page.
 * Edit freely: the enquiry form reads its options from this list.
 */
export type SketchStyle = {
  id: string;
  title: string;
  summary: string;
  bestFor: string;
  /** Example image. Leave out when there is no real example yet: a branded tile is shown instead. */
  image?: string;
  imageAlt?: string;
  /** Whether the form should ask how many people are in the artwork. */
  asksPeopleCount: boolean;
  galleryCategory?: CategoryId;
  accent: string;
};

export const sketchStyles: SketchStyle[] = [
  {
    id: 'single-portrait', title: 'Single Portrait', accent: 'var(--c-royal)',
    summary: 'One person, drawn or painted from your favourite photograph.',
    bestFor: 'Birthdays, tributes, a portrait of a parent or grandparent',
    image: '/artwork/heritage-portrait-sm.webp', imageAlt: 'Painted portrait example',
    asksPeopleCount: false, galleryCategory: 'portraits',
  },
  {
    id: 'couple', title: 'Couple Portrait', accent: 'var(--c-red)',
    summary: 'The two of you together, in pencil or in colour.',
    bestFor: 'Engagements, weddings, anniversaries',
    image: '/artwork/engagement-couple-portrait-sm.webp', imageAlt: 'Painted couple portrait example',
    asksPeopleCount: false, galleryCategory: 'couples',
  },
  {
    id: 'family', title: 'Family Portrait', accent: 'var(--c-green)',
    summary: 'Several people in one artwork, composed from your family photographs.',
    bestFor: 'Housewarmings, reunions, gifts for parents',
    asksPeopleCount: true,
  },
  {
    id: 'pencil', title: 'Pencil Sketch', accent: 'var(--c-navy)',
    summary: 'Classic graphite tones with soft shading and fine detail.',
    bestFor: 'Timeless keepsakes and minimal interiors',
    image: '/artwork/pencil-portrait-sm.webp', imageAlt: 'Pencil portrait sketch example',
    asksPeopleCount: true, galleryCategory: 'pencil',
  },
  {
    id: 'charcoal', title: 'Charcoal Sketch', accent: 'var(--c-ink)',
    summary: 'Rich blacks and expressive texture for a dramatic finish.',
    bestFor: 'Statement portraits with strong light and shadow',
    asksPeopleCount: true,
  },
  {
    id: 'gift', title: 'Special Gift Artwork', accent: 'var(--c-orange)',
    summary: 'A personal piece planned around an occasion, a story or a surprise.',
    bestFor: 'Weddings, retirements, farewells and milestone days',
    image: '/artwork/bridal-couple-portrait-sm.webp', imageAlt: 'Bridal couple portrait example',
    asksPeopleCount: true, galleryCategory: 'couples',
  },
  {
    id: 'folk', title: 'Folk Art Piece', accent: 'var(--c-purple)',
    summary: 'Gond-inspired trees, birds and animals in patterned colour.',
    bestFor: 'Living rooms, nurseries, cultural gifts',
    image: '/artwork/gond-deer-tree-sm.webp', imageAlt: 'Gond-style folk painting example',
    asksPeopleCount: false, galleryCategory: 'folk',
  },
  {
    id: 'mural', title: 'Wall Mural', accent: 'var(--c-gold-deep)',
    summary: 'A hand-painted wall for a home, café, studio or restaurant.',
    bestFor: 'Feature walls, entrances and dining spaces',
    image: '/artwork/cherry-blossom-mural-sm.webp', imageAlt: 'Cherry blossom wall mural example',
    asksPeopleCount: false, galleryCategory: 'murals',
  },
];

/** Finish options offered in step 1 of the enquiry form. */
export const finishOptions = ['Pencil / graphite', 'Charcoal', 'Colour painting', 'Not sure yet, advise me'] as const;
