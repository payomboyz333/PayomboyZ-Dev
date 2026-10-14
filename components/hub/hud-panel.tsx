"use client";

import Image from "next/image";
import useSWR from "swr";
import { Activity, Cpu, Radio } from "lucide-react";
import { DEPARTMENTS } from "@/lib/hub-data";
import { SectionLabel } from "./primitives";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const totalCats = DEPARTMENTS.reduce((n, d) => n + d.cats.length, 0);
const busyCats = DEPARTMENTS.reduce((n, d) => n + d.cats.filter((c) => c.status === "busy").length, 0);

export function HudPanel({ unlocked, messageCount }: { unlocked: boolean; messageCount: number }) {
  const { data } = useSWR<{ configured: boolean; model: string }>("/api/gateway", fetcher, { revalidateOnFocus: false });

  const rows = [
    { label: "AI Gateway", value: data ? (data.configured ? "ONLINE" : "OFFLINE") : "…", tone: data?.configured ? "text-cyber-emerald" : "text-cyber-crimson" },
    { label: "Model", value: data?.model ?? "…", tone: "text-cyber-cyan" },
    { label: "Cats on duty", value: `${busyCats}/${totalCats}`, tone: "text-cyber-gold" },
    { label: "Stream msgs", value: String(messageCount), tone: "text-slate-200" },
    { label: "Vault 2FA", value: unlocked ? "UNLOCKED" : "LOCKED", tone: unlocked ? "text-cyber-emerald" : "text-cyber-crimson" },
  ];

  return (
    <aside className="hidden w-[280px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-white/5 bg-obsidian-800/60 p-4 backdrop-blur-xl xl:flex">
      <figure className="relative overflow-hidden rounded-xl border border-cyber-gold/40 shadow-neon-gold">
        <Image
          src="/images/mascot.png"
          alt="PayomboyZ mascot: anime hacker with emerald HUD visor and floating gold crown"
          width={560}
          height={840}
          className="h-auto w-full"
          priority
        />
        <div className="visor-scan pointer-events-none absolute inset-x-0 top-[40%] h-px bg-cyber-emerald shadow-[0_0_12px_#00FF66]" aria-hidden />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3">
          <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-cyber-gold/80">Authorized Operator</p>
          <p className="font-outfit text-sm font-bold text-cyber-gold">dj · Boss / Chief Architect</p>
        </figcaption>
      </figure>

      <section className="space-y-2 rounded-xl border border-cyber-cyan/25 bg-black/40 p-3">
        <SectionLabel className="flex items-center gap-1.5 text-cyber-cyan/70">
          <Activity className="h-3.5 w-3.5" aria-hidden />
          Telemetry
        </SectionLabel>
        <dl className="space-y-1.5 font-code text-xs">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-2">
              <dt className="text-slate-500">{r.label}</dt>
              <dd className={`truncate font-semibold ${r.tone}`}>{r.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-2 rounded-xl border border-cyber-emerald/20 bg-black/40 p-3">
        <SectionLabel className="flex items-center gap-1.5 text-cyber-emerald/70">
          <Radio className="h-3.5 w-3.5" aria-hidden />
          Departments
        </SectionLabel>
        <ul className="space-y-1.5">
          {DEPARTMENTS.map((d) => {
            const busy = d.cats.filter((c) => c.status === "busy").length;
            return (
              <li key={d.id} className="text-xs">
                <div className="mb-1 flex justify-between text-slate-400">
                  <span className="truncate">{d.name}</span>
                  <span className="font-code text-slate-500">{d.jp}</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-cyber-emerald" style={{ width: `${(busy / d.cats.length) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="flex items-center gap-1.5 font-code text-[10px] text-slate-600">
        <Cpu className="h-3 w-3" aria-hidden />
        PBG // 神 // payomboyzdev.vercel.app
      </p>
    </aside>
  );
}
