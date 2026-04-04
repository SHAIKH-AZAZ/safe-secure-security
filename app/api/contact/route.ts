import { normalizeLeadForm, sendLeadEmail, validateLeadSubmission } from '@/lib/mail';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const form = normalizeLeadForm(payload);
  const errors = validateLeadSubmission('contact', form);

  if (Object.keys(errors).length > 0) {
    return Response.json({ error: 'Please complete the required fields.', errors }, { status: 400 });
  }

  try {
    await sendLeadEmail({ kind: 'contact', form });
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send email.';

    return Response.json({ error: message }, { status: 500 });
  }
}
