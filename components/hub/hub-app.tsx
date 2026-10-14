"use client";

import { useCallback, useRef, useState } from "react";
import { analyzePrompt, INITIAL_MESSAGES, nowTime, type ChatMessage, type HubTab, type WorkspaceFile } from "@/lib/hub-data";
import { AnydeskModal } from "./anydesk-modal";
import { BottomDock } from "./bottom-dock";
import { ChatView } from "./chat-view";
import { FileDrawer } from "./file-drawer";
import { HudPanel } from "./hud-panel";
import { LabView } from "./lab-view";
import { LoginModal } from "./login-modal";
import { OfficeView } from "./office-view";
import { applySlashCommand } from "./prompt-bar";
import { SakuraBackground } from "./sakura-background";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { useVault } from "./use-vault";

export function HubApp() {
  const [tab, setTab] = useState<HubTab>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [anydeskOpen, setAnydeskOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const vault = useVault();

  const focusPrompt = () => requestAnimationFrame(() => textareaRef.current?.focus());

  const handleAnalyze = useCallback((file: WorkspaceFile) => {
    setFilesOpen(false);
    setTab("chat");
    setInput(analyzePrompt(file));
    focusPrompt();
  }, []);

  const handleSlash = useCallback((cmd: string) => {
    setTab("chat");
    setInput((v) => applySlashCommand(cmd, v));
    focusPrompt();
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", content: text, timestamp: nowTime() }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, project: "slayer2" }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: "assistant", content: data.reply || data.error || "ไม่ได้รับคำตอบ", timestamp: nowTime() },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `e-${Date.now()}`, role: "assistant", content: "**เชื่อมต่อ AI Gateway ไม่สำเร็จ** ลองใหม่อีกครั้ง", timestamp: nowTime() },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <SakuraBackground />
      <TopBar
        remoteId={vault.publicId}
        unlocked={Boolean(vault.creds)}
        onFiles={() => setFilesOpen(true)}
        onAnydesk={() => setAnydeskOpen(true)}
        onLogin={() => (vault.creds ? vault.lock() : setLoginOpen(true))}
      />

      <div className="relative z-10 flex min-h-0 flex-1">
        <Sidebar tab={tab} onTab={setTab} onAnalyze={handleAnalyze} onSlash={handleSlash} />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {tab === "chat" && (
            <ChatView
              messages={messages}
              busy={busy}
              input={input}
              setInput={setInput}
              onSend={send}
              onAttach={() => setFilesOpen(true)}
              textareaRef={textareaRef}
            />
          )}
          {tab === "office" && <OfficeView onMasterPc={() => setAnydeskOpen(true)} />}
          {tab === "lab" && <LabView />}
        </main>
        <HudPanel unlocked={Boolean(vault.creds)} messageCount={messages.length} />
      </div>

      <BottomDock tab={tab} onTab={setTab} onFiles={() => setFilesOpen(true)} onAnydesk={() => setAnydeskOpen(true)} />

      <FileDrawer open={filesOpen} onClose={() => setFilesOpen(false)} onAnalyze={handleAnalyze} />
      <AnydeskModal open={anydeskOpen} onClose={() => setAnydeskOpen(false)} vault={vault} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} vault={vault} />
    </div>
  );
}
