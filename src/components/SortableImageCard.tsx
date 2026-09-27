"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Trash2,
  Eye,
} from "lucide-react";
import { ImageItem } from "@/types";
import { formatBytes } from "@/lib/utils";

interface SortableImageCardProps {
  item: ImageItem;
  index: number;
  total: number;
  viewMode: "grid" | "list";
  onMoveBackward: () => void;
  onMoveForward: () => void;
  onRotate: () => void;
  onDelete: () => void;
  onPreview: () => void;
}

export function SortableImageCard({
  item,
  index,
  total,
  viewMode,
  onMoveBackward,
  onMoveForward,
  onRotate,
  onDelete,
  onPreview,
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (viewMode === "list") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`group flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-xs transition-all dark:bg-slate-900 ${
          isDragging
            ? "border-indigo-500 ring-2 ring-indigo-400/40"
            : "border-slate-200 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-700/60"
        }`}
      >
        {/* Touch-Friendly Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          title="Tieni premuto e trascina per riordinare"
          className="flex h-10 w-8 cursor-grab active:cursor-grabbing items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 touch-none shrink-0"
        >
          <GripVertical className="h-5 w-5" />
        </button>

        {/* Page Badge */}
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white shadow-xs shrink-0">
          {index + 1}
        </div>

        {/* Thumbnail */}
        <div
          onClick={onPreview}
          className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 shrink-0 cursor-pointer group-hover:ring-2 group-hover:ring-indigo-500/30"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.previewUrl}
            alt={item.name}
            className="h-full w-full object-contain p-0.5 transition-transform"
            style={{ transform: `rotate(${item.rotation}deg)` }}
          />
        </div>

        {/* File Details */}
        <div className="min-w-0 flex-1">
          <p
            onClick={onPreview}
            className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 sm:text-sm"
            title={item.name}
          >
            {item.name}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <span>
              {item.width} × {item.height} px
            </span>
            <span>•</span>
            <span>{formatBytes(item.size)}</span>
            {item.rotation > 0 && (
              <>
                <span>•</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.rotation}°
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Arrow Up / Previous */}
          <button
            type="button"
            onClick={onMoveBackward}
            disabled={isFirst}
            title="Sposta su"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowUp className="h-4 w-4" />
          </button>

          {/* Arrow Down / Next */}
          <button
            type="button"
            onClick={onMoveForward}
            disabled={isLast}
            title="Sposta giù"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowDown className="h-4 w-4" />
          </button>

          {/* Rotate */}
          <button
            type="button"
            onClick={onRotate}
            title="Ruota di 90°"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-all hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <RotateCw className="h-4 w-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={onDelete}
            title="Rimuovi pagina"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid Mode (Default & Ideal for Visual Reordering)
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col rounded-2xl border bg-white shadow-xs transition-all overflow-hidden dark:bg-slate-900 ${
        isDragging
          ? "border-indigo-500 ring-2 ring-indigo-400/40 scale-105 shadow-xl"
          : "border-slate-200 hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:hover:border-indigo-700/60"
      }`}
    >
      {/* Top Header Card: Page Badge + Drag Handle */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3 py-2 dark:border-slate-800/80 dark:bg-slate-800/50">
        <span className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white shadow-xs">
          <span>Pagina</span>
          <span className="text-white font-extrabold">{index + 1}</span>
        </span>

        {/* Drag Handle with touch-none so scroll is not blocked on other parts */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          title="Trascina per spostare"
          className="flex h-7 w-7 cursor-grab active:cursor-grabbing items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200 touch-none"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Image Preview Area */}
      <div
        onClick={onPreview}
        className="relative flex h-40 w-full items-center justify-center bg-slate-100/70 p-2 cursor-pointer overflow-hidden dark:bg-slate-950/70 sm:h-44"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.previewUrl}
          alt={item.name}
          className="max-h-full max-w-full object-contain drop-shadow-xs transition-transform duration-200 select-none group-hover:scale-[1.03]"
          style={{ transform: `rotate(${item.rotation}deg)` }}
        />

        {/* Hover zoom pill */}
        <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-slate-900/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs opacity-0 transition-opacity group-hover:opacity-100">
          <Eye className="h-3 w-3" />
          Ingrandisci
        </span>

        {/* Rotation indicator pill */}
        {item.rotation > 0 && (
          <span className="absolute top-2 left-2 rounded-md bg-indigo-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs shadow-xs">
            {item.rotation}°
          </span>
        )}
      </div>

      {/* Info strip */}
      <div className="px-3 pt-2.5 pb-1 border-t border-slate-100 dark:border-slate-800">
        <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200" title={item.name}>
          {item.name}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {item.width} × {item.height} px • {formatBytes(item.size)}
        </p>
      </div>

      {/* Mobile-Friendly Tactile Controls Toolbar */}
      <div className="grid grid-cols-4 gap-1 p-2 bg-slate-50/50 border-t border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/80">
        {/* Move Left */}
        <button
          type="button"
          onClick={onMoveBackward}
          disabled={isFirst}
          title="Sposta prima (←)"
          className="flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* Move Right */}
        <button
          type="button"
          onClick={onMoveForward}
          disabled={isLast}
          title="Sposta dopo (→)"
          className="flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95"
        >
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Rotate 90° */}
        <button
          type="button"
          onClick={onRotate}
          title="Ruota di 90° in senso orario"
          className="flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-all hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 active:scale-95"
        >
          <RotateCw className="h-4 w-4" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          title="Elimina questa immagine"
          className="flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-500 shadow-xs transition-all hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/40 active:scale-95"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
