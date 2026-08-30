// components/admin/file-upload.tsx
"use client";

import React, { useState } from "react";
import { getPresignedUploadUrl, deleteFileFromR2 } from "@/app/actions/upload-actions";
import {
  Archive,
  CloudArrowUp,
  Trash,
  Check,
  HardDrive,
  Copy,
  LinkSimple,
} from "@phosphor-icons/react";

interface FileUploadProps {
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  folder?: string;
  acceptedTypes?: string;
  recommendedSize?: string;
  className?: string;
}

export default function FileUpload({
  name,
  defaultValue = "",
  value,
  onChange,
  label = "Downloadable Asset Package",
  folder = "assets",
  acceptedTypes = ".zip,.rar,.abr,.psd,.ai,.fig,.sketch,.pdf,.apk,.tar.gz",
  recommendedSize = "ZIP, RAR, PSD, ABR, AI, FIG (Max 500MB on R2)",
  className = "",
}: FileUploadProps) {
  const [fileUrl, setFileUrl] = useState(value !== undefined ? value : defaultValue);
  const [prevValue, setPrevValue] = useState(value);
  const [fileName, setFileName] = useState("");
  const [fileSizeStr, setFileSizeStr] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (value !== undefined && value !== prevValue) {
    setPrevValue(value);
    setFileUrl(value);
  }

  const updateFileUrl = (url: string) => {
    setFileUrl(url);
    setErrorMessage(null);
    onChange?.(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setFileName(file.name);
    setFileSizeStr(formatBytes(file.size));
    setProgress(0);
    setErrorMessage(null);

    try {
      // 1. Request presigned upload URL from Cloudflare R2
      const presigned = await getPresignedUploadUrl(
        file.name,
        file.type || "application/octet-stream",
        folder
      );

      if (!presigned.success || !presigned.signedUrl || !presigned.fileUrl) {
        throw new Error(presigned.error || "Failed to generate presigned upload token");
      }

      // 2. Upload directly to Cloudflare R2 bucket with XHR for accurate progress
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status code ${xhr.status}`));
          }
        });
        xhr.addEventListener("error", () => reject(new Error("Network error during file upload")));
        xhr.open("PUT", presigned.signedUrl!);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });

      updateFileUrl(presigned.fileUrl);
    } catch (error) {
      console.error("R2 Upload failed:", error);
      setErrorMessage((error as Error).message || "Failed to upload file to Cloudflare R2");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (fileUrl && fileUrl.includes("r2.cloudflarestorage.com")) {
      deleteFileFromR2(fileUrl).catch(console.error);
    }
    updateFileUrl("");
    setFileName("");
    setFileSizeStr("");
  };

  const handleCopyUrl = () => {
    if (!fileUrl) return;
    navigator.clipboard.writeText(fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col gap-2 font-mono ${className}`}>
      {/* Header Label */}
      <div className="flex items-center justify-between">
        <label htmlFor={`file-upload-${name}`} className="font-bold text-xs text-black-primary uppercase flex items-center gap-1.5">
          <Archive size={14} className="text-black-secondary" />
          {label}
        </label>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-bold">
          <HardDrive size={10} weight="fill" /> CLOUDFLARE R2 VAULT
        </span>
      </div>

      {/* Main Upload / File Status Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`relative border border-dashed rounded-lg p-3.5 transition-all bg-white ${
          dragOver
            ? "border-primary bg-green-50 ring-2 ring-primary/40"
            : "border-border hover:border-black-primary"
        } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          id={`file-upload-${name}`}
          type="file"
          accept={acceptedTypes}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isUploading}
        />

        {fileUrl ? (
          <div className="flex flex-col gap-2 relative z-20">
            <div className="flex items-center justify-between bg-zinc-50 border border-black-primary p-2.5 rounded">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded bg-primary border border-black-primary flex items-center justify-center text-black-primary shrink-0">
                  <Archive size={18} weight="bold" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-black-primary truncate max-w-64">
                    {fileName || fileUrl.split("/").pop() || "Vault Package"}
                  </p>
                  <p className="text-[10px] text-black-secondary flex items-center gap-1.5">
                    {fileSizeStr && <span>{fileSizeStr} •</span>}
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <Check size={10} weight="bold" /> Stored in Cloudflare R2
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl();
                  }}
                  className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-black-primary rounded border border-border text-[10px] flex items-center gap-1 cursor-pointer"
                  title="Copy Download URL"
                >
                  {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy URL"}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded border border-rose-200 text-[10px] flex items-center gap-1 cursor-pointer font-bold"
                  title="Remove Asset"
                >
                  <Trash size={12} /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-zinc-100 border border-border flex items-center justify-center text-black-secondary">
              <CloudArrowUp size={22} weight="duotone" />
            </div>
            <div>
              <p className="text-xs font-bold text-black-primary">
                {isUploading ? `UPLOADING TO R2 (${progress}%)...` : "DRAG & DROP ASSET FILE OR BROWSE"}
              </p>
              <p className="text-[10px] text-black-secondary">{recommendedSize}</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="mt-2 w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Error display */}
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

      {/* Direct Download URL Input (Always Visible) */}
      <div className="flex items-center gap-1.5 mt-0.5">
        <div className="relative flex-1 flex items-center">
          <LinkSimple size={13} className="absolute left-2.5 text-black-secondary pointer-events-none" />
          <input
            type="text"
            value={fileUrl}
            onChange={(e) => updateFileUrl(e.target.value)}
            placeholder="Direct / external download URL (e.g. Cloudflare R2, Google Drive, Mediafire...)"
            className="w-full pl-7 pr-2.5 py-1.5 border border-border rounded text-[11px] font-mono bg-white text-black-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Hidden input for form action */}
      <input type="hidden" name={name} value={fileUrl} />
    </div>
  );
}