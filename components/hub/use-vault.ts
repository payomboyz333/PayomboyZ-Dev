"use client";

import { useCallback, useState } from "react";
import useSWR from "swr";

export type VaultCreds = { remoteId: string; remotePass: string; authorizedTo: string };

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useVault() {
  const [creds, setCreds] = useState<VaultCreds | null>(null);
  const { data: publicInfo } = useSWR<{ remote_id: string | null; configured: boolean }>("/api/vault", fetcher, {
    revalidateOnFocus: false,
  });

  const unlock = useCallback(async (pin: string, username?: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, username }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return data.error || "ยืนยันตัวตนไม่สำเร็จ";
      setCreds({ remoteId: data.remote_id, remotePass: data.remote_pass, authorizedTo: data.authorized_to });
      return null;
    } catch {
      return "เชื่อมต่อ Vault ไม่สำเร็จ";
    }
  }, []);

  const lock = useCallback(() => setCreds(null), []);

  return {
    creds,
    unlock,
    lock,
    publicId: creds?.remoteId || publicInfo?.remote_id || null,
    configured: publicInfo?.configured ?? true,
  };
}

export type Vault = ReturnType<typeof useVault>;
