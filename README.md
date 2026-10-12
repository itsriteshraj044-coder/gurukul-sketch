# GURUKUL Sketch: Website

A five-page website for **GURUKUL Sketch**: custom sketches, painted portraits, folk art and hand-painted murals.

**Stack:** React 19 · TypeScript · Vite 8 · React Router 7 · Framer Motion · GSAP + ScrollTrigger · Lenis · Lucide icons · plain CSS (no UI framework).

| Route | Page |
| --- | --- |
| `/` | Home: hero, collection, before/after, process, why us, portfolio, testimonials, CTA |
| `/gallery` | Filterable masonry gallery + lightbox (`/gallery?category=murals` deep-links a filter) |
| `/custom-sketches` | Style cards + 4-step enquiry form (`#enquiry` jumps to the form, `?style=couple` preselects a style) |
| `/about` | Brand story, approach, detail, personalisation, studio videos, commitment |
| `/contact` | Contact form + WhatsApp / email / details |

---

## 1. Setup

Requires Node 20+ (tested on Node 24).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/ (+ sitemap/robots)
npm run preview    # serve dist/ locally
```

Optional environment variables: copy `.env.example` to `.env`.

| Variable | Purpose |
| --- | --- |
| `VITE_SITE_URL` | Production URL, e.g. `https://www.gurukulsketch.in` (no trailing slash). Enables canonical links, `og:url` and `dist/sitemap.xml`. |
| `VITE_ENQUIRY_ENDPOINT` | HTTPS endpoint that receives enquiries. Leave empty to use the WhatsApp hand-off (see §6). |

Every `VITE_*` value ends up in the public JavaScript bundle. **Never put API keys or passwords in them.**

## 2. Deployment

`npm run build` produces a static site in `dist/`. It's a single-page app, so every route must fall back to `index.html`:

- **Netlify:** `public/_redirects` is already included.
- **Vercel:** `vercel.json` is already included.
- **Apache / cPanel / Hostinger:** `public/.htaccess` is included and copied into `dist/`. It handles route fallback, MIME types, compression and caching. Upload the **contents** of `dist/` (including the hidden `.htaccess`) to `public_html/`.
- **IIS / Windows hosting / Azure App Service:** `public/web.config` is included (needs the IIS URL Rewrite module).
- **Nginx:** `try_files $uri /index.html;`

Set `VITE_SITE_URL` in the host's build environment so the sitemap and canonical URLs are generated.

## 3. Contact details: fill these in first

All business details live in **`src/config/site.ts`**:

```ts
contact: {
  whatsappNumber: '',            // digits with country code, e.g. '919876543210'
  phoneDisplay: '+91 XXXXX XXXXX',
  phoneHref: '',                 // e.g. '+919876543210' (empty = no tap-to-call link)
  email: 'hello@your-domain.example',
  address: '[Your studio address]',
  responseNote: '[Your working hours]',
},
social: { instagram: '', facebook: '', youtube: '', pinterest: '' }, // empty = hidden
testimonialsAreSamples: true,
```

- Until `whatsappNumber` is set, WhatsApp links open WhatsApp with the message pre-filled and let the visitor pick the contact. Set the number so messages go straight to the studio.
- In development, the browser console lists any fields still holding placeholders.

## 4. Artwork and images

### Where images live
- Artwork: `public/artwork/` (WebP). Each piece has two files: `name.webp` (max 1600px) and `name-sm.webp` (max 720px thumbnail).
- Studio videos: `public/video/` (silent MP4 + `-poster.webp`).
- Logo: `src/assets/logo.webp`.

### Supplied assets used
The 29 supplied WhatsApp files contained **5 exact duplicates**, which were removed, leaving 1 logo, 19 unique artworks and 4 videos. Every unique artwork is used, and **no image appears twice on the same page**. One image (the Gond deer painting) had a visiting card printed above it; it was cropped to the artwork only, so the card's phone numbers aren't published.

### Add a new artwork
1. Export the image and drop it in `public/artwork/`, ideally as `my-piece.webp` (≤1600px long side) plus `my-piece-sm.webp` (≤720px). JPG/PNG also work.
2. Add an entry to **`src/data/artworks.ts`**:
   ```ts
   {
     id: 'my-piece',
     title: 'Anniversary Portrait',
     category: 'couples',            // one of the ids in src/data/categories.ts
     image: '/artwork/my-piece.webp',
     thumbnail: '/artwork/my-piece-sm.webp',
     width: 1200, height: 1600,       // the image's real pixel size (keeps layout stable)
     medium: 'Graphite on paper',
     description: 'One or two sentences shown in the lightbox.',
     alt: 'Describe what is in the image for screen readers',
   },
   ```
The gallery, filters, counts, lightbox and footer links update automatically.

### Replace an image
Overwrite the file in `public/artwork/` with the same name, then update `width` / `height` in `artworks.ts` if the proportions changed.

### Categories
Edit **`src/data/categories.ts`**. Change `label` to rename a category, but keep its `id`. Categories marked `hideWhenEmpty: true` (Family, Charcoal) are hidden from the gallery filters until they have artwork; once you add pieces with those ids, the filters appear on their own.

### Order styles (Custom Sketches page)
Edit **`src/data/sketchStyles.ts`**. The style cards and the enquiry form's options both read from it. A style without an `image` shows a branded "made to order" tile, which is used for Family and Charcoal because no real examples were supplied yet.

