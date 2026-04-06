import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSessionCookie, COOKIE_NAME, cookieConfig } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await createSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, cookieConfig);
  return res;
}
