"use client";

import React from "react";
import { ShieldCheck, Zap, Smartphone, Sparkles, ExternalLink, Flame } from "lucide-react";

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
                100% Client-Side Privacy
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your images never leave your browser. Zero uploads to external servers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Maximum Resolution
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                PNG raw bytes are directly embedded at native pixel resolution without downscaling.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs dark:border-slate-800/80 dark:bg-slate-900/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Touch &amp; Mobile Optimized
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Dedicated touch controls for smartphones and fluid drag-and-drop support.
              </p>
            </div>
          </div>
        </div>

        {/* Sponsor Banner Card */}
        <div className="mb-8 rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-purple-500/10 p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Partner Deal: Google Gemini Pro 18 Months for only €10
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Premium AI access available directly on zwch.store with instant activation.
              </p>
            </div>
          </div>

          <a
            href="https://zwch.store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-xs hover:bg-amber-400 transition-colors shrink-0"
          >
            <span>Visit zwch.store</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} Fixpu PNG2PDF. Built with Next.js, Tailwind CSS, and pdf-lib.
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
