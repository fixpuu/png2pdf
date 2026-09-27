import { ImageItem } from "@/types";

/**
 * Format bytes into human-readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Ensure file name ends with .pdf and has valid characters
 */
export function sanitizeFileName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "documento.pdf";
  const cleaned = trimmed.replace(/[/\\?%*:|"<>]/g, "-");
  return cleaned.toLowerCase().endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

/**
 * Generate a unique ID for drag and drop items
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Read the natural width and height of an image file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({
        width: img.naturalWidth || 800,
        height: img.naturalHeight || 600,
      });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      // Fallback default dimensions if reading fails
      resolve({ width: 800, height: 600 });
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

/**
 * Convert a File object into an ImageItem
 */
export async function createImageItem(file: File): Promise<ImageItem> {
  const { width, height } = await getImageDimensions(file);
  const previewUrl = URL.createObjectURL(file);

  return {
    id: generateId(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    previewUrl,
    width,
    height,
    rotation: 0,
  };
}
