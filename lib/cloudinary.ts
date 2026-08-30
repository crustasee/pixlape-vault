/**
 * Cloudinary asset storage and transformation helpers
 */
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary server-side instance
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: string | number; // e.g. 'auto', 80, 'auto:good', 'auto:eco'
  format?: string; // e.g. 'auto', 'webp', 'avif', 'png'
  crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'pad' | 'thumb';
  gravity?: 'auto' | 'face' | 'center';
  blur?: number;
}

/**
 * Generate an optimized Cloudinary delivery URL
 * Supports:
 * 1. Cloudinary Public IDs (e.g. "products/banner123")
 * 2. Full Cloudinary URLs (injects transformations)
 * 3. Remote URLs (R2, S3, etc.) using Cloudinary Fetch API
 * 4. Local static paths (returns unchanged fallback)
 */
export function getOptimizedImageUrl(
  src: string | null | undefined,
  options: ImageOptimizationOptions = {}
): string {
  if (!src || src.trim() === '') {
    return '/img/minicard001.svg';
  }

  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    'lbovk2lu';

  // Build transformation string
  const transforms: string[] = [];
  transforms.push(`f_${options.format || 'auto'}`);
  transforms.push(`q_${options.quality || 'auto'}`);

  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop}`);
  if (options.gravity) transforms.push(`g_${options.gravity}`);
  if (options.blur) transforms.push(`e_blur:${options.blur}`);

  const transformStr = transforms.join(',');

  // Case 1: Local file path (e.g., /img/minicard001.svg)
  if (src.startsWith('/') && !src.startsWith('//')) {
    return src;
  }

  // Case 2: Already a Cloudinary URL
  if (src.includes('res.cloudinary.com')) {
    // If it already has transformations, return or inject
    if (src.includes('/image/upload/')) {
      return src.replace('/image/upload/', `/image/upload/${transformStr}/`);
    }
    return src;
  }

  // Case 3: Remote URL (e.g., Cloudflare R2, Unsplash, Supabase)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // We can use Cloudinary Fetch capability for on-the-fly optimization of R2/remote assets
    // Format: https://res.cloudinary.com/<cloud_name>/image/fetch/<transformations>/<remote_url>
    return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformStr}/${encodeURIComponent(src)}`;
  }

  // Case 4: Cloudinary Public ID (e.g. "products/item_01")
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${src}`;
}

// Backward compatibility alias
export const getCloudinaryUrl = getOptimizedImageUrl;