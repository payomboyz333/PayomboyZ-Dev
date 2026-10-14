import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#030608",
          900: "#05080A",
          800: "#080D14",
          700: "#0F172A",
          600: "#1E293B",
        },
        cyber: {
          emerald: "#00FF66",
          mint: "#00FF66",
          gold: "#FFD700",
          cyan: "#00F0FF",
          purple: "#BD93F9",
          crimson: "#FF1744",
          amber: "#FFB86C",
        },
      },
      fontFamily: {
        kanit: ["var(--font-kanit)", "var(--font-jp)", "sans-serif"],
        outfit: ["var(--font-outfit)", "var(--font-kanit)", "var(--font-jp)", "sans-serif"],
        code: ["var(--font-jetbrains)", "var(--font-kanit)", "var(--font-jp)", "monospace"],
      },
      boxShadow: {
        "neon-green": "0 0 25px rgba(0, 255, 102, 0.35)",
        "neon-gold": "0 0 25px rgba(255, 215, 0, 0.35)",
        "neon-cyan": "0 0 25px rgba(0, 240, 255, 0.35)",
        "neon-purple": "0 0 25px rgba(189, 147, 249, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
