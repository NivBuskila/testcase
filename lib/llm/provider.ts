// Server-side only: imported exclusively from server actions (app/actions.ts).
import type { LiveStatus } from "../types";

type Provider = "openai" | "anthropic";

function resolveProvider(): { provider: Provider; key: string; model: string } | null {
  const openai = process.env.OPENAI_API_KEY?.trim();
  const anthropic = process.env.ANTHROPIC_API_KEY?.trim();
  const preferred = process.env.AI_PROVIDER?.trim().toLowerCase();

  if (anthropic && (preferred === "anthropic" || !openai)) {
    return { provider: "anthropic", key: anthropic, model: process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-haiku-latest" };
  }
  if (openai) {
    return { provider: "openai", key: openai, model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini" };
  }
  return null;
}

export function liveStatus(): LiveStatus {
  const p = resolveProvider();
  return { available: Boolean(p), provider: p?.provider ?? null, model: p?.model ?? null };
}

/** Sends a system + user prompt to the configured provider and returns the parsed JSON object. */
export async function completeJSON(system: string, user: string): Promise<unknown> {
  const p = resolveProvider();
  if (!p) throw new Error("Live Mode needs OPENAI_API_KEY or ANTHROPIC_API_KEY. Switch to Mock Mode or add a key.");

  const text = p.provider === "openai" ? await callOpenAI(p.key, p.model, system, user) : await callAnthropic(p.key, p.model, system, user);
  return parseJSON(text);
}

async function callOpenAI(key: string, model: string, system: string, user: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI request failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic(key: string, model: string, system: string, user: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      temperature: 0.8,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic request failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return data.content?.find((c) => c.type === "text")?.text ?? "";
}

function parseJSON(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("The AI response did not contain JSON.");
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new Error("The AI response contained malformed JSON.");
  }
}
