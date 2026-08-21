import { getStorageProvider } from "@/lib/storage";

/**
 * Call after a mutation drops a reference to one or more uploaded image urls
 * (an image field was changed/removed, or the record holding it was deleted).
 * Each record owns its image exclusively (no shared Media library), so the
 * file is deleted unconditionally — no cross-table reference check needed.
 */
export async function deleteStoredImages(urls: Array<string | null | undefined>): Promise<void> {
  const unique = Array.from(new Set(urls.filter((u): u is string => Boolean(u))));

  for (const url of unique) {
    const storedPath = url.split("/").pop();
    if (storedPath) {
      await getStorageProvider().delete(storedPath).catch(() => undefined);
    }
  }
}
