"use client";

import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { WORKSPACE_ROOT, type WorkspaceFile } from "@/lib/hub-data";
import { FileList, ProjectFilter } from "./file-list";
import { Overlay } from "./primitives";

const PROJECT_DIRS: Record<string, string> = {
  all: WORKSPACE_ROOT,
  slayer2: `${WORKSPACE_ROOT}/Slayer2`,
  deobfuscate: `${WORKSPACE_ROOT}/Deobfuscate`,
  payomboyz_log: `${WORKSPACE_ROOT}/payomboyz_log-main`,
};

export function FileDrawer({
  open,
  onClose,
  onAnalyze,
}: {
  open: boolean;
  onClose: () => void;
  onAnalyze: (file: WorkspaceFile) => void;
}) {
  const [project, setProject] = useState("slayer2");

  return (
    <Overlay
      open={open}
      onClose={onClose}
      variant="sheet"
      labelledBy="file-drawer-title"
      title={
        <span className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-cyber-gold" aria-hidden />
          สำรวจไฟล์ในโปรเจกต์
        </span>
      }
    >
      <div className="space-y-3 p-4">
        <div className="rounded-lg border border-cyber-gold/25 bg-black/40 px-3 py-2">
          <p className="font-outfit text-[10px] font-bold uppercase tracking-widest text-cyber-gold/70">Active Directory</p>
          <p className="truncate font-code text-[13px] text-cyber-gold">{PROJECT_DIRS[project]}</p>
        </div>
        <ProjectFilter value={project} onChange={setProject} />
        <FileList project={project} onAnalyze={onAnalyze} />
      </div>
    </Overlay>
  );
}
