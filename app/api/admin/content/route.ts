import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { COOKIE_NAME, verifySessionCookie } from '@/lib/admin-auth';
import { getSiteContent, updateSiteContent } from '@/lib/admin-api';
import { normalizeSiteContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';

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
 * GET /api/admin/content
 * Returns the current site content
 */
export async function GET(req: NextRequest) {
  const isAuthenticated = await verifyAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const content = await getSiteContent();
    return NextResponse.json(content);
  } catch (error: unknown) {
    console.error('Error reading site content:', error);
    const message = error instanceof Error ? error.message : 'Failed to read site content';
    if (message.includes('Database not configured')) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to read site content' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content
 * Updates the site content
 */
export async function POST(req: NextRequest) {
  const isAuthenticated = await verifyAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid content payload' }, { status: 400 });
    }

    await updateSiteContent(normalizeSiteContent(body));
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Error updating site content:', error);
    const message = error instanceof Error ? error.message : 'Failed to update site content';
    if (message.includes('Database not configured')) {
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update site content' },
      { status: 500 }
    );
  }
}
