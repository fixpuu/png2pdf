"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { FileUploader } from "@/components/FileUploader";
import { SortableImageList } from "@/components/SortableImageList";
import { ExportCard } from "@/components/ExportCard";
import { ImagePreviewModal } from "@/components/ImagePreviewModal";
import { PromoBanner } from "@/components/PromoBanner";
import { Footer } from "@/components/Footer";
import { ImageItem } from "@/types";
import { createImageItem } from "@/lib/utils";
import { Sparkles, Layers, ArrowUpDown, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleFilesSelected = async (newFiles: File[]) => {
    if (newFiles.length === 0) return;

    const newItems = await Promise.all(
      newFiles.map((file) => createImageItem(file))
    );

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleClearAll = () => {
    if (images.length === 0) return;
    if (window.confirm("Are you sure you want to remove all loaded images?")) {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setImages([]);
      setPreviewIndex(null);
    }
  };

  const handleOpenPreview = (item: ImageItem) => {
    const idx = images.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      setPreviewIndex(idx);
    }
  };

  const handleRotateInModal = (id: string) => {
    setImages((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, rotation: (item.rotation + 90) % 360 }
          : item
      )
    );
  };

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const currentPreviewItem =
    previewIndex !== null && previewIndex >= 0 && previewIndex < images.length
      ? images[previewIndex]
      : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6">
        {/* Top Announcement Bar for zwch.store */}
        <div className="mb-6">
          <PromoBanner variant="banner" />
        </div>

        {/* Hero Section */}
        <section className="mb-8 text-center sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>High-Speed Lossless PDF Conversion</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Fixpu{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              PNG2PDF
            </span>
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Combine multiple PNG images into a single high-quality PDF.
            Reorder pages with fluid drag-and-drop or tactile arrow buttons.
            100% private in your browser — zero compression, zero server uploads.
          </p>
        </section>

        {/* Dynamic Workspace */}
        {images.length === 0 ? (
          <div className="mx-auto w-full max-w-2xl space-y-8">
            <FileUploader onFilesSelected={handleFilesSelected} />

            {/* Quick feature highlights */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100/70 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  <ArrowUpDown className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Intuitive Reordering
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Drag &amp; drop or arrow buttons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Zap className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    100% Lossless Quality
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Original pixel sharpness
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100/70 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    100% Local &amp; Private
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    No files ever sent to a server
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Sponsored Card */}
            <PromoBanner variant="card" />
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Sortable Image Gallery */}
            <SortableImageList
              images={images}
              setImages={setImages}
              onAddMoreFiles={handleFilesSelected}
              onPreviewImage={handleOpenPreview}
              onClearAll={handleClearAll}
            />

            {/* Export & Download Panel */}
            <ExportCard images={images} />
          </div>
        )}
      </main>

      {/* Image Zoom Lightbox Modal */}
      {currentPreviewItem && (
        <ImagePreviewModal
          item={currentPreviewItem}
          currentIndex={previewIndex ?? 0}
          totalCount={images.length}
          onClose={() => setPreviewIndex(null)}
          onNavigatePrev={
            previewIndex !== null && previewIndex > 0
              ? () => setPreviewIndex((prev) => (prev !== null ? prev - 1 : 0))
              : undefined
          }
          onNavigateNext={
            previewIndex !== null && previewIndex < images.length - 1
              ? () => setPreviewIndex((prev) => (prev !== null ? prev + 1 : 0))
              : undefined
          }
          onRotate={handleRotateInModal}
        />
      )}

      <Footer />
    </div>
  );
}
