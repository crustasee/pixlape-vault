// components/admin/file-upload.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  getPresignedUploadUrl,
  deleteFileFromR2,
  uploadToR2ServerAction,
} from "@/app/actions/upload-actions";
import {
  Archive,
  CloudArrowUp,
  Trash,
  Check,
  HardDrive,
  Copy,
  LinkSimple,
  Globe,
  ArrowClockwise,
} from "@phosphor-icons/react";

interface FileUploadProps {
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (url: string) => void;
  onFileMeta?: (meta: { name: string; size: string; format: string }) => void;
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
  onFileMeta,
  label = "Downloadable Asset Package",
  folder = "packages",
  acceptedTypes = ".zip,.rar,.abr,.psd,.ai,.fig,.sketch,.pdf,.apk,.tar.gz,.7z,.exe",
  recommendedSize = "ZIP, RAR, PSD, ABR, AI, FIG, APK (Max 500MB on R2)",
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined && value !== prevValue) {
      setPrevValue(value);
      setFileUrl(value);
    }
  }, [value, prevValue]);

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

  const getDisplayFileName = (url: string) => {
    if (fileName) return fileName;
    if (!url) return "Vault Package";
    try {
      const cleanUrl = url.split("?")[0].split("#")[0];
      const segments = cleanUrl.split("/").filter(Boolean);
      if (segments.length > 1 && segments[segments.length - 1].toLowerCase() === "file") {
        return decodeURIComponent(segments[segments.length - 2]);
      }
      const lastSeg = segments[segments.length - 1];
      return decodeURIComponent(lastSeg || "Vault Package");
    } catch {
      return "Vault Package";
    }
  };

  const isR2Url = Boolean(
    fileUrl &&
      (fileUrl.includes("r2.cloudflarestorage.com") ||
        fileUrl.includes(".r2.dev") ||
        fileUrl.includes("r2.dev"))
  );

  const handleFile = async (file: File) => {
    setIsUploading(true);
    setFileName(file.name);
    const sizeStr = formatBytes(file.size);
    setFileSizeStr(sizeStr);
    setProgress(10);
    setErrorMessage(null);

    const extMatch = file.name.match(/\.([0-9a-z]+)$/i);
    const formatStr = extMatch ? `.${extMatch[1].toUpperCase()}` : ".ZIP";

    onFileMeta?.({
      name: file.name,
      size: sizeStr,
      format: formatStr,
    });

    try {
      // 1. Request presigned upload URL from Cloudflare R2
      const presigned = await getPresignedUploadUrl(
        file.name,
        file.type || "application/octet-stream",
        folder
      );

      let finalUrl = "";

      if (presigned.success && presigned.signedUrl && presigned.fileUrl) {
        // 2. Direct browser-to-R2 upload with progress tracking
        try {
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
                reject(new Error(`Direct R2 upload responded with status ${xhr.status}`));
              }
            });
            xhr.addEventListener("error", () =>
              reject(new Error("Direct R2 upload network or CORS error"))
            );
            xhr.open("PUT", presigned.signedUrl!);
            xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
            xhr.send(file);
          });

          finalUrl = presigned.fileUrl;
        } catch (directErr) {
          console.warn("Direct R2 upload failed, falling back to server action...", directErr);
          // Fallback to server-side action
          setProgress(50);
          const formData = new FormData();
          formData.append("file", file);
          const serverUpload = await uploadToR2ServerAction(formData, folder);

          if (!serverUpload.success || !serverUpload.url) {
            throw new Error(serverUpload.error || "Server upload to R2 failed");
          }
          finalUrl = serverUpload.url;
          setProgress(100);
        }
      } else {
        // If presigned URL generation failed, fallback directly to server action
        const formData = new FormData();
        formData.append("file", file);
        const serverUpload = await uploadToR2ServerAction(formData, folder);

        if (!serverUpload.success || !serverUpload.url) {
          throw new Error(serverUpload.error || "Server upload to R2 failed");
        }
        finalUrl = serverUpload.url;
        setProgress(100);
      }

      updateFileUrl(finalUrl);
    } catch (error) {
      console.error("R2 Upload failed:", error);
      setErrorMessage((error as Error).message || "Failed to upload file to Cloudflare R2");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    if (fileUrl && isR2Url) {
      deleteFileFromR2(fileUrl).catch(console.error);
    }
    updateFileUrl("");
    setFileName("");
    setFileSizeStr("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyUrl = () => {
    if (!fileUrl) return;
    navigator.clipboard.writeText(fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Always reset input value so re-selecting the same file fires onChange
    e.target.value = "";
  };

  return (
    <div
      className={`flex flex-col bg-yellow-200 border border-black-primary rounded-md px-5 py-3 gap-2 font-mono shadow-pixel-sm ${className}`}
    >
      {/* Header Label */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={`file-upload-${name}`}
          className="font-bold text-xs text-black-primary uppercase flex items-center gap-2 cursor-pointer select-none"
        >
          <Archive size={14} className="text-black-secondary" />
          {label}
        </label>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-black-secondary text-black-secondary text-[10px] font-bold shadow-pixel-sm">
          <HardDrive size={10} weight="fill" /> C R2
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
        className={`relative border border-black-primary rounded-md transition-colors bg-emerald-200 shadow-pixel-sm hover:scale-98${
          dragOver
            ? "border-primary bg-green-50 ring-2 ring-primary/40"
            : "border-black-primary hover:border-black-primary"
        } ${isUploading ? "pointer-events-none opacity-80" : ""}`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          id={`file-upload-${name}`}
          type="file"
          accept={acceptedTypes}
          onChange={onFileInputChange}
          className="sr-only"
          disabled={isUploading}
        />

        {fileUrl ? (
          <div className="p-2 flex flex-col gap-2">
            <div className="flex items-center justify-between bg-green-100 border border-black-primary p-2 rounded">
              <div className="flex items-center gap-3 truncate">
                <div className="w-9 h-9 rounded-sm bg-white border border-black-primary flex items-center justify-center text-black-primary shrink-0">
                  <Archive size={22} weight="bold" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-black-primary truncate max-w-64" title={fileUrl}>
                    {getDisplayFileName(fileUrl)}
                  </p>
                  <p className="text-[10px] text-black-secondary flex items-center gap-1.5 flex-wrap">
                    {fileSizeStr && <span>{fileSizeStr} •</span>}
                    {isR2Url ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <Check size={10} weight="bold" /> Stored in Cloudflare R2
                      </span>
                    ) : (
                      <span className="text-blue-700 font-bold flex items-center gap-0.5">
                        <Globe size={10} weight="bold" /> External Download Link
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-2 py-1 bg-white hover:bg-emerald-100 text-black-primary rounded border border-black-primary text-[10px] flex items-center gap-1 cursor-pointer font-bold shadow-xs transition-colors"
                  title="Upload a different file to replace"
                >
                  <ArrowClockwise size={12} weight="bold" /> Replace
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl();
                  }}
                  className="px-2 py-1 bg-green-200 hover:bg-green-300 text-black-primary rounded border border-border text-[10px] flex items-center gap-1 cursor-pointer"
                  title="Copy Download URL"
                >
                  {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
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
                  <Trash size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="py-4 px-3 flex flex-col items-center justify-center text-center cursor-pointer select-none group"
          >
            <div className="w-9 h-9 flex items-center justify-center text-emerald-800 mb-1 group-hover:scale-110 transition-transform">
              <CloudArrowUp size={28} weight="duotone" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-800">
                {isUploading
                  ? `UPLOADING TO R2 (${progress}%)...`
                  : "DRAG & DROP ASSET FILE OR CLICK TO BROWSE"}
              </p>
              <p className="text-[10px] text-green-700 mt-0.5">{recommendedSize}</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <div className="p-2 w-full bg-black-primary/5 border-t border-border">
            <div className="flex justify-between text-[10px] font-bold text-green-900 mb-1">
              <span>Uploading package to R2...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white rounded-full h-1.5 overflow-hidden border border-black-primary">
              <div
                className="bg-emerald-600 h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
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

      {/* Direct Download URL Input */}
      <div className="flex items-center gap-3 mt-1">
        <div className="relative flex-1 flex items-center">
          <LinkSimple size={13} className="absolute left-3 text-black-secondary pointer-events-none" />
          <input
            type="text"
            value={fileUrl}
            onChange={(e) => updateFileUrl(e.target.value)}
            placeholder="Direct / external download URL (e.g. Cloudflare R2, Google Drive, Mediafire...)"
            className="w-full pl-7 pr-2.5 py-2 border border-black-secondary rounded text-[11px] font-mono bg-amber-50 text-black-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Hidden input for form action */}
      <input type="hidden" name={name} value={fileUrl} />
    </div>
  );
}