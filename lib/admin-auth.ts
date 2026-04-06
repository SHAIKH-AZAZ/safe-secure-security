// Admin authentication utilities using HMAC-signed cookies
// Uses Web Crypto API (crypto.subtle) for HMAC operations

export const COOKIE_NAME = 'admin_session';
export const COOKIE_MAX_AGE = 86400; // 24 hours in seconds

export interface CookieConfig {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
  maxAge: number;
}

export const cookieConfig: CookieConfig = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: COOKIE_MAX_AGE,
};

/**
 * Verify password against ADMIN_PASSWORD env variable
 */
export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD environment variable is not set');
  }
  return password === adminPassword;
}

/**
 * Get the cookie secret from environment variable
 */
function getCookieSecret(): ArrayBuffer {
  const secret = process.env.ADMIN_COOKIE_SECRET;
  if (!secret) {
    throw new Error('ADMIN_COOKIE_SECRET environment variable is not set');
  }
  // Convert string to ArrayBuffer
  const encoder = new TextEncoder();
  return encoder.encode(secret).buffer;
}

/**
 * Create HMAC signature using Web Crypto API
 */
async function createHmac(message: string, secret: ArrayBuffer): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify HMAC signature using Web Crypto API
 */
async function verifyHmac(message: string, signatureHex: string, secret: ArrayBuffer): Promise<boolean> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Convert hex signature to Uint8Array
  const signature = new Uint8Array(signatureHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    secret,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  return await crypto.subtle.verify('HMAC', cryptoKey, signature, data);
}

/**
 * Create a session cookie value with HMAC signature
 * Token format: {expiry_timestamp}.{hmac_signature_hex}
 */
export async function createSessionCookie(): Promise<string> {
  const secret = getCookieSecret();
  const expiry = Date.now() + COOKIE_MAX_AGE * 1000;
  const message = expiry.toString();
  
  const signature = await createHmac(message, secret);
  return `${expiry}.${signature}`;
}

/**
 * Verify a session cookie value
 * Checks HMAC signature and expiry timestamp
 */
export async function verifySessionCookie(cookieValue: string): Promise<boolean> {
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
export function getSessionCookieFromHeader(cookieHeader: string | null): string | null {
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
