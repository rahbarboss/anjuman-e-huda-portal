/**
 * Image Optimization Utility
 * 
 * Rules:
 * - Reduce uploaded images to ~80-100 KB before uploading to Supabase Storage
 * - Max width: 1200 px (maintain aspect ratio)
 * - Convert JPEG to WebP when supported
 * - Preserve transparency for PNG when needed (never fill background, preserve alpha)
 * - Adaptive compression: start at 0.82, reduce gradually until 80-100 KB, never below 0.55
 * - Skip unnecessary recompression if file is already below 100 KB
 */

export interface OptimizationStats {
  originalSize: number;
  optimizedSize: number;
  formattedOriginal: string;
  formattedOptimized: string;
  savedPercent: number;
  formatString: string; // e.g. "3.2 MB → 94 KB"
}

export interface OptimizationResult {
  file: File;
  stats: OptimizationStats;
}

/**
 * Format bytes into human readable format matching e.g. "3.2 MB" or "94 KB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  const mb = bytes / (1024 * 1024);
  const formatted = mb >= 10 ? Math.round(mb).toString() : mb.toFixed(1);
  return `${formatted} MB`;
}

/**
 * Check if the browser supports WebP canvas encoding
 */
export function isWebpSupported(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

/**
 * Helper to check whether an image contains transparent pixels
 */
function checkTransparency(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    const imgData = ctx.getImageData(0, 0, width, height).data;
    // Step through sampled pixels for instant execution
    const totalPixels = width * height;
    const sampleStep = Math.max(1, Math.floor(totalPixels / 15000));
    for (let i = 0; i < totalPixels; i += sampleStep) {
      const alphaIndex = i * 4 + 3;
      if (alphaIndex < imgData.length && imgData[alphaIndex] < 250) {
        return true;
      }
    }
    return false;
  } catch {
    // If security error (CORS) or anything, assume transparent to be safe
    return true;
  }
}

/**
 * Adaptively compress canvas to target 80 - 100 KB
 * Quality bounds: starts at 0.82, never drops below 0.55
 */
async function adaptivelyCompress(
  canvas: HTMLCanvasElement,
  mimeType: string
): Promise<Blob> {
  const targetMin = 80 * 1024; // 80 KB
  const targetMax = 100 * 1024; // 100 KB
  const minQuality = 0.55;
  const startQuality = 0.82;

  const toBlobWithQuality = (q: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        mimeType,
        q
      );
    });
  };

  // Start at quality 0.82
  let quality = startQuality;
  let blob = await toBlobWithQuality(quality);

  // If already at or under 100 KB at start quality 0.82, keep it
  if (blob.size <= targetMax) {
    return blob;
  }

  // Reduce gradually in small decrements until between 80 KB and 100 KB
  let prevQuality = quality;
  let prevBlob = blob;

  while (quality > minQuality) {
    quality = Math.max(minQuality, Math.round((quality - 0.04) * 100) / 100);
    blob = await toBlobWithQuality(quality);

    // If within 80 KB - 100 KB window, return immediately
    if (blob.size >= targetMin && blob.size <= targetMax) {
      return blob;
    }

    // If it dropped below 80 KB from previous step, refine between prev and current
    if (blob.size < targetMin) {
      const midQ = Math.round(((prevQuality + quality) / 2) * 100) / 100;
      const midBlob = await toBlobWithQuality(midQ);
      if (midBlob.size <= targetMax && midBlob.size >= targetMin) {
        return midBlob;
      }
      return midBlob.size <= targetMax ? midBlob : blob;
    }

    prevQuality = quality;
    prevBlob = blob;
  }

  // If still above targetMax (100 KB) at minQuality (0.55),
  // gradually downscale canvas dimensions while strictly maintaining quality >= 0.55
  if (blob.size > targetMax) {
    let scale = 0.9;
    while (blob.size > targetMax && scale >= 0.35) {
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = Math.max(100, Math.round(canvas.width * scale));
      scaledCanvas.height = Math.max(100, Math.round(canvas.height * scale));
      const sctx = scaledCanvas.getContext('2d');
      if (!sctx) break;
      sctx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

      const scaledBlob = await new Promise<Blob | null>((resolve) => {
        scaledCanvas.toBlob((b) => resolve(b), mimeType, minQuality);
      });

      if (scaledBlob) {
        blob = scaledBlob;
        if (blob.size <= targetMax) {
          break;
        }
      }
      scale -= 0.08;
    }
  }

  // Quality reached lower limit (0.55)
  return blob;
}

/**
 * Main optimizer function applied before upload
 */
