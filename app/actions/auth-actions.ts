'use server';

import { redirect } from 'next/navigation';
import {
  validateAdminCredentials,
  setAdminSessionCookie,
  removeAdminSessionCookie,
  getAdminSession,
} from '@/lib/auth';

export interface AuthState {
  success: boolean;
  message?: string;
}

/**
 * Server action to authenticate admin user
 */
export async function loginAction(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirect') as string) || '/admin';

  if (!username || !password) {
    return {
      success: false,
      message: 'Please enter both username and password.',
    };
  }

  const isValid = validateAdminCredentials(username, password);

  if (!isValid) {
    return {
      success: false,
      message: 'Invalid credentials. Access Denied.',
    };
  }

  // Set session cookie
  await setAdminSessionCookie(username.trim());

  // Redirect to dashboard or requested page
  redirect(redirectTo.startsWith('/admin') ? redirectTo : '/admin');
}

/**
 * Server action to log out
 */
export async function logoutAction() {
  await removeAdminSessionCookie();
  redirect('/auth');
}

/**
 * Check if current user is logged in
 */
export async function checkAuthStatus() {
  const session = await getAdminSession();
  return { isAuthenticated: !!session, session };
}
