import { NextResponse } from "next/server";

export const runtime = "edge";

const OPERATOR_USERNAME = "adminpayomboyz";

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function GET() {
  return NextResponse.json({
    remote_id: process.env.REMOTE_ANYDESK_ID || null,
    configured: Boolean(process.env.VAULT_MASTER_PIN),
  });
}

export async function POST(req: Request) {
  const masterPin = process.env.VAULT_MASTER_PIN;
  if (!masterPin) {
    return NextResponse.json({ error: "Vault ยังไม่ได้ตั้งค่า VAULT_MASTER_PIN" }, { status: 503 });
  }

  try {
    const { pin, username } = await req.json();

    if (username !== undefined && String(username).trim() !== OPERATOR_USERNAME) {
      return NextResponse.json({ error: "ชื่อผู้ใช้ไม่ถูกต้อง" }, { status: 401 });
    }

    if (!pin || !safeEqual(String(pin).trim(), masterPin)) {
      return NextResponse.json({ error: "รหัส 2FA PIN ไม่ถูกต้อง" }, { status: 401 });
    }

    const remoteId = process.env.REMOTE_ANYDESK_ID || "";
    return NextResponse.json(
      {
        success: true,
        remote_id: remoteId,
        remote_pass: process.env.REMOTE_ANYDESK_PASSWORD || "",
        direct_uri: `anydesk:${remoteId}`,
        authorized_to: "dj [Boss / Chief Architect]",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Access denied" }, { status: 400 });
  }
}
