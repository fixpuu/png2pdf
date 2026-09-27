"use client";

import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, Plus, Sparkles } from "lucide-react";

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  compact?: boolean;
}

export function FileUploader({ onFilesSelected, compact = false }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length > 0) {
        onFilesSelected(files);
      }
      // Reset input value so re-selecting same file triggers change
      e.target.value = "";
    }
  };

  if (compact) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-2 text-xs font-semibold text-indigo-700 shadow-xs transition-all hover:bg-indigo-100 hover:border-indigo-300 active:scale-95 dark:border-indigo-800/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
        >
          <Plus className="h-4 w-4" />
          <span>Aggiungi Altre Immagini</span>
        </button>
      </>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all cursor-pointer select-none sm:p-10 ${
        isDragOver
          ? "border-indigo-500 bg-indigo-50/80 scale-[1.01] shadow-xl shadow-indigo-500/10 dark:border-indigo-400 dark:bg-indigo-950/30"
          : "border-slate-300/80 bg-slate-50/60 hover:border-indigo-400 hover:bg-indigo-50/30 dark:border-slate-700/80 dark:bg-slate-900/40 dark:hover:border-indigo-500/60 dark:hover:bg-slate-800/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Decorative Icon */}
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
        <Upload className="h-8 w-8 sm:h-9 sm:w-9" />
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900">
          <Plus className="h-3.5 w-3.5" />
        </span>
      </div>

      {/* Main Call to Action */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
        Seleziona o trascina qui le tue immagini PNG
      </h3>

      <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
        Tocca per scegliere più file dalla galleria del telefono o dal computer.
        L&apos;ordine iniziale corrisponde alla tua selezione.
      </p>

      {/* Mobile-Friendly Big Button */}
      <div className="mt-5">
        <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition-all group-hover:bg-indigo-700 group-hover:shadow-indigo-600/35 active:scale-95">
          <ImageIcon className="h-4 w-4" />
          Scegli File PNG
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
        <span className="rounded-md bg-white/70 px-2 py-0.5 font-medium border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          Formati: PNG, JPG, WebP
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500" />
          Nessun limite di pagine
        </span>
      </div>
    </div>
  );
}