export async function optimizeImageBeforeUpload(file: File): Promise<OptimizationResult> {
  const originalSize = file.size;
  const formattedOriginal = formatFileSize(originalSize);

  // If not an image (or vector SVG / animated GIF), skip compression
  if (
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return {
      file,
      stats: {
        originalSize,
        optimizedSize: originalSize,
        formattedOriginal,
        formattedOptimized: formattedOriginal,
        savedPercent: 0,
        formatString: `${formattedOriginal} → ${formattedOriginal}`,
      },
    };
  }

  // Rule: Skip unnecessary recompression if the file is already below 100 KB
  if (originalSize <= 100 * 1024) {
    return {
      file,
      stats: {
        originalSize,
        optimizedSize: originalSize,
        formattedOriginal,
        formattedOptimized: formattedOriginal,
        savedPercent: 0,
        formatString: `${formattedOriginal} → ${formattedOriginal}`,
      },
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = async () => {
        try {
          const maxWidth = 1200;
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;

          // Rule: Maximum width: 1200 px (maintain aspect ratio)
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (!ctx) {
            return resolve({
              file,
              stats: {
                originalSize,
                optimizedSize: originalSize,
                formattedOriginal,
                formattedOptimized: formattedOriginal,
                savedPercent: 0,
                formatString: `${formattedOriginal} → ${formattedOriginal}`,
              },
            });
          }

          // Clear canvas (preserve transparency for PNG/WebP)
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const isWebp = isWebpSupported();
          const isPng = file.type === 'image/png' || /\.png$/i.test(file.name);
          const isJpeg =
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            /\.(jpe?g)$/i.test(file.name);

          let outputMime = 'image/jpeg';
          let extension = 'jpg';

          if (isJpeg) {
            // Rule: Convert JPEG images to WebP when supported
            if (isWebp) {
              outputMime = 'image/webp';
              extension = 'webp';
            } else {
              outputMime = 'image/jpeg';
              extension = 'jpg';
            }
          } else if (isPng) {
            // Rule: Preserve transparency for PNG when needed
            const hasAlpha = checkTransparency(ctx, width, height);
            if (hasAlpha) {
              // WebP natively preserves alpha transparency with efficient lossy compression
              if (isWebp) {
                outputMime = 'image/webp';
                extension = 'webp';
              } else {
                // Keep PNG to preserve transparency
                outputMime = 'image/png';
                extension = 'png';
              }
            } else {
              // No transparency: convert to WebP or JPEG
              if (isWebp) {
                outputMime = 'image/webp';
                extension = 'webp';
              } else {
                outputMime = 'image/jpeg';
                extension = 'jpg';
              }
            }
          } else {
            // Other formats (e.g. BMP, TIFF, WebP)
            if (isWebp) {
              outputMime = 'image/webp';
              extension = 'webp';
            } else {
              outputMime = 'image/jpeg';
              extension = 'jpg';
            }
          }

          // Execute adaptive compression
          let optimizedBlob: Blob;
          if (outputMime === 'image/png') {
            // PNG canvas export ignores quality parameter
            optimizedBlob = await new Promise<Blob>((resBlob, rejBlob) => {
              canvas.toBlob((b) => (b ? resBlob(b) : rejBlob()), 'image/png');
            });
          } else {
            optimizedBlob = await adaptivelyCompress(canvas, outputMime);
          }

          const optimizedSize = optimizedBlob.size;
          const formattedOptimized = formatFileSize(optimizedSize);
          const savedPercent =
            originalSize > optimizedSize
              ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
              : 0;

          // Format new file name
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const newFileName = `${baseName}.${extension}`;

          const optimizedFile = new File([optimizedBlob], newFileName, {
            type: outputMime,
            lastModified: Date.now(),
          });

          resolve({
            file: optimizedFile,
            stats: {
              originalSize,
              optimizedSize,
              formattedOriginal,
              formattedOptimized,
              savedPercent,
              formatString: `${formattedOriginal} → ${formattedOptimized}`,
            },
          });
        } catch {
          // If any issue occurred during canvas manipulation, safely fallback to original file
          resolve({
            file,
            stats: {
              originalSize,
              optimizedSize: originalSize,
              formattedOriginal,
              formattedOptimized: formattedOriginal,
              savedPercent: 0,
              formatString: `${formattedOriginal} → ${formattedOriginal}`,
            },
          });
        }
      };

      img.onerror = () => {
        resolve({
          file,
          stats: {
            originalSize,
            optimizedSize: originalSize,
            formattedOriginal,
            formattedOptimized: formattedOriginal,
            savedPercent: 0,
            formatString: `${formattedOriginal} → ${formattedOriginal}`,
          },
        });
      };
    };

    reader.onerror = () => {
      resolve({
        file,
        stats: {
          originalSize,
          optimizedSize: originalSize,
          formattedOriginal,
          formattedOptimized: formattedOriginal,
          savedPercent: 0,
          formatString: `${formattedOriginal} → ${formattedOriginal}`,
        },
      });
    };
  });
}

/**
 * Specialized Banner Image Optimizer
 * 
 * Target size: strictly 40 KB - 60 KB for Supabase as requested.
 * Automatically handles Landscape vs Portrait aspect ratios and adaptive compression.
 */
