# AGENTS.md

## What this repo is

A single-page **client-only** React 19 + TypeScript catalog builder, bundled by
Vite 8 with Tailwind CSS 4. Persian/RTL UI. There is no backend, database,
API route or server-side code: `src/main.tsx` mounts `App.tsx` and everything
runs in the browser.

## Running it

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- `web` runs the Vite dev server on host port 3000 from the bind-mounted source
  (`npm run dev`, i.e. `vite --port=3000 --host=0.0.0.0`), so edits hot-reload.
- There is **no lockfile** in the repo, so the container runs `npm install` at
  startup before exec'ing the dev server. First boot takes ~15s; the healthcheck
  has a 150s `start_period` to cover it.
- `node_modules` is an anonymous volume so the sandbox host's empty directory
  never shadows the installed dependencies.
- Logs: `docker compose -f docker-compose.base44.yml logs -f web`
- One-off commands (typecheck, etc.) must run inside the container, since the
  sandbox host has no Node runtime:
  `docker compose -f docker-compose.base44.yml exec -T web npm run lint`

## Non-obvious constraints

- **`esbuild` devDependency is pinned to `^0.28.0`.** It was `^0.25.0`, which
  made `npm install` fail with `ERESOLVE` because Vite 8 requires the
  `esbuild@^0.27 || ^0.28` peer. Nothing in `src/` imports esbuild; do not lower
  it again.
- **`vite.config.ts` extends `server.allowedHosts` only in preview mode.** The
  preview proxy forwards requests with a proxied hostname, so when
  `BASE44_PREVIEW_MODE === '1'` the config appends
  `3000-${BASE44_PUBLIC_HOST_SUFFIX}` and `.${BASE44_SANDBOX_HOST_DOMAIN}`.
  With the flag unset the original localhost/IP-only behavior is unchanged.
  The platform-provided `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` variable holds
  an unrelated domain and does **not** cover this preview host.
- `GEMINI_API_KEY` / `APP_URL` in `.env.example` are leftovers from the AI Studio
  export. Nothing in `src/` reads `process.env` or `import.meta.env`, and
  `@google/genai` is installed but never imported, so **no credentials are
  required to run the app**. They would only matter if AI features are added.
- Tailwind 4 arrives via the `@tailwindcss/vite` plugin (`@import "tailwindcss"`
  in `src/index.css`); there is no `tailwind.config.js`. Fonts load from Google
  Fonts, so the page needs outbound network to render its intended typefaces.
- The app keeps its state in React memory plus `localStorage` (archives); there
  is no server-side persistence to reset.

## How to verify it works

1. `curl -o /dev/null -w '%{http_code}' http://localhost:3000/` → `200`.
2. The HTML must contain `/@vite/client` and `/@react-refresh` (dev server
   serving live source), not hashed `/assets/*.js` bundle tags.
3. The rendered page shows the "RCG" catalog editor: a preview card on one side
   and a tool panel with tabs such as "ابزارهای محتوا" / "صفحات و چیدمان".
