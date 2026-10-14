"use client";

import { useState } from "react";
import { Eye, EyeOff, KeyRound, Monitor, Rocket } from "lucide-react";
import { CopyButton, Overlay } from "./primitives";
import type { Vault } from "./use-vault";

export function PinForm({
  onUnlock,
  submitLabel,
  withUsername = false,
}: {
  onUnlock: (pin: string, username?: string) => Promise<string | null>;
  submitLabel: string;
  withUsername?: boolean;
}) {
  const [username, setUsername] = useState("adminpayomboyz");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(await onUnlock(pin, withUsername ? username : undefined));
        setPending(false);
      }}
    >
      {withUsername && (
        <div className="space-y-1.5">
          <label htmlFor="op-username" className="font-outfit text-xs font-semibold text-slate-400">
            Username
          </label>
          <input
            id="op-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="h-11 w-full rounded-lg border border-white/10 bg-black/50 px-3 font-code text-[15px] text-slate-50 focus:border-cyber-emerald focus:outline-none"
          />
        </div>
      )}
      <div className="space-y-1.5">
        <label htmlFor={withUsername ? "op-pin" : "vault-pin"} className="font-outfit text-xs font-semibold text-slate-400">
          2FA PIN
        </label>
        <input
          id={withUsername ? "op-pin" : "vault-pin"}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus
          placeholder="••••••"
          className="h-12 w-full rounded-lg border border-white/10 bg-black/50 px-3 text-center font-code text-xl tracking-[0.5em] text-cyber-emerald placeholder:text-slate-600 focus:border-cyber-emerald focus:outline-none"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-md border border-cyber-crimson/40 bg-cyber-crimson/10 px-3 py-2 text-sm text-cyber-crimson">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pin.length < 4 || pending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cyber-emerald font-outfit text-sm font-bold text-black shadow-neon-green transition hover:brightness-110 disabled:bg-obsidian-600 disabled:text-slate-500 disabled:shadow-none"
      >
        <KeyRound className="h-4 w-4" aria-hidden />
        {pending ? "กำลังตรวจสอบ..." : submitLabel}
      </button>
    </form>
  );
}

export function AnydeskModal({ open, onClose, vault }: { open: boolean; onClose: () => void; vault: Vault }) {
  const [showPass, setShowPass] = useState(false);
  const creds = vault.creds;

  return (
    <Overlay
      open={open}
      onClose={onClose}
      tone="cyan"
      labelledBy="anydesk-title"
      title={
        <span className="flex items-center gap-2">
          <Monitor className="h-5 w-5 text-cyber-cyan" aria-hidden />
          AnyDesk Master Remote
        </span>
      }
    >
      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-cyber-cyan/30 bg-black/50 p-4">
          <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-cyber-cyan/70">Remote Address</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="font-code text-2xl font-bold tracking-wider text-cyber-cyan">{vault.publicId ?? "—"}</p>
            {vault.publicId && <CopyButton text={vault.publicId} />}
          </div>
        </div>

        {creds ? (
          <>
            <div className="rounded-xl border border-cyber-gold/30 bg-black/50 p-4">
              <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-cyber-gold/70">Password</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="min-w-0 truncate font-code text-lg text-cyber-gold">
                  {creds.remotePass ? (showPass ? creds.remotePass : "•".repeat(12)) : "ไม่ได้ตั้งค่า"}
                </p>
                {creds.remotePass && (
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-slate-300 hover:text-cyber-gold"
                      aria-label={showPass ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                    </button>
                    <CopyButton text={creds.remotePass} />
                  </div>
                )}
              </div>
            </div>
            <a
              href={`anydesk:${creds.remoteId}`}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyber-cyan font-outfit text-sm font-bold text-black shadow-neon-cyan transition hover:brightness-110"
            >
              <Rocket className="h-4 w-4" aria-hidden />
              เปิด AnyDesk บนเครื่อง
            </a>
            <p className="text-center text-xs text-slate-500">Authorized: {creds.authorizedTo}</p>
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-slate-400">
              รหัสผ่านถูกเก็บไว้ฝั่งเซิร์ฟเวอร์ กรอก 2FA PIN เพื่อปลดล็อกการเข้าถึงเครื่องหลัก
            </p>
            <PinForm onUnlock={(pin) => vault.unlock(pin)} submitLabel="ปลดล็อก Vault" />
          </div>
        )}
      </div>
    </Overlay>
  );
}
