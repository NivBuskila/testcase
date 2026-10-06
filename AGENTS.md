# AGENTS.md

Minimal static "Hello World" site built with Vite (vanilla, no framework).

- Entry point: `index.html` (plain HTML/CSS, no JS framework).
- Dev server: Vite, served on host port 3000 via `docker-compose.base44.yml`.
- No backend, no database, no external services/secrets.
- To run: `docker compose -f docker-compose.base44.yml up -d --build`.
- Edits to `index.html` hot-reload automatically in the browser.
- `node_modules` is NOT committed (see `.gitignore`); it lives in a Docker named volume and is installed with `npm ci` on container start. Never commit it — committed platform-specific binaries (rollup/esbuild) and a startup install mutating tracked files broke boot previously.
