"use client";

import { useEffect, useState } from "react";
import { Pause, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton, SectionLabel } from "../primitives";

type SpyEvent = { id: number; time: string; method: "FireServer" | "InvokeServer"; remote: string; args: string };

const REMOTES = [
  { remote: "ReplicatedStorage.Combat.Dodge", args: '"Roll", Vector3(0, 0, -12)' },
  { remote: "ReplicatedStorage.Combat.Attack", args: '"Slash", 3' },
  { remote: "ReplicatedStorage.Dungeon.Progress", args: "65, true" },
  { remote: "ReplicatedStorage.Inventory.Equip", args: '"Katana_Mk2"' },
  { remote: "ReplicatedStorage.Shop.Price", args: '"Potion"' },
];

const HOOK_SNIPPET = `-- Read-only logger: prints remote calls made by the local client
local mt = getrawmetatable(game)
local old = mt.__namecall
setreadonly(mt, false)

mt.__namecall = newcclosure(function(self, ...)
    local method = getnamecallmethod()
    if method == "FireServer" or method == "InvokeServer" then
        print(("[SPY] %s -> %s"):format(method, self:GetFullName()), ...)
    end
    return old(self, ...)
end)

setreadonly(mt, true)`;

let seq = 0;
function makeEvent(): SpyEvent {
  const pick = REMOTES[Math.floor(Math.random() * REMOTES.length)];
  return {
    id: ++seq,
    time: new Date().toLocaleTimeString("th-TH", { hour12: false }),
    method: pick.remote.includes("Shop") ? "InvokeServer" : "FireServer",
    ...pick,
  };
}

export function RemoteSpy() {
  const [events, setEvents] = useState<SpyEvent[]>([]);
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setEvents((e) => [makeEvent(), ...e].slice(0, 60)), 1400);
    return () => clearInterval(t);
  }, [live]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="flex min-h-[320px] flex-col gap-2">
        <div className="flex items-center justify-between">
          <SectionLabel className="flex items-center gap-2">
            __namecall stream
            {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyber-crimson" aria-hidden />}
          </SectionLabel>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setLive((v) => !v)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-xs text-slate-200 hover:text-white"
            >
              {live ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
              {live ? "Pause" : "Resume"}
            </button>
            <button
              type="button"
              onClick={() => setEvents([])}
              className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-slate-400 hover:text-cyber-crimson"
              aria-label="ล้าง log"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
        <ol className="min-h-0 flex-1 space-y-1 overflow-y-auto rounded-xl border border-white/10 bg-[#020406] p-3 font-code text-[12.5px]">
          {events.length === 0 && <li className="text-slate-600">{"> waiting for remote calls..."}</li>}
          {events.map((e) => (
            <li key={e.id} className="flex flex-wrap gap-x-2">
              <span className="text-slate-600">{e.time}</span>
              <span className={cn("font-semibold", e.method === "FireServer" ? "text-cyber-cyan" : "text-cyber-gold")}>
                {e.method}
              </span>
              <span className="text-slate-300">{e.remote}</span>
              <span className="text-cyber-emerald/80">({e.args})</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <SectionLabel>Executor Hook (Luau)</SectionLabel>
          <CopyButton text={HOOK_SNIPPET} label="Copy Code" />
        </div>
        <pre className="flex-1 overflow-auto rounded-xl border border-cyber-cyan/30 bg-[#020406] p-3 font-code text-[12.5px] leading-relaxed text-cyber-cyan">
          {HOOK_SNIPPET}
        </pre>
        <p className="text-xs text-slate-500">สตรีมด้านซ้ายเป็นข้อมูลจำลองเพื่อพรีวิว UI</p>
      </div>
    </div>
  );
}
