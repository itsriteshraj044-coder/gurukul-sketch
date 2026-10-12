import type { CategoryId } from './categories';

/**
 * All artwork shown on the site. Images live in /public/artwork.
 * `width` / `height` are the image's pixel size: they reserve space while
 * the image loads (no layout shift) and drive the masonry layout.
 */
export type Artwork = {
  id: string;
  title: string;
  category: CategoryId;
  image: string;
  thumbnail?: string;
  width: number;
  height: number;
  description?: string;
  alt?: string;
  featured?: boolean;
  medium?: string;
};

const files = (name: string) => ({ image: `/artwork/${name}.webp`, thumbnail: `/artwork/${name}-sm.webp` });

export const artworks: Artwork[] = [
  {
    id: 'pencil-portrait', title: 'Graphite Portrait Study', category: 'pencil', ...files('pencil-portrait'),
    width: 474, height: 800, medium: 'Graphite on paper', featured: true,
    description: 'A soft, tonal pencil portrait: hair, fabric and expression built up layer by layer.',
    alt: 'Pencil sketch of a young woman with long flowing hair, standing with hands clasped',
  },
  {
    id: 'bridal-couple-portrait', title: 'The Bridal Embrace', category: 'couples', ...files('bridal-couple-portrait'),
    width: 864, height: 1280, medium: 'Painted portrait on canvas', featured: true,
    description: 'A bride and groom painted close together, jewellery and mehendi rendered in detail.',
    alt: 'Painted portrait of a bride in white with gold jewellery leaning against her groom',
  },
  {
    id: 'engagement-couple-portrait', title: 'Engagement Portrait', category: 'couples', ...files('engagement-couple-portrait'),
    width: 1080, height: 1535, medium: 'Painted portrait',
    description: 'A joyful couple portrait in soft lilac tones, with a green saree and floral details.',
    alt: 'Painted portrait of a smiling couple, the woman in a green saree with flowers in her hair',
  },
  {
    id: 'watercolour-couple-portrait', title: 'A Shared Glance', category: 'couples', ...files('watercolour-couple-portrait'),
    width: 1080, height: 732, medium: 'Watercolour-style painted portrait', featured: true,
    description: 'Two people caught mid-smile, painted in fresh teal and green washes.',
    alt: 'Painted portrait of a couple in teal outfits smiling at each other',
  },
  {
    id: 'heritage-portrait', title: 'Chhatrapati Shivaji Maharaj', category: 'portraits', ...files('heritage-portrait'),
    width: 720, height: 1280, medium: 'Painted portrait', featured: true,
    description: 'A heritage portrait set against a hill-fort landscape, painted in rich natural tones.',
    alt: 'Painting of Chhatrapati Shivaji Maharaj standing on a hillside with a fort in the background',
  },
  {
    id: 'gond-deer-tree', title: 'Deer Beneath the Tree', category: 'folk', ...files('gond-deer-tree'),
    width: 558, height: 770, medium: 'Gond-inspired painting',
    description: 'A family of patterned deer under a blue tree alive with birds.',
    alt: 'Gond-style painting of colourful patterned deer beneath a blue tree with birds',
  },
  {
    id: 'gond-tree-of-life', title: 'Tree of Life', category: 'folk', ...files('gond-tree-of-life'),
    width: 830, height: 1242, medium: 'Gond-inspired painting', featured: true,
    description: 'A blue-trunked tree of life with patterned cattle climbing its side.',
    alt: 'Gond-style tree of life with a blue trunk, green leaves and orange patterned animals',
  },
  {
    id: 'family-nameplate', title: 'Family Nameplate', category: 'decor', ...files('family-nameplate'),
    width: 450, height: 800, medium: 'Hand-painted wooden nameplate',
    description: 'A rustic, hand-lettered nameplate for a family home, with a little house on top.',
    alt: 'Hand-painted wooden family nameplate with three names hanging on a white wall',
  },
  {
    id: 'floral-line-art-mural', title: 'Monochrome Blooms', category: 'pencil', ...files('floral-line-art-mural'),
    width: 745, height: 1600, medium: 'Line-art wall mural',
    description: 'Large black line-drawn flowers climbing a white wall.',
    alt: 'Black line-art flowers painted across a white wall',
  },
  {
    id: 'community-doodle-mural', title: 'Café Crowd Mural', category: 'murals', ...files('community-doodle-mural'),
    width: 1280, height: 593, medium: 'Illustrated wall mural', featured: true,
    description: 'A long illustrated wall packed with people, colour and conversation.',
    alt: 'Long illustrated café wall mural of many colourful cartoon people',
  },
  {
    id: 'cafe-doodle-mural', title: 'Street-side Doodle Wall', category: 'murals', ...files('cafe-doodle-mural'),
    width: 593, height: 1280, medium: 'Illustrated exterior mural',
    description: 'An exterior wall filled with hand-drawn doodles, food and lettering.',
    alt: 'Colourful doodle mural on an exterior café wall with a person standing beside it',
  },
  {
    id: 'pink-city-mural', title: 'Pink Liberty Wall', category: 'murals', ...files('pink-city-mural'),
    width: 1086, height: 1448, medium: 'Painted feature wall',
    description: 'A playful pink feature wall with a statue, street lamp and signposts, framed in blossoms.',
    alt: 'Pink painted wall with a statue figure, street lamp and signposts under a floral arch',
  },
  {
    id: 'cherry-blossom-mural', title: 'Blossom Ridge', category: 'murals', ...files('cherry-blossom-mural'),
    width: 1600, height: 735, medium: 'Painted wall mural', featured: true,
    description: 'Misty blue mountains with cherry-blossom branches reaching across the wall.',
    alt: 'Wall mural of layered blue mountains with pink cherry blossom branches and birds',
  },
  {
    id: 'botanical-leaves-mural', title: 'Hanging Leaves', category: 'murals', ...files('botanical-leaves-mural'),
    width: 1572, height: 1001, medium: 'Painted wall mural',
    description: 'Green and blush leaves trailing down a calm blue wall.',
    alt: 'Painted mural of green and pink leaves hanging over a pale blue background',
  },
  {
    id: 'floral-panel-wall', title: 'Floral Panel Wall', category: 'murals', ...files('floral-panel-wall'),
    width: 1600, height: 901, medium: 'Hand-painted wall panels',
    description: 'Delicate floral motifs painted inside arched white wall panels.',
    alt: 'White wall with arched panels each holding a small hand-painted floral motif',
  },
  {
    id: 'arch-botanical-mural', title: 'Botanical Archway', category: 'murals', ...files('arch-botanical-mural'),
    width: 1600, height: 900, medium: 'Interior mural',
    description: 'A sweeping green leaf border painted around a restaurant archway.',
    alt: 'Restaurant archway outlined with green painted leaves',
  },
  {
    id: 'dining-hall-mural', title: 'Dining Hall in Colour', category: 'murals', ...files('dining-hall-mural'),
    width: 1600, height: 613, medium: 'Interior mural',
    description: 'A dining room wrapped in warm, patterned painted walls.',
    alt: 'Wide view of a restaurant dining hall with patterned red painted walls',
  },
  {
    id: 'restaurant-foliage-mural', title: 'Red Foliage Walls', category: 'murals', ...files('restaurant-foliage-mural'),
    width: 1200, height: 1600, medium: 'Interior mural',
    description: 'Bold red foliage drawn floor-to-ceiling across a restaurant interior.',
    alt: 'Large restaurant interior with red foliage line drawings across the walls',
  },
  {
    id: 'mural-in-progress', title: 'Work in Progress', category: 'murals', ...files('mural-in-progress'),
    width: 722, height: 1600, medium: 'Mural, painted on site',
    description: 'An artist on a scaffold, painting details high on a restaurant wall.',
    alt: 'Artist standing on scaffolding painting a mural high on a warm-toned wall',
  },
];

export const artworkById = (id: string): Artwork => {
  const art = artworks.find((x) => x.id === id);
  if (!art) throw new Error(`Unknown artwork id: ${id}`);
  return art;
};
