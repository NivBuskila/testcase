# AGENTS.md

**DecisionForge AI** — a multi-agent decision simulator built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion and Recharts.

- Dev server: `next dev`, served on host port 3000 via `docker-compose.base44.yml`.
- Entry: `app/page.tsx` → `useDebate` hook (`hooks/useDebate.ts`) drives all state; `app/actions.ts` are the Next.js Server Actions the client calls.
- Two run modes, toggled in the top bar:
  - **Mock Mode** (default, no API key needed): deterministic simulated debate in `lib/mock/engine.ts`, with dilemma-aware "flavors" (`lib/mock/flavors.ts`: career / startup / tech / general) and constraint-reaction scripts (`lib/mock/constraints.ts`).
  - **Live Mode**: calls OpenAI or Anthropic via `lib/llm/provider.ts`, using `AI_PROVIDER`/`OPENAI_API_KEY`/`ANTHROPIC_API_KEY` env vars. Prompts in `lib/llm/prompts.ts`, response validated/sanitized in `lib/llm/normalize.ts` (never trust raw LLM JSON). The Live toggle is disabled client-side until `getLiveStatus()` reports a key is present.
- PostgreSQL `db` service (compose). Schema + seed in `db/init/*.sql`, run ONLY on first init of the `pgdata` volume — to re-apply, run the SQL manually with `docker compose -f docker-compose.base44.yml exec -T db psql -U decisionforge decisionforge`. Tables: `users`, `user_settings`, `personas` (user_id NULL = built-in). `DATABASE_URL` is passed to `web`; the app code does not query it yet (debate state is still in-memory).
- `node_modules` and `.next` are NOT committed; they live in Docker named volumes, installed with `npm ci` on container start.
- To run: `docker compose -f docker-compose.base44.yml up -d --build`.
- Export PDF uses the browser print dialog on a hidden print-only `components/PrintReport.tsx`, not a server-side PDF library.
