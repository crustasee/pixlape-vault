'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Cards,
  Article,
  PencilSimple,
  Trash,
  Star,
  ArrowRight,
  Database,
  Tag,
} from '@phosphor-icons/react';
import { deleteAssetFromStore, CardDetail } from '@/lib/db/card';
import { deleteArticleFromStore, toggleArticleFeatured, ArticleItem } from '@/lib/db/article';
import { useAssets } from '@/hooks/useAssets';
import { useArticles } from '@/hooks/useArticles';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/admin/Toast';

export default function AdminDashboardPage() {
  const assets = useAssets();
  const articles = useArticles();
  const { toasts, addToast, dismissToast } = useToast();

  const freeAssetsCount = assets.filter((a) => a.badge === 'free').length;
  const paidAssetsCount = assets.filter((a) => a.badge === 'paid' || a.badge === 'premium').length;
  const featuredArticlesCount = articles.filter((a) => a.featured).length;

  const recentAssets = assets.slice(0, 5);
  const recentArticles = articles.slice(0, 5);

  const handleDeleteAsset = (id: string, title: string) => {
    deleteAssetFromStore(id);
    addToast('info', 'ASSET REMOVED', `"${title}" has been deleted from vault.`);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    deleteArticleFromStore(id);
    addToast('info', 'ARTICLE REMOVED', `"${title}" has been deleted from editorial.`);
  };

  const handleToggleFeatured = (id: string) => {
    toggleArticleFeatured(id);
    addToast('success', 'FEATURED UPDATED', 'Hero showcase display status updated.');
  };

  return (
    <AdminLayout
      title="VAULT TELEMETRY & OPERATIONS"
      subtitle="Overview of digital assets, editorial documentation, database sync status, and system controls."
      breadcrumbs={[{ label: 'DASHBOARD' }]}
    >
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 font-mono">
        {/* Metric 1 */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-3.5 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              TOTAL ASSETS
            </span>
            <div className="p-1.5 bg-zinc-800/90 border border-zinc-700 text-primary rounded">
              <Cards className="w-4 h-4" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-primary">{assets.length}</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              {freeAssetsCount} Free / {paidAssetsCount} Premium
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-3.5 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              EDITORIAL POSTS
            </span>
            <div className="p-1.5 bg-zinc-800/90 border border-zinc-700 text-primary rounded">
              <Article className="w-4 h-4" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-primary">{articles.length}</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              {featuredArticlesCount} Featured on Hero
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-3.5 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              CATEGORIES ACTIVE
            </span>
            <div className="p-1.5 bg-zinc-800/90 border border-zinc-700 text-primary rounded">
              <Tag className="w-4 h-4" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-primary">7</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">
              APPS, BRUSH, TOOLS, ICON, etc.
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-3.5 flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              DATABASE ENGINE
            </span>
            <div className="p-1.5 bg-zinc-800/90 border border-zinc-700 text-primary rounded">
              <Database className="w-4 h-4" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm font-black text-emerald-400">DRIZZLE + NEON</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-bold block mt-0.5">
              SYNCED & OPERATIONAL
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 font-mono">
        {/* Recent Assets */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
              <span className="text-xs font-black text-zinc-100 uppercase flex items-center gap-2">
                <Cards className="w-4 h-4 text-primary" weight="bold" />
                RECENT ASSET CARDS ({assets.length})
              </span>
              <Link
                href="/admin/card"
                className="text-[11px] font-bold text-zinc-400 hover:text-primary flex items-center gap-1 transition-colors"
              >
                VIEW ALL <ArrowRight className="w-3 h-3" weight="bold" />
              </Link>
            </div>

            <div className="space-y-2">
              {recentAssets.map((asset: CardDetail) => (
                <div
                  key={asset.id}
                  className="bg-zinc-950/60 border border-zinc-800/80 rounded-md p-2 flex items-center justify-between gap-3 hover:border-zinc-700 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 bg-zinc-900 border border-zinc-700 rounded overflow-hidden relative shrink-0 flex items-center justify-center"
                    >
                      <Image
                        src={asset.icon || asset.thumbnail || '/img/Icontemp1.svg'}
                        alt={asset.title}
                        width={28}
                        height={28}
                        unoptimized
                        className="object-contain w-7 h-7 drop-shadow-xs"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-zinc-100 truncate block">
                        {asset.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-zinc-400">
                        <span className="px-1.5 py-0.2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded font-bold">
                          {asset.categories[0] || 'TOOLS'}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                          asset.badge === 'free'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                            : asset.badge === 'paid'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-700'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-700'
                        }`}>
                          {asset.badge}
                        </span>
                        <span>{asset.version || 'v1.0'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/admin/card/${asset.id}/edit`}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-primary rounded transition-colors"
                      title="Edit Asset"
                    >
                      <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteAsset(asset.id, asset.title)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded cursor-pointer transition-colors"
                      title="Delete Asset"
                    >
                      <Trash className="w-3.5 h-3.5" weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-end">
            <Link
              href="/admin/card/new"
              className="text-xs font-bold text-zinc-400 hover:text-primary flex items-center gap-1 transition-colors"
            >
              + ADD NEW DIGITAL ASSET
            </Link>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 mb-3">
              <span className="text-xs font-black text-zinc-100 uppercase flex items-center gap-2">
                <Article className="w-4 h-4 text-primary" weight="bold" />
                RECENT EDITORIAL ARTICLES ({articles.length})
              </span>
              <Link
                href="/admin/article"
                className="text-[11px] font-bold text-zinc-400 hover:text-primary flex items-center gap-1 transition-colors"
              >
                VIEW ALL <ArrowRight className="w-3 h-3" weight="bold" />
              </Link>
            </div>

            <div className="space-y-2">
              {recentArticles.map((article: ArticleItem) => (
                <div
                  key={article.id}
                  className="bg-zinc-950/60 border border-zinc-800/80 rounded p-2.5 flex items-center justify-between gap-3 hover:border-zinc-700 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-950/80 text-amber-300 border border-amber-700 rounded">
                          ★ HERO
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-400">{article.date}</span>
                    </div>
                    <span className="font-bold text-xs text-zinc-100 truncate block">
                      {article.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate block mt-0.5">
                      By {article.author} • {article.readTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(article.id)}
                      className={`p-1.5 border rounded cursor-pointer transition-colors ${
                        article.featured
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-3.5 h-3.5" weight={article.featured ? 'fill' : 'bold'} />
                    </button>
                    <Link
                      href={`/admin/article/${article.id}`}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-primary rounded transition-colors"
                      title="Edit Article"
                    >
                      <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded cursor-pointer transition-colors"
                      title="Delete Article"
                    >
                      <Trash className="w-3.5 h-3.5" weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-end">
            <Link
              href="/admin/article/new"
              className="text-xs font-bold text-zinc-400 hover:text-primary flex items-center gap-1 transition-colors"
            >
              + PUBLISH NEW EDITORIAL ARTICLE
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
