const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const extractPalette = async (imagePath, options = {}) => {
  const {
    maxColors = 5,
    resolution = 100,
    excludeBW = false,
    interpolation = 'linear',
    dev = false
  } = options;

  const sharp = require('sharp');
  
  const metadata = await sharp(imagePath).metadata();
  const originalWidth = metadata.width;
  const originalHeight = metadata.height;
  
  if (dev) {
    console.log('=== 调试信息 ===');
    console.log(`图片路径: ${imagePath}`);
    console.log(`原始尺寸: ${originalWidth} x ${originalHeight}`);
    console.log(`分辨率参数: ${resolution}`);
    console.log(`最大颜色数: ${maxColors}`);
    console.log(`排除黑白: ${excludeBW}`);
    console.log(`插值模式: ${interpolation}`);
  }
  
  let width, height;
  
  if (resolution === 1) {
    width = originalWidth;
    height = originalHeight;
    if (dev) {
      console.log(`缩放模式: 保持原始尺寸 (${width} x ${height})`);
    }
  } else if (resolution > 1) {
    const size = resolution;
    if (originalWidth > originalHeight) {
      width = size;
      height = Math.round((originalHeight / originalWidth) * size);
    } else {
      height = size;
      width = Math.round((originalWidth / originalHeight) * size);
    }
    if (dev) {
      console.log(`缩放模式: 固定尺寸模式 (${width} x ${height})`);
    }
  } else {
    const scale = resolution;
    width = Math.max(1, Math.round(originalWidth * scale));
    height = Math.max(1, Math.round(originalHeight * scale));
    if (dev) {
      console.log(`缩放模式: 比例缩放模式 (${(scale * 100).toFixed(1)}%)`);
      console.log(`缩放后尺寸: ${width} x ${height}`);
    }
  }
  
  const { data, info } = await sharp(imagePath)
    .resize(width, height, { fit: 'fill', kernel: interpolation })
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (dev) {
    console.log(`处理后的尺寸: ${info.width} x ${info.height}`);
    console.log(`像素总数: ${info.width * info.height}`);
    console.log(`数据长度: ${data.length} bytes`);
  }

  const colorCounts = {};
  let totalValidPixels = 0;
  let transparentPixels = 0;
  let excludedBWPixels = 0;
  const bwNearColors = new Set();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) {
      transparentPixels++;
      continue;
    }

    const factor = 12;
    const qr = Math.round(r / factor) * factor;
    const qg = Math.round(g / factor) * factor;
    const qb = Math.round(b / factor) * factor;
    const key = `${qr},${qg},${qb}`;

    const isBWNearColor = (r + g + b < 60) || (r + g + b > 710) || (Math.max(r, g, b) - Math.min(r, g, b) < 15);

    if (excludeBW) {
      if (isBWNearColor) {
        excludedBWPixels++;
        continue;
      }
    } else {
      if (isBWNearColor) {
        bwNearColors.add(key);
      }
    }

    if (!colorCounts[key]) {
      colorCounts[key] = { r: qr, g: qg, b: qb, count: 0 };
    }
    colorCounts[key].count++;
    totalValidPixels++;
  }

  const sortedColors = Object.values(colorCounts)
    .sort((a, b) => b.count - a.count);

  if (dev) {
    console.log(`\n=== 颜色统计 ===`);
    console.log(`总像素数: ${info.width * info.height}`);
    console.log(`透明像素: ${transparentPixels}`);
    console.log(`排除的黑白像素: ${excludedBWPixels}`);
    console.log(`有效像素: ${totalValidPixels}`);
    console.log(`量化后的颜色数量: ${sortedColors.length}`);
    console.log(`\n=== 前10个颜色（按出现次数）===`);
    sortedColors.slice(0, 10).forEach((c, i) => {
      const key = `${c.r},${c.g},${c.b}`;
      const isBWNear = bwNearColors.has(key);
      const bwLabel = isBWNear ? ' (黑白临近色)' : '';
      console.log(`${i + 1}. ${rgbToHex(c.r, c.g, c.b)} - 出现 ${c.count} 次 (${Math.round((c.count / totalValidPixels) * 100)}%)${bwLabel}`);
    });
  }

  const finalPalette = [];
  let skippedSimilar = 0;
  
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
    } else {
      skippedSimilar++;
    }
  }

  if (dev) {
    console.log(`\n=== 最终结果 ===`);
    console.log(`跳过的相似颜色: ${skippedSimilar}`);
    console.log(`最终提取颜色数: ${finalPalette.length}`);
    finalPalette.forEach((c, i) => {
      console.log(`${i + 1}. ${c.hex} - RGB(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}) - ${c.percentage}%`);
    });
    console.log('=== 调试结束 ===\n');
  }

  if (finalPalette.length === 0 && sortedColors.length > 0) {
    return sortedColors.slice(0, maxColors).map(c => ({
      hex: rgbToHex(c.r, c.g, c.b),
      rgb: { r: c.r, g: c.g, b: c.b },
      count: c.count,
      percentage: Math.round((c.count / totalValidPixels) * 100)
    }));
  }

  return finalPalette;
};

module.exports = {
  rgbToHex,
  hexToRgb,
  hexToRgba,
  extractPalette
};
