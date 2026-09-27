"use client";

import React from "react";
import { ShieldCheck, Zap, Smartphone, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/50 backdrop-blur-xs py-10 dark:border-slate-800/80 dark:bg-slate-900/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Value propositions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
          <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Privacy 100% Client-Side
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Le tue immagini non lasciano mai il browser né vengono inviate a server remoti.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Massima Risoluzione
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                I file PNG vengono incorporati direttamente a risoluzione nativa senza perdita di qualità.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Ottimizzato Touch & Vercel
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Controlli a tocco dedicati per smartphone e architettura pronta al deploy su Vercel.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} PNG to PDF Pro. Sviluppato con Next.js, Tailwind CSS e pdf-lib.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Vercel Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
