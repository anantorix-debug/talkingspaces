"use server";

import { auth } from "@/auth";
import { getStorageProvider, ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES } from "@/lib/storage";

export type UploadImageResult = { success: true; url: string } | { success: false; error: string };

/**
 * Uploads a single image and returns its url directly — there is no shared
 * Media library/table. Each content record owns its image url exclusively,
 * so cleanup on replace/delete just deletes the file at that url (see
 * lib/image-cleanup.ts) rather than checking a shared pool for reuse.
 */
export async function uploadImage(formData: FormData): Promise<UploadImageResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided" };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    return { success: false, error: "Unsupported file type" };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { success: false, error: "File is too large (max 1MB)" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await getStorageProvider().save(buffer, file.name, file.type);
  return { success: true, url: stored.url };
}
