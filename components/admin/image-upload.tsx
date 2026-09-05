// components/admin/image-upload.tsx
"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/app/actions/cloudinary-actions";
import { getPresignedUploadUrl } from "@/app/actions/upload-actions";
import {
  CloudArrowUp,
  Image as ImageIcon,
  Trash,
  Check,
  LinkSimple,
  Sparkle,
  HardDrive,
  Copy,
} from "@phosphor-icons/react";

export interface PresetItem {
  label: string;
  path: string;
}

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  folder?: string;
  presets?: PresetItem[];
  aspectRatio?: "square" | "video" | "banner" | "icon" | "auto";
  recommendedSize?: string;
  className?: string;
}

export default function ImageUpload({
  name,
  defaultValue = "",
  value,
  onChange,
  label = "Asset Image",
  folder = "products",
  aspectRatio = "auto",
  recommendedSize = "PNG, JPG, WEBP or SVG (Max 5MB)",
  className = "",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(value !== undefined ? value : defaultValue);
  const [prevValue, setPrevValue] = useState(value);
  const [storageTarget, setStorageTarget] = useState<"cloudinary" | "r2">("cloudinary");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Adjust state during render if controlled prop changed
  if (value !== undefined && value !== prevValue) {
    setPrevValue(value);
    setPreview(value);
  }

  const updateImage = (url: string) => {
    setPreview(url);
    setErrorMessage(null);
    onChange?.(url);
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/") && !file.name.endsWith(".svg")) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WEBP, SVG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size exceeds 10MB limit");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setUploadProgress(15);

    try {
      if (storageTarget === "cloudinary") {
        // Convert to Base64 for Cloudinary transformation pipeline
        setUploadProgress(40);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          try {
            const base64 = reader.result as string;
            setUploadProgress(70);
            const result = await uploadToCloudinary(base64, folder);

            if (result.success && result.url) {
              setUploadProgress(100);
              updateImage(result.url);
            } else {
              throw new Error(result.error || "Cloudinary upload failed");
            }
          } catch (err) {
            console.error("Cloudinary upload failed:", err);
            setErrorMessage((err as Error).message || "Failed to upload image to Cloudinary");
          } finally {
            setIsUploading(false);
          }
        };

        reader.onerror = () => {
          setErrorMessage("Failed to read image file");
          setIsUploading(false);
        };
      } else {
        // Upload directly to Cloudflare R2 via presigned URL
        const presigned = await getPresignedUploadUrl(file.name, file.type, `images/${folder}`);

        if (!presigned.success || !presigned.signedUrl || !presigned.fileUrl) {
          throw new Error(presigned.error || "Could not generate R2 upload token");
        }

        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        await new Promise<void>((resolve, reject) => {
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`R2 upload responded with status ${xhr.status}`));
            }
          });
          xhr.addEventListener("error", () => reject(new Error("R2 upload network error")));
          xhr.open("PUT", presigned.signedUrl!);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
          xhr.send(file);
        });

        updateImage(presigned.fileUrl);
        setIsUploading(false);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setErrorMessage((err as Error).message || "Image upload failed");
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storageTarget, folder]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleCopyUrl = () => {
    if (!preview) return;
    navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSourceBadge = () => {
    if (!preview) return null;
    if (preview.includes("cloudinary.com")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-500 text-emerald-800 text-[10px] font-mono font-bold">
          <Sparkle size={10} weight="fill" /> CLOUDINARY CDN
        </span>
      );
    }
    if (preview.includes("r2.cloudflarestorage.com") || preview.includes("r2.dev")) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 border border-amber-500 text-amber-900 text-[10px] font-mono font-bold">
          <HardDrive size={10} weight="fill" /> CLOUDFLARE R2
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-400 text-zinc-800 text-[10px] font-mono font-bold">
        <ImageIcon size={10} /> DIRECT / CUSTOM URL
      </span>
    );
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square max-h-48";
      case "video":
        return "aspect-video max-h-44";
      case "banner":
        return "aspect-[21/9] max-h-36";
      case "icon":
        return "w-24 h-24";
      default:
        return "max-h-44";
    }
  };

  return (
    <div className={`flex flex-col rounded-md bg-purple-200 border border-black-primary py-2 px-4 gap-2 font-mono shadow-pixel-sm ${className}`}>
      {/* Header with Label and Storage Target Toggle */}
      <div className="flex flex-wrap items-center justify-between">
        <label htmlFor={`upload-${name}`} className="font-bold text-xs text-black-primary uppercase flex items-center gap-1.5">
          <ImageIcon size={14} className="text-black-secondary" />
          {label}
        </label>

        {/* Target Pipeline Toggle */}
        <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-black-primary text-[10px]">
          <button
            type="button"
            onClick={() => setStorageTarget("cloudinary")}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer font-bold ${
              storageTarget === "cloudinary"
                ? "bg-yellow-300 text-blue-600 border border-blue-600 shadow-pixel-sm"
                : "text-black-secondary hover:text-black-primary"
            }`}
            title="Upload with automatic WebP/AVIF compression and responsive CDN delivery"
          >
            CDN
          </button>
          <button
            type="button"
            onClick={() => setStorageTarget("r2")}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer font-bold ${
              storageTarget === "r2"
                ? "bg-pink-200 text-red-600 border border-red-600 shadow-pixel-sm"
                : "text-black-secondary hover:text-black-primary"
            }`}
            title="Upload directly to Cloudflare R2 Vault (Zero Egress Storage)"
          >
            C R2
          </button>
        </div>
      </div>

      {/* Main Upload Dropzone / Preview Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative border border-black-primary rounded-lg text-center transition-all bg-pink-200 overflow-hidden shadow-pixel-sm hover:scale-98 ${
          dragOver
            ? "border-black-secondary bg-green-50 ring-2 ring-primary/40"
            : "border-black-secondary hover:border-black-primary"
        } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          id={`upload-${name}`}
          type="file"
          accept="image/*,.svg"
          onChange={onInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isUploading}
        />

        {preview ? (
          <div className="relative flex flex-col-2 items-center gap-2 py-2 px-4 rounded-md">
            {/* Image Preview Container */}
            <div className={`relative rounded-md border border-black-primary bg-white overflow-hidden ${getAspectClass()}`}>
              {preview.startsWith("/") ? (
                // Local static preset
                <Image
                  src={preview}
                  alt="Asset Preview"
                  width={300}
                  height={200}
                  className="object-contain w-full h-full max-h-40 p-1"
                  unoptimized
                />
              ) : (
                // Remote / Cloudinary / R2 image
                <Image
                  src={preview}
                  alt="Asset Preview"
                  width={400}
                  height={240}
                  className="object-contain w-full h-full max-h-40"
                  unoptimized
                />
              )}
            </div>

            {/* Preview Status & Controls */}
            <div className="flex flex-wrap items-center justify-between w-full pt-1 px-1 text-[11px] gap-2 border-border z-20">
              <div className="flex items-center gap-2 truncate">
                {getSourceBadge()}
                <span className="text-[10px] text-black-secondary truncate max-w-44" title={preview}>
                  {preview}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl();
                  }}
                  className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-black-primary rounded border border-border text-[10px] flex items-center gap-1 cursor-pointer"
                  title="Copy Image URL"
                >
                  {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateImage("");
                  }}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded border border-rose-200 text-[10px] flex items-center gap-1 cursor-pointer font-bold"
                  title="Remove Image"
                >
                  <Trash size={12} /> Clear
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-5 px-2 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center text-blue-600 group-hover:text-black-primary">
              <CloudArrowUp size={26} weight="duotone" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-bold text-black-primary">
                {isUploading
                  ? `UPLOADING TO ${storageTarget.toUpperCase()}...`
                  : "DRAG & DROP IMAGE OR BROWSE"}
              </p>
              <p className="text-[10px] text-black-secondary">{recommendedSize}</p>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-black-secondary font-mono">
              <span>Target:</span>
              <span className="font-bold text-black-primary underline">
                {storageTarget === "cloudinary" ? "Cloudinary Auto-Format" : "Cloudflare R2 Bucket"}
              </span>
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="absolute inset-x-0 bottom-0 bg-black-primary/10 p-2 backdrop-blur-xs flex flex-col gap-1 z-30">
            <div className="flex justify-between text-[10px] font-bold text-black-primary px-1">
              <span>Uploading to {storageTarget === "cloudinary" ? "Cloudinary" : "R2"}...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2 rounded bg-rose-50 border border-rose-300 text-rose-700 text-[11px] font-mono flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-800 text-xs ml-2 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Direct / Custom URL Input (Always Visible) */}
      <div className="flex items-center gap-2 mt-0.5">
        <div className="relative flex-1 flex items-center">
          <LinkSimple size={13} className="absolute left-3 text-black-secondary pointer-events-none" />
          <input
            type="text"
            value={preview}
            onChange={(e) => updateImage(e.target.value)}
            placeholder="Paste direct Image URL (e.g. https://res.cloudinary.com/... or https://...)"
            className="w-full pl-7 pr-2.5 py-2 border border-black-secondary rounded text-[11px] font-mono bg-white text-black-primary focus:outline-none focus:border-black-primary"
          />
        </div>
      </div>

      {/* Hidden input for form action submission */}
      <input type="hidden" name={name} value={preview} />
    </div>
  );
}