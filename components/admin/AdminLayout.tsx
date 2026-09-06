'use client';

import React from 'react';
import Header from '../Header';
import SidePanel from './SidePanel';
import Link from 'next/link';
import { CaretRight, House } from '@phosphor-icons/react';

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actionSlot?: React.ReactNode;
}

export function AdminLayout({
  children,
  title,
  subtitle,
  breadcrumbs = [],
  actionSlot,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono flex flex-col selection:bg-primary selection:text-black">
      {/* Top Fixed Header */}
      <Header />

      {/* Main Container Area */}
      <div className="flex-1 pt-16 pb-10 px-4 sm:px-4 lg:px-6 max-w-full w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Persistent Sidebar */}
          <SidePanel />

          {/* Dynamic Main Workspace View */}
          <main className="flex-1 w-full min-w-0 flex flex-col gap-2">
            {/* Breadcrumb & Title Bar */}
            {(title || breadcrumbs.length > 0) && (
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-col gap-1">
                  {/* Breadcrumb row */}
                  {breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
                      <Link
                        href="/"
                        className="flex items-center gap-1 text-zinc-300 hover:text-primary transition-colors"
                      >
                        <House className="w-3.5 h-3.5" weight="bold" />
                        <span>VAULT</span>
                      </Link>
                      {breadcrumbs.map((crumb, idx) => (
                        <React.Fragment key={idx}>
                          <CaretRight className="w-3 h-3 text-zinc-600" weight="bold" />
                          {crumb.href ? (
                            <Link
                              href={crumb.href}
                              className="text-zinc-300 hover:text-primary transition-colors"
                            >
                              {crumb.label}
                            </Link>
                          ) : (
                            <span className="font-bold text-zinc-100">{crumb.label}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </nav>
                  )}

                  {title && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <h1 className="text-xl sm:text-2xl font-black tracking-wide text-zinc-100 font-mono">
                        {title}
                      </h1>
                    </div>
                  )}

                  {subtitle && (
                    <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Right Action Slot */}
                {actionSlot && <div className="shrink-0">{actionSlot}</div>}
              </div>
            )}

            {/* Page Content */}
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
