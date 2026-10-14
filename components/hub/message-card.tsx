import { Cat, Crown } from "lucide-react";
import type { ChatMessage } from "@/lib/hub-data";
import { Markdown } from "./markdown";
import { ToolChip } from "./tool-chip";

export function MessageCard({ message }: { message: ChatMessage }) {
  const isOperator = message.role === "user";

  if (isOperator) {
    return (
      <article className="ml-auto w-full max-w-[42rem] rounded-xl border-[1.5px] border-cyber-gold bg-[linear-gradient(180deg,rgba(30,22,6,0.95),rgba(16,12,3,0.98))] p-4 shadow-[0_0_18px_rgba(255,215,0,0.14)]">
        <header className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-outfit text-[13px] font-bold text-cyber-gold">
            <Crown className="h-4 w-4" aria-hidden />
            dj <span className="font-medium text-cyber-gold/70">(Operator / Master)</span>
          </span>
          <time className="font-code text-xs text-cyber-gold/60">{message.timestamp}</time>
        </header>
        <p className="msg-text whitespace-pre-line break-words text-slate-50">{message.content}</p>
      </article>
    );
  }

  return (
    <article className="mr-auto w-full max-w-[46rem] rounded-xl border-[1.5px] border-cyber-emerald bg-[linear-gradient(180deg,rgba(8,20,13,0.95),rgba(4,10,7,0.98))] p-4 shadow-[0_0_18px_rgba(0,255,102,0.12)]">
      <header className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-outfit text-[13px] font-bold text-cyber-emerald">
          <Cat className="h-4 w-4" aria-hidden />
          ANON <span className="font-code font-semibold text-cyber-emerald/70">[MAHI68]</span>
        </span>
        <time className="font-code text-xs text-cyber-emerald/60">{message.timestamp}</time>
      </header>
      {message.toolCalls && message.toolCalls.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {message.toolCalls.map((call, i) => (
            <ToolChip key={i} call={call} />
          ))}
        </div>
      )}
      <Markdown text={message.content} />
    </article>
  );
}

export function TypingCard() {
  return (
    <div
      className="mr-auto flex items-center gap-3 rounded-xl border-[1.5px] border-cyber-emerald/50 bg-[rgba(8,20,13,0.9)] px-4 py-3"
      role="status"
    >
      <Cat className="h-4 w-4 text-cyber-emerald" aria-hidden />
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyber-emerald"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </span>
      <span className="msg-text text-slate-300">MAHI68 กำลังประมวลผล...</span>
    </div>
  );
}
