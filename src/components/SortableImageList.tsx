"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  ArrowDownAZ,
  Trash2,
  Layers,
} from "lucide-react";
import { ImageItem } from "@/types";
import { SortableImageCard } from "./SortableImageCard";
import { FileUploader } from "./FileUploader";
import { formatBytes } from "@/lib/utils";

interface SortableImageListProps {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  onAddMoreFiles: (files: File[]) => void;
  onPreviewImage: (item: ImageItem) => void;
  onClearAll: () => void;
}

export function SortableImageList({
  images,
  setImages,
  onAddMoreFiles,
  onPreviewImage,
  onClearAll,
}: SortableImageListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Pointer sensor with distance activation constraint ensures smooth touch scroll on mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Reorder buttons handlers
  const handleMoveBackward = (index: number) => {
    if (index > 0) {
      setImages((items) => arrayMove(items, index, index - 1));
    }
  };

  const handleMoveForward = (index: number) => {
    if (index < images.length - 1) {
      setImages((items) => arrayMove(items, index, index + 1));
    }
  };

  const handleRotate = (id: string) => {
    setImages((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, rotation: (item.rotation + 90) % 360 }
          : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setImages((items) => {
      const removed = items.find((i) => i.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return items.filter((item) => item.id !== id);
    });
  };

  // Quick batch operations
  const handleSortByName = () => {
    setImages((items) =>
      [...items].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" })
      )
    );
  };

  const handleReverseOrder = () => {
    setImages((items) => [...items].reverse());
  };

  const totalBytes = images.reduce((acc, curr) => acc + curr.size, 0);
  const activeItem = activeId ? images.find((i) => i.id === activeId) : null;
  const activeIndex = activeItem ? images.findIndex((i) => i.id === activeId) : 0;

  return (
    <div className="space-y-4">
      {/* List Toolbar / Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        {/* Count and total size */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {images.length} {images.length === 1 ? "page loaded" : "pages loaded"}
            </h3>
            <p className="text-[11px] text-slate-400">
              Total file size: {formatBytes(totalBytes)}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
          {/* Add more button */}
          <FileUploader onFilesSelected={onAddMoreFiles} compact />

          {/* Sort A-Z */}
          <button
            type="button"
            onClick={handleSortByName}
            title="Sort alphabetically by file name"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowDownAZ className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Sort A-Z</span>
          </button>

          {/* Reverse order */}
          <button
            type="button"
            onClick={handleReverseOrder}
            title="Reverse current sequence"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Reverse</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              title="List View"
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-700 dark:text-white"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Clear All */}
          <button
            type="button"
            onClick={onClearAll}
            title="Clear all pages"
            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50/70 px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Reordering helper hint */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          💡 <strong>Tip:</strong> Drag cards or use the arrow buttons to define the exact sequence of pages in your PDF.
        </span>
      </div>

      {/* Dnd Sortable Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={images.map((i) => i.id)}
          strategy={viewMode === "grid" ? rectSortingStrategy : verticalListSortingStrategy}
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((item, index) => (
                <SortableImageCard
                  key={item.id}
                  item={item}
                  index={index}
                  total={images.length}
                  viewMode="grid"
                  onMoveBackward={() => handleMoveBackward(index)}
                  onMoveForward={() => handleMoveForward(index)}
                  onRotate={() => handleRotate(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onPreview={() => onPreviewImage(item)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {images.map((item, index) => (
                <SortableImageCard
                  key={item.id}
                  item={item}
                  index={index}
                  total={images.length}
                  viewMode="list"
                  onMoveBackward={() => handleMoveBackward(index)}
                  onMoveForward={() => handleMoveForward(index)}
                  onRotate={() => handleRotate(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onPreview={() => onPreviewImage(item)}
                />
              ))}
            </div>
          )}
        </SortableContext>

        {/* Drag Overlay for smooth preview during drag */}
        <DragOverlay>
          {activeItem ? (
            <div className="pointer-events-none opacity-90 shadow-2xl scale-105">
              <SortableImageCard
                item={activeItem}
                index={activeIndex}
                total={images.length}
                viewMode={viewMode}
                onMoveBackward={() => {}}
                onMoveForward={() => {}}
                onRotate={() => {}}
                onDelete={() => {}}
                onPreview={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
