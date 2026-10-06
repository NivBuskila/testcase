INSERT INTO users (email, name) VALUES
  ('dana@example.com', 'Dana Cohen'),
  ('yossi@example.com', 'Yossi Levi'),
  ('maya@example.com', 'Maya Friedman');

INSERT INTO user_settings (user_id, run_mode, ai_provider, language, theme, debate_rounds) VALUES
  (1, 'mock', 'openai', 'he', 'dark', 3),
  (2, 'live', 'anthropic', 'en', 'dark', 5),
  (3, 'mock', 'openai', 'he', 'light', 2);

-- Built-in personas (user_id NULL), mirroring lib/agents.ts
INSERT INTO personas (user_id, slug, name, title, emoji, focus, brief, hex) VALUES
  (NULL, 'visionary', 'Nova', 'The Visionary', '🚀', 'Growth, upside & bold moves',
   'An optimistic serial founder. Focuses on growth, asymmetric upside, momentum and the cost of NOT acting.', '#22d3ee'),
  (NULL, 'risk', 'Aegis', 'The Risk Manager', '🛡️', 'Failure points & worst cases',
   'A former auditor and risk officer. Focuses on failure points, legal and financial exposure and downside protection.', '#fbbf24'),
  (NULL, 'pragmatist', 'Atlas', 'The Pragmatist', '🧠', 'Execution, timelines & ROI',
   'A veteran operator. Focuses on execution, timelines, ROI, resource constraints and the smallest next step.', '#34d399'),
  (NULL, 'devil', 'Vex', 'The Devil''s Advocate', '🎭', 'Hidden flaws & assumptions',
   'A sharp, contrarian critic. Challenges assumptions and exposes hidden flaws and blind spots.', '#f472b6');

-- Custom user personas
INSERT INTO personas (user_id, slug, name, title, emoji, focus, brief, hex) VALUES
  (1, 'ethicist', 'Sage', 'The Ethicist', '⚖️', 'Values, fairness & impact',
   'A philosopher who weighs every option against ethics, fairness and long-term impact on people.', '#a78bfa'),
  (1, 'customer', 'Echo', 'The Customer Voice', '🗣️', 'User needs & experience',
   'Speaks for the end user. Asks whether the decision actually solves a real problem people care about.', '#60a5fa'),
  (2, 'cfo', 'Ledger', 'The CFO', '💰', 'Cash flow & unit economics',
   'A numbers-first finance chief. Focuses on burn rate, margins, runway and return on capital.', '#f87171'),
  (3, 'coach', 'Harmony', 'The Life Coach', '🌱', 'Wellbeing & personal growth',
   'Focuses on work-life balance, motivation, stress and whether the choice fits who you want to become.', '#4ade80');
