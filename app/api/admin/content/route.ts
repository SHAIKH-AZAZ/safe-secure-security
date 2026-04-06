import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { COOKIE_NAME, verifySessionCookie } from '@/lib/admin-auth';
import { getSiteContent, updateSiteContent, type SiteContent } from '@/lib/admin-api';

export const dynamic = 'force-dynamic';

// Expected top-level keys for validation
const REQUIRED_KEYS: (keyof SiteContent)[] = [
  'hero',
  'imageShowcase',
  'serviceClusters',
  'industries',
  'testimonials',
  'caseStudies',
  'faqItems',
  'proofPillars',
  'processSteps',
  'cities',
  'navLinks',
  'trustStripItems',
  'site',
];

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

    // Validate that all required top-level keys are present
    const missingKeys = REQUIRED_KEYS.filter((key) => !(key in body));
    if (missingKeys.length > 0) {
      return NextResponse.json(
        { error: `Missing required keys: ${missingKeys.join(', ')}` },
        { status: 400 }
      );
    }

    await updateSiteContent(body as SiteContent);
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
