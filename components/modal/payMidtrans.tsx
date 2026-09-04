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
    tagColor: "bg-red-100 text-red-600 border-red-500",
    description: "Scan via GoPay, OVO, Dana, ShopeePay, BCA, dll",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788506168/quick-response-code-indonesia-standard-qris-seeklogo.svg",
    icon: <QrCode className="w-5 h-5 text-red-600" />,
    bgHover: "hover:bg-red-50",
    borderColor: "border-red-400",
  },
  {
    id: "bank_transfer",
    name: "BANK TRANSFER",
    tag: "VA 24 JAM",
    tagColor: "bg-blue-100 text-blue-700 border-blue-500",
    description: "Virtual Account BCA, Mandiri, BNI, BRI, Permata",
    logoUrl: "https://files.svgcdn.io/fluent/building-bank-16-filled.svg",
    icon: <Building2 className="w-5 h-5 text-blue-600" />,
    bgHover: "hover:bg-blue-50",
    borderColor: "border-blue-400",
  },
  {
    id: "ovo",
    name: "OVO",
    tag: "E-WALLET",
    tagColor: "bg-purple-100 text-purple-700 border-purple-500",
    description: "Notifikasi pembayaran langsung ke aplikasi OVO",
    logoUrl: "https://res.cloudinary.com/lbovk2lu/image/upload/v1788506889/OVO_Logo_-_Colored_-_zonalogo.com.svg",
    icon: <Smartphone className="w-5 h-5 text-purple-600" />,
    bgHover: "hover:bg-purple-50",
    borderColor: "border-purple-400",
  },
  {
    id: "shopeepay",
    name: "SHOPEEPAY",
    tag: "E-WALLET",
    tagColor: "bg-orange-100 text-orange-700 border-orange-500",
    description: "Bayar cepat dengan saldo ShopeePay atau SPayLater",
    logoUrl: "https://www.freelogovectors.net/wp-content/uploads/2023/10/shopeepay-logo-freelogovectors.net_.png",
    icon: <Wallet className="w-5 h-5 text-orange-600" />,
    bgHover: "hover:bg-orange-50",
    borderColor: "border-orange-400",
  },
  {
    id: "dana",
    name: "DANA",
    tag: "E-WALLET",
    tagColor: "bg-sky-100 text-sky-700 border-sky-500",
    description: "Konfirmasi instan via akun dan dompet digital DANA",
    logoUrl: "https://www.freelogovectors.net/wp-content/uploads/2023/10/dana-logo-freelogovectors.net_.png",
    icon: <CreditCard className="w-5 h-5 text-sky-600" />,
    bgHover: "hover:bg-sky-50",
    borderColor: "border-sky-400",
  },
];

