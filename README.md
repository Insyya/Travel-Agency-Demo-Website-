# Voyago — Travel, thoughtfully planned

Voyago is a responsive, frontend-only travel agency experience built for a Next.js technical assessment. It brings destination inspiration, travel services, interactive mock searches, traveller stories, and contact options together in one polished landing page.

## Technology

- Next.js App Router and React
- TypeScript
- Tailwind CSS 4 (with custom responsive design-system styles)
- GSAP and ScrollTrigger
- Lucide React icons

## Features

- Responsive sticky navigation with a mobile menu
- Cinematic GSAP hero sequence with clipped headline reveals, a floating destination postcard, slow image parallax, and scroll-staggered content
- GSAP hover lift and image-zoom interactions for cards and primary buttons
- Hero travel search panel with four service tabs
- Four search modes: flights, hotels, visa guidance, and car rental
- Client-side mock search results, required-field validation, date range validation, loading feedback, empty states, and detail dialogs
- Dedicated `/visa`, `/flights`, `/hotels`, and `/cars` booking journeys with service-specific filters, sorting, details, mock booking summaries, and confirmation steps
- Combined destination planner linking a selected destination to all four service journeys
- Six destination cards with save controls and shortcuts to destination search
- Service cards, benefits, animated statistics, and a keyboard-operable testimonial carousel
- Validated contact and newsletter forms with local success feedback
- Reduced-motion support, visible keyboard focus, semantic sections, and page metadata

Searches, application requests, bookings, contact submissions, and newsletter subscriptions are demonstration interactions only. No real bookings, tickets, payments, backend, email service, or external travel APIs are connected. Visa details and prices are sample data and are not official immigration guidance. Travel photographs are loaded from Unsplash.

## Run locally

Requirements: Node.js 20.9 or later and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production checks

```bash
npm run lint
npm run build
npm run start
```

The project is compatible with Vercel's standard Next.js deployment flow. A GitHub repository and live deployment have not been created as part of this workspace task.

## Project structure

```text
src/
  app/
    globals.css   Responsive styles and design tokens
    layout.tsx    Root layout and SEO metadata
    page.tsx      Landing page, destination planner, and client-side interactions
    visa/page.tsx Visa assistance experience
    flights/page.tsx Flight search and selection experience
    hotels/page.tsx Hotel search and booking experience
    cars/page.tsx Car rental search and selection experience
  components/
    ServicePage.tsx       Request-time destination query wrapper
    ServiceExperience.tsx Shared interactive service search/details/booking UI
  lib/
    travel-data.ts Local visa, flight, hotel, car, and destination sample data
public/           Static assets
```

## Mock data

The detailed visa, flight, hotel, car, and destination datasets are stored in `src/lib/travel-data.ts`. Landing-page copy and presentation data remain alongside the landing page. Search forms filter and sort local sample results; booking/application details and confirmations are simulated in React state. The project performs no network requests for search or form submissions.
