"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import Image from "next/image";
import {
  QrCode,
  Building2,
  Wallet,
  Smartphone,
  ArrowLeft,
  Check,
  ShieldCheck,
  ChevronRight,
  CreditCard,
} from "lucide-react";

export type MidtransPaymentMethod =
  | "qris"
  | "bank_transfer"
  | "ovo"
  | "shopeepay"
  | "dana";

export interface PayMidtransModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Amount in IDR (e.g. 25000 or "Rp 25.000") */
  amount?: number | string;
  /** Title or name of item being paid */
  itemName?: string;
  /** Order ID reference */
  orderId?: string;
  /** Callback when user proceeds with a payment method */
  onSelectMethod?: (
    method: MidtransPaymentMethod,
    extraData?: { bank?: string; phoneNumber?: string }
  ) => void;
  /** Optional custom URL or handler if redirecting directly */
  midtransUrl?: string;
}

interface MethodOption {
  id: MidtransPaymentMethod;
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  logoUrl: string;
  icon: React.ReactNode;
  bgHover: string;
  borderColor: string;
}

const PAYMENT_METHODS: MethodOption[] = [
  {
    id: "qris",
    name: "QRIS",
    tag: "INSTANT",
    tagColor: "bg-red-100 text-red-600 border-red-500 dark:bg-red-950/60 dark:text-red-400 dark:border-red-700",
    description: "Scan via GoPay, OVO, Dana, ShopeePay, BCA, dll",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1789664913/qrisblack.svg",
    icon: <QrCode className="w-5 h-5 text-red-600 dark:text-red-400" />,
    bgHover: "hover:bg-red-50 dark:hover:bg-red-950/40",
    borderColor: "border-red-400 dark:border-red-700",
  },
  {
    id: "bank_transfer",
    name: "BANK TRANSFER",
    tag: "VA 24 JAM",
    tagColor: "bg-blue-100 text-blue-700 border-blue-500 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-700",
    description: "Virtual Account BCA, Mandiri, BNI, BRI, Permata",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1789664902/bank.svg",
    icon: <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    bgHover: "hover:bg-blue-50 dark:hover:bg-blue-950/40",
    borderColor: "border-blue-400 dark:border-blue-700",
  },
  {
    id: "ovo",
    name: "OVO",
    tag: "E-WALLET",
    tagColor: "bg-purple-100 text-purple-700 border-purple-500 dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-700",
    description: "Notifikasi pembayaran langsung ke aplikasi OVO",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788506889/OVO_Logo_-_Colored_-_zonalogo.com.svg",
    icon: <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    bgHover: "hover:bg-purple-50 dark:hover:bg-purple-950/40",
    borderColor: "border-purple-400 dark:border-purple-700",
  },
  {
    id: "shopeepay",
    name: "SHOPEEPAY",
    tag: "E-WALLET",
    tagColor: "bg-orange-100 text-orange-700 border-orange-500 dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-700",
    description: "Bayar cepat dengan saldo ShopeePay atau SPayLater",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788701354/shopeepay.svg",
    icon: <Wallet className="w-12 h-5 text-orange-600 dark:text-orange-400" />,
    bgHover: "hover:bg-orange-50 dark:hover:bg-orange-950/40",
    borderColor: "border-orange-400 dark:border-orange-700",
  },
  {
    id: "dana",
    name: "DANA",
    tag: "E-WALLET",
    tagColor: "bg-sky-100 text-sky-700 border-sky-500 dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-700",
    description: "Konfirmasi instan via akun dan dompet digital DANA",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788701354/dana.svg",
    icon: <CreditCard className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    bgHover: "hover:bg-sky-50 dark:hover:bg-sky-950/40",
    borderColor: "border-sky-400 dark:border-sky-700",
  },
];

const VA_BANKS = [
  {
    id: "bca",
    name: "BCA VA",
    code: "BCA",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1789664912/bca.svg",
  },
  {
    id: "mandiri",
    name: "Mandiri VA",
    code: "MANDIRI",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788701354/mandiri.svg",
  },
  {
    id: "bni",
    name: "BNI VA",
    code: "BNI",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788701354/bni.svg",
  },
  {
    id: "bri",
    name: "BRI VA",
    code: "BRI",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788701354/bri.svg",
  },
  {
    id: "seabank",
    name: "Seabank VA",
    code: "seabank",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788509911/seabank-seeklogo.svg",
  },
];