const VA_BANKS = [
  {
    id: "bca",
    name: "BCA VA",
    code: "BCA",
    logoUrl: "https://www.freelogovectors.net/wp-content/uploads/2023/10/bca-logo-freelogovectors.net_.png",
  },
  {
    id: "mandiri",
    name: "Mandiri VA",
    code: "MANDIRI",
    logoUrl: "https://www.freelogovectors.net/wp-content/uploads/2023/10/mandiri-logo-freelogovectors.net_.png",
  },
  {
    id: "bni",
    name: "BNI VA",
    code: "BNI",
    logoUrl: "https://www.freelogovectors.net/wp-content/uploads/2019/09/bni-logo-bank-negara-indonesia.png",
  },
  {
    id: "bri",
    name: "BRI VA",
    code: "BRI",
    logoUrl: "https://www.freelogovectors.net/wp-content/uploads/2023/02/bri-logo-freelogovectors.net_.png",
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
          className="absolute  right-1 w-8 h-8 rounded-md bg-pink-500 text-white border border-black hover:scale-95 active:scale-90 transition-all duration-150 flex items-center justify-center text-lg font-mono font-bold cursor-pointer shadow-pixel z-10"
        >
          ✕
        </button>

        {/* Header Badge */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-green-100 text-green-800 border border-green-400">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            MIDTRANS SECURE PAY
          </span>
        </div>

        {/* Modal Title */}
        <h1 className="text-base sm:text-lg font-pixel font-bold text-black-secondary text-center tracking-wide uppercase mb-3">
          {selectedMethod ? "ORDER DETAILS" : "PAYMENT METHOD"}
        </h1>

        {/* Order / Amount Summary Box */}
        <div className="w-full bg-green-100 rounded-lg border p-3 mb-4 shadow-xs text-xs">
          <div className="flex items-center justify-between border-b border-dashed border-border pb-2 mb-2">
            <span className="text-black-secondary truncate max-w-52">
              {itemName}
            </span>
            {orderId && (
              <span className="font-mono text-[10px] bg-surface px-1.5 py-0.5 border border-border rounded text-black-secondary">
                #{orderId}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between font-bold">
            <span className="text-black-primary font-mono uppercase text-[11px]">
              Total Tagihan:
            </span>
            <span className="text-sm font-mono text-emerald-600 font-extrabold tracking-tight">
              {formattedAmount}
            </span>
          </div>
        </div>

        {/* Step 1: Payment Method Buttons Menu */}
        {!selectedMethod ? (
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono font-bold text-black-secondary uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pilih Channel Midtrans:</span>
              <span className="text-[10px] font-normal text-black-tertiary">
                5 Pilihan
              </span>
            </div>

            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handleSelectMethodClick(method.id)}
                className={`w-full group text-left p-1 rounded-md border border-black bg-green-100 shadow-pixel hover:scale-96 active:translate-x-0 active:translate-y-0 transition-all duration-150 cursor-pointer flex items-center justify-center`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-24 h-12 shrink-0 flex items-center justify-center transition-transform overflow-hidden">
                    <img
                      src={method.logoUrl}
                      alt={method.name}
                      className="max-h-full max-w-full object-contain"
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
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-black-secondary hover:text-black transition-colors cursor-pointer"
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
              <div className="bg-red-50/70 border border-red-200 rounded-lg text-center space-y-2.5">
                <div className="w-full mx-auto bg-white rounded-md flex items-center justify-center p-2 shadow-xs">
                  <img
                    src="https://res.cloudinary.com/lbovk2lu/image/upload/v1788508579/qrissimulation.svg"
                    alt="QRIS Official"
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-[11px] font-mono text-black-secondary mt-1">
                    Midtrans Verified QR
                  </p>
                </div>
              </div>
            )}

            {selectedMethod === "bank_transfer" && (
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-black-secondary uppercase">
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
                        className={`w-full flex items-center justify-between px-12 py-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                          isBankSelected
                            ? "border-black bg-blue-100 text-black shadow-pixel-sm font-black"
                            : "border-border bg-white text-black-secondary hover:border-black"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="w-full h-9 rounded flex items-center justify-center shrink-0 shadow-xs">
                            <img
                              src={bank.logoUrl}
                              alt={bank.name}
                              className="max-h-full max-w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        {isBankSelected && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedMethod === "ovo" && (
              <div className="p-3.5 bg-white border rounded-lg space-y-3">
                <div className="items-center gap-4 flex flex-col">
                  <div className="w-full h-12 bg-white rounded-md flex items-center justify-center shrink-0">
                    <img
                      src={currentMethodDetails?.logoUrl}
                      alt="OVO Official"
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-black text-center">
                      OVO PAYMENT
                    </h2>
                    <p className="text-[11px] font-mono text-black-secondary">
                      Masukkan nomor ponsel yang terdaftar di akun OVO kamu.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-black-secondary mb-1">
                    Nomor Handphone OVO:
                  </label>
                  <input
                    type="tel"
                    placeholder="Exp: 081234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-surface border border-black rounded-sm outline-hidden focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            )}

            {selectedMethod === "shopeepay" && (
              <div className="p-3.5 bg-white border rounded-lg text-center space-y-2">
                <div className="w-full h-34 mx-auto rounded-md flex items-center justify-center">
                  <img
                    src={currentMethodDetails?.logoUrl}
                    alt="ShopeePay Official"
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h2 className="text-xs font-bold text-black">
                  PEMBAYARAN SHOPEEPAY
                </h2>
                <p className="text-[11px] font-mono text-black-secondary">
                  Kamu akan diarahkan ke aplikasi Shopee atau ditampilkan QR
                  Code ShopeePay untuk menyelesaikan pembayaran.
                </p>
              </div>
            )}

            {selectedMethod === "dana" && (
              <div className="p-3.5 bg-white border rounded-lg text-center space-y-2">
                <div className="w-full h-46 mx-auto rounded-md flex items-center justify-center shadow-xs">
                  <img
                    src={currentMethodDetails?.logoUrl}
                    alt="DANA Official"
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <h2 className="font-black text-xs text-black">
                  DOMPET DIGITAL DANA
                </h2>
                <p className="text-[11px] font-mono text-black-secondary">
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
              className="w-full py-2 rounded-md bg-primary hover:bg-primary-hover text-black font-bold text-xs sm:text-sm border border-black shadow-pixel hover:scale-98 active:scale-95 transition-all duration-150 cursor-pointer text-center tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[10px] font-mono text-black-secondary">
          <div className="flex items-center gap-1">
            <Image
              src="/logopx.svg"
              alt="Logo"
              width={16}
              height={16}
              className="opacity-70"
            />
            <span className="font-bold">PIXLape</span>
          </div>
          <span>Powered by Midtrans Gateway</span>
        </div>
      </div>
    </Modal>
  );
}