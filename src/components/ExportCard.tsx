"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Download,
  FileCheck,
  Loader2,
  Settings2,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Flame,
} from "lucide-react";
import {
  ImageItem,
  MarginMode,
  PageSizeMode,
  PdfGenerationOptions,
  ProgressCallbackData,
} from "@/types";
import { generatePdf, downloadPdfBlob } from "@/lib/pdf-generator";
import { formatBytes } from "@/lib/utils";

interface ExportCardProps {
  images: ImageItem[];
}

export function ExportCard({ images }: ExportCardProps) {
  const [fileName, setFileName] = useState("fixpu_merged_document");
  const [pageSize, setPageSize] = useState<PageSizeMode>("original");
  const [margin, setMargin] = useState<MarginMode>("none");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<ProgressCallbackData | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalBytes = images.reduce((acc, curr) => acc + curr.size, 0);

  const handleGenerate = async () => {
    if (images.length === 0 || isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setDownloadSuccess(false);

    try {
      const options: PdfGenerationOptions = {
        fileName,
        pageSize,
        margin,
      };

      const result = await generatePdf(images, options, (data) => {
        setProgress(data);
      });

      // Trigger file download directly in browser
      downloadPdfBlob(result.blob, result.fileName);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Confetti non-fatal
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 6000);
    } catch (err: unknown) {
      console.error("PDF generation error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred while building the PDF."
      );
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-7">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Settings2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                PDF Options &amp; Download
              </h3>
              <p className="text-xs text-slate-400">
                Customize format, margins, and document name
              </p>
            </div>
          </div>

          <span className="hidden sm:flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            Client-Side Zero Lag
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* File Name Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              PDF File Name
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="e.g. fixpu_document"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-14 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:border-indigo-400"
              />
              <span className="absolute right-3.5 text-xs font-bold text-slate-400 select-none">
                .pdf
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Will be saved to your device with this file name.
            </p>
          </div>

          {/* Page Sizing Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Page Sizing
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSizeMode)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:border-indigo-400"
            >
              <option value="original">
                🌟 Original 1:1 PNG Resolution (Recommended)
              </option>
              <option value="a4-auto">📄 Standard A4 (Adaptive)</option>
              <option value="a4-portrait">📄 Standard A4 Portrait</option>
              <option value="a4-landscape">📄 Standard A4 Landscape</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              {pageSize === "original"
                ? "Each PDF page matches the exact native pixel dimensions of your PNG."
                : "Image is centered on a standard A4 page preserving aspect ratio."}
            </p>
          </div>
        </div>

        {/* Margin selection if A4 */}
        {pageSize !== "original" && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Page Margins (A4)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "none", label: "None (0 mm)" },
                { id: "small", label: "Tight (5 mm)" },
                { id: "normal", label: "Standard (10 mm)" },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMargin(m.id as MarginMode)}
                  className={`rounded-xl border py-2 px-3 text-xs font-medium transition-all ${
                    margin === m.id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress display */}
        {isGenerating && progress && (
          <div className="mt-5 rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/50 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                {progress.statusText}
              </span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-indigo-200/60 dark:bg-indigo-900/80">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-200"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Error state */}
        {errorMessage && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3.5 text-xs text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Success notification */}
        {downloadSuccess && (
          <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>PDF generated and downloaded directly to your device!</span>
          </div>
        )}

        {/* Big Main CTA Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={images.length === 0 || isGenerating}
            className="relative group w-full flex-1 flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating PDF in browser...</span>
              </>
            ) : (
              <>
                <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                <span>Generate &amp; Download PDF</span>
                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
                  {images.length} {images.length === 1 ? "page" : "pages"}
                </span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>
            Estimated total: ~{formatBytes(totalBytes)} • 100% processed in browser
          </span>
        </div>
      </div>

      {/* Sponsored Ad Banner for zwch.store */}
      <aside aria-label="Sponsored deal" className="overflow-hidden rounded-2xl border border-amber-300/70 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-indigo-500/10 p-4 text-slate-900 dark:border-amber-500/30 dark:from-amber-950/20 dark:to-indigo-950/20 dark:text-slate-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Exclusive Deal • zwch.store
              </p>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Google Gemini Pro (18 Months) for only €10!
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Get full access to Google Gemini Advanced / Pro models at an unbeatable price.
              </p>
            </div>
          </div>

          <a
            href="https://zwch.store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Buy on zwch.store (€10)</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </aside>
    </div>
  );
}
