/**
 * Gallery categories. To rename a category, change its `label` only —
 * the `id` is what artworks reference. To add one, add an entry here and
 * use its id in src/data/artworks.ts.
 */
export type CategoryId =
  | 'portraits'
  | 'couples'
  | 'family'
  | 'pencil'
  | 'charcoal'
  | 'murals'
  | 'folk'
  | 'decor';

export type Category = {
  id: CategoryId;
  label: string;
  /** Short line used on cards. */
  blurb: string;
  /** Brand accent used for the category label. */
  accent: string;
  /** Hide the gallery filter while the category has no artwork. */
  hideWhenEmpty?: boolean;
};

export const categories: Category[] = [
  { id: 'portraits', label: 'Portraits', blurb: 'Faces and characters painted with presence and quiet detail.', accent: 'var(--c-royal)' },
  { id: 'couples', label: 'Couples', blurb: 'Engagements, weddings and the two of you, held in one frame.', accent: 'var(--c-red)' },
  { id: 'family', label: 'Family', blurb: 'Everyone together: generations, siblings, the whole household.', accent: 'var(--c-green)', hideWhenEmpty: true },
  { id: 'pencil', label: 'Pencil & Line Art', blurb: 'Graphite tones and confident lines, from paper to full walls.', accent: 'var(--c-navy)' },
  { id: 'charcoal', label: 'Charcoal', blurb: 'Deep blacks and soft smudges for dramatic, expressive portraits.', accent: 'var(--c-ink)', hideWhenEmpty: true },
  { id: 'murals', label: 'Wall Murals', blurb: 'Hand-painted walls for homes, cafés and restaurants.', accent: 'var(--c-orange)' },
  { id: 'folk', label: 'Folk Art', blurb: 'Gond-inspired trees, birds and animals in patterned colour.', accent: 'var(--c-purple)' },
  { id: 'decor', label: 'Custom Décor', blurb: 'Nameplates and personal pieces made for a specific home.', accent: 'var(--c-gold-deep)' },
];

export const categoryById = (id: string): Category | undefined => categories.find((c) => c.id === id);
