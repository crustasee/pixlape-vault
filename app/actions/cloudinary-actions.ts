// app/actions/cloudinary-actions.ts
"use server";

import { cloudinary, getOptimizedImageUrl } from "@/lib/cloudinary";

export interface CloudinaryUploadResponse {
  success: boolean;
  url?: string;
  secureUrl?: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: string;
}

/**
 * Upload an image (base64 data URI or remote URL) to Cloudinary with automatic optimization
 */
export async function uploadToCloudinary(
  fileOrBase64: string,
  folder: string = "products"
): Promise<CloudinaryUploadResponse> {
  try {
    const result = await cloudinary.uploader.upload(fileOrBase64, {
      folder: `pixlape/${folder}`,
      resource_type: "image",
      transformation: [
        { width: 1600, height: 1600, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      secureUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to upload to Cloudinary",
    };
  }
}

/**
 * Upload image via FormData server action
 */
export async function uploadImageFormData(
  formData: FormData,
  folder: string = "products"
): Promise<CloudinaryUploadResponse> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    return await uploadToCloudinary(base64Data, folder);
  } catch (error) {
    console.error("Cloudinary FormData upload failed:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to process image upload",
    };
  }
}

/**
 * Delete an image asset from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    if (!publicId) return { success: false, error: "No public ID provided" };
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: true, result };
  } catch (error) {
    console.error("Cloudinary destroy failed:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to delete from Cloudinary",
    };
  }
}

/**
 * Helper to get optimized Cloudinary URL on server
 */
export async function getOptimizedImageUrlAction(
  src: string,
  width?: number,
  height?: number
) {
  return getOptimizedImageUrl(src, { width, height, format: "auto", quality: "auto" });
}