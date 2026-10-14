import { NextResponse } from "next/server";

export const runtime = "edge";

// 🛡️ SANITIZED & VIRTUALIZED WORKSPACE PATHS (NEVER LEAK HOST USERNAME OR ABSOLUTE DRIVE LETTERS)
const VIRTUAL_WORKSPACE_FILES = [
  { name: "auto dodge (1).lua", path: "Slayer2/auto dodge (1).lua", is_dir: false, size_kb: 215.4, project: "slayer2" },
  { name: "S2Dungeon65.lua", path: "Slayer2/S2Dungeon65.lua", is_dir: false, size_kb: 48.2, project: "slayer2" },
  { name: "slayer2.luau", path: "Slayer2/slayer2.luau", is_dir: false, size_kb: 89.1, project: "slayer2" },
  { name: "auto_dodge_config.lua", path: "Slayer2/auto_dodge_config.lua", is_dir: false, size_kb: 4.8, project: "slayer2" },
  { name: "godmode_server.py", path: "Deobfuscate/godmode_server.py", is_dir: false, size_kb: 36.7, project: "deobfuscate" },
  { name: "templates/office_ui.html", path: "Deobfuscate/templates/office_ui.html", is_dir: false, size_kb: 178.5, project: "deobfuscate" },
  { name: "universal_deobfuscator.py", path: "Deobfuscate/universal_deobfuscator.py", is_dir: false, size_kb: 81.1, project: "deobfuscate" },
  { name: "pbg_memory.py", path: "Deobfuscate/pbg_memory.py", is_dir: false, size_kb: 11.9, project: "deobfuscate" },
  { name: "lib/game-collectors.ts", path: "payomboyz_log-main/lib/game-collectors.ts", is_dir: false, size_kb: 14.2, project: "payomboyz_log" },
  { name: "lib/script-template.ts", path: "payomboyz_log-main/lib/script-template.ts", is_dir: false, size_kb: 22.8, project: "payomboyz_log" },
];

export async function POST(req: Request) {
  try {
    const { project } = await req.json();
    const filtered = VIRTUAL_WORKSPACE_FILES.filter(
      (f) => !project || f.project === project || project === "all"
    );
    return NextResponse.json({
      project: project || "slayer2",
      files: filtered.length > 0 ? filtered : VIRTUAL_WORKSPACE_FILES,
      total: filtered.length,
      mode: "virtualized_secure",
    });
  } catch (e: any) {
    return NextResponse.json({ files: VIRTUAL_WORKSPACE_FILES, total: VIRTUAL_WORKSPACE_FILES.length });
  }
}
