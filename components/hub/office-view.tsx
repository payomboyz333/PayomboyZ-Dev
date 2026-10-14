"use client";

import { motion } from "framer-motion";
import { Cat, Monitor } from "lucide-react";
import { DEPARTMENTS, type Department } from "@/lib/hub-data";
import { cn } from "@/lib/utils";

const ACCENT: Record<Department["accent"], { border: string; text: string; bg: string }> = {
  gold: { border: "border-cyber-gold/40", text: "text-cyber-gold", bg: "bg-cyber-gold/10" },
  emerald: { border: "border-cyber-emerald/40", text: "text-cyber-emerald", bg: "bg-cyber-emerald/10" },
  cyan: { border: "border-cyber-cyan/40", text: "text-cyber-cyan", bg: "bg-cyber-cyan/10" },
  crimson: { border: "border-cyber-crimson/40", text: "text-cyber-crimson", bg: "bg-cyber-crimson/10" },
};

const STATUS = {
  busy: "bg-cyber-emerald",
  idle: "bg-cyber-gold",
  away: "bg-slate-500",
};

const STATUS_LABEL = { busy: "กำลังทำงาน", idle: "ว่าง", away: "พัก" };

const totalCats = DEPARTMENTS.reduce((n, d) => n + d.cats.length, 0);

function DepartmentRoom({ dept, index, onMasterPc }: { dept: Department; index: number; onMasterPc: () => void }) {
  const a = ACCENT[dept.accent];
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      aria-labelledby={`dept-${dept.id}`}
      className={cn("relative flex flex-col gap-3 overflow-hidden rounded-xl border bg-obsidian-800/80 p-4 backdrop-blur", a.border)}
    >
      <div className="hex-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <header className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-code text-[11px] text-slate-500">ROOM 0{index + 1}</p>
          <h3 id={`dept-${dept.id}`} className="font-outfit text-base font-bold text-slate-50">
            {dept.name}
          </h3>
        </div>
        <span className={cn("shrink-0 rounded-md px-2 py-0.5 font-code text-sm font-bold", a.bg, a.text)}>{dept.jp}</span>
      </header>

      <ul className="relative grid grid-cols-2 gap-2">
        {dept.cats.map((c) => (
          <li key={c.name} className="flex items-center gap-2 rounded-lg border border-white/5 bg-black/40 px-2 py-1.5">
            <span className="relative">
              <Cat className={cn("h-5 w-5", a.text)} aria-hidden />
              <span
                className={cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-black", STATUS[c.status])}
                aria-hidden
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-slate-100">{c.name}</span>
              <span className="block truncate text-[11px] text-slate-500">
                {c.role}
                <span className="sr-only"> · {STATUS_LABEL[c.status]}</span>
              </span>
            </span>
          </li>
        ))}
      </ul>

      {dept.hasMasterPc && (
        <button
          type="button"
          onClick={onMasterPc}
          className="relative mt-auto flex h-11 items-center justify-center gap-2 rounded-lg border border-cyber-cyan/60 bg-cyber-cyan/10 font-outfit text-sm font-bold text-cyber-cyan shadow-neon-cyan transition hover:bg-cyber-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan"
        >
          <Monitor className="h-4 w-4" aria-hidden />
          Master PC · เปิด AnyDesk Remote
        </button>
      )}
    </motion.section>
  );
}

export function OfficeView({ onMasterPc }: { onMasterPc: () => void }) {
  return (
    <section className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-6" aria-labelledby="office-title">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-code text-[11px] uppercase tracking-[0.2em] text-cyber-cyan/70">Neo-Tokyo HQ · 電脳事務所</p>
            <h2 id="office-title" className="font-outfit text-2xl font-bold text-slate-50">
              Virtual Cyber-Office
            </h2>
            <p className="text-sm text-slate-400">
              แมววิศวกร {totalCats} ตัว ประจำการ {DEPARTMENTS.length} แผนก
            </p>
          </div>
          <ul className="flex gap-3 text-xs text-slate-400">
            {(Object.keys(STATUS) as (keyof typeof STATUS)[]).map((s) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className={cn("h-2 w-2 rounded-full", STATUS[s])} aria-hidden />
                {STATUS_LABEL[s]}
              </li>
            ))}
          </ul>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {DEPARTMENTS.map((d, i) => (
            <DepartmentRoom key={d.id} dept={d} index={i} onMasterPc={onMasterPc} />
          ))}
        </div>
      </div>
    </section>
  );
}
