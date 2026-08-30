// app/actions/upload-actions.ts
"use server";

import { r2Client, R2_BUCKET_NAME, getR2PublicUrl } from "@/lib/r2";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface PresignedUrlResponse {
  success: boolean;
  signedUrl?: string;
  fileUrl?: string;
  key?: string;
  error?: string;
}

/**
 * Generate presigned URL for direct secure browser-to-R2 upload
 */
export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
  folder: string = "assets"
): Promise<PresignedUrlResponse> {
  try {
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
    const key = `${cleanFolder}/${uniquePrefix}-${sanitizedFilename}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType || "application/octet-stream",
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 600 }); // 10 minutes valid

    return {
      success: true,
      signedUrl,
      fileUrl: getR2PublicUrl(key),
      key,
    };
  } catch (error) {
    console.error("Error generating presigned R2 URL:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to generate presigned upload URL",
    };
  }
}

/**
 * Server-side upload to Cloudflare R2 from FormData
 */
export async function uploadToR2ServerAction(
  formData: FormData,
  folder: string = "uploads"
) {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `${folder}/${Date.now()}-${sanitizedFilename}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      })
    );

    return {
      success: true,
      url: getR2PublicUrl(key),
      key,
      size: file.size,
      name: file.name,
    };
  } catch (error) {
    console.error("Server upload to R2 failed:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to upload to R2",
    };
  }
}

/**
 * Delete file from Cloudflare R2 by key or full URL
 */
export async function deleteFileFromR2(keyOrUrl: string) {
  try {
    if (!keyOrUrl) return { success: false, error: "No key or URL provided" };

    let key = keyOrUrl;
    if (keyOrUrl.startsWith("http://") || keyOrUrl.startsWith("https://")) {
      try {
        const urlObj = new URL(keyOrUrl);
        key = urlObj.pathname.replace(/^\/+/, "");
      } catch {
        key = keyOrUrl;
      }
    }

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to delete object from R2:", error);
    return {
      success: false,
      error: (error as Error).message || "Failed to delete file from R2",
    };
  }
}