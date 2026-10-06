"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Network } from "lucide-react";
import type { TreeNode } from "@/lib/types";
import { GlassCard } from "../ui/GlassCard";
import { Skeleton } from "../ui/Skeleton";
import { NodeDetail } from "./NodeDetail";
import { TreeNodeButton } from "./TreeNodeButton";

interface Edge {
  id: string;
  d: string;
  highlighted: boolean;
}

function findNode(root: TreeNode, id: string): TreeNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

function bestOptionId(tree: TreeNode) {
  return [...tree.children].sort((a, b) => (b.probability ?? 0) - (a.probability ?? 0))[0]?.id;
}

export function DecisionTree({ tree }: { tree: TreeNode | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState("root");
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Reset view whenever a new tree arrives: open the most attractive path.
  useEffect(() => {
    if (!tree) return;
    const best = bestOptionId(tree);
    setExpanded(new Set(best ? [best] : []));
    setSelectedId("root");
  }, [tree]);

  const setRef = useCallback(
    (id: string) => (el: HTMLButtonElement | null) => {
      if (el) nodeRefs.current.set(id, el);
      else nodeRefs.current.delete(id);
    },
    [],
  );

  const selectedPath = useMemo(() => {
    // Ids from root to the selected node (ids are hierarchical: opt1, opt1-o0).
    if (selectedId === "root") return new Set(["root"]);
    const parts = selectedId.split("-");
    return new Set(["root", parts[0], selectedId]);
  }, [selectedId]);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || !tree) return;
    const box = container.getBoundingClientRect();
    const next: Edge[] = [];
    const link = (parent: TreeNode) => {
      const from = nodeRefs.current.get(parent.id);
      for (const child of parent.children) {
        const to = nodeRefs.current.get(child.id);
        if (from && to) {
          const a = from.getBoundingClientRect();
          const b = to.getBoundingClientRect();
          const x1 = a.right - box.left;
          const y1 = a.top + a.height / 2 - box.top;
          const x2 = b.left - box.left;
          const y2 = b.top + b.height / 2 - box.top;
          const mid = (x1 + x2) / 2;
          next.push({
            id: `${parent.id}->${child.id}`,
            d: `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`,
            highlighted: selectedPath.has(child.id),
          });
        }
        link(child);
      }
    };
    link(tree);
    setEdges(next);
    setSize({ w: container.scrollWidth, h: container.scrollHeight });
  }, [tree, selectedPath]);

  useLayoutEffect(() => {
    measure();
  }, [measure, expanded]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const selected = tree ? findNode(tree, selectedId) ?? tree : null;

  const toggleOption = (id: string) => {
    setSelectedId(id);
    setExpanded((prev) => {
      const next = new Set(prev);
      // First click opens; clicking an already-selected open option collapses it.
      if (next.has(id) && selectedId === id) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <GlassCard
      title="Interactive Decision Tree"
      icon={<Network className="h-4 w-4 text-cyan-300" />}
      action={<span className="text-[11px] text-slate-500">Click any node to explore</span>}
    >
      {!tree ? (
        <div className="flex items-center gap-10">
          <Skeleton className="h-16 w-44" />
          <div className="space-y-4">
            <Skeleton className="h-14 w-44" />
            <Skeleton className="h-14 w-44" />
            <Skeleton className="h-14 w-44" />
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto pb-2">
            <div ref={containerRef} className="relative flex min-w-max items-center gap-10 p-1">
              <svg className="pointer-events-none absolute left-0 top-0" width={size.w} height={size.h} aria-hidden>
                {edges.map((e) => (
                  <motion.path
                    key={e.id}
                    d={e.d}
                    fill="none"
                    stroke={e.highlighted ? "#22d3ee" : "rgba(148,163,184,0.3)"}
                    strokeWidth={e.highlighted ? 2 : 1.25}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                ))}
              </svg>

              <TreeNodeButton ref={setRef(tree.id)} node={tree} selected={selectedId === tree.id} onClick={() => setSelectedId(tree.id)} />

              <div className="flex flex-col gap-4">
                {tree.children.map((option) => {
                  const open = expanded.has(option.id);
                  return (
                    <div key={option.id} className="flex items-center gap-10">
                      <TreeNodeButton
                        ref={setRef(option.id)}
                        node={option}
                        selected={selectedId === option.id}
                        expanded={open}
                        onClick={() => toggleOption(option.id)}
                      />
                      {open && (
                        <div className="flex flex-col gap-2">
                          {option.children.map((outcome, i) => (
                            <motion.div
                              key={outcome.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 + i * 0.08 }}
                            >
                              <TreeNodeButton
                                ref={setRef(outcome.id)}
                                node={outcome}
                                selected={selectedId === outcome.id}
                                onClick={() => setSelectedId(outcome.id)}
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait">{selected && <NodeDetail key={selected.id} node={selected} />}</AnimatePresence>
        </>
      )}
    </GlassCard>
  );
}
