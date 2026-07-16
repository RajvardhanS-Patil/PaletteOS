import { normalizeHex } from '../color/conversions';

export interface ExtractedColor {
  hex: string;
  population: number;
}

/**
 * Extracts dominant colors from an image File using Canvas and K-Means clustering.
 * Runs fully client-side.
 */
export async function extractDominantColors(
  imageFile: File,
  k: number = 6
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Downscale to 100x100 to make computation extremely fast (< 10ms)
          canvas.width = 100;
          canvas.height = 100;
          ctx.drawImage(img, 0, 0, 100, 100);

          const imgData = ctx.getImageData(0, 0, 100, 100).data;
          const pixels: number[][] = [];

          // Sample pixels (every 4th pixel to reduce computation further)
          for (let i = 0; i < imgData.length; i += 16) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            const a = imgData[i + 3];
            if (a > 128) { // Skip transparent pixels
              pixels.push([r, g, b]);
            }
          }

          if (pixels.length === 0) {
            resolve(['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899']);
            return;
          }

          const centroids = runKMeans(pixels, k);
          const hexColors = centroids.map((c) => {
            const r = Math.round(c[0]).toString(16).padStart(2, '0');
            const g = Math.round(c[1]).toString(16).padStart(2, '0');
            const b = Math.round(c[2]).toString(16).padStart(2, '0');
            return normalizeHex(`#${r}${g}${b}`);
          });

          resolve(hexColors);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(imageFile);
  });
}

export function runKMeans(pixels: number[][], k: number, maxIterations: number = 10): number[][] {
  // Initialize centroids randomly
  let centroids: number[][] = [];
  const step = Math.floor(pixels.length / k);
  for (let i = 0; i < k; i++) {
    centroids.push([...pixels[Math.min(pixels.length - 1, i * step + Math.floor(Math.random() * step))]]);
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    const clusters: number[][][] = Array.from({ length: k }, () => []);

    // Assign pixels to closest centroid
    for (const pixel of pixels) {
      let minDist = Infinity;
      let closestIdx = 0;

      for (let cIdx = 0; cIdx < k; cIdx++) {
        const centroid = centroids[cIdx];
        const dist = 
          Math.pow(pixel[0] - centroid[0], 2) +
          Math.pow(pixel[1] - centroid[1], 2) +
          Math.pow(pixel[2] - centroid[2], 2);

        if (dist < minDist) {
          minDist = dist;
          closestIdx = cIdx;
        }
      }

      clusters[closestIdx].push(pixel);
    }

    // Recompute centroids
    let centroidsChanged = false;
    const nextCentroids: number[][] = [];

    for (let cIdx = 0; cIdx < k; cIdx++) {
      const cluster = clusters[cIdx];
      if (cluster.length === 0) {
        // Fallback if cluster becomes empty: pick random pixel
        nextCentroids.push([...pixels[Math.floor(Math.random() * pixels.length)]]);
        centroidsChanged = true;
        continue;
      }

      const mean = [0, 0, 0];
      for (const p of cluster) {
        mean[0] += p[0];
        mean[1] += p[1];
        mean[2] += p[2];
      }
      mean[0] /= cluster.length;
      mean[1] /= cluster.length;
      mean[2] /= cluster.length;

      const distToOld =
        Math.pow(mean[0] - centroids[cIdx][0], 2) +
        Math.pow(mean[1] - centroids[cIdx][1], 2) +
        Math.pow(mean[2] - centroids[cIdx][2], 2);

      if (distToOld > 1.0) {
        centroidsChanged = true;
      }

      nextCentroids.push(mean);
    }

    centroids = nextCentroids;

    if (!centroidsChanged) {
      break;
    }
  }

  return centroids;
}
