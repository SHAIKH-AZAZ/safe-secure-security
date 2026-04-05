import { createCmsEntry, getCmsEntries } from '@/lib/cms';
import type { CmsEntryInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const entries = await getCmsEntries();
  return Response.json({ entries });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CmsEntryInput;
    const entry = await createCmsEntry(body);

    return Response.json({ entry }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unable to save content right now.';

    return Response.json({ error: message }, { status: 400 });
  }
}
