# Kingsberry Consulting

Marketing site for Kingsberry Consulting — an AI-powered revenue growth
consultancy that builds automated lead-generation systems for small and
mid-sized businesses.

Single-page scroll experience: hero, the five funnel failures, a live
automation walkthrough, eight service categories, the engagement process,
positioning, an interactive engagement picker, credibility, and a contact form.

## The engagement picker

The packages section deliberately shows no prices. It is three columns
(`components/Packages.tsx`):

1. **The project** — checkboxes from `projectOptions` in `lib/content.ts`.
2. **The partnership** — a standing pitch for the retainer, with its own
   add-to-quote toggle. It is not one option among many; it is the recurring
   half of the business and gets its own column.
3. **Your quote** — line items for whatever is selected, plus the project
   scope and the CTA.

`matchPackage()` picks the package: each option carries the lowest `tier` that
covers it, and the match is the **highest** tier checked — the smallest
engagement that still covers everything asked for. The retainer is deliberately
outside that ladder, so adding it never changes which package fits. Selecting
only the retainer recommends the retainer on its own.

To add a project option, append to `projectOptions` with the right `tier`. The
options are interleaved rather than grouped by tier so the answer isn't visible
before anyone checks a box.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Hero background | [ShaderGradient](https://github.com/ruucm/shadergradient) on React Three Fiber |
| Logo mark | Custom GLSL liquid-metal shader (R3F + three) |
| Scroll animation | [Motion](https://motion.dev) for reveals and scroll-scrub |
| Pinned sections | GSAP ScrollTrigger |
| Smooth scroll | Lenis, driven off the GSAP ticker |

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Deploying

Built for Vercel. Import the repo and accept the defaults — no environment
variables are required. Any host that runs a Next.js app works too.

## Where the content lives

All copy is in `lib/content.ts` — services, packages, pricing, process steps,
industries, and contact details. Edit that one file to change the site's text;
components read from it and never hardcode copy.

## Before going live

These are placeholders in `lib/content.ts` and `components/Contact.tsx`:

- **Contact details** — `site.email`, `site.phone`, `site.linkedin`, and
  `site.location` are stand-ins. Replace them with real values.
- **Booking link** — `site.bookingUrl` currently points at the on-page contact
  form. Swap in a Calendly or HubSpot meetings link if you'd rather send people
  straight to a calendar.
- **Form submission** — `handleSubmit` in `components/Contact.tsx` shows the
  success state without sending anything. Point it at Formspree, HubSpot Forms,
  or a Next.js route handler.
- **Domain** — `metadataBase` in `app/layout.tsx` assumes
  `kingsberryconsulting.com`. Update it if the domain differs, since Open Graph
  URLs resolve against it.

## Notes on the graphics

The hero's WebGL layer is opt-in at runtime: it mounts only after first paint,
only above 768px, only when a WebGL context is actually obtainable, and never
under `prefers-reduced-motion`. A CSS gradient sits underneath as the real
background, so the hero is never blank if any of those checks fail.

The logo mark rasterises its glyph to a canvas at runtime and derives surface
normals from a blurred copy of it — a glyph's raw alpha is flat across its
interior, so differencing it alone would shade only the outline.
