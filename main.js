#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { extractPalette } = require('./colorUtils');
const { parseFile } = require('music-metadata');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    imagePath: null,
    precision: 100,
    excludeBW: false,
    colorSys: 'hex',
    maxColors: 5,
    present: false,
    interpolation: 'linear',
    dev: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--precision=')) {
      options.precision = parseFloat(arg.split('=')[1]);
    } else if (arg === '--precision' && args[i + 1]) {
      options.precision = parseFloat(args[++i]);
    } else if (arg === '--unabw') {// 去除黑白临近色
      options.excludeBW = true;
    } else if (arg.startsWith('--colorsys=')) {
      options.colorSys = arg.split('=')[1];
    } else if (arg === '--colorsys' && args[i + 1]) {
      options.colorSys = args[++i];
    } else if (arg.startsWith('--max=')) {
      options.maxColors = parseInt(arg.split('=')[1]);
    } else if (arg === '--max' && args[i + 1]) {
      options.maxColors = parseInt(args[++i]);
    } else if (arg === '--present') {
      options.present = true;
    } else if (arg.startsWith('--interpolation=')) {
      options.interpolation = arg.split('=')[1];
    } else if (arg === '--interpolation' && args[i + 1]) {
      options.interpolation = args[++i];
    } else if (arg === '--dev') {
      options.dev = true;
    } else if (!arg.startsWith('--') && !options.imagePath) {
      options.imagePath = arg;
    }
  }

  return options;
};

const formatColor = (color, colorSys, showPercentage) => {
  const colorValue = (() => {
    switch (colorSys.toLowerCase()) {
      case 'hex':
        return color.hex;
      case 'rgb':
        return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
      case 'rgba':
        return `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, 1)`;
      default:
        return color.hex;
    }
  })();

  if (showPercentage) {
    return `${colorValue} (${color.percentage}%)`;
  }
  return colorValue;
};

const extractCoverFromAudio = async (audioPath) => {
  const metadata = await parseFile(audioPath);
  
  if (!metadata.common.picture || metadata.common.picture.length === 0) {
    throw new Error('No cover image found in the audio file');
  }

  const picture = metadata.common.picture[0];
  const tempDir = path.join(path.dirname(audioPath), '.temp');
  
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempImagePath = path.join(tempDir, `cover_${Date.now()}.${picture.format.split('/')[1] || 'jpg'}`);
  fs.writeFileSync(tempImagePath, picture.data);
  
  return tempImagePath;
};

const main = async () => {
  const options = parseArgs();

  if (!options.imagePath) {
    console.error('Error: Please provide an image or audio file path');
    console.log('Usage: node main.js <file_path> [options]');
    console.log('Supported file types:');
    console.log('  Images: jpg, jpeg, png, gif, webp, bmp, tiff');
    console.log('  Audio: mp3, m4a, flac, ogg, wav');
    console.log('Options:');
    console.log('  --precision <size>        Resolution size: 1 (no compression), >1 for pixel size, 0-1 for percentage');
    console.log('                            Examples: 1 (original), 100 (100px), 0.5 (50%%)');
    console.log('  --unabw                  Exclude black and white colors');
    console.log('  --colorsys <format>      Color system: hex, rgb, rgba (default: hex)');
    console.log('  --max <number>           Maximum number of colors (default: 5)');
    console.log('  --present                Show color percentage in the image');
    console.log('  --interpolation <mode>   Interpolation mode: nearest, linear, cubic, lanczos (default: linear)');
    console.log('  --dev                    Enable detailed debug output');
    console.log('');
    console.log('Example: node main.js ./bg.jpg --precision 0.5 --unabw --colorsys hex --present');
    console.log('Example: node main.js ./song.mp3 --max 3 --colorsys rgb');
    process.exit(1);
  }

  const filePath = path.resolve(options.imagePath);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  const audioExtensions = ['.mp3', '.m4a', '.flac', '.ogg', '.wav', '.wma'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.tif'];
  
  let imagePath = filePath;
  let isAudioFile = false;
  let tempImagePath = null;

  if (audioExtensions.includes(ext)) {
    isAudioFile = true;
    try {
      console.log(`Extracting cover from audio file: ${path.basename(filePath)}`);
      tempImagePath = await extractCoverFromAudio(filePath);
      imagePath = tempImagePath;
      console.log(`Cover extracted successfully`);
    } catch (error) {
      console.error(`Error extracting cover: ${error.message}`);
      process.exit(1);
    }
  } else if (!imageExtensions.includes(ext)) {
    console.error(`Error: Unsupported file type: ${ext}`);
    console.log('Supported file types: images (jpg, png, etc.) and audio files (mp3, m4a, flac, etc.)');
    process.exit(1);
  }

  try {
    const palette = await extractPalette(imagePath, {
      maxColors: options.maxColors,
      resolution: options.precision,
      excludeBW: options.excludeBW,
      interpolation: options.interpolation,
      dev: options.dev
    });

    palette.forEach(color => {
      console.log(formatColor(color, options.colorSys, options.present));
    });

    if (tempImagePath && fs.existsSync(tempImagePath)) {
      fs.unlinkSync(tempImagePath);
      const tempDir = path.dirname(tempImagePath);
      if (fs.existsSync(tempDir) && fs.readdirSync(tempDir).length === 0) {
        fs.rmdirSync(tempDir);
      }
    }
  } catch (error) {
    console.error(`Error extracting colors: ${error.message}`);
    
    if (tempImagePath && fs.existsSync(tempImagePath)) {
      fs.unlinkSync(tempImagePath);
    }
    process.exit(1);
  }
};

main();
