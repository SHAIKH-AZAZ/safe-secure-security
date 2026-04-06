import { normalizeLeadForm, sendLeadEmail, validateLeadSubmission } from '@/lib/mail';
import clientPromise from '@/lib/mongodb';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const form = normalizeLeadForm(payload);
  const errors = validateLeadSubmission('emergency', form);

  if (Object.keys(errors).length > 0) {
    return Response.json({ error: 'Please complete the required fields.', errors }, { status: 400 });
  }

  try {
    await sendLeadEmail({ kind: 'emergency', form });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send email.';

    return Response.json({ error: message }, { status: 500 });
  }

  // Persist lead to MongoDB (best-effort, don't fail if DB is down)
  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('leads').insertOne({
        type: 'emergency',
        status: 'new',
        data: form,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (dbError) {
    // Log but don't fail the request — email was already sent
    console.error('Failed to save lead to database:', dbError);
  }

  return Response.json({ ok: true });
}
