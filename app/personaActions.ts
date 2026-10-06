"use server";

import { db } from "@/lib/db";

export interface PersonaRow {
  id: number;
  name: string;
  title: string;
  emoji: string;
  focus: string;
  brief: string;
  hex: string;
}

export type NewPersona = Omit<PersonaRow, "id">;

export async function listPersonas(): Promise<PersonaRow[]> {
  const { rows } = await db.query<PersonaRow>(
    "SELECT id, name, title, emoji, focus, brief, hex FROM personas ORDER BY id",
  );
  return rows;
}

export async function addPersona(input: NewPersona): Promise<PersonaRow> {
  const name = input.name?.trim();
  const title = input.title?.trim();
  if (!name || !title) throw new Error("Name and title are required.");
  const hex = /^#[0-9a-fA-F]{6}$/.test(input.hex) ? input.hex : "#94a3b8";
  const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
  const { rows } = await db.query<PersonaRow>(
    `INSERT INTO personas (slug, name, title, emoji, focus, brief, hex)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, title, emoji, focus, brief, hex`,
    [slug, name, title, input.emoji?.trim() || "🤖", input.focus?.trim() ?? "", input.brief?.trim() ?? "", hex],
  );
  return rows[0];
}

export async function deletePersona(id: number): Promise<void> {
  await db.query("DELETE FROM personas WHERE id = $1", [id]);
}
