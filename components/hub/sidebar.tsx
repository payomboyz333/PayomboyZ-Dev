"use client";

import { useState } from "react";
import { Building2, MessageSquare, TerminalSquare, Zap, type LucideIcon } from "lucide-react";
import { SLASH_COMMANDS, type HubTab, type WorkspaceFile } from "@/lib/hub-data";
import { cn } from "@/lib/utils";
import { FileList, ProjectFilter } from "./file-list";
import { SectionLabel } from "./primitives";

const NAV: { id: HubTab; label: string; jp: string; icon: LucideIcon }[] = [
  { id: "chat", label: "แชท AI", jp: "対話", icon: MessageSquare },
  { id: "office", label: "ออฟฟิศ 27 แมว", jp: "事務所", icon: Building2 },
  { id: "lab", label: "แล็บวิจัย", jp: "研究所", icon: Zap },
];

export function Sidebar({
  tab,
  onTab,
  onAnalyze,
  onSlash,
}: {
  tab: HubTab;
  onTab: (t: HubTab) => void;
  onAnalyze: (file: WorkspaceFile) => void;
  onSlash: (cmd: string) => void;
}) {
  const [project, setProject] = useState("slayer2");

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-r border-white/5 bg-obsidian-800/70 backdrop-blur-xl md:flex">
      <nav aria-label="เมนูหลัก" className="space-y-1 border-b border-white/5 p-3">
        {NAV.map((item) => {
          const active = item.id === tab;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => onTab(item.id)}
              className={cn(
                "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-emerald",
                active
                  ? "border border-cyber-emerald/50 bg-cyber-emerald/10 text-cyber-emerald shadow-[inset_0_0_12px_rgba(0,255,102,0.12)]"
                  : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              <span className="flex-1">{item.label}</span>
              <span className="font-code text-[10px] text-slate-500">{item.jp}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3">
        <div className="flex items-center justify-between">
          <SectionLabel>Project Files</SectionLabel>
        </div>
        <ProjectFilter value={project} onChange={setProject} />
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <FileList project={project} onAnalyze={onAnalyze} dense />
        </div>
      </div>

      <div className="space-y-2 border-t border-white/5 p-3">
        <SectionLabel className="flex items-center gap-1.5">
          <TerminalSquare className="h-3.5 w-3.5" aria-hidden />
          Slash Palette
        </SectionLabel>
        <ul className="grid grid-cols-2 gap-1.5">
          {SLASH_COMMANDS.map((c) => (
            <li key={c.cmd}>
              <button
                type="button"
                onClick={() => onSlash(c.cmd)}
                title={c.desc}
                className="w-full rounded-md border border-cyber-gold/25 bg-cyber-gold/[0.04] px-2 py-1.5 text-left transition hover:border-cyber-gold/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-gold"
              >
                <span className="block font-code text-xs font-semibold text-cyber-gold">{c.cmd}</span>
                <span className="block truncate text-[11px] text-slate-400">{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
