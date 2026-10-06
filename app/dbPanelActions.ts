"use server";

import { db } from "@/lib/db";

/** Whitelisted tables and their primary key column. */
const TABLES = { users: "id", user_settings: "user_id", personas: "id" } as const;
export type TableName = keyof typeof TABLES;

export interface TableData {
  columns: { name: string; hasDefault: boolean }[];
  rows: Record<string, unknown>[];
  primaryKey: string;
}

function assertTable(table: string): asserts table is TableName {
  if (!(table in TABLES)) throw new Error("Unknown table.");
}

async function getColumns(table: TableName) {
  const { rows } = await db.query<{ column_name: string; column_default: string | null }>(
    `SELECT column_name, column_default FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1 ORDER BY ordinal_position`,
    [table],
  );
  return rows.map((r) => ({ name: r.column_name, hasDefault: r.column_default !== null }));
}

export async function getTable(table: string): Promise<TableData> {
  assertTable(table);
  const pk = TABLES[table];
  const columns = await getColumns(table);
  const { rows } = await db.query(`SELECT * FROM ${table} ORDER BY ${pk}`);
  return { columns, primaryKey: pk, rows: JSON.parse(JSON.stringify(rows)) };
}

export async function insertRow(table: string, values: Record<string, string>): Promise<void> {
  assertTable(table);
  const allowed = new Set((await getColumns(table)).map((c) => c.name));
  const entries = Object.entries(values).filter(([k, v]) => allowed.has(k) && v.trim() !== "");
  if (entries.length === 0) throw new Error("Fill at least one field.");
  const cols = entries.map(([k]) => `"${k}"`).join(", ");
  const params = entries.map((_, i) => `$${i + 1}`).join(", ");
  await db.query(`INSERT INTO ${table} (${cols}) VALUES (${params})`, entries.map(([, v]) => v.trim()));
}

export async function deleteRow(table: string, key: string | number): Promise<void> {
  assertTable(table);
  await db.query(`DELETE FROM ${table} WHERE ${TABLES[table]} = $1`, [key]);
}
