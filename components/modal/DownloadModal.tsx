"use client";

import React, { useState, useEffect } from "react";
import Modal from "./Modal";

export interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonateOpen: () => void;
  downloadUrl?: string;
  countdownSeconds?: number;
}

function DownloadModalContent({
  onClose,
  onDonateOpen,
  downloadUrl = "#",
  countdownSeconds = 15,
}: Omit<DownloadModalProps, "isOpen">) {
  const [secondsLeft, setSecondsLeft] = useState(countdownSeconds);
  const isReady = secondsLeft <= 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDownload = () => {
    if (isReady && downloadUrl !== "#") {
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <>
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-pink-400 text-white border border-black hover:bg-pink-500 hover:text-black-primary transition-all duration-150 flex items-center justify-center text-xl font-mono font-bold cursor-pointer"
      >
        ✕
      </button>

      {/* Heading */}
      <h1 className="text-base sm:text-lg font-pixel font-bold text-black-primary text-center mb-2 tracking-wide leading-relaxed">
        {isReady
          ? "THANK FOR DOWNLOAD !"
          : `${secondsLeft} SECOND${secondsLeft !== 1 ? "S" : ""} ....`}
      </h1>
      <h2 className="text-xs font-mono uppercase tracking-widest text-black-secondary text-center mb-3">
        {isReady ? "Your link is ready below" : "Countdown download link ......."}
      </h2>

      <hr className="w-full border-t-2 border-black-secondary my-7" />

      {/* Download CTA Button */}
      <button
        type="button"
        onClick={handleDownload}
        disabled={!isReady}
        className={`w-full rounded-lg py-3 mt-3 text-sm font-pixel font-bold border transition-all duration-150 text-center ${
          isReady
            ? "bg-green-400 text-black-primary border-black hover:bg-primary hover:scale-[1.1] active:scale-[0.99] cursor-pointer"
            : "bg-black-secondary/20 text-black-secondary border-border cursor-not-allowed"
        }`}
      >
        {isReady
          ? "YOUR LINK IS READY .."
          : `PLEASE WAIT ${secondsLeft} SECONDS`}
      </button>

      {/* Donate CTA Button */}
      <button
        type="button"
        onClick={onDonateOpen}
        className="w-full py-3 mt-3 rounded-lg bg-pink-400 text-black-primary text-xs sm:text-sm font-pixel font-bold border border-black hover:bg-pink-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-150 cursor-pointer text-center"
      >
        DONATE ❤️
      </button>
    </>
  );
}

export default function DownloadModal({
  isOpen,
  onClose,
  onDonateOpen,
  downloadUrl = "#",
  countdownSeconds = 15,
}: DownloadModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isOpen && (
        <DownloadModalContent
          onClose={onClose}
          onDonateOpen={onDonateOpen}
          downloadUrl={downloadUrl}
          countdownSeconds={countdownSeconds}
        />
      )}
    </Modal>
  );
}