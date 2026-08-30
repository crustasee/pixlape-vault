import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'pixlape_admin_token';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Default Admin Credentials (can be overridden with environment variables)
export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'pixladmin',
  password: process.env.ADMIN_PASSWORD || 'pixlape11223344',
};

export interface AdminSession {
  username: string;
  role: 'superadmin' | 'editor';
  loggedInAt: number;
}

/**
 * Validates provided credentials against configured admin credentials
 */
export function validateAdminCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;
  const validUser = username.trim().toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase();
  const validPass = password === ADMIN_CREDENTIALS.password;
  return validUser && validPass;
}

/**
 * Creates a signed/simple session payload
 */
export function createSessionToken(username: string): string {
  const sessionData: AdminSession = {
    username,
    role: 'superadmin',
    loggedInAt: Date.now(),
  };
  return Buffer.from(JSON.stringify(sessionData)).toString('base64');
}

/**
 * Decodes and validates session token
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    const json = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(json) as AdminSession;
    if (data && data.username) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Get current admin session from request cookies (Server Components / Server Actions)
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Sets admin session cookie
 */
export async function setAdminSessionCookie(username: string) {
  const token = createSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Removes admin session cookie
 */
export async function removeAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
