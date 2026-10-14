export type HubTab = "chat" | "office" | "lab";

export type ToolCall = {
  name: string;
  target: string;
  args: Record<string, unknown>;
  output: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
};

export type WorkspaceFile = {
  name: string;
  path: string;
  is_dir: boolean;
  size_kb: number;
  project: string;
};

export const WORKSPACE_ROOT = "c:/Users/PayomboyZ/Desktop/Games";

export const fullPath = (file: Pick<WorkspaceFile, "path">) => `${WORKSPACE_ROOT}/${file.path}`;

export const analyzePrompt = (file: Pick<WorkspaceFile, "path">) =>
  `ช่วยตรวจสอบและวิเคราะห์โค้ดในไฟล์: ${fullPath(file)}\n`;

export const PROJECTS = [
  { id: "all", label: "ทั้งหมด" },
  { id: "slayer2", label: "Slayer2" },
  { id: "deobfuscate", label: "Deobfuscate" },
  { id: "payomboyz_log", label: "PBZ Log" },
] as const;

export const SLASH_COMMANDS = [
  { cmd: "/goal", label: "สั่งงานระยะยาว", desc: "มอบหมายเป้าหมายใหญ่ ให้ AI ทำต่อเนื่องจนจบ" },
  { cmd: "/plan", label: "วางแผนเป็นสเต็ป", desc: "แตกงานเป็นขั้นตอนก่อนลงมือแก้โค้ด" },
  { cmd: "/grill-me", label: "สัมภาษณ์เชิงลึก", desc: "ให้ AI ถามคำถามจนเข้าใจโจทย์ครบ" },
  { cmd: "/learn", label: "บันทึกจำ", desc: "บันทึกความรู้/กฎลงหน่วยความจำถาวร" },
] as const;

export const ANYDESK_PUBLIC_ID = "1216968584";

export const nowTime = () =>
  new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false });

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "user",
    timestamp: "14:45",
    content:
      "ช่วยตรวจระบบ Auto-Dodge ใน Slayer2 ให้ที ดูว่าทำไมเวลาบอสเฟ้นต์แล้วเราแดชผิดจังหวะ",
  },
  {
    id: "init-2",
    role: "assistant",
    timestamp: "14:46",
    toolCalls: [
      {
        name: "view_file",
        target: "auto dodge (1).lua",
        args: { path: "Slayer2/auto dodge (1).lua", lines: "2200-2450" },
        output:
          "2231 | local FeintWindow = 0.20\n2232 | local AntiFeintDelay = 0.00\n2240 | if anim.Name:match(\"Feint\") then\n2241 |     Dash() -- fires on first frame\n2242 | end",
      },
      {
        name: "replace_file_content",
        target: "auto dodge (1).lua",
        args: { path: "Slayer2/auto dodge (1).lua", feint_window: 0.35, anti_feint_delay: 0.08 },
        output: "- local FeintWindow = 0.20\n+ local FeintWindow = 0.35\n- local AntiFeintDelay = 0.00\n+ local AntiFeintDelay = 0.08\n✓ 2 hunks applied",
      },
    ],
    content: `## ตรวจพบจุดบกพร่อง 2 จุด

1. **FeintWindow คลาดเคลื่อน:** อนิเมชั่นหลอกของบอสกินเวลา \`0.35s\` แต่ค่าเดิมตั้งไว้ \`0.20s\` ตัวละครจึงแดชตั้งแต่เฟรมแรก และติด Cooldown ตอนบอสฟาดจริง
2. **ไม่มีหน่วงกันเฟ้นต์:** \`AntiFeintDelay\` เป็น 0 ทำให้ไม่มีเวลายืนยันท่าจริง

แพตช์ที่ใช้:

\`\`\`lua
local Config = {
    MaxDistance    = 14,
    AntiFeintDelay = 0.08,
    FeintWindow    = 0.35,
    Mode           = "FeintOnly",
}
\`\`\`

เปิดแท็บ **แล็บวิจัย** เพื่อจูนค่าและทดสอบคอมแบทได้ทันทีครับ`,
  },
];

export type Department = {
  id: string;
  name: string;
  jp: string;
  accent: "gold" | "emerald" | "cyan" | "crimson";
  cats: { name: string; role: string; status: "busy" | "idle" | "away" }[];
  hasMasterPc?: boolean;
};

export const DEPARTMENTS: Department[] = [
  {
    id: "ceo",
    name: "CEO Master Suite",
    jp: "社長室",
    accent: "gold",
    hasMasterPc: true,
    cats: [
      { name: "Chief Kuro", role: "CEO", status: "busy" },
      { name: "Mahi68", role: "Chief Architect AI", status: "busy" },
    ],
  },
  {
    id: "ast",
    name: "Deobfuscate & AST Pillar",
    jp: "解読柱",
    accent: "emerald",
    cats: [
      { name: "Hexa", role: "Hex Decoder", status: "busy" },
      { name: "Tokyo", role: "AST Walker", status: "busy" },
      { name: "Mochi", role: "Constant Folder", status: "idle" },
      { name: "Sora", role: "Var Renamer", status: "busy" },
      { name: "Yuzu", role: "Bytecode Reader", status: "away" },
    ],
  },
  {
    id: "bypass",
    name: "Bypass & Metamethod",
    jp: "回避室",
    accent: "cyan",
    cats: [
      { name: "Neko", role: "Namecall Watcher", status: "busy" },
      { name: "Kage", role: "Hook Auditor", status: "idle" },
      { name: "Ren", role: "Remote Mapper", status: "busy" },
      { name: "Kiri", role: "Sandbox Tester", status: "idle" },
    ],
  },
  {
    id: "rea",
    name: "Reverse Engineering Lab",
    jp: "逆工学",
    accent: "crimson",
    cats: [
      { name: "Akuma", role: "Lead REA", status: "busy" },
      { name: "Bit", role: "Disassembler", status: "busy" },
      { name: "Nori", role: "Packet Analyst", status: "idle" },
      { name: "Zero", role: "Diff Hunter", status: "busy" },
      { name: "Hana", role: "Doc Writer", status: "away" },
    ],
  },
  {
    id: "arena",
    name: "Retro Arena & Slayer2 Gym",
    jp: "闘技場",
    accent: "emerald",
    cats: [
      { name: "Raiden", role: "Combat Tester", status: "busy" },
      { name: "Kenji", role: "Dodge Tuner", status: "busy" },
      { name: "Pixel", role: "Frame Counter", status: "idle" },
      { name: "Boss", role: "Sparring Dummy", status: "busy" },
      { name: "Taro", role: "QA Runner", status: "idle" },
    ],
  },
  {
    id: "lounge",
    name: "Coffee Lounge & Cat Condo",
    jp: "休憩所",
    accent: "gold",
    cats: [
      { name: "Latte", role: "Barista", status: "idle" },
      { name: "Kumo", role: "Nap Specialist", status: "away" },
      { name: "Uni", role: "Aquarium Keeper", status: "idle" },
      { name: "Miso", role: "Morale Officer", status: "idle" },
      { name: "Tama", role: "Intern", status: "away" },
      { name: "Koi", role: "Fish Watcher", status: "idle" },
    ],
  },
];
