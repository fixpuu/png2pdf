export interface ImageItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
}

export type PageSizeMode = 'original' | 'a4-auto' | 'a4-portrait' | 'a4-landscape';
export type MarginMode = 'none' | 'small' | 'normal';

export interface PdfGenerationOptions {
  fileName: string;
  pageSize: PageSizeMode;
  margin: MarginMode;
}

export interface ProgressCallbackData {
  current: number;
  total: number;
  percentage: number;
  statusText: string;
}
