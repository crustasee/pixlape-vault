'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Cards,
  Article,
  PlusCircle,
  PencilSimple,
  Trash,
  Star,
  Eye,
  ArrowRight,
  Database,
  Tag,
  Lightning,
} from '@phosphor-icons/react';
import { useAssets, deleteAssetFromStore, CardDetail } from '@/lib/db/card';
import { useArticles, deleteArticleFromStore, toggleArticleFeatured, ArticleItem } from '@/lib/db/article';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2 font-mono">
        {/* Metric 1 */}
        <div className="bg-emerald-100 border border-black-primary rounded-md p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black-secondary uppercase tracking-wider">
              TOTAL ASSETS
            </span>
            <div className="p-1.5 bg-primary/20 border border-black-primary rounded">
              <Cards className="w-4 h-4 text-black-primary" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-black-primary">{assets.length}</span>
            <span className="text-[10px] text-black-secondary block mt-0.5">
              {freeAssetsCount} Free / {paidAssetsCount} Premium
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-emerald-100 border border-black-primary rounded-md p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black-secondary uppercase tracking-wider">
              EDITORIAL POSTS
            </span>
            <div className="p-1.5 bg-blue-100 border border-black-primary rounded">
              <Article className="w-4 h-4 text-blue-800" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-black-primary">{articles.length}</span>
            <span className="text-[10px] text-black-secondary block mt-0.5">
              {featuredArticlesCount} Featured on Hero
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-emerald-100 border border-black-primary rounded-md p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black-secondary uppercase tracking-wider">
              CATEGORIES ACTIVE
            </span>
            <div className="p-1.5 bg-amber-100 border border-black-primary rounded">
              <Tag className="w-4 h-4 text-amber-800" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-black-primary">7</span>
            <span className="text-[10px] text-black-secondary block mt-0.5">
              APPS, BRUSH, TOOLS, ICON, etc.
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-emerald-100 border border-black-primary rounded-md p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-black-secondary uppercase tracking-wider">
              DATABASE ENGINE
            </span>
            <div className="p-1.5 bg-emerald-100 border border-black-primary rounded">
              <Database className="w-4 h-4 text-emerald-800" weight="bold" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-black text-green-600">DRIZZLE + NEON</span>
            </div>
            <span className="text-[10px] text-black-secondary font-bold block mt-0.5">
              SYNCED & OPERATIONAL
            </span>
          </div>
        </div>
      </div>



      {/* Main Two-Column Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 font-mono">
        {/* Recent Assets */}
        <div className="bg-surface border border-black-primary rounded-md p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-black-primary pb-2.5 mb-3">
              <span className="text-xs font-black text-black-primary uppercase flex items-center gap-1.5">
                <Cards className="w-4 h-4 text-black-primary" weight="bold" />
                RECENT ASSET CARDS ({assets.length})
              </span>
              <Link
                href="/admin/card"
                className="text-[11px] font-bold text-emerald-800 hover:underline flex items-center gap-1"
              >
                VIEW ALL <ArrowRight className="w-3 h-3" weight="bold" />
              </Link>
            </div>

            <div className="space-y-2">
              {recentAssets.map((asset: CardDetail) => (
                <div
                  key={asset.id}
                  className="bg-white border border-border rounded p-2.5 flex items-center justify-between gap-3 hover:border-black-primary transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-surface border border-border rounded overflow-hidden relative shrink-0">
                      <Image
                        src={asset.thumbnail || '/img/minicard001.svg'}
                        alt={asset.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-black-primary truncate block">
                        {asset.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-black-secondary">
                        <span className="px-1.5 py-0.2 bg-surface rounded border border-border font-bold">
                          {asset.categories[0] || 'TOOLS'}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded font-bold uppercase ${
                          asset.badge === 'free'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asset.badge === 'paid'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
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
                      className="p-1.5 bg-surface hover:bg-border border border-border text-black-primary rounded"
                      title="Edit Asset"
                    >
                      <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteAsset(asset.id, asset.title)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 rounded cursor-pointer"
                      title="Delete Asset"
                    >
                      <Trash className="w-3.5 h-3.5" weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex justify-end">
            <Link
              href="/admin/card/new"
              className="text-xs font-bold text-black-primary hover:underline flex items-center gap-1"
            >
              + ADD NEW DIGITAL ASSET
            </Link>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-surface border border-black-primary rounded-md p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-black-primary pb-2.5 mb-3">
              <span className="text-xs font-black text-black-primary uppercase flex items-center gap-1.5">
                <Article className="w-4 h-4 text-black-primary" weight="bold" />
                RECENT EDITORIAL ARTICLES ({articles.length})
              </span>
              <Link
                href="/admin/article"
                className="text-[11px] font-bold text-blue-800 hover:underline flex items-center gap-1"
              >
                VIEW ALL <ArrowRight className="w-3 h-3" weight="bold" />
              </Link>
            </div>

            <div className="space-y-2">
              {recentArticles.map((article: ArticleItem) => (
                <div
                  key={article.id}
                  className="bg-white border border-border rounded p-2.5 flex items-center justify-between gap-3 hover:border-black-primary transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-black-primary text-white rounded">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 rounded">
                          ★ HERO
                        </span>
                      )}
                      <span className="text-[10px] text-black-secondary">{article.date}</span>
                    </div>
                    <span className="font-bold text-xs text-black-primary truncate block">
                      {article.title}
                    </span>
                    <span className="text-[10px] text-black-secondary truncate block mt-0.5">
                      By {article.author} • {article.readTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(article.id)}
                      className={`p-1.5 border rounded cursor-pointer ${
                        article.featured
                          ? 'bg-amber-100 text-amber-800 border-amber-400'
                          : 'bg-surface text-black-secondary border-border hover:text-black-primary'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-3.5 h-3.5" weight={article.featured ? 'fill' : 'bold'} />
                    </button>
                    <Link
                      href={`/admin/article/${article.id}`}
                      className="p-1.5 bg-surface hover:bg-border border border-border text-black-primary rounded"
                      title="Edit Article"
                    >
                      <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(article.id, article.title)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 rounded cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash className="w-3.5 h-3.5" weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex justify-end">
            <Link
              href="/admin/article/new"
              className="text-xs font-bold text-black-secondary hover:text-border flex items-center gap-1"
            >
              + PUBLISH NEW EDITORIAL ARTICLE
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