export async function optimizeBannerImage(
  file: File,
  orientation: 'landscape' | 'portrait' = 'landscape'
): Promise<OptimizationResult & { dataUrl?: string }> {
  return new Promise((resolve) => {
    const originalSize = file.size;
    const formattedOriginal = formatFileSize(originalSize);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = async () => {
        try {
          // Dimensions based on orientation
          let maxW = orientation === 'landscape' ? 1400 : 900;
          let maxH = orientation === 'landscape' ? 800 : 1300;

          let width = img.width;
          let height = img.height;

          if (width > maxW || height > maxH) {
            const ratio = Math.min(maxW / width, maxH / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          let canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext('2d', { alpha: false });

          if (!ctx) {
            resolve({
              file,
              stats: {
                originalSize,
                optimizedSize: originalSize,
                formattedOriginal,
                formattedOptimized: formattedOriginal,
                savedPercent: 0,
                formatString: `${formattedOriginal} → ${formattedOriginal}`,
              },
            });
            return;
          }

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const useWebp = isWebpSupported();
          const mimeType = useWebp ? 'image/webp' : 'image/jpeg';
          const extension = useWebp ? 'webp' : 'jpg';

          const targetMin = 40 * 1024; // 40 KB
          const targetMax = 60 * 1024; // 60 KB

          const getBlob = (c: HTMLCanvasElement, q: number): Promise<Blob> => {
            return new Promise((res, rej) => {
              c.toBlob(
                (b) => (b ? res(b) : rej(new Error('toBlob failed'))),
                mimeType,
                q
              );
            });
          };

          let currentQuality = 0.80;
          let blob = await getBlob(canvas, currentQuality);

          // If blob is too large (> 60 KB), reduce quality or downscale canvas
          let attempts = 0;
          while (blob.size > targetMax && attempts < 12) {
            attempts++;
            if (currentQuality > 0.45) {
              currentQuality = Math.max(0.40, currentQuality - 0.08);
              blob = await getBlob(canvas, currentQuality);
            } else {
              // Quality is already low, reduce resolution by 15%
              width = Math.round(width * 0.85);
              height = Math.round(height * 0.85);
              if (width < 320 || height < 320) break;

              const scaledCanvas = document.createElement('canvas');
              scaledCanvas.width = width;
              scaledCanvas.height = height;
              const sCtx = scaledCanvas.getContext('2d', { alpha: false });
              if (sCtx) {
                sCtx.fillStyle = '#ffffff';
                sCtx.fillRect(0, 0, width, height);
                sCtx.drawImage(canvas, 0, 0, width, height);
                canvas = scaledCanvas;
                currentQuality = 0.65;
                blob = await getBlob(canvas, currentQuality);
              } else {
                break;
              }
            }
          }

          // If blob is smaller than 40 KB and original was larger, try increasing quality up to 0.95
          if (blob.size < targetMin && originalSize > targetMin && attempts === 0) {
            let highQuality = 0.90;
            const highBlob = await getBlob(canvas, highQuality);
            if (highBlob.size <= targetMax) {
              blob = highBlob;
            }
          }

          const optimizedSize = blob.size;
          const formattedOptimized = formatFileSize(optimizedSize);
          const savedPercent =
            originalSize > optimizedSize
              ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
              : 0;

          const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
          const newFileName = `${baseName}_banner.${extension}`;
          const optimizedFile = new File([blob], newFileName, {
            type: mimeType,
            lastModified: Date.now(),
          });

          // Generate dataUrl for instant fast local rendering
          const dataUrl = canvas.toDataURL(mimeType, currentQuality);

          resolve({
            file: optimizedFile,
            dataUrl,
            stats: {
              originalSize,
              optimizedSize,
              formattedOriginal,
              formattedOptimized,
              savedPercent,
              formatString: `${formattedOriginal} → ${formattedOptimized} (${Math.round(optimizedSize / 1024)} KB)`,
            },
          });
        } catch {
          resolve({
            file,
            stats: {
              originalSize,
              optimizedSize: originalSize,
              formattedOriginal,
              formattedOptimized: formattedOriginal,
              savedPercent: 0,
              formatString: `${formattedOriginal} → ${formattedOriginal}`,
            },
          });
        }
      };

      img.onerror = () => {
        resolve({
          file,
          stats: {
            originalSize,
            optimizedSize: originalSize,
            formattedOriginal,
            formattedOptimized: formattedOriginal,
            savedPercent: 0,
            formatString: `${formattedOriginal} → ${formattedOriginal}`,
          },
        });
      };
    };

    reader.onerror = () => {
      resolve({
        file,
        stats: {
          originalSize,
          optimizedSize: originalSize,
          formattedOriginal,
          formattedOptimized: formattedOriginal,
          savedPercent: 0,
          formatString: `${formattedOriginal} → ${formattedOriginal}`,
        },
      });
    };
  });
}
