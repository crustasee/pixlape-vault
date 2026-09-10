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
  trakteerUrl = "https://trakteer.id/pixlape/tip",
  saweriaUrl = "https://saweria.co/pixlape",
}: DonateModalProps) {
  const openLink = (url: string) => window.open(url, "_blank");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-red-400 text-white border border-black hover:scale-97 active:scale-97 transition-all duration-150 flex items-center justify-center shadow-pixel-sm text-xl font-bold cursor-pointer"
      >
        ✕
      </button>

      {/* Heading */}
      <h2 className="text-xs font-mono uppercase tracking-widest text-rose-400 text-center mb-1">
        Support me
      </h2>
      <h1 className="text-base sm:text-lg font-pixel font-bold text-rose-500 text-center mb-3 tracking-wide">
        DONATE FOR CREATOR
      </h1>

      <hr className="w-full border-t border-border my-4" />

      {/* Icon placeholder */}
      <div className="w-52 h-52 mx-auto border bg-pink-300/60 my-3 rounded-lg flex items-center justify-center">
        <Image src="https://res.cloudinary.com/lbovk2lu/image/upload/v1788327329/Pixel_Art_GIF.gif" alt="Logo" width={170} height={170} />
      </div>

      {/* Trakteer Button */}
    <button
    type="button"
    onClick={() => openLink(trakteerUrl)}
    className="w-full py-3 mt-2.5 rounded-lg bg-red-400 shadow-pixel text-white text-sm font-black border border-black hover:scale-97 active:scale-96 transition-all duration-300 cursor-pointer text-center tracking-wider"
    >
      TRAKTEER
    </button>
     

      {/* Saweria Button */}
      <button
        type="button"
        onClick={() => openLink(saweriaUrl)}
        className="w-full py-3 mt-2.5 rounded-lg bg-pink-400 shadow-pixel text-white text-sm font-black border border-black hover:scale-97 active:scale-96 transition-all duration-300 cursor-pointer text-center tracking-wider"
      >
        SAWERIA
      </button>
    </Modal>
  );
}