### Before / after slider
**`src/data/transformation.ts`**. No matching photo → artwork pair was supplied, so the slider currently compares a pencil-style rendering of a finished painting with the painting itself, and it is **clearly labelled "Illustrative preview"** on the page. To use a real pair (with the customer's consent), set `before` to the original photo, `after` to the finished piece, and `illustrative: false`.

### Logo
Replace `src/assets/logo.webp` with a transparent version (PNG/WebP/SVG; update the import in `src/components/Logo.tsx` if the extension changes). The lettering is knocked out of the colour blocks, so the logo is only ever placed on light surfaces.

### Testimonials
`src/data/testimonials.ts` holds **placeholder text**, labelled on the page as sample reviews. Replace it with real customer words (with their permission), then set `testimonialsAreSamples: false` in `site.ts` to remove the label.

## 5. Copy to review

The copy avoids invented facts: there are no founder names, years, customer counts, awards, prices or delivery times. Some lines still describe how the studio works, for example "size, medium and details are agreed with you before work begins" and the commitments on the About page. Please confirm they match how GURUKUL Sketch actually operates.

The studio videos are captioned only as "moments from the studio". If the studio runs art classes and wants to promote them, that would be a new section.

## 6. Form submissions

Both forms submit through **`src/services/enquiry.ts`**, which has two honest modes:

**WhatsApp hand-off (default, no endpoint set).** On the final step, the visitor presses *Send via WhatsApp*. WhatsApp opens with all their details pre-filled, and the page explains that **nothing is sent until they press send in WhatsApp** and that they need to attach the reference photo themselves. The site never shows a "submitted" message in this mode. Drafts are kept in `sessionStorage`, so details aren't lost on refresh.

**API mode (`VITE_ENQUIRY_ENDPOINT` set).** The form POSTs `multipart/form-data` to your endpoint:

| Field | Notes |
| --- | --- |
| `kind` | `custom-sketch` or `contact` |
| `style`, `people`, `finish`, `occasion`, `name`, `phone`, `email`, `details` | custom-sketch form |
| `type`, `name`, `phone`, `email`, `message` | contact form |
| `referencePhoto` | optional image file (≤10 MB, JPG/PNG/WEBP/HEIC) |

The success screen appears **only** when the endpoint returns a 2xx status. Errors and timeouts (30s) show a retry message, and the details stay in the form.

**What the endpoint must do (server-side):** validate the fields again, check the file type and size, store uploads in **private** storage (not a public folder or bucket), send the notification email or WhatsApp message using credentials held only on the server, rate-limit requests and add spam protection (e.g. a CAPTCHA token or honeypot), and allow CORS from your domain. Good options are a small serverless function (Vercel/Netlify/Cloudflare) or a form service that supports file uploads.

## 7. Motion system

- **GSAP + ScrollTrigger:** hero entrance timeline, scroll parallax, word-by-word headline reveals (`RevealText`), clip-path artwork reveals, the drawing process line, the About-page detail zoom and the horizontal studio reel. Pages opt in through data attributes handled by `usePageMotion` (`data-reveal`, `data-reveal-stagger`, `data-clip`, `data-speed`).
- **Framer Motion:** navigation indicator, mobile menu, route transitions, card hovers, gallery filter layout animations, lightbox, form steps and testimonial slider.
- **Lenis:** smooth scrolling, driven by GSAP's ticker so there is only one animation loop.
- Every GSAP effect runs inside `gsap.context` and is reverted on unmount, so it is safe under React Strict Mode. The two libraries never animate the same property on the same element.
- **Reduced motion:** with `prefers-reduced-motion`, there is no preloader and no Lenis, nothing is hidden or animated in, and videos don't autoplay. Parallax and pointer effects run only on wide screens with a mouse.

## 8. Project structure

```
src/
  config/site.ts          business details, social links, flags
  data/                   artworks, categories, styles, testimonials, transformation
  services/enquiry.ts     form submission adapter (API / WhatsApp)
  components/             Navbar, Footer, Preloader, CustomCursor, RevealText, ScrollReveal,
                          ArtworkCard, MasonryGrid, Lightbox, BeforeAfter, TestimonialSlider,
                          EnquiryForm, CTASection, VideoFrame, PageHero, Seo, WhatsAppButton
  components/home/Hero.tsx
  hooks/                  SmoothScroll (Lenis), useGsap, usePageMotion, useFocusTrap, ...
  layouts/MainLayout.tsx  shell, route transitions, hash scrolling
  pages/                  Home, Gallery, CustomSketches, About, Contact, NotFound
  styles/                 global (tokens), layout, sections, gallery, home, pages
public/
  artwork/  video/  favicon.svg  og-image.jpg  _redirects
scripts/generate-sitemap.mjs
```

## 9. Brand tokens

Defined at the top of `src/styles/global.css`: navy `#18264F`, royal `#1656A8`, purple `#75458B`, green `#75B83C`, orange `#D47A16`, red `#C94D45`, gold `#F4BE24`, on white and warm paper `#F8F7F4`. The multicolour "stripe" (`--stripe`) follows the order of the logo's letters. Type pairing: Fraunces (display), Manrope (text) and Caveat (hand-written notes), all self-hosted through Fontsource.
