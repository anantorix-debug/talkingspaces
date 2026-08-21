"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/actions/admin/upload";
import { labelClass } from "@/components/admin/FormControls";
import { useToast } from "@/components/admin/ToastProvider";

// Mirrors MAX_UPLOAD_BYTES in lib/storage/index.ts. Checked here first so an
// oversized file never reaches the network — the Server Action's own body
// size limit crashes the request outright (not the app's graceful "too
// large" response) if a file gets there uncaught.
const MAX_UPLOAD_BYTES = 1 * 1024 * 1024;

export function ImagePicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function handleFile(file: File) {
    if (file.size > MAX_UPLOAD_BYTES) {
      const message = "File is too large (max 1MB)";
      setError(message);
      toast.error(message);
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadImage(formData);
      if (result.success) {
        onChange(result.url);
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch {
      const message = "Upload failed — please try a smaller file.";
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-gray-100">
          {value && <Image src={value} alt="" fill sizes="64px" className="object-cover" />}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
        </button>
        {value && !uploading && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-600">
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
