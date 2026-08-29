import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PIXLApe Vault Admin Console',
  description: 'Control panel and digital asset management interface for PIXLApe Vault.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
