'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import Toast from '@/components/admin/Toast';
import { useToast } from '@/hooks/useToast';
import {
  MagnifyingGlass,
  PlusCircle,
  Trash,
  Star,
  Clock,
  User,
  Heart,
  Eye,
  X,
  PencilSimple,
  Article,
} from '@phosphor-icons/react';
import {
  deleteArticleFromStore,
  toggleArticleFeatured,
  ArticleItem,
} from '@/lib/db/article';
import { useArticles } from '@/hooks/useArticles';
import {
  deleteArticleAction,
  toggleArticleFeaturedAction,
} from '@/app/actions/product-actions';

const DEFAULT_CATEGORIES = ['ALL', 'DEV', 'SYSTEMS', 'DESIGN', 'ASSETS', 'UX', 'TUTORIAL', 'NEWS'];

export default function ArticleListPage() {
  const articles: ArticleItem[] = useArticles();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [previewArticle, setPreviewArticle] = useState<ArticleItem | null>(null);
  const { toasts, addToast, dismissToast } = useToast();

  const dynamicCategories: string[] = [
    'ALL',
    ...Array.from(
      new Set(
        articles.map((a: ArticleItem) => a.category).concat(DEFAULT_CATEGORIES.slice(1))
      )
    ),
  ];

  const filteredArticles = articles.filter((article: ArticleItem) => {
    const matchSearch =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === 'ALL' ||
      article.category.toUpperCase() === selectedCategory.toUpperCase();

    return matchSearch && matchCategory;
  });

  const handleDelete = (id: string, title: string) => {
    deleteArticleFromStore(id);
    deleteArticleAction(id);
    if (previewArticle?.id === id) setPreviewArticle(null);
    addToast('info', 'ARTICLE REMOVED', `"${title}" deleted from vault editorial.`);
  };

  const handleToggleFeatured = (id: string) => {
    toggleArticleFeatured(id);
    toggleArticleFeaturedAction(id);
    addToast('success', 'FEATURED STATUS UPDATED', 'Hero showcase display status updated.');
  };

  return (
    <AdminLayout
      title="VAULT EDITORIAL & ARTICLES"
      subtitle="Manage technical documentation, tutorials, release notes, and dev articles in PIXLApe Vault."
      breadcrumbs={[{ label: 'EDITORIAL ARTICLES' }]}
      actionSlot={
        <Link
          href="/admin/article/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/50 text-black-primary border border-black-primary shadow-pixel rounded-md text-xs font-mono font-black hover:scale-98 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" weight="bold" />
          <span>PUBLISH ARTICLE</span>
        </Link>
      }
    >
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Filter and Search */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-4 mb-3 flex flex-col md:flex-row gap-3 items-center justify-between font-mono shadow-sm">
        <div className="relative w-full md:max-w-md">
          <MagnifyingGlass className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" weight="bold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, author, or keywords..."
            className="w-full pl-9 pr-4 py-2 border border-zinc-800 rounded-md bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <span className="text-[11px] font-bold text-zinc-400 uppercase mr-1">TOPIC:</span>
          {dynamicCategories.map((cat: string) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded border transition-all cursor-pointer uppercase ${
                selectedCategory.toUpperCase() === cat.toUpperCase()
                  ? 'bg-primary text-black border-primary shadow-xs'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-750 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid / Empty State */}
      {filteredArticles.length === 0 ? (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-12 text-center font-mono shadow-sm">
          <Article className="w-10 h-10 text-zinc-600 mx-auto mb-3" weight="duotone" />
          <h3 className="text-sm font-bold uppercase text-zinc-200">
            NO MATCHING ARTICLES FOUND
          </h3>
          <p className="text-xs text-zinc-400 mt-1 mb-4">
            Try adjusting your search query or topic filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-md text-xs font-bold font-mono cursor-pointer transition-all shadow-xs"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
          {filteredArticles.map((article: ArticleItem) => (
            <div
              key={article.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-md p-4 flex flex-col justify-between group hover:border-primary/60 transition-all shadow-sm"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-2.5 border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-zinc-400">{article.date}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(article.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      article.featured
                        ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'
                    }`}
                    title="Toggle Featured on Vault Hero"
                  >
                    <Star className="w-3 h-3 text-amber-400" weight={article.featured ? 'fill' : 'bold'} />
                    <span>{article.featured ? 'FEATURED HERO' : 'STANDARD'}</span>
                  </button>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-bold text-sm text-zinc-100 group-hover:text-primary leading-snug mb-1 transition-colors">
                  {article.title}
                </h3>
                {article.subtitle && (
                  <p className="text-xs text-zinc-400 font-medium mb-2 italic">
                    {article.subtitle}
                  </p>
                )}
                <p className="text-xs text-zinc-300 line-clamp-2 mb-3 bg-zinc-950/70 p-2.5 rounded border border-zinc-800">
                  {article.excerpt}
                </p>
              </div>

              {/* Footer details */}
              <div className="border-t border-zinc-800 pt-3 flex items-center justify-between text-[11px] text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-zinc-500" weight="bold" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" weight="bold" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" weight="fill" />
                    {article.likes}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewArticle(article)}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded text-zinc-200 cursor-pointer transition-colors"
                    title="Preview Full Article"
                  >
                    <Eye className="w-3.5 h-3.5" weight="bold" />
                  </button>
                  <Link
                    href={`/admin/article/${article.id}`}
                    className="p-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 text-cyan-300 rounded cursor-pointer transition-colors"
                    title="Edit Article"
                  >
                    <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.id, article.title)}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-900 text-rose-300 rounded cursor-pointer transition-colors"
                    title="Delete Article"
                  >
                    <Trash className="w-3.5 h-3.5" weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
          <div className="bg-zinc-900 border border-zinc-800 rounded-md max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between bg-zinc-950 border-b border-zinc-800 text-primary p-3 px-4 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider">
                ++ VAULT EDITORIAL INSPECTOR: #{previewArticle.id} ++
              </span>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" weight="bold" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono px-2 py-0.5 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded font-bold">
                  {previewArticle.category}
                </span>
                <span className="text-xs text-zinc-400">◉ {previewArticle.date}</span>
                <span className="text-xs text-zinc-400">◉ {previewArticle.readTime}</span>
                {previewArticle.featured && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-700 rounded font-bold">
                    ★ FEATURED HERO
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-black text-zinc-100 tracking-wide leading-snug">
                  {previewArticle.title}
                </h2>
                {previewArticle.subtitle && (
                  <h4 className="text-xs font-semibold text-zinc-400 mt-1">
                    ▦ {previewArticle.subtitle}
                  </h4>
                )}
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3 p-2.5 bg-zinc-950 rounded border border-zinc-800">
                <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-200">
                  {previewArticle.author.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-100 block">{previewArticle.author}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Author & Contributor</span>
                </div>
              </div>

              {/* Excerpt */}
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded text-xs leading-relaxed text-zinc-200 font-medium">
                {previewArticle.excerpt}
              </div>

              {/* External URL Link */}
              {previewArticle.externalUrl && (
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    External Article Link
                  </span>
                  <a
                    href={previewArticle.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 hover:underline break-all flex items-center gap-1 font-mono"
                  >
                    <span>↗</span> {previewArticle.externalUrl}
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-zinc-800 pt-3">
                <span>Likes: {previewArticle.likes}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewArticle(null)}
                    className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-xs font-bold cursor-pointer transition-colors"
                  >
                    CLOSE
                  </button>
                  <Link
                    href={`/admin/article/${previewArticle.id}`}
                    className="px-4 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                    <span>EDIT ARTICLE</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
