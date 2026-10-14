"use client";

import { useState } from "react";
import { RotateCcw, Unlock } from "lucide-react";
import { deobfuscate, SAMPLE_OBFUSCATED, type DeobfResult } from "@/lib/deobfuscate";
import { CopyButton, SectionLabel } from "../primitives";

export function DeobfStudio() {
  const [input, setInput] = useState(SAMPLE_OBFUSCATED);
  const [result, setResult] = useState<DeobfResult | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setResult(deobfuscate(input))}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-cyber-emerald px-4 font-outfit text-sm font-bold text-black shadow-neon-green transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Unlock className="h-4 w-4" aria-hidden />
          รันถอดรหัส AST
        </button>
        <button
          type="button"
          onClick={() => {
            setInput(SAMPLE_OBFUSCATED);
            setResult(null);
          }}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-slate-300 transition hover:text-white"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          รีเซ็ต
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="deobf-input">
            <SectionLabel>Obfuscated Input</SectionLabel>
          </label>
          <textarea
            id="deobf-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            className="h-72 w-full resize-none rounded-xl border border-cyber-crimson/30 bg-[#020406] p-3 font-code text-[13px] leading-relaxed text-slate-300 focus:border-cyber-crimson focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <SectionLabel>Clean Output</SectionLabel>
            {result && <CopyButton text={result.output} label="Copy Code" />}
          </div>
          <pre className="h-72 overflow-auto rounded-xl border border-cyber-emerald/30 bg-[#020406] p-3 font-code text-[13px] leading-relaxed text-cyber-emerald">
            {result ? result.output : <span className="text-slate-600">{"-- รอการถอดรหัส..."}</span>}
          </pre>
        </div>
      </div>

      {result && (
        <ul className="grid gap-1.5 rounded-xl border border-white/10 bg-black/40 p-3 font-code text-xs text-slate-400 sm:grid-cols-2 lg:grid-cols-3">
          {result.passes.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="text-cyber-emerald" aria-hidden>
                ✓
              </span>
              {p}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
