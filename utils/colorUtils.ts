
import { ColorPalette, FilterMode } from '../types';

export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * 提取图片调色板
 */
export const extractPalette = async (
  imageUrl: string, 
  filterMode: FilterMode, 
  maxColors: number = 5
): Promise<ColorPalette[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const colorCounts: Record<string, { r: number, g: number, b: number, count: number }> = {};
      let totalValidPixels = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        if (a < 128) continue;

        const factor = 12;
        const qr = Math.round(r / factor) * factor;
        const qg = Math.round(g / factor) * factor;
        const qb = Math.round(b / factor) * factor;
        const key = `${qr},${qg},${qb}`;

        if (filterMode === FilterMode.EXCLUDE_BW) {
          if (r + g + b < 60) continue;
          if (r + g + b > 710) continue;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          if (max - min < 15) continue;
        }

        if (!colorCounts[key]) {
          colorCounts[key] = { r: qr, g: qg, b: qb, count: 0 };
        }
        colorCounts[key].count++;
        totalValidPixels++;
      }

      const sortedColors = Object.values(colorCounts)
        .sort((a, b) => b.count - a.count);

      const finalPalette: ColorPalette[] = [];
      for (const c of sortedColors) {
        if (finalPalette.length >= maxColors) break;

        const isTooSimilar = finalPalette.some(existing => {
          const dr = existing.rgb.r - c.r;
          const dg = existing.rgb.g - c.g;
          const db = existing.rgb.b - c.b;
          return Math.sqrt(dr*dr + dg*dg + db*db) < 45;
        });

        if (!isTooSimilar) {
          finalPalette.push({
            hex: rgbToHex(c.r, c.g, c.b),
            rgb: { r: c.r, g: c.g, b: c.b },
            count: c.count,
            percentage: Math.round((c.count / totalValidPixels) * 100)
          });
        }
      }

      if (finalPalette.length === 0 && sortedColors.length > 0) {
        const fallback = sortedColors.slice(0, maxColors).map(c => ({
          hex: rgbToHex(c.r, c.g, c.b),
          rgb: { r: c.r, g: c.g, b: c.b },
          count: c.count,
          percentage: Math.round((c.count / totalValidPixels) * 100)
        }));
        resolve(fallback);
      } else {
        resolve(finalPalette);
      }
    };

    img.onerror = () => reject(new Error("Image failed to load"));
  });
};

/**
 * 动态加载 jsmediatags
 */
export const loadJsMediaTags = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).jsmediatags) {
      resolve((window as any).jsmediatags);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js';
    script.onload = () => resolve((window as any).jsmediatags);
    script.onerror = () => reject(new Error("Failed to load jsmediatags"));
    document.head.appendChild(script);
  });
};

/**
 * 从 MP3 文件中提取封面 Base64
 */
export const getMp3Cover = async (file: File): Promise<string | null> => {
  const jsmediatags = await loadJsMediaTags();
  return new Promise((resolve) => {
    jsmediatags.read(file, {
      onSuccess: (tag: any) => {
        const image = tag.tags.picture;
        if (image) {
          const { data, format } = image;
          let base64String = "";
          for (let i = 0; i < data.length; i++) {
            base64String += String.fromCharCode(data[i]);
          }
          const base64 = `data:${format};base64,${window.btoa(base64String)}`;
          resolve(base64);
        } else {
          resolve(null);
        }
      },
      onError: () => resolve(null)
    });
  });
};
