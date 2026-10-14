export type CombatConfig = {
  maxDistance: number;
  antiFeintDelay: number;
  feintWindow: number;
};

export type AttackKind = "slash" | "feint" | "slam";

export type CombatLog = {
  id: string;
  time: string;
  attack: AttackKind;
  text: string;
  ms: number | null;
  ok: boolean;
};

export const PRESETS: { id: string; label: string; config: CombatConfig }[] = [
  { id: "pve", label: "Aggressive PvE", config: { maxDistance: 22, antiFeintDelay: 0.04, feintWindow: 0.3 } },
  { id: "pvp", label: "Stealth PvP", config: { maxDistance: 12, antiFeintDelay: 0.12, feintWindow: 0.48 } },
  { id: "dungeon", label: "Safe Dungeon 65", config: { maxDistance: 14, antiFeintDelay: 0.08, feintWindow: 0.35 } },
  { id: "farm", label: "Max Range Farm", config: { maxDistance: 30, antiFeintDelay: 0.02, feintWindow: 0.22 } },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const stamp = () => new Date().toLocaleTimeString("th-TH", { hour12: false });

export function simulateAttack(attack: AttackKind, cfg: CombatConfig): CombatLog {
  const base = { id: `${Date.now()}-${Math.random()}`, time: stamp(), attack };

  if (attack === "slash") {
    const distance = rand(6, 26);
    if (distance > cfg.maxDistance) {
      return {
        ...base,
        ms: null,
        ok: false,
        text: `Slash ที่ระยะ ${distance.toFixed(1)} studs เกิน MaxDistance (${cfg.maxDistance}) → ไม่ตอบสนอง`,
      };
    }
    const ms = Math.round(28 + cfg.antiFeintDelay * 500 + rand(0, 16));
    return { ...base, ms, ok: ms < 120, text: `Slash ที่ ${distance.toFixed(1)} studs → Side-Roll (${ms}ms)` };
  }

  if (attack === "feint") {
    const feintDuration = rand(0.22, 0.55);
    const held = cfg.feintWindow >= feintDuration;
    const ms = Math.round(cfg.antiFeintDelay * 1000 + feintDuration * 1000);
    return held
      ? { ...base, ms, ok: true, text: `Feint ${feintDuration.toFixed(2)}s อยู่ใน FeintWindow → กดค้างไม่แดช, รอท่าจริง (${ms}ms)` }
      : {
          ...base,
          ms,
          ok: false,
          text: `Feint ${feintDuration.toFixed(2)}s ยาวกว่า FeintWindow ${cfg.feintWindow.toFixed(2)}s → แดชหลอก ติด Cooldown`,
        };
  }

  const aoeRadius = 18;
  const ms = Math.round(cfg.antiFeintDelay * 1000 + 46 + rand(0, 30));
  const inTime = ms < 170;
  const covered = cfg.maxDistance >= aoeRadius;
  return {
    ...base,
    ms,
    ok: inTime && covered,
    text: !covered
      ? `Boss Slam AoE ${aoeRadius} studs แต่ MaxDistance ${cfg.maxDistance} → ตรวจจับช้า โดนเต็มๆ`
      : inTime
        ? `Boss Slam AoE ${aoeRadius} studs → I-Frame Dash ทัน (${ms}ms)`
        : `Boss Slam → ตอบสนองช้า (${ms}ms) เกิน 170ms`,
  };
}

export function toLuaConfig(cfg: CombatConfig) {
  return `local Config = {
    MaxDistance    = ${cfg.maxDistance},
    AntiFeintDelay = ${cfg.antiFeintDelay.toFixed(2)},
    FeintWindow    = ${cfg.feintWindow.toFixed(2)},
}

return Config`;
}
