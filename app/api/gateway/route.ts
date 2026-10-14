import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const key = process.env.OPENROUTER_API_KEY || "";
  const hint = key.length > 8 ? `${key.slice(0, 6)}…${key.slice(-4)}` : null;
  const ping = new URL(req.url).searchParams.get("ping") === "1";

  let upstreamMs: number | null = null;
  let upstreamOk = false;
  if (ping) {
    const started = Date.now();
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models", { method: "GET", cache: "no-store" });
      upstreamOk = res.ok;
    } catch {
      upstreamOk = false;
    }
    upstreamMs = Date.now() - started;
  }

  return NextResponse.json(
    { configured: Boolean(key), hint, upstreamMs, upstreamOk, provider: "OpenRouter", model: "deepseek/deepseek-chat" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
