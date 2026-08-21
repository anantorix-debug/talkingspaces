import type { StorageProvider } from "@/lib/storage/types";
import { LocalStorageProvider } from "@/lib/storage/local-provider";

/**
 * Storage driver is selected via MEDIA_STORAGE_DRIVER. Only "local" is implemented today
 * (fits Hostinger's persistent Node process); adding S3-compatible storage later means
 * adding a new provider class here without touching call sites.
 */
export function getStorageProvider(): StorageProvider {
  const driver = process.env.MEDIA_STORAGE_DRIVER ?? "local";
  switch (driver) {
    case "local":
      return new LocalStorageProvider();
    default:
      throw new Error(`Unknown MEDIA_STORAGE_DRIVER: ${driver}`);
  }
}

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
] as const;

export const MAX_UPLOAD_BYTES = 1 * 1024 * 1024; // 1MB
