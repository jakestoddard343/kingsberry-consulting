# Kingsberry Consulting

Marketing site for Kingsberry Consulting — an AI-powered revenue growth
consultancy that builds automated lead-generation systems for small and
mid-sized businesses.

Single-page scroll experience: hero, the five funnel failures, a live
automation walkthrough, eight service categories, the engagement process,
positioning, an interactive engagement picker, credibility, and a contact form.

## The engagement picker

The packages section deliberately shows no prices. Visitors check off the
outcomes they want and the panel names their match — "Looks like you're
interested in the Growth Automation System" — then lists what that engagement
includes.

The matching rule lives in `recommend()` in `components/Packages.tsx`: each
option in `capabilities` (`lib/content.ts`) carries the lowest `tier` that
covers it, and the recommendation is the **highest** tier checked — the
smallest engagement that still covers everything asked for. Options flagged
`ongoing` are the retainer's; they sit outside the tier ladder and attach the
retainer to the result instead of pushing the package up.

To add an option, add it to `capabilities` with the right `tier` (or
`ongoing: true`). The options are interleaved rather than grouped by tier so
the answer isn't visible before anyone checks a box.

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
