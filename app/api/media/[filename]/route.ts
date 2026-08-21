import path from "path";
import { readFile, stat } from "fs/promises";
import { NextResponse } from "next/server";

// Upload directory is intentionally dynamic (configurable per environment) and lives
// outside the build output — opt out of Turbopack's static file-tracing for these calls
// so the whole project isn't swept into the deploy bundle.
const UPLOAD_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_STORAGE_PATH ?? "./storage/uploads");

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const safeName = path.basename(filename);
  const fullPath = path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, safeName);

  if (!fullPath.startsWith(UPLOAD_DIR)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    await stat(/*turbopackIgnore: true*/ fullPath);
    const buffer = await readFile(/*turbopackIgnore: true*/ fullPath);
    const ext = path.extname(safeName).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
