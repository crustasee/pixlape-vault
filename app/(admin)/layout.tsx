import React from 'react';
import type { Metadata } from 'next';
import AdminThemeScope from '@/components/admin/AdminThemeScope';

export const metadata: Metadata = {
  title: 'PIXLApe Vault Admin Console',
  description: 'Control panel and digital asset management interface for PIXLApe Vault.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100 font-mono antialiased selection:bg-primary selection:text-black">
      <AdminThemeScope />
      {children}
    </div>
  );
}