export default function PayMidtransModal({
  isOpen,
  onClose,
  amount = 25000,
  itemName = "PIXLape Digital Asset / Tip",
  orderId,
  onSelectMethod,
  midtransUrl,
}: PayMidtransModalProps) {
  const [selectedMethod, setSelectedMethod] =
    useState<MidtransPaymentMethod | null>(null);
  const [selectedBank, setSelectedBank] = useState<string>("bca");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const formattedAmount =
    typeof amount === "number"
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(amount)
      : amount;

  const handleClose = () => {
    setSelectedMethod(null);
    setIsProcessing(false);
    onClose();
  };

  const handleSelectMethodClick = (method: MidtransPaymentMethod) => {
    setSelectedMethod(method);
  };

  const handleProceedPayment = () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    if (onSelectMethod) {
      onSelectMethod(selectedMethod, {
        bank: selectedMethod === "bank_transfer" ? selectedBank : undefined,
        phoneNumber: selectedMethod === "ovo" ? phoneNumber : undefined,
      });
    } else if (midtransUrl) {
      window.open(midtransUrl, "_blank");
    }

    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const currentMethodDetails = PAYMENT_METHODS.find(
    (m) => m.id === selectedMethod
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative max-h-[95vh] overflow-y-auto pr-0.5">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close modal"
          className="absolute right-1 w-8 h-8 rounded-md bg-pink-500 text-white border border-black dark:border-zinc-700 hover:scale-95 active:scale-90 transition-all duration-150 flex items-center justify-center text-lg font-mono font-bold cursor-pointer shadow-pixel z-10"
        >
          ✕
        </button>

        {/* Header Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-400 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            MIDTRANS SECURE PAY
          </span>
        </div>

        {/* Modal Title */}
        <h1 className="text-base sm:text-lg font-pixel font-bold text-black-primary dark:text-zinc-100 text-center tracking-wide uppercase mb-3">
          {selectedMethod ? "ORDER DETAILS" : "PAYMENT METHOD"}
        </h1>

        {/* Order / Amount Summary Box */}
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/60 p-3 mb-4 shadow-xs text-xs">
          <div className="flex items-center justify-between border-b border-dashed border-emerald-200 dark:border-emerald-800/60 pb-2 mb-2">
            <span className="text-black-primary dark:text-zinc-200 font-medium truncate max-w-52">
              {itemName}
            </span>
            {orderId && (
              <span className="font-mono text-[10px] bg-white dark:bg-zinc-900 px-1.5 py-0.5 border border-emerald-200 dark:border-emerald-800/60 rounded text-black-secondary dark:text-zinc-400">
                #{orderId}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between font-bold">
            <span className="text-black-primary dark:text-zinc-300 font-mono uppercase text-[11px]">
              Total Tagihan:
            </span>
            <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-extrabold tracking-tight">
              {formattedAmount}
            </span>
          </div>
        </div>

        {/* Step 1: Payment Method Buttons Menu */}
        {!selectedMethod ? (
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono font-bold text-black-secondary dark:text-zinc-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pilih Channel Midtrans:</span>
              <span className="text-[10px] font-normal text-black-tertiary dark:text-zinc-400">
                5 Pilihan
              </span>
            </div>

            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handleSelectMethodClick(method.id)}
                className="w-full group text-left p-1.5 rounded-md border border-black dark:border-zinc-700 dark:bg-zinc-900 shadow-pixel-sm hover:scale-97 hover:bg-emerald-100 dark:hover:bg-zinc-800 dark:hover:border-emerald-500 active:scale-96 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-36 h-8 shrink-0 flex items-center justify-center transition-transform overflow-hidden px-2 py-0.5 rounded bg-transparent">
                    <img
                      src={method.logoUrl}
                      alt={method.name}
                      className="max-h-6 max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Step 2: Selected Method Configuration / Action View */
          <div className="space-y-4">
            {/* Active Method Pill & Back Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedMethod(null)}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-black-secondary hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Ganti Metode
              </button>
              {currentMethodDetails && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${currentMethodDetails.tagColor}`}
                >
                  {currentMethodDetails.name}
                </span>
              )}
            </div>

            {/* Method Details Specific Content */}
            {selectedMethod === "qris" && (
              <div className="bg-red-50/70 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg text-center space-y-2.5 p-3">
                <div className="w-full mx-auto bg-white rounded-md flex items-center justify-center p-3 shadow-xs">
                  <img
                    src="https://res.cloudinary.com/lbovk2lu/image/upload/v1788972109/Puzzle_Code_GIF_by_Sam_Omo.gif"
                    alt="QRIS Official"
                    className="max-h-56 max-w-full object-contain rounded"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-mono text-black-secondary dark:text-zinc-400 mt-1">
                    Midtrans Verified QR
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === "bank_transfer" && (
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-black-secondary dark:text-zinc-300 uppercase">
                  Pilih Bank Virtual Account:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {VA_BANKS.map((bank) => {
                    const isBankSelected = selectedBank === bank.id;
                    return (
                      <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`w-full flex items-center justify-between px-6 py-2.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                          isBankSelected
                            ? "border-black dark:border-emerald-500 bg-green-100 dark:bg-emerald-950/50 text-black dark:text-emerald-300 shadow-pixel-sm font-black"
                            : "border-border dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black-secondary dark:text-zinc-400 hover:border-black dark:hover:border-zinc-600 dark:hover:bg-zinc-800/70"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="w-full h-9 rounded flex items-center justify-center shrink-0 shadow-xs px-2 py-0.5 bg-transparent dark:bg-white/95">
                            <img
                              src={bank.logoUrl}
                              alt={bank.name}
                              className="max-h-6 max-w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        {isBankSelected && (
                          <Check className="w-4 h-4 text-green-600 dark:text-emerald-400 ml-2 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedMethod === "ovo" && (
              <div className="p-3.5 bg-white dark:bg-zinc-900/80 border border-border dark:border-zinc-800 rounded-lg space-y-3">
                <div className="items-center gap-4 flex flex-col">
                  <div className="w-full h-12 bg-white dark:bg-white/95 rounded-md flex items-center justify-center shrink-0 p-1">
                    <img
                      src={currentMethodDetails?.logoUrl}
                      alt="OVO Official"
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-black dark:text-white text-center">
                      OVO PAYMENT
                    </h2>
                    <p className="text-[11px] font-mono text-black-secondary dark:text-zinc-400 text-center mt-0.5">
                      Masukkan nomor ponsel yang terdaftar di akun OVO kamu.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-black-secondary dark:text-zinc-300 mb-1">
                    Nomor Handphone OVO:
                  </label>
                  <input
                    type="tel"
                    placeholder="Exp: 081234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-surface dark:bg-zinc-950 border border-black dark:border-zinc-700 text-black dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 rounded-sm outline-hidden focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500"
                  />
                </div>
              </div>
            )}

            {selectedMethod === "shopeepay" && (
              <div className="bg-white dark:bg-zinc-900/80 border border-border dark:border-zinc-800 rounded-lg text-center">
                <div className="w-full mx-auto rounded-md flex items-center justify-center overflow-hidden bg-white dark:bg-white/95 p-2">
                  <img
                    src="https://res.cloudinary.com/lbovk2lu/image/upload/v1789665546/e2e4b22b-ae53-4f97-9569-0eadc16a4b33.jpg"
                    alt="ShopeePay Official"
                    className="max-h-full max-w-full object-contain rounded"
                    loading="lazy"
                  />
                </div>
                <h2 className="text-xs font-bold text-black dark:text-white">
                  PEMBAYARAN SHOPEEPAY
                </h2>
              </div>
            )}

            {selectedMethod === "dana" && (
              <div className="p-3.5 border border-border dark:border-zinc-800 rounded-lg text-center space-y-2">
                <div className="w-full h-36 mx-auto rounded-md flex items-center justify-center p-3">
                  <img
                    src={currentMethodDetails?.logoUrl}
                    alt="DANA Official"
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h2 className="font-black text-xs text-black dark:text-white">
                  DOMPET DIGITAL DANA
                </h2>
                <p className="text-[11px] font-mono text-black-secondary dark:text-zinc-400">
                  Login dan konfirmasi transaksi dengan saldo DANA melalui
                  portal checkout Midtrans DANA.
                </p>
              </div>
            )}

            {/* Action Pay Button */}
            <button
              type="button"
              onClick={handleProceedPayment}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-md bg-primary hover:bg-primary-hover text-black font-bold text-xs sm:text-sm border border-black dark:border-primary shadow-pixel hover:scale-98 active:scale-95 transition-all duration-150 cursor-pointer text-center tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span>MEMPROSES MIDTRANS...</span>
              ) : (
                <>
                  <span>BAYAR SEKARANG ({formattedAmount})</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Footer info & Midtrans Guarantee */}
        <div className="mt-5 pt-3 border-t border-border dark:border-zinc-800 flex items-center justify-between text-[10px] font-mono text-black-secondary dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Image
              src="/logopx.svg"
              alt="Logo"
              width={16}
              height={16}
              className="opacity-70 dark:opacity-90 dark:brightness-125"
            />
            <span className="font-bold text-black-primary dark:text-zinc-200">PIXLape</span>
          </div>
          <span className="text-black-tertiary dark:text-zinc-500">Powered by Midtrans Gateway</span>
        </div>
      </div>
    </Modal>
  );
}