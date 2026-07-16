# Rulix — marketing site

Public site for Rulix, the human-review-first export-control memo audit console.

- **Stack:** Vite + React 18 + TypeScript + Tailwind CSS v4 (same design tokens as the reviewer console)
- **Pages:** Home (`/#/`), Security (`/#/security`), Legal (`/#/legal`)
- **Deploy:** Vercel-ready Vite output (`dist/`) with one serverless access-request endpoint

## Develop

```sh
npm install
npm run dev     # http://localhost:5174
```

## Build

```sh
npm run build   # typecheck + vite build → dist/
```

## Access-request delivery

The request-access form posts to `/api/access-requests`. Configure the following
Vercel environment variable before production deployment:

- `ACCESS_REQUEST_WEBHOOK_URL` (required): HTTPS endpoint that receives the normalized request JSON.
- `ACCESS_REQUEST_WEBHOOK_SECRET` (optional): sent as a Bearer token to authenticate webhook delivery.

If delivery is unavailable, the form keeps the visitor on the page and offers a
direct email fallback instead of reporting a false success.

## Messaging guardrails

Copy on this site must never imply that Rulix issues final ECCN, license, sanctions,
or jurisdiction determinations. All product visuals use demo data only. Input-scope
warnings (sanitized / public / approved text only) stay prominent on every page.
