'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour,
  Cards,
  Article,
  ShieldCheck,
  Pulse,
  Database,
  Globe,
  SignOut,
} from '@phosphor-icons/react';
import { useAssets } from '@/hooks/useAssets';
import { useArticles } from '@/hooks/useArticles';
import { logoutAction } from '@/app/actions/auth-actions';

export interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; weight?: 'regular' | 'bold' | 'fill' }>;
  tag?: string;
  badgeCount?: (assetsCount: number, articlesCount: number) => string | number;
}

const MENU_ITEMS: MenuItem[] = [
  {
    name: 'DASHBOARD',
    href: '/admin',
    icon: SquaresFour,
    tag: 'SYS',
  },
  {
    name: 'ASSET CARDS',
    href: '/admin/card',
    icon: Cards,
    badgeCount: (a) => a,
  },
  {
    name: 'ARTICLES',
    href: '/admin/article',
    icon: Article,
    badgeCount: (_, arts) => arts,
  },
  {
    name: 'INTEGRATIONS',
    href: '/admin/integrations',
    icon: Database,
    tag: 'SYS',
  },
];

interface SidebarProps {
  selectedMenu?: string | null;
  onSelectMenu?: (menuName: string | null) => void;
  className?: string;
}

export function SidePanel({
  selectedMenu = null,
  onSelectMenu,
  className = '',
}: SidebarProps) {
  const pathname = usePathname();
  const assets = useAssets();
  const articles = useArticles();

  return (
    <aside
      className={`w-full lg:w-58 bg-zinc-900/90 rounded-md border border-zinc-800 p-4 flex flex-col gap-2 shrink-0 font-mono ${className}`}
    >
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-primary border border-primary/50 rounded-full animate-pulse"></div>
          <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
            CONTROL PANEL
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 font-bold rounded-sm border border-zinc-700">
          VAULT
        </span>
      </div>

      {/* Main Navigation links */}
      <nav className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1">
          NAVIGATION
        </span>
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isCurrentRoute =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          const isSelected = selectedMenu
            ? selectedMenu.toUpperCase() === item.name
            : isCurrentRoute;

          const badgeDisplay = item.badgeCount
            ? item.badgeCount(assets.length, articles.length)
            : item.tag || 'OK';

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onSelectMenu?.(item.name)}
              className={`w-full py-2.5 px-3 border rounded-md text-xs font-mono font-bold transition-all flex items-center justify-between text-left group ${
                isSelected
                  ? 'bg-primary border-primary text-black shadow-pixel font-black'
                  : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-4 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isSelected ? 'text-black' : 'text-zinc-400 group-hover:text-primary'
                  }`}
                  weight={isSelected ? 'bold' : 'regular'}
                />
                <span className="truncate">{item.name}</span>
              </div>

              <span
                className={`text-[10px] px-2 py-1 rounded border font-mono font-bold shrink-0 ml-2 ${
                  isSelected
                    ? 'bg-black/20 border-black/30 text-black'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 group-hover:border-zinc-700'
                }`}
              >
                {badgeDisplay}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* View Public Vault Link */}
      <div className="border-t border-zinc-800 pt-3 mt-1">
        <Link
          href="https://pixlape.vercel.app/"
          target="_blank"
          className="w-full py-2 px-3 bg-zinc-800/80 hover:bg-zinc-800 shadow-pixel border border-zinc-700 text-zinc-200 hover:text-primary text-xs font-mono font-bold rounded-md flex items-center justify-between transition-all group"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-zinc-400 group-hover:text-primary" />
            LIVE PUBLIC VAULT
          </span>
          <span className="text-[10px] text-zinc-400 group-hover:text-primary">&gt;</span>
        </Link>
      </div>

      {/* Info / Account Telemetry Box */}
      <div className="border border-zinc-800 p-3 rounded-md flex flex-col mt-auto bg-zinc-950/70 gap-2 text-xs text-zinc-400 font-mono">
        <div className="flex items-center justify-between text-[11px] font-bold text-zinc-300 border-b border-zinc-800/80 pb-1.5">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" weight="bold" />
            ADMIN CONSOLE
          </span>
          <span className="px-1.5 py-0.5 bg-zinc-800 text-primary text-[9px] rounded-md font-bold border border-zinc-700">
            ROOT
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Operator:</span>
          <span className="font-bold text-zinc-200">admin</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" />
            Data:
          </span>
          <span className="font-bold text-emerald-400">Drizzle / Neon</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Host Service:</span>
          <span className="font-bold text-zinc-200 flex items-center gap-1">
            <Pulse className="w-3 h-3 text-emerald-400 animate-pulse" weight="bold" />
            vercel
          </span>
        </div>
      </div>

      {/* Sign Out Button */}
      <form action={logoutAction} className="w-full">
        <button
          type="submit"
          className="w-full py-1.5 px-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 rounded-md text-xs font-mono font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-pixel hover:scale-98"
          title="Sign out of Admin Session"
        >
          <SignOut className="w-3.5 h-3.5" weight="bold" />
          <span>SIGN OUT</span>
        </button>
      </form>
    </aside>
  );
}

export default SidePanel;
