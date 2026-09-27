"use client";

import React from "react";
import { Sparkles, ExternalLink, Flame, ShieldCheck, Zap } from "lucide-react";

interface PromoBannerProps {
  variant?: "banner" | "card";
}

export function PromoBanner({ variant = "banner" }: PromoBannerProps) {
  if (variant === "card") {
    return (
      <aside aria-label="Sponsored deal" className="relative overflow-hidden rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-500/10 via-indigo-500/10 to-purple-500/10 p-5 shadow-lg shadow-amber-500/5 backdrop-blur-xs dark:border-amber-500/30 dark:from-amber-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-md shadow-amber-500/25">
              <Flame className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  SPONSORED DEAL
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  €10 ONLY
                </span>
              </div>
              <h4 className="mt-1 text-base font-extrabold text-slate-900 dark:text-white sm:text-lg">
                Google Gemini Pro — 18 Months for only €10
              </h4>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                Unlock 1.5/2.0 Pro models, unlimited reasoning, and premium AI features at 95% off on <strong>zwch.store</strong>.
              </p>
            </div>
          </div>

          <a
            href="https://zwch.store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-amber-500/20 transition-all hover:scale-105 hover:shadow-lg active:scale-95 sm:text-sm shrink-0"
          >
            <span>Get Gemini Pro for €10</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="Sponsored announcement" className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 px-4 py-3 text-white shadow-md">
      <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow-xs">
            🔥
          </span>
          <p className="text-xs sm:text-sm text-slate-100">
            <span className="font-bold text-amber-300">Special Offer:</span> Get{" "}
            <strong>Google Gemini Pro (18 Months)</strong> for just{" "}
            <span className="inline-block rounded-md bg-amber-400/20 px-1.5 py-0.5 font-extrabold text-amber-300 border border-amber-300/30">
              €10
            </span>{" "}
            on zwch.store!
          </p>
        </div>

        <a
          href="https://zwch.store"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-xs transition-transform hover:scale-105 active:scale-95 shrink-0"
        >
          <span>Claim Deal</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  );
}
