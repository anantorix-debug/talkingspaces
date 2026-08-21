"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/admin/ToastProvider";

export function DeleteButton({
  action,
  confirmMessage = "Are you sure? This cannot be undone.",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        setOpen(false);
        toast.success("Deleted");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not delete — please try again.";
        setError(message);
        toast.error(message);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        aria-label="Delete"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={confirmMessage}>
        <p className="text-sm text-gray-500">This action cannot be undone.</p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={handleDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {pending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </>
  );
}
