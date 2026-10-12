/**
 * SAMPLE CONTENT: these are placeholders, not real customer reviews.
 * Replace them with genuine words from customers (with their permission),
 * then set `testimonialsAreSamples` to false in src/config/site.ts.
 */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 's1',
    quote:
      'We sent one blurry photo from our engagement and were nervous about how it would turn out. The finished portrait felt more like us than the photo did.',
    name: 'Sample customer',
    context: 'Couple portrait · placeholder review',
  },
  {
    id: 's2',
    quote:
      'They asked about the little things: the jewellery, the colour of the saree, how she usually smiles. You can see that care in every part of the piece.',
    name: 'Sample customer',
    context: 'Anniversary gift · placeholder review',
  },
  {
    id: 's3',
    quote:
      'Our café wall went from blank to the first thing every guest photographs. The process was simple and we were kept updated throughout.',
    name: 'Sample customer',
    context: 'Wall mural · placeholder review',
  },
];
