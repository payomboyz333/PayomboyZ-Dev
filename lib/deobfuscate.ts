export type DeobfStats = { hex: number; unicode: number; decimal: number; vars: number; concat: number };

export type DeobfResult = { output: string; stats: DeobfStats; passes: string[] };

// Control chars and quote/backslash must stay escaped so the output remains valid source.
function printable(code: number, original: string): string | null {
  if (Number.isNaN(code) || code < 32 || code === 127 || code > 0x10ffff) return null;
  const ch = String.fromCodePoint(code);
  if (ch === '"' || ch === "'" || ch === "\\") return original;
  return ch;
}

export function deobfuscate(source: string): DeobfResult {
  const stats: DeobfStats = { hex: 0, unicode: 0, decimal: 0, vars: 0, concat: 0 };

  let out = source.replace(/\\x([0-9a-fA-F]{2})/g, (match, hex: string) => {
    const decoded = printable(parseInt(hex, 16), match);
    if (decoded === null) return match;
    stats.hex++;
    return decoded;
  });

  out = out.replace(/\\u\{([0-9a-fA-F]{1,6})\}|\\u([0-9a-fA-F]{4})/g, (match, braced?: string, plain?: string) => {
    const decoded = printable(parseInt(braced ?? plain ?? "", 16), match);
    if (decoded === null) return match;
    stats.unicode++;
    return decoded;
  });

  out = out.replace(/\\(\d{1,3})/g, (match, dec: string) => {
    const decoded = printable(parseInt(dec, 10), match);
    if (decoded === null || parseInt(dec, 10) > 255) return match;
    stats.decimal++;
    return decoded;
  });

  const concatPattern = /"([^"\\\n]*)"\s*\.\.\s*"([^"\\\n]*)"/;
  while (concatPattern.test(out)) {
    out = out.replace(concatPattern, (_m, a: string, b: string) => `"${a}${b}"`);
    stats.concat++;
  }

  const renames = new Map<string, string>();
  out = out.replace(/\b_0x[0-9a-fA-F]+\b/g, (name) => {
    if (!renames.has(name)) renames.set(name, `var_${renames.size + 1}`);
    return renames.get(name)!;
  });
  stats.vars = renames.size;

  const passes = [
    `Pass 1 · Hex \\xNN → ${stats.hex} chars`,
    `Pass 2 · Unicode \\uNNNN → ${stats.unicode} chars`,
    `Pass 3 · Decimal \\NNN → ${stats.decimal} chars`,
    `Pass 4 · String concat fold → ${stats.concat} merges`,
    `Pass 5 · _0x identifiers → ${stats.vars} renamed`,
  ];

  return { output: out, stats, passes };
}

export const SAMPLE_OBFUSCATED = `local _0x1a = { "\\x50\\x61\\x79\\x6f\\x6d\\x62\\x6f\\x79\\x5a", "\\u0041\\u0075\\u0074\\u006f" .. "\\045\\068\\111\\100\\103\\101" }
local function _0x2b(_0x3c)
    return _0x1a[_0x3c]
end
local _0x4d = _0x2b(1) .. " :: " .. _0x2b(2)
print(_0x4d)`;
