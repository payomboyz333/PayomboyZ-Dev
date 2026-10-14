"use client";

import { Building2, FolderOpen, MessageSquare, Monitor, Zap, type LucideIcon } from "lucide-react";
import type { HubTab } from "@/lib/hub-data";
import { cn } from "@/lib/utils";

type DockItem = { id: string; label: string; icon: LucideIcon; tab?: HubTab; color: string };

const ITEMS: DockItem[] = [
  { id: "chat", label: "แชท AI", icon: MessageSquare, tab: "chat", color: "text-cyber-emerald" },
  { id: "files", label: "ไฟล์โปรเจกต์", icon: FolderOpen, color: "text-cyber-gold" },
  { id: "office", label: "ออฟฟิศ", icon: Building2, tab: "office", color: "text-cyber-cyan" },
  { id: "lab", label: "แล็บวิจัย", icon: Zap, tab: "lab", color: "text-cyber-gold" },
  { id: "anydesk", label: "AnyDesk", icon: Monitor, color: "text-cyber-cyan" },
];

export function BottomDock({
  tab,
  onTab,
  onFiles,
  onAnydesk,
}: {
  tab: HubTab;
  onTab: (t: HubTab) => void;
  onFiles: () => void;
  onAnydesk: () => void;
}) {
  return (
    <nav
      aria-label="เมนูหลัก"
      className="relative z-30 grid h-14 shrink-0 grid-cols-5 border-t border-cyber-emerald/20 bg-obsidian-800/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      {ITEMS.map((item) => {
        const active = item.tab === tab;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => (item.tab ? onTab(item.tab) : item.id === "files" ? onFiles() : onAnydesk())}
            className="relative flex flex-col items-center justify-center gap-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyber-emerald"
          >
            {active && (
              <span
                className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-cyber-emerald shadow-[0_0_10px_#00FF66]"
                aria-hidden
              />
            )}
            <Icon
              className={cn("h-5 w-5 transition", active ? `${item.color} drop-shadow-[0_0_6px_currentColor]` : "text-slate-500")}
              aria-hidden
            />
            <span className={cn("text-[11px] font-medium", active ? "text-slate-50" : "text-slate-500")}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
