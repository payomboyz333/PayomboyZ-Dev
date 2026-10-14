"use client";

import { useEffect, type RefObject } from "react";
import { Paperclip, Rocket } from "lucide-react";
import { SLASH_COMMANDS } from "@/lib/hub-data";
import { cn } from "@/lib/utils";

export function applySlashCommand(cmd: string, current: string) {
  return `${cmd} ${current.replace(/^\/[\w-]+\s*/, "")}`;
}

export function PromptBar({
  value,
  onChange,
  onSubmit,
  onAttach,
  busy,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onAttach: () => void;
  busy: boolean;
  textareaRef: RefObject<HTMLTextAreaElement>;
}) {
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  }, [value, textareaRef]);

  const canSend = value.trim().length > 0 && !busy;

  return (
    <div className="border-t border-white/10 bg-obsidian-900/90 px-3 pb-3 pt-2 backdrop-blur-xl md:px-5">
      <div className="no-scrollbar -mx-1 mb-2 flex gap-2 overflow-x-auto px-1" role="toolbar" aria-label="Slash commands">
        {SLASH_COMMANDS.map((c) => (
          <button
            key={c.cmd}
            type="button"
            onClick={() => {
              onChange(applySlashCommand(c.cmd, value));
              textareaRef.current?.focus();
            }}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-[13px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-gold",
              value.startsWith(c.cmd + " ")
                ? "border-cyber-gold bg-cyber-gold/15 text-cyber-gold"
                : "border-cyber-gold/30 bg-cyber-gold/[0.04] text-slate-300 hover:border-cyber-gold/70 hover:text-cyber-gold",
            )}
          >
            <span className="font-code font-semibold text-cyber-gold">{c.cmd}</span> {c.label}
          </button>
        ))}
      </div>

      <form
        className="flex items-end gap-2 rounded-xl border border-cyber-emerald/30 bg-obsidian-800 p-1.5 focus-within:border-cyber-emerald focus-within:shadow-neon-green"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSend) onSubmit();
        }}
      >
        <button
          type="button"
          onClick={onAttach}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-cyber-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-gold"
          aria-label="แนบไฟล์จากโปรเจกต์"
        >
          <Paperclip className="h-5 w-5" aria-hidden />
        </button>
        <label htmlFor="hub-prompt" className="sr-only">
          ข้อความสั่งงาน AI
        </label>
        <textarea
          id="hub-prompt"
          ref={textareaRef}
          value={value}
          rows={1}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              if (e.nativeEvent.isComposing || e.keyCode === 229) return;
              e.preventDefault();
              if (canSend) onSubmit();
            }
          }}
          placeholder="พิมพ์สั่งงาน AI เช่น 'ช่วยแก้ระบบ Feint ใน auto dodge (1).lua'..."
          className="msg-text max-h-[168px] min-h-11 flex-1 resize-none bg-transparent px-1 py-2.5 text-slate-50 placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-cyber-emerald text-black shadow-neon-green transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:bg-obsidian-600 disabled:text-slate-500 disabled:shadow-none"
          aria-label="ส่งคำสั่ง"
        >
          <Rocket className="h-5 w-5" aria-hidden />
        </button>
      </form>
    </div>
  );
}
