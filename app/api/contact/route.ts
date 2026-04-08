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
  const errors = validateLeadSubmission('contact', form);

  if (Object.keys(errors).length > 0) {
    return Response.json({ error: 'Please complete the required fields.', errors }, { status: 400 });
  }

  let insertedLeadId: unknown = null;

  // Persist lead to MongoDB first so submissions are not lost if email delivery fails.
  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('leads').insertOne({
        type: 'contact',
        status: 'new',
        emailStatus: 'pending',
        data: form,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      insertedLeadId = result.insertedId;
    }
  } catch (dbError) {
    console.error('Failed to save lead to database:', dbError);
  }

  try {
    await sendLeadEmail({ kind: 'contact', form });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send email.';

    if (clientPromise && insertedLeadId) {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('leads').updateOne({
        _id: insertedLeadId,
      }, {
        $set: {
          emailStatus: 'failed',
          emailError: message,
          updatedAt: new Date(),
        },
      });
    }

    if (insertedLeadId) {
      return Response.json(
        {
          ok: true,
          warning: 'Your request was saved successfully, but email delivery is delayed right now.',
        },
        { status: 202 }
      );
    }

    return Response.json({ error: message }, { status: 500 });
  }

  try {
    if (clientPromise && insertedLeadId) {
      const client = await clientPromise;
      const db = client.db();
      await db.collection('leads').updateOne({
        _id: insertedLeadId,
      }, {
        $set: {
          emailStatus: 'sent',
          updatedAt: new Date(),
        },
      });
    }
  } catch (dbError) {
    console.error('Failed to update lead email status:', dbError);
  }

  return Response.json({ ok: true });
}
