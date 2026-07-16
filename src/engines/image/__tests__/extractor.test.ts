import { describe, test, expect } from 'vitest';
import { runKMeans } from '../extractor';

describe('Image Extractor Math', () => {
  test('runKMeans clusters standard coordinate sets correctly', () => {
    // Generate two distinct clusters of 3D pixel points
    const clusterA = Array.from({ length: 10 }, () => [10 + Math.random() * 2, 10 + Math.random() * 2, 10 + Math.random() * 2]);
    const clusterB = Array.from({ length: 10 }, () => [200 + Math.random() * 2, 200 + Math.random() * 2, 200 + Math.random() * 2]);
    const pixels = [...clusterA, ...clusterB];

    // Find 2 centroids
    const centroids = runKMeans(pixels, 2);
    expect(centroids.length).toBe(2);

    // One centroid should be close to [11, 11, 11] and the other close to [201, 201, 201]
    const hasLowCentroid = centroids.some(c => c[0] < 20);
    const hasHighCentroid = centroids.some(c => c[0] > 180);
    expect(hasLowCentroid).toBe(true);
    expect(hasHighCentroid).toBe(true);
  });
});
