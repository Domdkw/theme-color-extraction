
export enum ExtractionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export enum FilterMode {
  ALL = 'ALL',
  EXCLUDE_BW = 'EXCLUDE_BW'
}

export enum QuantityMode {
  ALL = 'ALL',
  SINGLE = 'SINGLE'
}

export enum ResolutionMode {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  ULTRA = 'ULTRA'
}

export interface ColorPalette {
  hex: string;
  rgb: { r: number; g: number; b: number };
  count: number;
  percentage: number;
}

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  status: ExtractionStatus;
  palette: ColorPalette[];
  progress: number;
}
