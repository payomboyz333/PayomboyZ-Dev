"use client";

import useSWR from "swr";
import { Eye, FileCode2, FileType2, ScrollText } from "lucide-react";
import { fullPath, PROJECTS, type WorkspaceFile } from "@/lib/hub-data";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useWorkspaceFiles(project: string) {
  const { data, isLoading, error } = useSWR<{ files: WorkspaceFile[] }>(
    `/api/files?project=${encodeURIComponent(project)}`,
    fetcher,
    { revalidateOnFocus: false },
  );
  return { files: data?.files ?? [], isLoading, error };
}

function FileIcon({ name }: { name: string }) {
  if (/\.luau?$/.test(name)) return <ScrollText className="h-5 w-5 text-cyber-emerald drop-shadow-[0_0_6px_#00FF66]" aria-hidden />;
  if (name.endsWith(".py")) return <FileCode2 className="h-5 w-5 text-cyber-cyan drop-shadow-[0_0_6px_#00F0FF]" aria-hidden />;
  return <FileType2 className="h-5 w-5 text-slate-400" aria-hidden />;
}

export function ProjectFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="no-scrollbar flex gap-1.5 overflow-x-auto" role="tablist" aria-label="เลือกโปรเจกต์">
      {PROJECTS.map((p) => (
        <button
          key={p.id}
          role="tab"
          aria-selected={value === p.id}
          type="button"
          onClick={() => onChange(p.id)}
          className={cn(
            "shrink-0 rounded-md px-2.5 py-1 font-outfit text-xs font-semibold transition",
            value === p.id ? "bg-cyber-gold text-black" : "bg-white/5 text-slate-400 hover:text-slate-100",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function FileList({
  project,
  onAnalyze,
  dense = false,
}: {
  project: string;
  onAnalyze: (file: WorkspaceFile) => void;
  dense?: boolean;
}) {
  const { files, isLoading, error } = useWorkspaceFiles(project);

  if (error) return <p className="p-3 text-sm text-cyber-crimson">โหลดรายการไฟล์ไม่สำเร็จ</p>;
  if (isLoading)
    return (
      <ul className="space-y-2" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
        ))}
      </ul>
    );

  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li
          key={file.path}
          className={cn(
            "group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] transition hover:border-cyber-gold/40",
            dense ? "p-2" : "p-3",
          )}
        >
          <FileIcon name={file.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-code text-[13px] font-semibold text-slate-100">{file.name}</p>
            <p className="truncate font-code text-[11px] text-slate-500" title={fullPath(file)}>
              {dense ? file.path : fullPath(file)} · {file.size_kb.toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAnalyze(file)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-md border border-cyber-emerald/40 bg-cyber-emerald/10 font-outfit text-xs font-semibold text-cyber-emerald transition hover:bg-cyber-emerald hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-emerald",
              dense ? "h-8 w-8 justify-center" : "h-9 px-2.5",
            )}
            aria-label={`สั่ง AI วิเคราะห์ ${file.name}`}
          >
            <Eye className="h-4 w-4" aria-hidden />
            {!dense && <span>สั่ง AI วิเคราะห์</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}
