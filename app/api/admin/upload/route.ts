import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { COOKIE_NAME, verifySessionCookie } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (safe under Vercel Function body limit)
const IS_VERCEL_DEPLOYMENT = process.env.VERCEL === '1';
const MAX_IMAGE_DIMENSION = 2400;
const WEBP_QUALITY = 82;

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

/**
 * Verify admin session from request cookies
 */
async function verifyAuth(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(COOKIE_NAME);
  if (!cookie?.value) {
    return false;
  }
  return await verifySessionCookie(cookie.value);
}

/**
 * Ensure the uploads directory exists
 */
function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Generate a unique filename with timestamp prefix
 */
function generateUniqueFilename(originalName: string, extension: string): string {
  const timestamp = Date.now();
  const base = path.basename(originalName, path.extname(originalName));
  // Sanitize base name - remove special characters
  const sanitized = base.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);
  return `${timestamp}-${sanitized || 'image'}${extension}`;
}

/**
 * Validate file type and size
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: JPEG, PNG, WebP, GIF`,
    };
  }

  // Check file extension
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size: 4MB`,
    };
  }

  return { valid: true };
}

function getDetectedImageType(buffer: Buffer): { mime: string; extension: string } | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: 'image/jpeg', extension: '.jpg' };
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: 'image/png', extension: '.png' };
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { mime: 'image/webp', extension: '.webp' };
  }

  if (
    buffer.length >= 6 &&
    (buffer.subarray(0, 6).toString('ascii') === 'GIF87a' ||
      buffer.subarray(0, 6).toString('ascii') === 'GIF89a')
  ) {
    return { mime: 'image/gif', extension: '.gif' };
  }

  return null;
}

function normalizeExtension(ext: string): string {
  return ext === '.jpeg' ? '.jpg' : ext;
}

function validateImageContent(file: File, buffer: Buffer): { valid: boolean; error?: string; mime?: string; extension?: string } {
  const detected = getDetectedImageType(buffer);
  if (!detected) {
    return { valid: false, error: 'Invalid image content. File signature does not match a supported image.' };
  }

  const providedExt = normalizeExtension(path.extname(file.name).toLowerCase());
  const detectedExt = normalizeExtension(detected.extension);
  const providedMime = file.type.toLowerCase();

  if (providedExt !== detectedExt || providedMime !== detected.mime) {
    return {
      valid: false,
      error: 'Image validation failed. File extension/MIME must match actual image content.',
    };
  }

  return { valid: true, mime: detected.mime, extension: detectedExt };
}

async function optimizeUploadAsset(
  buffer: Buffer,
  mime: string,
  extension: string
): Promise<{ buffer: Buffer; mime: string; extension: string }> {
  // Keep GIF as-is to avoid breaking animation frames.
  if (mime === 'image/gif') {
    return { buffer, mime, extension };
  }

  // Normalize static image uploads to optimized WebP.
  const optimizedBuffer = await sharp(buffer, {
    failOn: 'error',
    limitInputPixels: 40_000_000,
  })
    .rotate()
    .resize({
      width: MAX_IMAGE_DIMENSION,
      height: MAX_IMAGE_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: WEBP_QUALITY,
      effort: 4,
    })
    .toBuffer();

  return {
    buffer: optimizedBuffer,
    mime: 'image/webp',
    extension: '.webp',
  };
}

/**
 * POST /api/admin/upload
 * Upload an image file
 */
export async function POST(req: NextRequest) {
  const isAuthenticated = await verifyAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const contentValidation = validateImageContent(file, buffer);
    if (!contentValidation.valid || !contentValidation.mime || !contentValidation.extension) {
      return NextResponse.json(
        { error: contentValidation.error || 'Image validation failed' },
        { status: 400 }
      );
    }

    let optimizedAsset: { buffer: Buffer; mime: string; extension: string };
    try {
      optimizedAsset = await optimizeUploadAsset(
        buffer,
        contentValidation.mime,
        contentValidation.extension
      );
    } catch {
      return NextResponse.json(
        { error: 'Invalid or unreadable image file.' },
        { status: 400 }
      );
    }

    // Generate unique filename based on final stored type
    const filename = generateUniqueFilename(file.name, optimizedAsset.extension);

    // Prefer Vercel Blob when token is configured (required for Vercel persistence).
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, optimizedAsset.buffer, {
        access: 'public',
        addRandomSuffix: true,
        contentType: optimizedAsset.mime,
      });
      return NextResponse.json({ url: blob.url });
    }

    // Vercel deployment without Blob token cannot persist uploads to local filesystem.
    if (IS_VERCEL_DEPLOYMENT) {
      return NextResponse.json(
        {
          error:
            'Upload storage is not configured. Set BLOB_READ_WRITE_TOKEN on Vercel for persistent image uploads.',
        },
        { status: 500 }
      );
    }

    // Local development fallback: save to public/uploads
    ensureUploadDir();
    const filepath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filepath, optimizedAsset.buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
