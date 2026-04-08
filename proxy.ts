import { NextRequest, NextResponse } from 'next/server';

// Cookie configuration - must match lib/admin-auth.ts
const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 86400; // 24 hours in seconds

/**
 * Get the cookie secret from environment variable
 * Note: In Edge runtime, process.env is available
 */
function getCookieSecret(): ArrayBuffer {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) {
    throw new Error('ADMIN_COOKIE_SECRET environment variable is not set');
  }
  const encoder = new TextEncoder();
  return encoder.encode(secret).buffer;
}

/**
 * Verify HMAC signature using Web Crypto API
 * This is duplicated here because proxy runs in Edge runtime
 * and cannot import from lib/admin-auth.ts if it uses Node.js APIs
 */
async function verifyHmac(message: string, signatureHex: string, secret: ArrayBuffer): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Convert hex signature to Uint8Array
  const signatureBytes = new Uint8Array(signatureHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  return await crypto.subtle.verify('HMAC', cryptoKey, signatureBytes, data);
}

/**
 * Verify a session cookie value
 * Token format: {expiry_timestamp}.{hmac_signature_hex}
 */
async function verifySessionCookie(cookieValue: string): Promise<boolean> {
  try {
    const secret = getCookieSecret();
    const parts = cookieValue.split('.');
    
    if (parts.length !== 2) {
      return false;
    }
    
    const [expiryStr, signature] = parts;
    const expiry = parseInt(expiryStr, 10);
    
    // Check if expired
    if (Date.now() > expiry) {
      return false;
    }
    
    // Verify HMAC signature
    const isValid = await verifyHmac(expiryStr, signature, secret);
    return isValid;
  } catch {
    return false;
  }
}

/**
 * Parse cookie string and extract admin session value
 */
function getSessionCookieFromHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Check if the request is to a login route that should be skipped
 */
function isLoginRoute(pathname: string): boolean {
  return pathname === '/admin/login' || pathname === '/api/admin/login';
}

/**
 * Check if the request is to an API route
 */
function isApiRoute(pathname: string): boolean {
  return pathname.startsWith('/api/');
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  
  // Skip authentication for login routes
  if (isLoginRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Get session cookie from request
  const cookieHeader = request.headers.get('cookie');
  const sessionCookie = getSessionCookieFromHeader(cookieHeader);
  
  // Verify the session cookie
  const isAuthenticated = sessionCookie ? await verifySessionCookie(sessionCookie) : false;
  
  if (!isAuthenticated) {
    // For API routes, return 401 JSON response
    if (isApiRoute(pathname)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // For page routes, redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // User is authenticated, allow the request
  return NextResponse.next();
}

// Configure proxy to match admin routes
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
