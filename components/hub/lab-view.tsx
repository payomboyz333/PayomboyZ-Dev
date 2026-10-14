"use client";

import { useState } from "react";
import { Binary, Radar, Server, Swords, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CombatTuner } from "./lab/combat-tuner";
import { DeobfStudio } from "./lab/deobf-studio";
import { GatewayPanel } from "./lab/gateway-panel";
import { RemoteSpy } from "./lab/remote-spy";

const TOOLS: { id: string; label: string; sub: string; icon: LucideIcon; Panel: () => JSX.Element }[] = [
  { id: "combat", label: "Combat Tuner", sub: "Slayer2 Auto-Dodge", icon: Swords, Panel: CombatTuner },
  { id: "ast", label: "AST Deobfuscator", sub: "Hex · Unicode · _0x", icon: Binary, Panel: DeobfStudio },
  { id: "spy", label: "Remote Spy", sub: "__namecall hook", icon: Radar, Panel: RemoteSpy },
  { id: "gateway", label: "AI Gateway", sub: "DevOps & latency", icon: Server, Panel: GatewayPanel },
];

export function LabView() {
  const [active, setActive] = useState(TOOLS[0].id);
  const tool = TOOLS.find((t) => t.id === active) ?? TOOLS[0];

  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-6" aria-labelledby="lab-title">
      <div className="mx-auto max-w-6xl space-y-4">
        <header>
          <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyber-gold/70">Engineering Lab · 研究所</p>
          <h2 id="lab-title" className="font-outfit text-2xl font-bold text-slate-50">
            Pro-Tier Workstations
          </h2>
        </header>

        <div role="tablist" aria-label="เครื่องมือในแล็บ" className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 md:mx-0 md:grid md:grid-cols-4 md:px-0">
          {TOOLS.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                type="button"
                onClick={() => setActive(t.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-gold",
                  selected
                    ? "border-cyber-gold bg-cyber-gold/10 shadow-neon-gold"
                    : "border-white/10 bg-obsidian-800/70 hover:border-cyber-gold/40",
                )}
              >
                <t.icon className={cn("h-5 w-5 shrink-0", selected ? "text-cyber-gold" : "text-slate-500")} aria-hidden />
                <span className="min-w-0">
                  <span className={cn("block font-outfit text-sm font-bold", selected ? "text-cyber-gold" : "text-slate-200")}>
                    {t.label}
                  </span>
                  <span className="block truncate font-code text-[11px] text-slate-500">{t.sub}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${tool.id}`}
          aria-labelledby={`tab-${tool.id}`}
          className="rounded-2xl border border-white/10 bg-obsidian-800/70 p-4 backdrop-blur md:p-5"
        >
          <tool.Panel />
        </div>
      </div>
    </section>
  );
}
