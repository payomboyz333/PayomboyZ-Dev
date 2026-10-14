"use client";

import { useId, useState } from "react";
import { ChevronDown, Wrench } from "lucide-react";
import type { ToolCall } from "@/lib/hub-data";
import { cn } from "@/lib/utils";

function ArgsView({ args }: { args: Record<string, unknown> }) {
  return (
    <pre className="overflow-x-auto font-code text-[12.5px] leading-relaxed">
      <span className="text-slate-500">{"{"}</span>
      {Object.entries(args).map(([key, value], i, arr) => (
        <span key={key} className="block pl-4">
          <span className="text-cyber-cyan">{`"${key}"`}</span>
          <span className="text-slate-500">: </span>
          <span className={typeof value === "number" ? "text-cyber-gold" : "text-cyber-emerald"}>
            {JSON.stringify(value)}
          </span>
          {i < arr.length - 1 && <span className="text-slate-500">,</span>}
        </span>
      ))}
      <span className="text-slate-500">{"}"}</span>
    </pre>
  );
}

function OutputLine({ line }: { line: string }) {
  const tone = line.startsWith("+")
    ? "text-cyber-emerald"
    : line.startsWith("-")
      ? "text-cyber-crimson"
      : line.startsWith("✓")
        ? "text-cyber-gold"
        : "text-slate-300";
  return <span className={cn("block", tone)}>{line}</span>;
}

export function ToolChip({ call }: { call: ToolCall }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="overflow-hidden rounded-lg border border-cyber-cyan/30 bg-cyber-cyan/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex min-h-10 w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-slate-300 transition hover:bg-cyber-cyan/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyber-cyan"
      >
        <Wrench className="h-3.5 w-3.5 shrink-0 text-cyber-cyan" aria-hidden />
        <span className="min-w-0 flex-1 truncate">
          <span className="text-slate-400">กริยาคำสั่ง: </span>
          <span className="font-code font-semibold text-cyber-cyan">[{call.name}]</span>{" "}
          <span className="text-slate-200">{call.target}</span>{" "}
          <span className="text-slate-500">(แตะดูกริยาคำสั่ง)</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-cyber-cyan transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <div id={panelId} className="space-y-3 border-t border-cyber-cyan/20 bg-[#020406] p-3">
          <div>
            <p className="mb-1 font-outfit text-[10px] font-bold uppercase tracking-widest text-slate-500">Arguments</p>
            <ArgsView args={call.args} />
          </div>
          <div>
            <p className="mb-1 font-outfit text-[10px] font-bold uppercase tracking-widest text-slate-500">Output</p>
            <pre className="overflow-x-auto font-code text-[12.5px] leading-relaxed">
              {call.output.split("\n").map((line, i) => (
                <OutputLine key={i} line={line} />
              ))}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
