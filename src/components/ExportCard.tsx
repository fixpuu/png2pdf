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
  FileText,
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
  const [fileName, setFileName] = useState("documento_unito");
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
      console.error("Errore generazione PDF:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Si è verificato un errore durante la creazione del PDF."
      );
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-7">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Settings2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Opzioni e Download PDF
            </h3>
            <p className="text-xs text-slate-400">
              Personalizza il formato del documento finale
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
            Nome del File PDF
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="es. scansione_documenti"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pr-14 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:border-indigo-400"
            />
            <span className="absolute right-3.5 text-xs font-bold text-slate-400 select-none">
              .pdf
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Verrà salvato sul tuo dispositivo con questo nome.
          </p>
        </div>

        {/* Page Sizing Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Formato Pagina
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSizeMode)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-100 dark:focus:border-indigo-400"
          >
            <option value="original">
              🌟 Risoluzione Originale PNG 1:1 (Consigliata)
            </option>
            <option value="a4-auto">📄 Standard A4 (Adattivo Automatico)</option>
            <option value="a4-portrait">📄 Standard A4 Verticale</option>
            <option value="a4-landscape">📄 Standard A4 Orizzontale</option>
          </select>
          <p className="mt-1 text-[11px] text-slate-400">
            {pageSize === "original"
              ? "Ciascuna pagina del PDF adotta le dimensioni esatte dell'immagine senza scalare."
              : "L'immagine viene posizionata centrata su foglio standard A4."}
          </p>
        </div>
      </div>

      {/* Margin selection if A4 */}
      {pageSize !== "original" && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Margini di Pagina (A4)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "none", label: "Nessuno (0 mm)" },
              { id: "small", label: "Stretto (5 mm)" },
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
          <span>PDF generato e scaricato con successo sul tuo dispositivo!</span>
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
              <span>Creazione PDF in corso...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
              <span>Genera e Scarica PDF</span>
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
                {images.length} {images.length === 1 ? "pag." : "pagg."}
              </span>
            </>
          )}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>
          Totale stimato: ~{formatBytes(totalBytes)} • Elaborato interamente nel browser
        </span>
      </div>
    </div>
  );
}
