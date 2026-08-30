// lib/r2.ts
import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: accountId
    ? `https://${accountId}.r2.cloudflarestorage.com`
    : "https://auto.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "pixlape";
export const R2_PUBLIC_URL =
  process.env.R2_PUBLIC_URL ||
  (accountId ? `https://${accountId}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}` : "");

/**
 * Helper to build public URL for an R2 key
 */
export function getR2PublicUrl(key: string): string {
  const base = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
  if (base) {
    return `${base}/${key.replace(/^\//, "")}`;
  }
  if (accountId) {
    return `https://${accountId}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key.replace(/^\//, "")}`;
  }
  return `/${key.replace(/^\//, "")}`;
}