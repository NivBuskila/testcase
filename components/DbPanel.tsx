"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { deleteRow, getTable, insertRow, type TableData, type TableName } from "@/app/dbPanelActions";

const TABLES: { name: TableName; label: string }[] = [
  { name: "users", label: "Users" },
  { name: "user_settings", label: "User settings" },
  { name: "personas", label: "Agents" },
];

export function DbPanel() {
  const [table, setTable] = useState<TableName>("users");
  const [data, setData] = useState<TableData | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await getTable(table));
    } catch {
      setError("Could not load table.");
    }
  }, [table]);

  useEffect(() => {
    setForm({});
    setError(null);
    load();
  }, [load]);

  const run = async (action: () => Promise<void>) => {
    try {
      await action();
      setError(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Database error.");
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await insertRow(table, form);
      setForm({});
    });
  };

  const show = (v: unknown) => (v === null ? "—" : String(v));
  const input = "rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white placeholder:text-slate-500";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
      <h2 className="mb-3 text-lg font-semibold text-white">Database panel</h2>

      <div className="mb-3 flex gap-2">
        {TABLES.map((t) => (
          <button
            key={t.name}
            onClick={() => setTable(t.name)}
            className={`rounded-md px-3 py-1.5 text-sm ${table === t.name ? "bg-cyan-500 text-slate-950" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {data && (
        <>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  {data.columns.map((c) => <th key={c.name} className="px-2 py-2 font-medium">{c.name}</th>)}
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => {
                  const key = row[data.primaryKey] as string | number;
                  return (
                    <tr key={key} className="border-t border-white/5">
                      {data.columns.map((c) => (
                        <td key={c.name} className="max-w-56 truncate px-2 py-1.5">{show(row[c.name])}</td>
                      ))}
                      <td className="px-2">
                        <button aria-label={`Delete row ${key}`} onClick={() => run(() => deleteRow(table, key))} className="text-slate-400 hover:text-rose-400">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleAdd} className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
            {data.columns.map((c) => (
              <input
                key={c.name}
                className={`${input} w-40`}
                placeholder={c.hasDefault ? `${c.name} (optional)` : c.name}
                value={form[c.name] ?? ""}
                onChange={(e) => setForm({ ...form, [c.name]: e.target.value })}
              />
            ))}
            <button type="submit" className="flex items-center gap-1 rounded-md bg-cyan-500 px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-cyan-400">
              <Plus size={16} /> Add row
            </button>
          </form>
        </>
      )}
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </section>
  );
}
