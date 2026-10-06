"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addPersona, deletePersona, listPersonas, type NewPersona, type PersonaRow } from "@/app/personaActions";

const EMPTY: NewPersona = { name: "", title: "", emoji: "🤖", focus: "", brief: "", hex: "#a78bfa" };

export function AgentManager() {
  const [personas, setPersonas] = useState<PersonaRow[]>([]);
  const [form, setForm] = useState<NewPersona>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPersonas().then(setPersonas).catch(() => setError("Could not load agents."));
  }, []);

  const set = (key: keyof NewPersona) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await addPersona(form);
      setPersonas([...personas, created]);
      setForm(EMPTY);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add agent.");
    }
  };

  const handleDelete = async (id: number) => {
    await deletePersona(id);
    setPersonas(personas.filter((p) => p.id !== id));
  };

  const input = "rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white placeholder:text-slate-500";

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-12 sm:px-6">
      <h2 className="mb-3 text-lg font-semibold text-white">Agents ({personas.length})</h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {personas.map((p) => (
          <div key={p.id} className="relative rounded-xl border bg-white/5 p-3" style={{ borderColor: `${p.hex}66` }}>
            <button
              onClick={() => handleDelete(p.id)}
              aria-label={`Delete ${p.name}`}
              className="absolute right-2 top-2 text-slate-400 hover:text-rose-400"
            >
              <Trash2 size={16} />
            </button>
            <div className="text-2xl">{p.emoji}</div>
            <div className="font-semibold" style={{ color: p.hex }}>{p.name}</div>
            <div className="text-xs text-slate-300">{p.title}</div>
            {p.focus && <div className="mt-1 text-xs text-slate-400">{p.focus}</div>}
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
        <input className={`${input} w-14`} value={form.emoji} onChange={set("emoji")} aria-label="Emoji" />
        <input className={input} placeholder="Name" value={form.name} onChange={set("name")} />
        <input className={input} placeholder="Title" value={form.title} onChange={set("title")} />
        <input className={input} placeholder="Focus" value={form.focus} onChange={set("focus")} />
        <input className={`${input} min-w-48 flex-1`} placeholder="Description" value={form.brief} onChange={set("brief")} />
        <input type="color" className="h-8 w-10 cursor-pointer rounded bg-transparent" value={form.hex} onChange={set("hex")} aria-label="Color" />
        <button type="submit" className="flex items-center gap-1 rounded-md bg-cyan-500 px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-cyan-400">
          <Plus size={16} /> Add agent
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
    </section>
  );
}
