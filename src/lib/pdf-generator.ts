import { PDFDocument } from "pdf-lib";
import {
  ImageItem,
  MarginMode,
  PdfGenerationOptions,
  ProgressCallbackData,
} from "@/types";
import { sanitizeFileName } from "./utils";

// Standard A4 dimensions in PDF points (72 DPI)
const A4_PORTRAIT_WIDTH = 595.28;
const A4_PORTRAIT_HEIGHT = 841.89;

function getMarginPoints(margin: MarginMode): number {
  switch (margin) {
    case "none":
      return 0;
    case "small":
      return 14.17; // ~5mm
    case "normal":
      return 28.35; // ~10mm
    default:
      return 0;
  }
}

/**
 * Prepares image buffer. If no rotation, uses the raw original file bytes directly.
 * If rotated or non-standard format, renders onto high-res canvas and exports to PNG.
 */
async function getImageData(item: ImageItem): Promise<{
  bytes: ArrayBuffer;
  isPng: boolean;
  width: number;
  height: number;
}> {
  const normRotation = ((item.rotation % 360) + 360) % 360;

  // Fastest lossless path: raw file bytes directly
  if (normRotation === 0) {
    if (item.file.type === "image/png") {
      try {
        const bytes = await item.file.arrayBuffer();
        return { bytes, isPng: true, width: item.width, height: item.height };
      } catch (err) {
        console.warn("Direct buffer read failed, using canvas fallback", err);
      }
    } else if (
      item.file.type === "image/jpeg" ||
      item.file.type === "image/jpg"
    ) {
      try {
        const bytes = await item.file.arrayBuffer();
        return { bytes, isPng: false, width: item.width, height: item.height };
      } catch (err) {
        console.warn("Direct buffer read failed, using canvas fallback", err);
      }
    }
  }

  // Canvas path for rotation or unsupported image containers
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(item.file);

    img.onload = () => {
      const isSwapped = normRotation === 90 || normRotation === 270;
      const targetWidth = isSwapped ? img.naturalHeight : img.naturalWidth;
      const targetHeight = isSwapped ? img.naturalWidth : img.naturalHeight;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Unable to initialize 2D canvas context"));
      }

      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((normRotation * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error("Canvas export failed"));
        }
        blob
          .arrayBuffer()
          .then((bytes) => {
            resolve({
              bytes,
              isPng: true,
              width: targetWidth,
              height: targetHeight,
            });
          })
          .catch(reject);
      }, "image/png");
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image in canvas"));
    };

    img.src = url;
  });
}

/**
 * Generates a single high-quality PDF containing all provided images in order.
 */
export async function generatePdf(
  images: ImageItem[],
  options: PdfGenerationOptions,
  onProgress?: (data: ProgressCallbackData) => void
): Promise<{ blob: Blob; fileName: string }> {
  if (images.length === 0) {
    throw new Error("No images to convert");
  }

  const pdfDoc = await PDFDocument.create();
  const total = images.length;

  for (let i = 0; i < total; i++) {
    const item = images[i];

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round(((i + 0.3) / total) * 90),
        statusText: `Processing page ${i + 1} of ${total}: "${item.name}"...`,
      });
    }

    const { bytes, isPng, width: imgW, height: imgH } = await getImageData(item);

    let embeddedImage;
    if (isPng) {
      try {
        embeddedImage = await pdfDoc.embedPng(bytes);
      } catch (err) {
        console.warn("embedPng failed, fallback to canvas...", err);
        const fallback = await renderToStandardPng(item.file);
        embeddedImage = await pdfDoc.embedPng(fallback);
      }
    } else {
      try {
        embeddedImage = await pdfDoc.embedJpg(bytes);
      } catch (err) {
        console.warn("embedJpg failed, fallback to canvas...", err);
        const fallback = await renderToStandardPng(item.file);
        embeddedImage = await pdfDoc.embedPng(fallback);
      }
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    // Sizing and positioning calculations
    if (options.pageSize === "original") {
      // 1:1 Pixel-perfect original dimension. Zero scaling, maximum resolution.
      const page = pdfDoc.addPage([imgWidth, imgHeight]);
      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
      });
    } else {
      // A4 Page mode
      let pageWidth = A4_PORTRAIT_WIDTH;
      let pageHeight = A4_PORTRAIT_HEIGHT;

      if (options.pageSize === "a4-landscape") {
        pageWidth = A4_PORTRAIT_HEIGHT;
        pageHeight = A4_PORTRAIT_WIDTH;
      } else if (options.pageSize === "a4-auto") {
        if (imgWidth > imgHeight) {
          pageWidth = A4_PORTRAIT_HEIGHT;
          pageHeight = A4_PORTRAIT_WIDTH;
        } else {
          pageWidth = A4_PORTRAIT_WIDTH;
          pageHeight = A4_PORTRAIT_HEIGHT;
        }
      }

      const margin = getMarginPoints(options.margin);
      const availableWidth = Math.max(pageWidth - margin * 2, 10);
      const availableHeight = Math.max(pageHeight - margin * 2, 10);

      // Fit inside available bounds while preserving aspect ratio
      const scale = Math.min(
        availableWidth / imgWidth,
        availableHeight / imgHeight
      );

      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      // Center horizontally & vertically inside page bounds
      const x = margin + (availableWidth - drawWidth) / 2;
      const y = margin + (availableHeight - drawHeight) / 2;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(embeddedImage, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }

    if (onProgress) {
      onProgress({
        current: i + 1,
        total,
        percentage: Math.round(((i + 1) / total) * 90),
        statusText: `Page ${i + 1} of ${total} ready.`,
      });
    }
  }

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percentage: 95,
      statusText: "Finalizing PDF file...",
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  const finalFileName = sanitizeFileName(options.fileName || "merged_document.pdf");

  if (onProgress) {
    onProgress({
      current: total,
      total,
      percentage: 100,
      statusText: "PDF generated successfully!",
    });
  }

  return { blob, fileName: finalFileName };
}

/**
 * Emergency fallback to ensure compatibility with non-standard images
 */
function renderToStandardPng(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Canvas context unavailable"));
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas toBlob failed"));
        blob.arrayBuffer().then(resolve).catch(reject);
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/**
 * Triggers a download of the Blob in the client browser
 */
export function downloadPdfBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
