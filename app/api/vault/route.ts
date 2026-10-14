import { NextResponse } from "next/server";

export const runtime = "edge";

const MASTER_PIN = process.env.VAULT_MASTER_PIN || "280342";
const ANYDESK_ID = process.env.REMOTE_ANYDESK_ID || "1216968584";
const ANYDESK_PASS = process.env.REMOTE_ANYDESK_PASSWORD || "";

export async function POST(req: Request) {
  try {
    const { pin } = await req.json();

    if (!pin || String(pin).trim() !== MASTER_PIN) {
      return NextResponse.json(
        { error: "Invalid 2FA PIN. Access to remote terminal denied." },
        { status: 401 }
      );
    }

    // 🛡️ SECURE VAULT UNLOCKED ONLY AFTER 2FA VERIFICATION
    return NextResponse.json({
      success: true,
      remote_id: ANYDESK_ID,
      remote_pass: ANYDESK_PASS,
      unattended: true,
      status: "connected",
      direct_uri: `anydesk:${ANYDESK_ID}`,
      authorized_to: "dj [SuperAdmin]",
    });
  } catch (e: any) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
}
