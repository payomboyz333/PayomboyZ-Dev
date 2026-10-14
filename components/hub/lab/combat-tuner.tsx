"use client";

import { useState } from "react";
import { Bomb, Sword, Tornado } from "lucide-react";
import { PRESETS, simulateAttack, toLuaConfig, type AttackKind, type CombatConfig, type CombatLog } from "@/lib/combat";
import { cn } from "@/lib/utils";
import { CopyButton, SectionLabel } from "../primitives";

const SLIDERS: { key: keyof CombatConfig; label: string; min: number; max: number; step: number; unit: string }[] = [
  { key: "maxDistance", label: "MaxDistance", min: 10, max: 30, step: 1, unit: " studs" },
  { key: "antiFeintDelay", label: "AntiFeintDelay", min: 0, max: 0.2, step: 0.01, unit: "s" },
  { key: "feintWindow", label: "FeintWindow", min: 0.2, max: 0.6, step: 0.01, unit: "s" },
];

const ATTACKS: { id: AttackKind; label: string; icon: typeof Sword; cls: string }[] = [
  { id: "slash", label: "Slash", icon: Sword, cls: "border-cyber-cyan/50 text-cyber-cyan hover:bg-cyber-cyan/10" },
  { id: "feint", label: "Feint", icon: Tornado, cls: "border-cyber-gold/50 text-cyber-gold hover:bg-cyber-gold/10" },
  { id: "slam", label: "Boss Slam", icon: Bomb, cls: "border-cyber-crimson/60 text-cyber-crimson hover:bg-cyber-crimson/10" },
];

const fmt = (key: keyof CombatConfig, v: number) => (key === "maxDistance" ? String(v) : v.toFixed(2));

export function CombatTuner() {
  const [config, setConfig] = useState<CombatConfig>(PRESETS[2].config);
  const [preset, setPreset] = useState<string | null>(PRESETS[2].id);
  const [logs, setLogs] = useState<CombatLog[]>([]);

  const success = logs.length ? Math.round((logs.filter((l) => l.ok).length / logs.length) * 100) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <SectionLabel>Presets</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={preset === p.id}
                onClick={() => {
                  setConfig(p.config);
                  setPreset(p.id);
                }}
                className={cn(
                  "h-10 rounded-lg border px-3 font-outfit text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-gold",
                  preset === p.id
                    ? "border-cyber-gold bg-cyber-gold text-black shadow-neon-gold"
                    : "border-cyber-gold/30 bg-cyber-gold/[0.05] text-cyber-gold hover:border-cyber-gold/70",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-white/10 bg-black/40 p-4">
          {SLIDERS.map((s) => (
            <div key={s.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor={`slider-${s.key}`} className="font-code text-[13px] text-slate-300">
                  {s.label}
                </label>
                <output htmlFor={`slider-${s.key}`} className="font-code text-sm font-bold text-cyber-emerald">
                  {fmt(s.key, config[s.key])}
                  {s.unit}
                </output>
              </div>
              <input
                id={`slider-${s.key}`}
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={config[s.key]}
                onChange={(e) => {
                  setConfig((c) => ({ ...c, [s.key]: Number(e.target.value) }));
                  setPreset(null);
                }}
                className="range-emerald w-full"
              />
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#020406]">
          <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
            <span className="font-code text-xs text-slate-500">auto_dodge_config.lua</span>
            <CopyButton text={toLuaConfig(config)} label="Copy Code" />
          </div>
          <pre className="overflow-x-auto p-3 font-code text-[13px] leading-relaxed text-cyber-emerald">{toLuaConfig(config)}</pre>
        </div>
      </div>

      <div className="flex min-h-[320px] flex-col gap-3">
        <div className="flex items-center justify-between">
          <SectionLabel>Attack Test Simulator</SectionLabel>
          {success !== null && (
            <span className="font-code text-xs text-slate-400">
              Evade rate <span className={success >= 70 ? "text-cyber-emerald" : "text-cyber-crimson"}>{success}%</span>
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ATTACKS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setLogs((l) => [simulateAttack(a.id, config), ...l].slice(0, 40))}
              className={cn(
                "flex h-12 flex-col items-center justify-center gap-0.5 rounded-lg border bg-black/40 font-outfit text-xs font-bold transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:flex-row sm:gap-1.5 sm:text-sm",
                a.cls,
              )}
            >
              <a.icon className="h-4 w-4" aria-hidden />
              {a.label}
            </button>
          ))}
        </div>
        <ol
          className="min-h-0 flex-1 space-y-1 overflow-y-auto rounded-xl border border-white/10 bg-[#020406] p-3 font-code text-[12.5px]"
          aria-live="polite"
          aria-label="Combat reaction log"
        >
          {logs.length === 0 && <li className="text-slate-600">{"> กดปุ่มโจมตีเพื่อเริ่มทดสอบ reaction..."}</li>}
          {logs.map((l) => (
            <li key={l.id} className="flex gap-2">
              <span className="shrink-0 text-slate-600">{l.time}</span>
              <span className={l.ok ? "text-cyber-emerald" : "text-cyber-crimson"}>{l.ok ? "OK " : "ERR"}</span>
              <span className="text-slate-300">{l.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
