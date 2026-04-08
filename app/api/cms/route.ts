import { cookies } from 'next/headers';
import { createCmsEntry, getCmsEntries } from '@/lib/cms';
import { COOKIE_NAME, verifySessionCookie } from '@/lib/admin-auth';
import type { CmsEntryInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token || !(await verifySessionCookie(token))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entries = await getCmsEntries();
  return Response.json({ entries });
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token || !(await verifySessionCookie(token))) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as CmsEntryInput;
    const entry = await createCmsEntry(body);

    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to save content right now.';

    return Response.json({ error: message }, { status: 400 });
  }
}
