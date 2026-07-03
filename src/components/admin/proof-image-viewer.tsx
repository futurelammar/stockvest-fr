"use client";

import { useState } from "react";
import { X, ZoomIn, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ProofImageViewerProps {
  url: string;
  label?: string;
}

export function ProofImageViewer({ url, label = "View proof" }: ProofImageViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[#D6D0C4] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0E1A17] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
      >
        <ZoomIn className="h-3.5 w-3.5" />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-h-[85vh] max-w-2xl w-full overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E5E0D4] px-4 py-3">
              <p className="text-sm font-semibold text-[#0E1A17]">Proof of Payment</p>
              <div className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-[#D6D0C4] px-3 py-1.5 text-xs font-medium text-[#5B6661] hover:border-[#1F6F4F] hover:text-[#1F6F4F]"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open original
                </a>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F7F4EE]"
                >
                  <X className="h-4 w-4 text-[#5B6661]" />
                </button>
              </div>
            </div>
            <div className="relative max-h-[70vh] overflow-auto bg-[#FAFAF7]">
              <Image
                src={url}
                alt="Proof of payment"
                width={800}
                height={600}
                className="mx-auto object-contain"
                unoptimized={!url.includes("cloudinary")}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}