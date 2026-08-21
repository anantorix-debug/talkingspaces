import { randomUUID } from "crypto";
import path from "path";
import { mkdir, writeFile, unlink } from "fs/promises";
import type { StorageProvider, StoredFile } from "@/lib/storage/types";

// Upload directory is intentionally dynamic (configurable per environment) and lives
// outside the build output — opt out of Turbopack's static file-tracing for these calls
// so the whole project isn't swept into the deploy bundle.
const UPLOAD_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_STORAGE_PATH ?? "./storage/uploads");

function safeExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return /^\.[a-z0-9]{2,5}$/.test(ext) ? ext : "";
}

export class LocalStorageProvider implements StorageProvider {
  async save(buffer: Buffer, filename: string, _mimeType: string): Promise<StoredFile> {
    await mkdir(/*turbopackIgnore: true*/ UPLOAD_DIR, { recursive: true });
    const storedName = `${randomUUID()}${safeExtension(filename)}`;
    const fullPath = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, storedName);
    await writeFile(/*turbopackIgnore: true*/ fullPath, buffer);

    return {
      url: `/api/media/${storedName}`,
      path: storedName,
      size: buffer.byteLength,
    };
  }

  async delete(storedPath: string): Promise<void> {
    const fullPath = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, path.basename(storedPath));
    await unlink(fullPath).catch(() => undefined);
  }
}
