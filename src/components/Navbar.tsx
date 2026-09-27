"use client";

import React from "react";
import { FileText, ShieldCheck, Sparkles, Zap } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                PNG<span className="text-indigo-600 dark:text-indigo-400">2</span>PDF
              </span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block">
              Client-Side Fast Converter
            </p>
          </div>
        </div>

        {/* Badges / Status */}
        <div className="flex items-center gap-2">
          <div
            title="Tutte le immagini vengono elaborate esclusivamente sul tuo dispositivo. Nessun dato viene caricato su server esterni."
            className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50 cursor-help transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">100% Privacy Locale</span>
            <span className="sm:hidden">Locale</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>Qualità Originale Lossless</span>
          </div>
        </div>
      </div>
    </header>
  );
}
