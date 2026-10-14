import type { Metadata, Viewport } from "next";
import { Kanit, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "PAYOMBOYZ HUB // AI SCRIPT STUDIO (27 Cats HQ)",
  description: "Japanese Cyber-Anime AI Script Studio & Engineering Workbench for Roblox Exploit Systems & Deobfuscation",
  keywords: ["PayomboyZ", "AI Script Studio", "Antigravity", "Slayer2", "Auto-Dodge", "Deobfuscator"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#05080A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${kanit.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <body className="bg-obsidian-900 text-slate-100 font-kanit min-h-screen flex flex-col antialiased selection:bg-cyber-emerald selection:text-black">
        {children}
      </body>
    </html>
  );
}
