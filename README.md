# 1 NGƯỜI — Nguyễn Huy Chiến

Personal narrative, ERP field notes and a small toolbox for people building operational systems. The experience is designed around the idea: **một người, nhiều vai, một hệ thống**.

## What is inside

- cinematic, responsive landing page with ambient canvas, parallax and cursor-reactive motion
- ERP journey, project map and the different roles behind `1nguoi.com`
- searchable journal with topic filters and four seeded long-form articles
- interactive ERP Readiness Scan and six-level customization guide
- local writing studio with live preview, autosave and Markdown export
- accessible reduced-motion fallback and mobile layouts

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Narrative home experience |
| `/blog` | Searchable journal |
| `/blog/[slug]` | Article detail |
| `/tools` | Tool directory |
| `/tools/erp-readiness` | Six-question ERP diagnostic |
| `/tools/customization-ladder` | Interactive customization ladder |
| `/studio` | Local-first draft editor |

## Run locally

```bash
npm ci
npm run dev
```

The site uses the Vinext/Vite runtime for its ChatGPT Sites preview. For a standard Vercel production check:

```bash
npm run build:vercel
```

## Publish an article

The writing studio intentionally keeps drafts in the browser and exports portable Markdown; it does not pretend to be a hosted CMS. To publish on the static Vercel site:

1. Draft and export from `/studio`.
2. Add the final article entry in `app/content.ts`.
3. Commit and push to `main`; Vercel rebuilds the site.

This Git-backed workflow keeps articles versioned, reviewable and portable. A database-backed CMS can be added later without changing the public reading experience.

## Deployment

- `npm run build` builds and verifies the ChatGPT Sites artifact.
- `npm run build:vercel` runs the native Next.js production build.
- `vercel.json` pins Vercel to the native build so it does not mistake the Vinext artifact for a `.next` output.

The character artwork in `public/characters` was supplied for this project and optimized to WebP for the web experience.
