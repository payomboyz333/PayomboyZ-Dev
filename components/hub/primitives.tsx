"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { cn, copyText } from "@/lib/utils";

export function CopyButton({
  text,
  label = "คัดลอก",
  className,
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => setCopied(await copyText(text))}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 font-outfit text-xs font-semibold text-slate-200 transition hover:border-cyber-emerald/60 hover:text-cyber-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-emerald",
        copied && "border-cyber-emerald/60 text-cyber-emerald",
        className,
      )}
      aria-live="polite"
    >
      {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {copied ? "คัดลอกแล้ว" : label}
    </button>
  );
}

export function Overlay({
  open,
  onClose,
  title,
  children,
  variant = "modal",
  tone = "gold",
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  variant?: "modal" | "sheet";
  tone?: "gold" | "emerald" | "cyan";
  labelledBy: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const toneClass =
    tone === "gold" ? "glass-panel-gold shadow-neon-gold" : tone === "cyan" ? "glass-panel-cyan shadow-neon-cyan" : "glass-panel shadow-neon-green";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-6">
          <motion.button
            type="button"
            aria-label="ปิดหน้าต่าง"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={variant === "sheet" ? { y: "100%" } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={variant === "sheet" ? { y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={variant === "sheet" ? { y: "100%" } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className={cn(
              "relative flex max-h-[88dvh] w-full flex-col overflow-hidden rounded-t-2xl md:rounded-2xl",
              variant === "sheet" ? "md:max-w-2xl" : "md:max-w-md",
              toneClass,
            )}
          >
            <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/20 md:hidden" aria-hidden />
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
              <h2 id={labelledBy} className="min-w-0 font-outfit text-base font-bold text-slate-50">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-gold"
                aria-label="ปิด"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-outfit text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500", className)}>
      {children}
    </p>
  );
}
