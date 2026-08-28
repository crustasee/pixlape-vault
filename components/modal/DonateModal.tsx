"use client";

import React from "react";
import Modal from "./Modal";
import Image from "next/image";

export interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  trakteerUrl?: string;
  saweriaUrl?: string;
  qrisImageUrl?: string;
  midtranseUrl?: string;
}

export default function DonateModal({
  isOpen,
  onClose,
  trakteerUrl = "https://trakteer.id/galih_addi/tip",
  saweriaUrl = "https://saweria.co",
  midtranseUrl = "https://www.midtrans.com/id",
}: DonateModalProps) {
  const openLink = (url: string) => window.open(url, "_blank");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-pink-500 text-white border border-black hover:scale-97 active:scale-97 transition-all duration-150 flex items-center shadow-pixel justify-center text-xl font-mono font-bold cursor-pointer"
      >
        ✕
      </button>

      {/* Heading */}
      <h2 className="text-xs font-mono uppercase tracking-widest text-black-secondary text-center mb-1">
        Support the creator
      </h2>
      <h1 className="text-base sm:text-lg font-pixel font-bold text-black-primary text-center mb-3 tracking-wide">
        TIP FOR CREATOR
      </h1>

      <hr className="w-full border-t border-border my-4" />

      {/* Icon placeholder */}
      <div className="w-20 h-20 mx-auto my-3 rounded-md bg-white border border-border flex items-center justify-center text-black-secondary text-xs font-mono font-bold shadow-xs">
        <Image src="/logopx.svg" alt="Logo" width={100} height={100} />
      </div>

      {/* Trakteer Button */}
    <button
    type="button"
    onClick={() => openLink(trakteerUrl)}
    className="w-full py-3 mt-2.5 rounded-lg bg-red-400 shadow-pixel text-white text-sm font-black border border-black hover:text-white hover:scale-97 active:scale-[0.99] transition-all duration-150 cursor-pointer text-center tracking-wider"
    >
      TRAKTEER
    </button>
     

      {/* Saweria Button */}
      <button
        type="button"
        onClick={() => openLink(saweriaUrl)}
        className="w-full py-3 mt-2.5 rounded-lg bg-pink-400 shadow-pixel text-white text-sm font-black border border-black hover:text-white hover:scale-97 active:scale-[0.99] transition-all duration-150 cursor-pointer text-center tracking-wider"
      >
        SAWERIA
      </button>

      {/* MIDTRANS Button */}
      <button
        type="button"
        onClick={() => midtranseUrl && openLink(midtranseUrl)}
        disabled={!midtranseUrl}
        className={`w-full py-3 mt-2.5 rounded-lg text-sm shadow-pixel font-black border transition-all duration-150 text-center tracking-wider ${
          midtranseUrl
            ? "bg-green-400 text-black-primary border-black hover:scale-96 active:scale-99 cursor-pointer"
            : "bg-green-400 text-black-primary border-black hover:bg-green-200 hover:scale-96 active:scale-99 cursor-not-allowed"
        }`}
      >MIDTRANS
      </button>
    </Modal>
  );
}