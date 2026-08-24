"use client";

import React, { useState } from "react";
import DownloadModal from "./DownloadModal";
import DonateModal from "./DonateModal";

export interface DialogModalProps {
  /** Controls visibility of the download modal */
  downloadModalOpen?: boolean;
  /** Controls visibility of the donate modal */
  donateModalOpen?: boolean;
  /** URL to open when download is ready */
  downloadUrl?: string;
  /** Countdown duration in seconds before download link unlocks */
  countdownSeconds?: number;
  /** Trakteer donation URL */
  trakteerUrl?: string;
  /** Saweria donation URL */
  saweriaUrl?: string;
  /** QRIS image/link URL */
  qrisImageUrl?: string;
  /** Callback when download modal closes */
  onDownloadClose?: () => void;
  /** Callback when donate modal closes */
  onDonateClose?: () => void;
}

/**
 * DialogModal — orchestrates DownloadModal + DonateModal.
 *
 * @example
 * const [open, setOpen] = useState(false);
 * <button onClick={() => setOpen(true)}>DOWNLOAD</button>
 * <DialogModal
 *   downloadModalOpen={open}
 *   downloadUrl="https://example.com/file.zip"
 *   countdownSeconds={15}
 *   trakteerUrl="https://trakteer.id/yourname"
 *   saweriaUrl="https://saweria.co/yourname"
 *   onDownloadClose={() => setOpen(false)}
 * />
 */
export default function DialogModal({
  downloadModalOpen = false,
  donateModalOpen = false,
  downloadUrl,
  countdownSeconds = 15,
  trakteerUrl,
  saweriaUrl,
  qrisImageUrl,
  onDownloadClose,
  onDonateClose,
}: DialogModalProps) {
  const [internalDonateOpen, setInternalDonateOpen] = useState(false);

  const isDonateOpen = donateModalOpen || internalDonateOpen;

  const handleDownloadClose = () => {
    onDownloadClose?.();
  };

  const handleDonateClose = () => {
    setInternalDonateOpen(false);
    onDonateClose?.();
  };

  return (
    <>
      <DownloadModal
        isOpen={downloadModalOpen}
        onClose={handleDownloadClose}
        onDonateOpen={() => {
          onDownloadClose?.();
          setInternalDonateOpen(true);
        }}
        downloadUrl={downloadUrl}
        countdownSeconds={countdownSeconds}
      />
      <DonateModal
        isOpen={isDonateOpen}
        onClose={handleDonateClose}
        trakteerUrl={trakteerUrl}
        saweriaUrl={saweriaUrl}
        qrisImageUrl={qrisImageUrl}
      />
    </>
  );
}