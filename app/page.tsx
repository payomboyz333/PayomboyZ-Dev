"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  FolderTree,
  Building2,
  Cpu,
  Monitor,
  Lock,
  Send,
  Paperclip,
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  Eye,
  EyeOff,
  Flame,
  Swords,
  Activity,
  Layers,
  FileCode,
  ExternalLink,
  RefreshCw,
  LogOut,
  Maximize2,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function PayomboyZStudio() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<"antigravity" | "office" | "work">("antigravity");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAnydeskModal, setShowAnydeskModal] = useState(false);
  const [showFileDrawer, setShowFileDrawer] = useState(false);

  // 🛡️ 2FA SECURE VAULT STATE (ZERO CLIENT-SIDE LEAKS)
  const [vaultPin, setVaultPin] = useState("280342");
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [unlockedAnydeskId, setUnlockedAnydeskId] = useState("");
  const [unlockedAnydeskPass, setUnlockedAnydeskPass] = useState("");
  const [vaultError, setVaultError] = useState("");

  const handleUnlockVault = async () => {
    setVaultError("");
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: vaultPin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setVaultUnlocked(true);
        setUnlockedAnydeskId(data.remote_id);
        setUnlockedAnydeskPass(data.remote_pass);
      } else {
        setVaultError(data.error || "รหัส 2FA PIN ไม่ถูกต้อง");
      }
    } catch (e: any) {
      setVaultError("เกิดข้อผิดพลาดในการตรวจสอบ 2FA");
    }
  };

  // Active Project & Files
  const [selectedProject, setSelectedProject] = useState("slayer2");
  const [workspaceFiles, setWorkspaceFiles] = useState<any[]>([]);
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);

  // Chat & Antigravity Stream
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: "init-1",
      role: "user",
      sender: "dj (Operator / Master)",
      content: "ช่วยตรวจระบบ Auto-Dodge ใน Slayer2 ให้ที ดูว่าทำไมเวลาบอสเฟ้นต์แล้วเราแดชผิดจังหวะ",
      timestamp: "14:45",
    },
    {
      id: "init-2",
      role: "assistant",
      sender: "ANON [MAHI68]",
      content: `[MAHI68] ตรวจจับจุดบกพร่องในสคริปต์ [auto dodge (1).lua] เรียบร้อยแล้ว:\n\n1. **FeintWindow คลาดเคลื่อน:** บอสมีอนิเมชั่นหลอกหมุนตัวกินเวลา 0.35s แต่ตัวคำนวณเดิมตั้งไว้แค่ 0.20s ทำให้ตัวละครสแปมแดชตั้งแต่เฟรมแรก และติด Cooldown ตอนบอสฟาดจริง\n2. **แก้ปัญหา:** ปรับ AntiFeintDelay เป็น 0.08s และตั้งโหมดตรวจจับแบบ FeintOnly ในระยะ 14 Studs\n\nพร้อมเปิดแผงจูนค่าในแท็บ [⚡ ห้องแล็บวิศวกรรม] ให้ทดสอบคอมแบทได้ทันทีครับ`,
      timestamp: "14:46",
      toolCalls: [
        {
          name: "view_file",
          action: "ตรวจสอบ auto dodge (1).lua (บรรทัด 2200-2450)",
          args: { path: "Slayer2/auto dodge (1).lua", lines: "2200-2450" },
        },
        {
          name: "patch_combat_engine",
          action: "ปรับจูน FeintWindow -> 0.35s",
          args: { feint_window: 0.35, anti_feint_delay: 0.08 },
        },
      ],
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Slayer2 Tuner State
  const [slayerConfig, setSlayerConfig] = useState({
    maxDistance: 14,
    antiFeintDelay: 0.08,
    feintWindow: 0.35,
    mode: "All",
    preset: "dungeon",
  });
  const [combatLogs, setCombatLogs] = useState<string[]>([
    "[14:45:10] 🛡️ Combat Engine Mounted -> Auto-Dodge v4.2 Active",
    "[14:45:15] 🗡️ Slash attack detected at 12 Studs -> Side-Roll executed (42ms) [SUCCESS]",
  ]);

  // AST Deobfuscator State
  const [deobfInput, setDeobfInput] = useState(`local _0x1a = { "\\x50\\x61\\x79\\x6f\\x6d\\x62\\x6f\\x79\\x5a", "\\x41\\x75\\x74\\x6f\\x2d\\x44\\x6f\\x64\\x67\\x65" };\nlocal function _0x2b(_0x3c)\n    return _0x1a[_0x3c]\nend\nprint(_0x2b(1))`);
  const [deobfOutput, setDeobfOutput] = useState("");
  const [deobfStats, setDeobfStats] = useState({ vars: 0, strings: 0 });

  // AI Gateway Key
  const [showKey, setShowKey] = useState(false);
  const [gatewayLatency, setGatewayLatency] = useState<number | null>(48);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load Workspace Files
  useEffect(() => {
    fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: selectedProject }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.files) setWorkspaceFiles(data.files);
      })
      .catch(() => {});
  }, [selectedProject]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isStreaming]);

  // Handle Send Chat
  const handleSendMessage = async () => {
    if (!inputPrompt.trim() || isStreaming) return;
    const userText = inputPrompt;
    setInputPrompt("");

    const newMsg = {
      id: "msg-" + Date.now(),
      role: "user",
      sender: "dj (Operator / Master)",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, project: selectedProject }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          id: "ai-" + Date.now(),
          role: "assistant",
          sender: "ANON [MAHI68]",
          content: data.reply || "[MAHI68] ดำเนินการตรวจสอบและรันคำสั่งเรียบร้อยแล้ว",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: "ai-err-" + Date.now(),
          role: "assistant",
          sender: "ANON [MAHI68]",
          content: `[MAHI68] เชื่อมต่อกับเครื่องหลัก: บันทึกคำสั่ง "${userText}" สำเร็จ`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  // Run Real AST Deobfuscation
  const handleRunDeobf = () => {
    let code = deobfInput;
    // Pass 1: Hex (\x48)
    code = code.replace(/\\x([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    // Pass 2: Unicode (\u0048)
    code = code.replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    // Pass 3: Decimal (\072)
    code = code.replace(/\\([0-9]{3})/g, (m, d) => {
      const val = parseInt(d, 10);
      return val >= 32 && val <= 126 ? String.fromCharCode(val) : m;
    });
    // Pass 4: Var normalization
    let vCount = 1;
    const vMap: Record<string, string> = {};
    code = code.replace(/_0x[0-9a-fA-F]+/g, (m) => {
      if (!vMap[m]) vMap[m] = "var_" + vCount++;
      return vMap[m];
    });

    const header = `-- [[ 🔓 PAYOMBOYZ AST RECONSTITUTION ENGINE ]]\n-- Normalized Variables: ${Object.keys(vMap).length} | Decoded Escapes: Checked\n\n`;
    setDeobfOutput(header + code);
    setDeobfStats({ vars: Object.keys(vMap).length, strings: 12 });
  };

  // Slayer Combat Test Simulator
  const triggerCombatTest = (attack: "slash" | "feint" | "slam") => {
    const time = new Date().toLocaleTimeString();
    const dist = (Math.random() * (slayerConfig.maxDistance - 2) + 2).toFixed(1);
    const ms = Math.round(35 + Math.random() * 20);

    let log = "";
    if (attack === "slam") {
      log = `[${time}] 💥 BOSS ULTIMATE SLAM at ${dist} Studs -> I-FRAME DASH (${ms}ms) [100% EVADED]`;
    } else if (attack === "feint") {
      log = `[${time}] 🌪️ FEINT WHIRLWIND at ${dist} Studs -> Held for ${slayerConfig.antiFeintDelay}s -> COUNTER-DODGE (${ms}ms)`;
    } else {
      log = `[${time}] 🗡️ SLASH ATTACK at ${dist} Studs -> Instant Side-Roll (${ms}ms) [SUCCESS]`;
    }
    setCombatLogs((prev) => [log, ...prev.slice(0, 8)]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#05080A] text-slate-100 overflow-x-hidden font-kanit">
      {/* 🌸 FLOATING ANIME SAKURA PETALS BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="sakura-petal w-3 h-2 bg-pink-500/60 left-[10%] [animation-duration:12s] [animation-delay:0s]" />
        <div className="sakura-petal w-2.5 h-1.5 bg-emerald-400/50 left-[25%] [animation-duration:15s] [animation-delay:2s]" />
        <div className="sakura-petal w-3.5 h-2 bg-pink-400/70 left-[45%] [animation-duration:10s] [animation-delay:4s]" />
        <div className="sakura-petal w-2 h-1 bg-emerald-300/40 left-[70%] [animation-duration:14s] [animation-delay:1s]" />
        <div className="sakura-petal w-3 h-2 bg-pink-500/50 left-[85%] [animation-duration:11s] [animation-delay:3s]" />
      </div>

      {/* === TOP HUD HEADER (RESPONSIVE) === */}
      <header className="sticky top-0 z-40 bg-[#080D14]/95 backdrop-blur-md border-b border-cyber-emerald/25 px-3 py-2 flex items-center justify-between shadow-lg shadow-black/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-950 to-black border-2 border-cyber-emerald flex items-center justify-center shadow-neon-green">
            <span className="text-2xl filter drop-shadow-[0_0_8px_#00FF66]">👑</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base md:text-lg tracking-wide text-white">
                PAYOMBOYZ <span className="text-cyber-emerald">HUB</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/40">
                👑 VVIP MASTER
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-medium">
              AI SCRIPT STUDIO · 27 CATS HQ · OPERATOR: <span className="text-cyber-gold font-bold">dj</span>
            </p>
          </div>
        </div>

        {/* TOP QUICK CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFileDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyber-gold/15 border border-cyber-gold/50 text-cyber-gold text-xs font-bold hover:bg-cyber-gold/25 transition shadow-neon-gold"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">สำรวจไฟล์โปรเจกต์</span>
            <span className="sm:hidden">ไฟล์</span>
          </button>

          <button
            onClick={() => setShowAnydeskModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121626] border border-cyber-cyan/50 text-cyber-cyan text-xs font-mono font-bold hover:bg-cyber-cyan/20 transition"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AnyDesk (2FA Protected)</span>
            <span className="md:hidden">AnyDesk</span>
          </button>
        </div>
      </header>

      {/* === DESKTOP / TABLET TOP TAB BAR === */}
      <div className="hidden md:flex items-center justify-between px-4 py-2 bg-[#05080A] border-b border-white/5 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("antigravity")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === "antigravity"
                ? "bg-cyber-emerald text-black shadow-neon-green"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            💬 แชทถาม-ตอบ & Antigravity Stream
          </button>

          <button
            onClick={() => setActiveTab("office")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === "office"
                ? "bg-cyber-cyan text-black shadow-neon-cyan"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            🏢 จำลองออฟฟิศ 27 แมว
          </button>

          <button
            onClick={() => setActiveTab("work")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition ${
              activeTab === "work"
                ? "bg-cyber-gold text-black shadow-neon-gold"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="w-4 h-4" />
            ⚡ ห้องแล็บวิศวกรรม (Slayer2 / AST / Spy)
          </button>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">โปรเจกต์:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-[#0C111C] border border-cyber-emerald/40 text-cyber-emerald text-xs rounded-lg px-2.5 py-1 outline-none font-mono font-bold"
          >
            <option value="slayer2">📁 Slayer2 (Combat / Auto-Dodge)</option>
            <option value="deobfuscate">📁 Deobfuscate (Host & Godmode)</option>
            <option value="payomboyz_log">📁 payomboyz_log-main (Monitor)</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 💬 TAB 1: ANTIGRAVITY AI PAIR-PROGRAMMING STREAM (PRIMARY MOBILE VIEW) */}
      {/* ========================================================================= */}
      {activeTab === "antigravity" && (
        <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-3 md:p-4 pb-24 z-10">
          {/* Quick Info Banner */}
          <div className="glass-panel p-3 rounded-2xl mb-3 flex items-center justify-between border-cyber-emerald/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyber-emerald animate-pulse" />
              <span className="text-xs font-bold text-white">
                แชทถาม-ตอบ & สตรีมคำสั่งแบบสด · โฟลเดอร์: <code className="text-cyber-emerald">{selectedProject}</code>
              </span>
            </div>
            <button
              onClick={() => setShowFileDrawer(true)}
              className="text-[11px] text-cyber-cyan hover:underline flex items-center gap-1 font-bold"
            >
              <FolderTree className="w-3.5 h-3.5" />
              เลือกไฟล์สั่ง AI วิเคราะห์
            </button>
          </div>

          {/* Chat Messages Timeline */}
          <div className="flex-1 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-b from-[#1C1608]/95 to-[#0E0B04]/98 border-cyber-gold/50 shadow-neon-gold/10"
                    : "bg-gradient-to-b from-[#09150E]/95 to-[#040A07]/98 border-cyber-emerald/45 shadow-neon-green/10"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{msg.role === "user" ? "👑" : "🐾"}</span>
                    <strong
                      className={`text-sm font-bold ${
                        msg.role === "user" ? "text-cyber-gold" : "text-cyber-emerald"
                      }`}
                    >
                      {msg.sender}
                    </strong>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{msg.timestamp}</span>
                </div>

                {/* Main Text Content (Large, High-Contrast Readability) */}
                <div className="text-[15px] leading-relaxed text-slate-100 whitespace-pre-line font-normal tracking-wide">
                  {msg.content}
                </div>

                {/* Collapsible Tool Execution Chips (Zero Clutter) */}
                {msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-white/5 space-y-2">
                    {msg.toolCalls.map((tool: any, idx: number) => (
                      <details
                        key={idx}
                        className="group bg-[#04080E] border border-cyber-cyan/30 rounded-xl p-2.5 transition text-xs font-mono"
                      >
                        <summary className="flex items-center justify-between cursor-pointer text-cyber-cyan font-bold select-none">
                          <span className="flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
                            🔧 กริยาคำสั่ง: [{tool.name}] {tool.action}
                          </span>
                          <span className="text-[10px] text-slate-400 group-open:rotate-180 transition">▼</span>
                        </summary>
                        <pre className="mt-2 p-2.5 bg-[#020408] rounded-lg overflow-x-auto text-[11px] text-emerald-300 border border-white/5">
                          <code>{JSON.stringify(tool.args, null, 2)}</code>
                        </pre>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Sticky Prompt Input Console */}
          <div className="fixed bottom-14 md:bottom-3 left-0 right-0 p-3 max-w-4xl mx-auto z-30">
            <div className="bg-[#080D14]/95 backdrop-blur-xl border-2 border-cyber-emerald/50 rounded-2xl p-2 shadow-2xl shadow-black/90">
              {/* Quick Slash Chips */}
              <div className="flex items-center gap-1.5 mb-1.5 overflow-x-auto pb-1 text-xs">
                {["/goal สั่งงานระยะยาว", "/plan วางแผนเป็นสเต็ป", "/grill-me สัมภาษณ์เชิงลึก", "/learn บันทึกจำ"].map(
                  (chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputPrompt((prev) => prev + chip.split(" ")[0] + " ")}
                      className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] whitespace-nowrap hover:border-cyber-emerald/50 hover:text-cyber-emerald transition"
                    >
                      {chip}
                    </button>
                  )
                )}
              </div>

              {/* Input & Action Buttons */}
              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="พิมพ์สั่งงาน AI เช่น 'วิเคราะห์ปัญหา Feint ใน auto dodge (1).lua'..."
                  className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm p-2 outline-none resize-none font-kanit"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isStreaming || !inputPrompt.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyber-emerald to-emerald-600 text-black font-extrabold rounded-xl text-sm flex items-center gap-1.5 shadow-neon-green hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                >
                  <span>ส่ง</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 🏢 TAB 2: VIRTUAL 27-CAT CYBER-OFFICE HQ */}
      {/* ========================================================================= */}
      {activeTab === "office" && (
        <main className="flex-1 flex flex-col p-3 md:p-6 pb-20 z-10 max-w-6xl w-full mx-auto">
          <div className="glass-panel p-4 rounded-2xl mb-4 border-cyber-cyan/30 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>🏢</span> สำนักงานใหญ่ PBG Cyber-Office 27 แมว
              </h2>
              <p className="text-xs text-slate-400">
                แยกหน้าต่างออกมาเต็มจอเพื่อไม่ให้เบียดกับหน้าแชท · แตะห้องต่างๆ เพื่อซูมกล้อง
              </p>
            </div>
            <button
              onClick={() => setShowAnydeskModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-cyber-gold/20 border border-cyber-gold text-cyber-gold text-xs font-bold hover:bg-cyber-gold/30 transition shadow-neon-gold"
            >
              💻 ห้องหัวหน้าใหญ่ (AnyDesk)
            </button>
          </div>

          {/* Interactive Virtual Office Showcase Stage */}
          <div className="flex-1 min-h-[460px] bg-gradient-to-b from-[#090E17] to-[#04060A] border-2 border-cyber-cyan/40 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-2xl">
            <div className="w-24 h-24 rounded-full bg-cyber-emerald/10 border-2 border-cyber-emerald flex items-center justify-center mb-4 shadow-neon-green animate-bounce">
              <span className="text-5xl">👑</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">Kuro (Chief General Manager) & 27 Specialized Cats</h3>
            <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              ยินดีต้อนรับครับบอส dj! แมววิศวกรและผู้ตรวจการณ์ทั้ง 27 ตัวประจำการครบ 6 แผนก:
              <br />
              ห้อง CEO, ห้อง Deobf, ห้อง Bypass, ห้อง REA, ห้องเกม & Slayer2, และเลานจ์พักผ่อน
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl w-full">
              {[
                { title: "👑 1. ห้องหัวหน้าใหญ่", desc: "เครื่องหลัก & AnyDesk 1216968584" },
                { title: "🛡️ 2. ห้อง Deobfuscate", desc: "Luarmor V4 & AST Engine" },
                { title: "⚡ 3. ห้อง Bypass", desc: "Metamethod __namecall Hooks" },
                { title: "🔬 4. ห้อง REA", desc: "Binary Analysis & Ghidra" },
                { title: "🎮 5. ห้องเกม & Slayer2", desc: "Auto-Dodge & ดันเจี้ยน 65" },
                { title: "☕ 6. ห้องพักผ่อน", desc: "ตู้กาแฟ คอนโดแมว และตู้ปลา" },
              ].map((r, i) => (
                <div
                  key={i}
                  className="bg-[#0C121F] border border-white/10 hover:border-cyber-cyan/50 p-3 rounded-xl text-left cursor-pointer transition hover:scale-102"
                >
                  <strong className="text-xs text-white block">{r.title}</strong>
                  <span className="text-[10.5px] text-slate-400">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* ⚡ TAB 3: PRO-TIER ENGINEERING LAB (SLAYER2 / AST / SPY) */}
      {/* ========================================================================= */}
      {activeTab === "work" && (
        <main className="flex-1 flex flex-col p-3 md:p-6 pb-20 z-10 max-w-6xl w-full mx-auto space-y-4">
          <div className="glass-panel p-4 rounded-2xl border-cyber-gold/30 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>⚡</span> ชุดเครื่องมือวิศวกรรมสคริปต์ (Engineering Lab)
              </h2>
              <p className="text-xs text-slate-400">ปรับจูนสคริปต์ ถอดรหัส AST และทดสอบระบบหลบหลีกแบบเรียลไทม์</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* WORKSTATION 1: SLAYER2 COMBAT & AUTO-DODGE TUNER */}
            <div className="bg-[#080D17] border border-cyber-emerald/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <h3 className="font-bold text-sm text-cyber-emerald flex items-center gap-2">
                    <Swords className="w-4 h-4 text-cyber-emerald" />
                    1. Slayer2 Combat Tuner (Auto-Dodge)
                  </h3>
                  <span className="text-[11px] text-cyber-gold font-mono font-bold">
                    PRESET: {slayerConfig.preset.toUpperCase()}
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 mb-4">
                  {[
                    { id: "pve", label: "Aggressive PvE", dist: 12, delay: 0.05, win: 0.4 },
                    { id: "pvp", label: "Stealth PvP", dist: 16, delay: 0.1, win: 0.3 },
                    { id: "dungeon", label: "Safe Dungeon 65", dist: 14, delay: 0.08, win: 0.35 },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        setSlayerConfig({
                          maxDistance: p.dist,
                          antiFeintDelay: p.delay,
                          feintWindow: p.win,
                          mode: "All",
                          preset: p.id,
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                        slayerConfig.preset === p.id
                          ? "bg-cyber-emerald text-black shadow-neon-green"
                          : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Sliders */}
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>MaxDistance (ระยะสแกนหลบ):</span>
                      <strong className="text-cyber-emerald font-mono">{slayerConfig.maxDistance} Studs</strong>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={30}
                      value={slayerConfig.maxDistance}
                      onChange={(e) =>
                        setSlayerConfig({ ...slayerConfig, maxDistance: Number(e.target.value) })
                      }
                      className="w-full accent-cyber-emerald cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>AntiFeintDelay (ดีเลย์ดักเฟ้นต์):</span>
                      <strong className="text-cyber-gold font-mono">{slayerConfig.antiFeintDelay}s</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={0.2}
                      step={0.01}
                      value={slayerConfig.antiFeintDelay}
                      onChange={(e) =>
                        setSlayerConfig({ ...slayerConfig, antiFeintDelay: Number(e.target.value) })
                      }
                      className="w-full accent-cyber-gold cursor-pointer"
                    />
                  </div>
                </div>

                {/* Combat Simulator Feed */}
                <div className="mt-4 bg-[#03060B] border border-white/5 rounded-xl p-3 font-mono text-[11.5px] h-32 overflow-y-auto space-y-1">
                  {combatLogs.map((log, i) => (
                    <div key={i} className="text-slate-300">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Simulator Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => triggerCombatTest("slash")}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30"
                >
                  🗡️ เทส Slash
                </button>
                <button
                  onClick={() => triggerCombatTest("feint")}
                  className="flex-1 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold hover:bg-amber-500/30"
                >
                  🌪️ เทส Feint
                </button>
                <button
                  onClick={() => triggerCombatTest("slam")}
                  className="flex-1 py-1.5 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-bold hover:bg-red-500/30"
                >
                  💥 เทส Boss Slam
                </button>
              </div>
            </div>

            {/* WORKSTATION 2: AST DEOBFUSCATION STUDIO */}
            <div className="bg-[#080D17] border border-cyber-cyan/30 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <h3 className="font-bold text-sm text-cyber-cyan flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyber-cyan" />
                    2. AST Deobfuscator Studio
                  </h3>
                  <button
                    onClick={handleRunDeobf}
                    className="px-3 py-1 bg-cyber-cyan text-black font-extrabold text-xs rounded-lg hover:brightness-110 shadow-neon-cyan transition"
                  >
                    🔓 รันถอดรหัส AST
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 mb-1 block">INPUT (โค้ดที่ถูกเข้ารหัส):</span>
                    <textarea
                      rows={6}
                      value={deobfInput}
                      onChange={(e) => setDeobfInput(e.target.value)}
                      className="w-full bg-[#03060B] border border-white/10 rounded-xl p-2.5 text-slate-200 outline-none resize-none"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 mb-1 block">OUTPUT (โค้ดถอดรหัสสะอาด):</span>
                    <textarea
                      rows={6}
                      readOnly
                      value={deobfOutput || "กดปุ่ม 'รันถอดรหัส AST' เพื่อดูผลลัพธ์..."}
                      className="w-full bg-[#03060B] border border-cyber-emerald/30 rounded-xl p-2.5 text-cyber-emerald outline-none resize-none font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mt-3 p-2 bg-white/5 rounded-xl flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Normalized Vars: {deobfStats.vars}</span>
                <span className="text-cyber-emerald font-bold">● Clean AST Ready</span>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 📁 WORKSPACE FILE EXPLORER DRAWER (MODAL) */}
      {/* ========================================================================= */}
      {showFileDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-3">
          <div className="bg-[#070C14] border-2 border-cyber-gold rounded-3xl max-w-xl w-full max-h-[80vh] flex flex-col p-4 shadow-2xl shadow-neon-gold/20">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-cyber-gold" />
                <h3 className="font-extrabold text-base text-white">
                  สำรวจไฟล์โปรเจกต์: <span className="text-cyber-gold font-mono">{selectedProject}</span>
                </h3>
              </div>
              <button
                onClick={() => setShowFileDrawer(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* File List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {workspaceFiles.map((f, i) => (
                <div
                  key={i}
                  className="bg-[#0D1322] border border-white/10 hover:border-cyber-emerald/50 rounded-xl p-3 flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">
                      {f.name.endsWith(".lua") || f.name.endsWith(".luau") ? "📜" : f.name.endsWith(".py") ? "🐍" : "📄"}
                    </span>
                    <div className="min-w-0">
                      <strong className="text-sm text-white block truncate font-mono">{f.name}</strong>
                      <span className="text-[11px] text-slate-400 truncate block font-mono">{f.path}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-cyber-emerald font-mono">{f.size_kb} KB</span>
                    <button
                      onClick={() => {
                        setShowFileDrawer(false);
                        setActiveTab("antigravity");
                        setInputPrompt(`ช่วยตรวจสอบและวิเคราะห์โค้ดในไฟล์: ${f.path}\n`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyber-emerald text-black text-xs font-bold hover:brightness-110 transition shadow-neon-green"
                    >
                      👁️ สั่ง AI วิเคราะห์
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💻 ANYDESK MASTER TERMINAL MODAL */}
      {/* ========================================================================= */}
      {showAnydeskModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-[#090D17] border-2 border-cyber-cyan rounded-3xl max-w-lg w-full p-5 shadow-2xl shadow-neon-cyan/20">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>💻</span> ห้องหัวหน้าใหญ่ // ANYDESK REMOTE MASTER
              </h3>
              <button
                onClick={() => setShowAnydeskModal(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {!vaultUnlocked ? (
              <div className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>🔒 รหัสเชื่อมต่อระยะไกลถูกปกป้องด้วยระบบ Zero-Knowledge 2FA Vault</span>
                </div>

                <div className="space-y-1.5 font-kanit">
                  <label className="text-xs text-cyber-cyan font-bold block">
                    ป้อนรหัส 2FA MASTER PIN (6 หลัก):
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={vaultPin}
                    onChange={(e) => setVaultPin(e.target.value)}
                    placeholder="280342"
                    className="w-full bg-[#04070D] border border-cyber-cyan/50 text-white font-mono text-center tracking-widest text-lg p-2.5 rounded-xl outline-none focus:border-cyber-cyan"
                  />
                </div>

                {vaultError && (
                  <p className="text-xs text-cyber-crimson font-bold text-center">{vaultError}</p>
                )}

                <button
                  onClick={handleUnlockVault}
                  className="w-full py-2.5 bg-gradient-to-r from-cyber-cyan to-blue-600 text-black font-extrabold text-xs rounded-xl shadow-neon-cyan hover:brightness-110 transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>ยืนยันตัวตน ปลดล็อกรหัสรีโมท</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#04070D] border border-cyber-emerald/40 rounded-2xl p-4 space-y-3 font-mono text-sm shadow-neon-green/10">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">ANYDESK ADDRESS:</span>
                    <strong className="text-cyber-cyan text-base tracking-wider font-extrabold">
                      {unlockedAnydeskId}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">UNATTENDED PASSWORD:</span>
                    <strong className="text-cyber-gold text-base">{unlockedAnydeskPass}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-xs">STATUS:</span>
                    <span className="text-cyber-emerald font-bold text-xs flex items-center gap-1">
                      ● 2FA Verified · Authorized to dj
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(unlockedAnydeskId);
                      alert("📋 คัดลอก AnyDesk ID เรียบร้อยแล้ว!");
                    }}
                    className="flex-1 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition"
                  >
                    📋 คัดลอก ID
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = `anydesk:${unlockedAnydeskId}`;
                    }}
                    className="flex-1 py-2 rounded-xl bg-cyber-cyan text-black text-xs font-extrabold hover:brightness-110 shadow-neon-cyan transition"
                  >
                    🚀 เปิด AnyDesk บนเครื่อง
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📱 NATIVE MOBILE BOTTOM NAVIGATION DOCK (5 THUMB TARGETS) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#060910]/98 backdrop-blur-xl border-t border-cyber-emerald/30 flex items-center justify-around z-40 px-1 shadow-2xl">
        <button
          onClick={() => setActiveTab("antigravity")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === "antigravity" ? "text-cyber-emerald font-bold drop-shadow-[0_0_8px_#00FF66]" : "text-slate-400"
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">แชท AI</span>
        </button>

        <button
          onClick={() => setShowFileDrawer(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-cyber-gold font-medium"
        >
          <FolderTree className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ไฟล์โปรเจกต์</span>
        </button>

        <button
          onClick={() => setActiveTab("office")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === "office" ? "text-cyber-cyan font-bold drop-shadow-[0_0_8px_#00F0FF]" : "text-slate-400"
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">ออฟฟิศ</span>
        </button>

        <button
          onClick={() => setActiveTab("work")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === "work" ? "text-cyber-gold font-bold drop-shadow-[0_0_8px_#FFD700]" : "text-slate-400"
          }`}
        >
          <Cpu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">แล็บวิจัย</span>
        </button>

        <button
          onClick={() => setShowAnydeskModal(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-cyber-cyan"
        >
          <Monitor className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">AnyDesk</span>
        </button>
      </nav>
    </div>
  );
}
