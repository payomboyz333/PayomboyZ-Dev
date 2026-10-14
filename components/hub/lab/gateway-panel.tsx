"use client";

import { useState } from "react";
import useSWR from "swr";
import { Eye, EyeOff, Gauge } from "lucide-react";
import { CopyButton, SectionLabel } from "../primitives";

type GatewayInfo = { configured: boolean; hint: string | null; upstreamMs: number | null; upstreamOk: boolean; provider: string; model: string };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function GatewayPanel() {
  const { data } = useSWR<GatewayInfo>("/api/gateway", fetcher, { revalidateOnFocus: false });
  const [reveal, setReveal] = useState(false);
  const [pings, setPings] = useState<{ ms: number; ok: boolean }[]>([]);
  const [pinging, setPinging] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://payomboyzdev.vercel.app";
  const curl = `curl -X POST ${origin}/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message":"ping from cURL","project":"slayer2"}'`;

  const ping = async () => {
    setPinging(true);
    try {
      const r: GatewayInfo = await fetch("/api/gateway?ping=1", { cache: "no-store" }).then((res) => res.json());
      setPings((p) => [{ ms: r.upstreamMs ?? 0, ok: r.upstreamOk }, ...p].slice(0, 12));
    } finally {
      setPinging(false);
    }
  };

  const max = Math.max(200, ...pings.map((p) => p.ms));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/40 p-4">
          <SectionLabel>AI Gateway Key</SectionLabel>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-md bg-[#020406] px-3 py-2 font-code text-sm text-cyber-gold">
              {!data ? "…" : !data.configured ? "ยังไม่ได้ตั้งค่า" : reveal ? data.hint : "••••••••••••"}
            </code>
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              disabled={!data?.configured}
              className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-300 hover:text-white disabled:opacity-40"
              aria-label={reveal ? "ซ่อนคีย์" : "แสดงคีย์"}
            >
              {reveal ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          <p className="text-xs text-slate-500">แสดงเฉพาะส่วนต้น/ท้ายของคีย์ ค่าเต็มอยู่ฝั่งเซิร์ฟเวอร์เท่านั้น</p>
          <dl className="grid grid-cols-2 gap-2 pt-1 font-code text-xs">
            <div>
              <dt className="text-slate-500">Provider</dt>
              <dd className="text-cyber-cyan">{data?.provider ?? "…"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Model</dt>
              <dd className="truncate text-cyber-cyan">{data?.model ?? "…"}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <SectionLabel>cURL Test Snippet</SectionLabel>
            <CopyButton text={curl} label="Copy Code" />
          </div>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#020406] p-3 font-code text-[12.5px] leading-relaxed text-slate-300">
            {curl}
          </pre>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border border-cyber-cyan/25 bg-black/40 p-4">
        <div className="flex items-center justify-between">
          <SectionLabel>Latency Benchmark</SectionLabel>
          <button
            type="button"
            onClick={ping}
            disabled={pinging}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-cyber-cyan/60 bg-cyber-cyan/10 px-3 font-outfit text-sm font-bold text-cyber-cyan transition hover:bg-cyber-cyan/20 disabled:opacity-50"
          >
            <Gauge className="h-4 w-4" aria-hidden />
            {pinging ? "Pinging..." : "Ping"}
          </button>
        </div>
        <p className="font-code text-3xl font-bold text-cyber-cyan">
          {pings[0] ? `${pings[0].ms}ms` : "—"}
          {pings[0] && !pings[0].ok && <span className="ml-2 text-sm text-cyber-crimson">upstream error</span>}
        </p>
        <div className="flex h-32 items-end gap-1.5 rounded-lg bg-[#020406] p-2" aria-label="Latency history" role="img">
          {pings.length === 0 && <span className="m-auto text-xs text-slate-600">กด Ping เพื่อวัดความหน่วง</span>}
          {[...pings].reverse().map((p, i) => (
            <div
              key={i}
              className={p.ok ? "flex-1 rounded-t bg-cyber-cyan/70" : "flex-1 rounded-t bg-cyber-crimson/70"}
              style={{ height: `${Math.max(6, (p.ms / max) * 100)}%` }}
              title={`${p.ms}ms`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
