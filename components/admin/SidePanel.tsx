'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour,
  Cards,
  Article,
  PlusCircle,
  ShieldCheck,
  Pulse,
  Database,
  Globe,
} from '@phosphor-icons/react';
import { useAssets } from '@/lib/db/card';
import { useArticles } from '@/lib/db/article';

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
    name: 'EDITORIAL ARTICLES',
    href: '/admin/article',
    icon: Article,
    badgeCount: (_, arts) => arts,
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
      className={`w-full lg:w-72 bg-surface rounded-md border border-black-primary p-4 flex flex-col gap-4 shrink-0 font-mono shadow-sm ${className}`}
    >
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-black-primary pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-primary border border-black-primary rounded-full animate-pulse"></div>
          <h3 className="text-xs font-bold text-black-primary uppercase tracking-wider">
            ++ CONTROL PANEL ++
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-black-primary text-white font-bold rounded">
          VAULT
        </span>
      </div>

      {/* Main Navigation links */}
      <nav className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-black-secondary uppercase tracking-wider px-1">
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
                  ? 'bg-primary border-black-primary text-black-primary shadow-pixel font-black'
                  : 'bg-white border-border text-black-primary hover:bg-[#e4e4e7] hover:border-black-primary'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isSelected ? 'text-black-primary' : 'text-black-secondary group-hover:text-black-primary'
                  }`}
                  weight={isSelected ? 'bold' : 'regular'}
                />
                <span className="truncate">{item.name}</span>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded border font-mono font-bold shrink-0 ml-2 ${
                  isSelected
                    ? 'bg-green-300 border-black-primary text-black-primary'
                    : 'bg-surface text-black-secondary border-border group-hover:border-black-primary'
                }`}
              >
                {badgeDisplay}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Action Shortcuts */}
      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <span className="text-[10px] font-bold text-black-secondary uppercase tracking-wider px-1">
          QUICK ACTIONS
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          <Link
            href="/admin/card/new"
            className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-mono font-bold rounded flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-3.5 h-3.5 text-emerald-700" weight="bold" />
              ADD NEW ASSET
            </span>
            <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
              +CARD
            </span>
          </Link>

          <Link
            href="/admin/article/new"
            className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-400 text-blue-950 text-xs font-mono font-bold rounded flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <PlusCircle className="w-3.5 h-3.5 text-blue-700" weight="bold" />
              PUBLISH ARTICLE
            </span>
            <span className="text-[9px] bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded font-bold">
              +POST
            </span>
          </Link>
        </div>
      </div>

      {/* View Public Vault Link */}
      <div className="border-t border-border pt-3">
        <Link
          href="/"
          target="_blank"
          className="w-full py-2 px-3 bg-surface hover:bg-border border border-black-primary text-black-primary text-xs font-mono font-bold rounded flex items-center justify-between transition-all group"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-black-secondary group-hover:text-black-primary" />
            LIVE PUBLIC VAULT
          </span>
          <span className="text-[10px] text-black-secondary">&gt;</span>
        </Link>
      </div>

      {/* Info / Account Telemetry Box */}
      <div className="border border-black-primary p-3 rounded-md flex flex-col mt-auto bg-border gap-2 text-xs text-black-secondary font-mono">
        <div className="flex items-center justify-between text-[11px] font-bold text-black-primary border-b border-black-primary/20 pb-1.5">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" weight="bold" />
            ADMIN CONSOLE
          </span>
          <span className="px-1.5 py-0.5 bg-black-primary text-primary text-[9px] rounded font-bold">
            ROOT
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-black-secondary">Operator:</span>
          <span className="font-bold text-black-primary">Brandon</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-black-secondary flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-700" />
            Database:
          </span>
          <span className="font-bold text-emerald-800">Drizzle / Neon</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-black-secondary">Host Service:</span>
          <span className="font-bold text-black-primary flex items-center gap-1">
            <Pulse className="w-3 h-3 text-emerald-600 animate-pulse" weight="bold" />
            pixlape-vault
          </span>
        </div>
      </div>
    </aside>
  );
}

export default SidePanel;
