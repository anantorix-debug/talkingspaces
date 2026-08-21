"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  // Portaled to document.body so this is never nested inside an ancestor with
  // a CSS transform (e.g. the .reveal animation wrapper) — a transform on any
  // ancestor turns position:fixed descendants into being positioned relative
  // to that ancestor instead of the viewport, breaking the full-screen overlay.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto bg-paper p-8 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-light text-charcoal">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-charcoal/60 transition-colors hover:text-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal"
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
