CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_settings (
  user_id         INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  run_mode        TEXT NOT NULL DEFAULT 'mock' CHECK (run_mode IN ('mock', 'live')),
  ai_provider     TEXT NOT NULL DEFAULT 'openai' CHECK (ai_provider IN ('openai', 'anthropic')),
  language        TEXT NOT NULL DEFAULT 'en',
  theme           TEXT NOT NULL DEFAULT 'dark',
  debate_rounds   INTEGER NOT NULL DEFAULT 3 CHECK (debate_rounds BETWEEN 1 AND 10),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE personas (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE, -- NULL = built-in persona
  slug        TEXT NOT NULL,
  name        TEXT NOT NULL,
  title       TEXT NOT NULL,
  emoji       TEXT NOT NULL,
  focus       TEXT NOT NULL,
  brief       TEXT NOT NULL,
  hex         TEXT NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, slug)
);
