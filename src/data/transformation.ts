/**
 * Before / after slider content (homepage).
 *
 * Replace with a REAL pair: the customer's original photo (`before`) and the
 * finished artwork made from it (`after`), shared with the customer's consent.
 * Then set `illustrative` to false.
 *
 * While `illustrative` is true, the "before" side is a filtered rendering of the
 * same artwork and the component labels it clearly, so it is never presented as
 * a real customer transformation.
 */
export type Transformation = {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  alt: string;
  width: number;
  height: number;
  illustrative: boolean;
};

export const transformation: Transformation = {
  before: '/artwork/engagement-couple-portrait.webp',
  after: '/artwork/engagement-couple-portrait.webp',
  beforeLabel: 'Original Photo',
  afterLabel: 'Finished Sketch',
  alt: 'Couple portrait shown as a pencil-style study and as the finished painted artwork',
  width: 1080,
  height: 1535,
  illustrative: true,
};
