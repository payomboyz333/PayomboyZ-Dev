"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { PinForm } from "./anydesk-modal";
import { Overlay } from "./primitives";
import type { Vault } from "./use-vault";

export function LoginModal({ open, onClose, vault }: { open: boolean; onClose: () => void; vault: Vault }) {
  return (
    <Overlay
      open={open}
      onClose={onClose}
      tone="emerald"
      labelledBy="login-title"
      title={
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyber-emerald" aria-hidden />
          SuperAdmin 2FA Terminal
        </span>
      }
    >
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-3 rounded-xl border border-cyber-gold/30 bg-cyber-gold/[0.05] p-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-cyber-gold/50">
            <Image src="/images/mascot.png" alt="" fill sizes="56px" className="object-cover object-top" />
          </div>
          <div className="min-w-0">
            <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-cyber-gold/70">Authorized Operator</p>
            <p className="font-outfit text-sm font-bold text-cyber-gold">dj [Boss / Chief Architect]</p>
          </div>
        </div>
        <PinForm
          withUsername
          submitLabel="ยืนยันตัวตน"
          onUnlock={async (pin, username) => {
            const err = await vault.unlock(pin, username);
            if (!err) onClose();
            return err;
          }}
        />
      </div>
    </Overlay>
  );
}
