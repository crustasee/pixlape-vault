'use client';

import { useEffect } from 'react';

/**
 * AdminThemeScope ensures that the `.dark` class is applied to document.documentElement
 * (the <html> root) strictly while the user is inside the admin section.
 * When the user navigates away from admin routes to public routes, the cleanup
 * function removes the `.dark` class so the public vault remains in light mode.
 */
export default function AdminThemeScope() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return null;
}
