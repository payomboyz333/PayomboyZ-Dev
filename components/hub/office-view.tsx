"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Cat, Monitor } from "lucide-react";
import { DEPARTMENTS, type Department } from "@/lib/hub-data";
import { cn } from "@/lib/utils";

const ACCENT: Record<Department["accent"], { border: string; text: string; bg: string }> = {
  gold: { border: "border-cyber-gold/40", text: "text-cyber-gold", bg: "bg-cyber-gold/10" },
  emerald: { border: "border-cyber-emerald/40", text: "text-cyber-emerald", bg: "bg-cyber-emerald/10" },
  cyan: { border: "border-cyber-cyan/40", text: "text-cyber-cyan", bg: "bg-cyber-cyan/10" },
  crimson: { border: "border-cyber-crimson/40", text: "text-cyber-crimson", bg: "bg-cyber-crimson/10" },
};

const STATUS = {
  busy: "bg-cyber-emerald",
  idle: "bg-cyber-gold",
  away: "bg-slate-500",
};

const totalCats = DEPARTMENTS.reduce((n, d) => n + d.cats.length, 0);

function DepartmentRoom({ dept, index, onMasterPc }: { dept: Department; index: number; onMasterPc: () => void }) {
  
