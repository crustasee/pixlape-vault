"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Image from "next/image";
import {
  CheckCircle2,
  Loader2,
  Heart,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface PaymentFinishProps {
  isOpen: boolean;
  onClose: () => void;
  /** Amount paid (e.g. 25000 or "Rp 25.000") */
  amount?: number | string;
  /** Order ID or Transaction reference */
  orderId?: string;
  /** Title of product, asset, or donation */
  itemName?: string;
  /** Payment method used (e.g. QRIS, BCA VA, ShopeePay, DANA, OVO) */
  paymentMethod?: string;
  /** Optional download URL if purchasing a digital asset */
  downloadUrl?: string;
  /** Optional callback when user clicks download or finish */
  onDownload?: () => void;
  /** Duration of loading simulation in milliseconds (default: 2200ms) */
  loadingDuration?: number;
}

export default function PaymentFinish({
  isOpen,
  onClose,
  amount = 25000,
  orderId = "MID-PX98214",
  itemName = "PIXLape Creator Support",
  paymentMethod = "QRIS Midtrans",
  downloadUrl,
  onDownload,
  loadingDuration = 2200,
}: PaymentFinishProps) {
  const [status, setStatus] = useState<"loading" | "success">("loading");
  const [progress, setProgress] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>("");

  const formattedAmount =
    typeof amount === "number"
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(amount)
      : amount;

  // Handle loading to success transition when modal opens
  useEffect(() => {
    if (!isOpen) {
      setStatus("loading");
      setProgress(15);
      setCopied(false);
      return;
    }

    // Capture current date time formatted
    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentDate(formattedDate);

    setStatus("loading");
    setProgress(20);

    const step1 = setTimeout(() => setProgress(55), loadingDuration * 0.3);
    const step2 = setTimeout(() => setProgress(88), loadingDuration * 0.7);
    const stepFinal = setTimeout(() => {
      setProgress(100);
      setStatus("success");
    }, loadingDuration);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(stepFinal);
    };
  }, [isOpen, loadingDuration]);

  const handleCopyOrderId = () => {
    if (typeof window !== "undefined" && orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    } else if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative max-h-[92vh] overflow-y-auto pr-0.5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-1 top-0 w-8 h-8 rounded-md bg-pink-500 text-white border border-black hover:scale-95 active:scale-90 transition-all duration-150 flex items-center justify-center text-base font-mono font-bold cursor-pointer shadow-pixel z-10"
        >
          ✕
        </button>

        {/* ─── STATE 1: LOADING / VERIFYING PAYMENT ─── */}
        {status === "loading" ? (
          <div className="py-8 px-2 flex flex-col items-center justify-center text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-400 mb-5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              VERIFIKASI TRANSAKSI
            </div>

            {/* Animated Retro Loader Box */}
            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-black flex items-center justify-center shadow-pixel mb-5 relative">
              <Loader2 className="w-10 h-10 text-primary-dim animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-black-primary">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Title & Friendly Loading Note */}
            <h2 className="text-base font-pixel font-bold text-black-primary tracking-wide uppercase mb-1">
              MEMERIKSA PEMBAYARAN...
            </h2>
            <p className="text-xs font-mono text-black-secondary max-w-[320px] leading-relaxed mb-6">
              Sistem sedang menghubungkan ke gateway Midtrans untuk memverifikasi
              status transaksi kamu.
            </p>

            {/* Retro Progress Bar */}
            <div className="w-full max-w-[320px] bg-white border-2 border-black rounded-lg p-1 shadow-pixel-sm mb-3">
              <div
                className="h-3.5 bg-primary rounded-xs transition-all duration-300 ease-out flex items-center justify-end pr-1"
                style={{ width: `${progress}%` }}
              >
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
              </div>
            </div>

            <span className="text-[11px] font-mono text-black-tertiary">
              {progress < 50
                ? "Menghubungkan ke jaringan..."
                : progress < 90
                ? "Memvalidasi dana masuk..."
                : "Menyelesaikan bukti transaksi..."}
            </span>
          </div>
        ) : (
          /* ─── STATE 2: PEMBAYARAN BERHASIL (SUCCESS & FRIENDLY THANK YOU) ─── */
          <div className="py-2 flex flex-col items-center text-center">
            {/* Celebration Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-green-100 text-green-800 border border-green-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              MIDTRANS SETTLED & VERIFIED
            </div>

            {/* Success Icon with Pixel Aesthetic & Heart Badge */}
            <div className="relative mb-3">
              <div className="w-18 h-18 rounded-2xl bg-green-300 border-2 border-black flex items-center justify-center shadow-pixel transition-transform hover:scale-105">
                <CheckCircle2 className="w-10 h-10 text-black stroke-[2.5]" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-pink-500 rounded-full border border-black flex items-center justify-center text-white shadow-xs">
                <Heart className="w-4 h-4 fill-white" />
              </div>
            </div>

            {/* Modal Title */}
            <h1 className="text-base sm:text-lg font-pixel font-bold text-black-primary tracking-wide uppercase mb-1 flex items-center justify-center gap-1.5">
              <span>PEMBAYARAN BERHASIL!</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>

            {/* Friendly Thank You Warm Message */}
            <div className="bg-pink-50/90 border border-pink-300 rounded-lg p-3 my-2.5 text-left max-w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base select-none">💖</span>
                <h4 className="font-pixel text-xs text-black font-bold">
                  Terima Kasih Banyak!
                </h4>
              </div>
              <p className="text-xs font-mono text-black-secondary leading-relaxed">
                Dukungan kamu telah kami terima dengan hangat. Kebaikanmu sangat
                berarti dalam menjaga karya, aset kreatif, dan komunitas PIXLape
                terus hidup dan berkembang!
              </p>
            </div>

            {/* Neo-brutalist Digital Receipt Card */}
            <div className="w-full bg-white rounded-lg border-2 border-black p-3.5 my-2 shadow-pixel text-left font-mono text-xs">
              <div className="flex items-center justify-between border-b border-dashed border-border pb-2.5 mb-2.5">
                <div>
                  <span className="text-[10px] text-black-secondary uppercase block">
                    ID Transaksi
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-bold text-black text-xs font-mono">
                      {orderId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOrderId}
                      className="p-1 hover:bg-surface rounded text-black-secondary hover:text-black transition-colors"
                      title="Salin ID Transaksi"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-black-secondary uppercase block">
                    Status
                  </span>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-400">
                    LUNAS
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center text-black-secondary">
                  <span>Item / Keterangan:</span>
                  <span className="font-bold text-black truncate max-w-[200px]">
                    {itemName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-black-secondary">
                  <span>Metode Bayar:</span>
                  <span className="font-bold text-black uppercase">
                    {paymentMethod}
                  </span>
                </div>
                {currentDate && (
                  <div className="flex justify-between items-center text-black-secondary">
                    <span>Waktu Pembayaran:</span>
                    <span className="font-medium text-black">{currentDate}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-dotted border-border text-xs">
                  <span className="font-bold text-black uppercase">
                    Total Diterima:
                  </span>
                  <span className="font-bold text-emerald-600 text-sm font-mono">
                    {formattedAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2 mt-3">
              {downloadUrl || onDownload ? (
                <button
                  type="button"
                  onClick={handleDownloadClick}
                  className="w-full py-2.5 px-3 bg-primary hover:bg-primary-hover text-black font-pixel font-bold text-xs sm:text-sm border-2 border-black rounded-lg shadow-pixel hover:scale-98 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>UNDUH ASET SEKARANG</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-3 bg-surface hover:bg-surface-hover text-black font-pixel font-bold text-xs sm:text-sm border border-black rounded-lg shadow-pixel hover:scale-98 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>SELESAI & KEMBALI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Footer PIXLape Branding */}
            <div className="mt-4 pt-2.5 border-t border-border w-full flex items-center justify-between text-[10px] font-mono text-black-secondary">
              <div className="flex items-center gap-1">
                <Image
                  src="/logopx.svg"
                  alt="Logo"
                  width={14}
                  height={14}
                  className="opacity-70"
                />
                <span className="font-bold">PIXLape Vault</span>
              </div>
              <span>Status Pembayaran Terverifikasi</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
