"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { ChatMessage } from "@/lib/hub-data";
import { MessageCard, TypingCard } from "./message-card";
import { PromptBar } from "./prompt-bar";

export function ChatView({
  messages,
  busy,
  input,
  setInput,
  onSend,
  onAttach,
  textareaRef,
}: {
  messages: ChatMessage[];
  busy: boolean;
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onAttach: () => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, busy]);

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="Antigravity AI pair-programming">
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-6" aria-live="polite">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <p className="text-center font-code text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Antigravity Stream · Session 電脳開発
          </p>
          {messages.map((m) => (
            <MessageCard key={m.id} message={m} />
          ))}
          {busy && <TypingCard />}
          <div ref={endRef} />
        </div>
      </div>
      <PromptBar
        value={input}
        onChange={setInput}
        onSubmit={onSend}
        onAttach={onAttach}
        busy={busy}
        textareaRef={textareaRef}
      />
    </section>
  );
}
