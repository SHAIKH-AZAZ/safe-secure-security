import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { COOKIE_NAME, verifySessionCookie } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lead type definition
interface Lead {
  _id: ObjectId;
  type: 'contact' | 'emergency';
  status: 'new' | 'contacted' | 'converted' | 'lost';
  data: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Verify admin session from request cookies
 */
async function verifyAuth(req: NextRequest): Promise<boolean> {
  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookieValue) {
    return false;
  }
  return await verifySessionCookie(cookieValue);
}

/**
 * GET /api/admin/leads
 * Fetch leads with pagination and optional filters
 */
export async function GET(req: NextRequest) {
  // Check database configuration
  if (!clientPromise) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  // Verify authentication
  const isAuthenticated = await verifyAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse query parameters
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
  const type = searchParams.get('type') as 'contact' | 'emergency' | null;
  const status = searchParams.get('status') as 'new' | 'contacted' | 'converted' | 'lost' | null;

  // Build filter query
  const filter: Record<string, string> = {};
  if (type && ['contact', 'emergency'].includes(type)) {
    filter.type = type;
  }
  if (status && ['new', 'contacted', 'converted', 'lost'].includes(status)) {
    filter.status = status;
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Lead>('leads');

    // Get total count for pagination
    const total = await collection.countDocuments(filter);

    // Fetch leads with pagination
    const leads = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      leads,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/leads
 * Update lead status
 */
export async function PATCH(req: NextRequest) {
  // Check database configuration
  if (!clientPromise) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  // Verify authentication
  const isAuthenticated = await verifyAuth(req);
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse request body
  let body: { id: string; status: 'new' | 'contacted' | 'converted' | 'lost' };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { id, status } = body;

  // Validate required fields
  if (!id) {
    return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
  }

  if (!status || !['new', 'contacted', 'converted', 'lost'].includes(status)) {
    return NextResponse.json(
      { error: 'Valid status is required (new, contacted, converted, lost)' },
      { status: 400 }
    );
  }

  // Validate ObjectId format
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: 'Invalid lead ID format' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Lead>('leads');

    // Update the lead
    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      lead: result,
    });
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
