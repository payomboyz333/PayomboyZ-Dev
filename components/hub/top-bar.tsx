"use client";

import { Crown, FolderOpen, Monitor, ShieldCheck, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar({
  remoteId,
  unlocked,
  onFiles,
  onAnydesk,
  onLogin,
}: {
  remoteId: string | null;
  unlocked: boolean;
  onFiles: () => void;
  onAnydesk: () => void;
  onLogin: () => void;
}) {
  return (
    <header className="relative z-30 flex h-12 shrink-0 items-center justify-between gap-2 border-b border-cyber-emerald/20 bg-obsidian-800/90 px-3 backdrop-blur-xl md:h-14 md:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-cyber-emerald/60 bg-[radial-gradient(circle_at_30%_20%,#0b3a20,#05080A)] shadow-neon-green">
          <Crown className="h-5 w-5 text-cyber-gold drop-shadow-[0_0_6px_#FFD700]" aria-hidden />
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate font-kanit text-[15px] font-bold tracking-wide text-slate-50">
            PAYOMBOYZ <span className="text-cyber-emerald">HUB</span>
          </p>
          <p className="hidden font-code text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:block">
            AI Script Studio · 電脳開発
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onFiles}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-cyber-gold/60 bg-cyber-gold/10 px-2.5 text-[13px] font-semibold text-cyber-gold transition hover:bg-cyber-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-gold md:hidden"
        >
          <FolderOpen className="h-4 w-4" aria-hidden />
          ไฟล์โปรเจกต์
        </button>
        <button
          type="button"
          onClick={onAnydesk}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-cyber-cyan/50 bg-cyber-cyan/10 px-2.5 font-code text-xs font-semibold text-cyber-cyan transition hover:bg-cyber-cyan/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan"
          aria-label={`AnyDesk ${remoteId ?? ""}`}
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-cyan opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-cyan" />
          </span>
          <Monitor className="hidden h-4 w-4 sm:block" aria-hidden />
          <span className="hidden min-[380px]:inline">{remoteId ?? "AnyDesk"}</span>
        </button>
        <button
          type="button"
          onClick={onLogin}
          className={cn(
            "hidden h-8 items-center gap-1.5 rounded-md border px-2.5 font-outfit text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 md:inline-flex",
            unlocked
              ? "border-cyber-emerald/50 bg-cyber-emerald/10 text-cyber-emerald focus-visible:ring-cyber-emerald"
              : "border-white/15 bg-white/5 text-slate-300 hover:text-white focus-visible:ring-white",
          )}
        >
          {unlocked ? <ShieldCheck className="h-4 w-4" aria-hidden /> : <ShieldOff className="h-4 w-4" aria-hidden />}
          {unlocked ? "2FA Verified" : "SuperAdmin Login"}
        </button>
      </div>
    </header>
  );
}
