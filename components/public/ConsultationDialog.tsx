"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ConsultationForm } from "@/components/public/ConsultationForm";

export function ConsultationDialog({
  label = "Request a Consultation",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Request a Consultation">
        <ConsultationForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  );
}
