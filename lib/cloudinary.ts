/**
 * Cloudinary asset storage and transformation helpers
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
}

export function getCloudinaryUrl(
  publicId: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!publicId) return "/img/placeholder.svg";
  if (publicId.startsWith("http://") || publicId.startsWith("https://") || publicId.startsWith("/")) {
    return publicId;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "pixlape";
  const params: string[] = [];

  if (options.width) params.push(`w_${options.width}`);
  if (options.height) params.push(`h_${options.height}`);
  if (options.quality) params.push(`q_${options.quality}`);
  if (options.format) params.push(`f_${options.format}`);

  const transformations = params.length > 0 ? `${params.join(",")}/` : "";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}${publicId}`;
}