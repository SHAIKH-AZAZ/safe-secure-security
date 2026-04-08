import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSessionCookie, COOKIE_NAME, cookieConfig } from '@/lib/admin-auth';

export const runtime = 'nodejs';

const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const FAILURE_DELAY_MS = IS_DEVELOPMENT ? 0 : 300;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_FAILURES = IS_DEVELOPMENT ? Number.POSITIVE_INFINITY : 6;
const RATE_LIMIT_BLOCK_MS = 5 * 60 * 1000;

type LoginAttemptState = {
  count: number;
  windowStartedAt: number;
  blockedUntil: number;
};

declare global {
  // eslint-disable-next-line no-var
  var _adminLoginRateLimit: Map<string, LoginAttemptState> | undefined;
}

const loginRateLimitStore = globalThis._adminLoginRateLimit ?? new Map<string, LoginAttemptState>();
globalThis._adminLoginRateLimit = loginRateLimitStore;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getClientKey(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const userAgent = req.headers.get('user-agent') || 'unknown-agent';
  const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';
  return `${ip}:${userAgent}`;
}

function pruneLoginAttempts(now: number) {
  for (const [key, state] of loginRateLimitStore.entries()) {
    const windowExpired = now - state.windowStartedAt > RATE_LIMIT_WINDOW_MS;
    const blockExpired = state.blockedUntil !== 0 && state.blockedUntil <= now;

    if ((windowExpired && state.blockedUntil === 0) || (windowExpired && blockExpired) || (!windowExpired && blockExpired && state.count === 0)) {
      loginRateLimitStore.delete(key);
    }
  }
}

function getRateLimitState(key: string, now: number) {
  const state = loginRateLimitStore.get(key);

  if (!state) {
    return { blocked: false, retryAfterMs: 0 };
  }

  if (state.blockedUntil > now) {
    return { blocked: true, retryAfterMs: state.blockedUntil - now };
  }

  if (now - state.windowStartedAt > RATE_LIMIT_WINDOW_MS) {
    loginRateLimitStore.delete(key);
    return { blocked: false, retryAfterMs: 0 };
  }

  return { blocked: false, retryAfterMs: 0 };
}

function recordFailedAttempt(key: string, now: number) {
  const existing = loginRateLimitStore.get(key);

  if (!existing || now - existing.windowStartedAt > RATE_LIMIT_WINDOW_MS) {
    loginRateLimitStore.set(key, {
      count: 1,
      windowStartedAt: now,
      blockedUntil: 0,
    });
    return;
  }

  const nextCount = existing.count + 1;
  loginRateLimitStore.set(key, {
    count: nextCount,
    windowStartedAt: existing.windowStartedAt,
    blockedUntil: nextCount >= RATE_LIMIT_MAX_FAILURES ? now + RATE_LIMIT_BLOCK_MS : 0,
  });
}

function clearFailedAttempts(key: string) {
  loginRateLimitStore.delete(key);
}

export async function POST(req: NextRequest) {
  const now = Date.now();
  const clientKey = getClientKey(req);
  pruneLoginAttempts(now);

  const currentRateLimit = IS_DEVELOPMENT
    ? { blocked: false, retryAfterMs: 0 }
    : getRateLimitState(clientKey, now);

  if (currentRateLimit.blocked) {
    await sleep(FAILURE_DELAY_MS);
    const retryAfterSeconds = Math.ceil(currentRateLimit.retryAfterMs / 1000);
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Please try again in about ${retryAfterSeconds} seconds.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfterSeconds.toString(),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const password =
    body && typeof body === 'object' && !Array.isArray(body)
      ? (body as { password?: unknown }).password
      : undefined;

  if (typeof password !== 'string' || !password.trim()) {
    return NextResponse.json({ error: 'Password is required' }, { status: 400 });
  }

  if (!verifyPassword(password.trim())) {
    recordFailedAttempt(clientKey, Date.now());
    const nextState = IS_DEVELOPMENT
      ? { blocked: false, retryAfterMs: 0 }
      : getRateLimitState(clientKey, Date.now());
    await sleep(FAILURE_DELAY_MS);

    if (nextState.blocked) {
      const retryAfterSeconds = Math.ceil(nextState.retryAfterMs / 1000);
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in about ${retryAfterSeconds} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfterSeconds.toString(),
          },
        }
      );
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  clearFailedAttempts(clientKey);
  const token = await createSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, cookieConfig);
  return res;
}
