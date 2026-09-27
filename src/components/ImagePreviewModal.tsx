"use client";

import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, RotateCw, ZoomIn } from "lucide-react";
import { ImageItem } from "@/types";
import { formatBytes } from "@/lib/utils";

interface ImagePreviewModalProps {
  item: ImageItem | null;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onRotate?: (id: string) => void;
}

export function ImagePreviewModal({
  item,
  currentIndex,
  totalCount,
  onClose,
  onNavigatePrev,
  onNavigateNext,
  onRotate,
}: ImagePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onNavigatePrev) onNavigatePrev();
      if (e.key === "ArrowRight" && onNavigateNext) onNavigateNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNavigatePrev, onNavigateNext]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[92vh] max-w-4xl w-full rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-7 px-2.5 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-xs shrink-0">
              Pagina {currentIndex + 1} di {totalCount}
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold truncate text-slate-100" title={item.name}>
                {item.name}
              </h4>
              <p className="text-[11px] text-slate-400">
                {item.width} × {item.height} px • {formatBytes(item.size)}
                {item.rotation > 0 && ` • Ruotata ${item.rotation}°`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onRotate && (
              <button
                type="button"
                onClick={() => onRotate(item.id)}
                title="Ruota di 90° in senso orario"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Image Body */}
        <div className="relative flex flex-1 items-center justify-center overflow-auto p-4 min-h-[300px] max-h-[70vh] bg-slate-950/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.previewUrl}
            alt={item.name}
            className="max-h-full max-w-full object-contain transition-transform duration-200 select-none shadow-lg rounded-md"
            style={{
              transform: `rotate(${item.rotation}deg)`,
            }}
          />

          {/* Navigation Arrows */}
          {onNavigatePrev && currentIndex > 0 && (
            <button
              type="button"
              onClick={onNavigatePrev}
              title="Pagina precedente"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white shadow-lg backdrop-blur-xs hover:bg-indigo-600 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {onNavigateNext && currentIndex < totalCount - 1 && (
            <button
              type="button"
              onClick={onNavigateNext}
              title="Pagina successiva"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 border border-slate-700 text-white shadow-lg backdrop-blur-xs hover:bg-indigo-600 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Modal Footer info */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs text-slate-400 sm:px-6">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ZoomIn className="h-3.5 w-3.5 text-indigo-400" />
            Visualizzazione fedele al 100%
          </span>
          <span className="text-[11px] text-slate-500">
            Tasti freccia ← → per scorrere • Esc per chiudere
          </span>
        </div>
      </div>
    </div>
  );
}
