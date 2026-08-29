'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Tag,
  CheckCircle,
} from '@phosphor-icons/react';
import {
  useArticles,
  deleteArticleFromStore,
  toggleArticleFeatured,
  ArticleItem,
} from '@/lib/db/article';
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white border border-black-primary shadow-pixel rounded-md text-xs font-mono font-black hover:scale-98 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" weight="bold" />
          <span>PUBLISH ARTICLE</span>
        </Link>
      }
    >
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Filter and Search */}
      <div className="bg-surface border border-black-primary rounded-md p-4 mb-3 flex flex-col md:flex-row gap-3 items-center justify-between font-mono shadow-sm">
        <div className="relative w-full md:max-w-md">
          <MagnifyingGlass className="w-4 h-4 text-black-secondary absolute left-3 top-1/2 -translate-y-1/2" weight="bold" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, author, or keywords..."
            className="w-full pl-9 pr-4 py-2 border border-black-primary rounded-md bg-white text-xs font-mono focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          <span className="text-[11px] font-bold text-black-secondary uppercase mr-1">TOPIC:</span>
          {dynamicCategories.map((cat: string) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded border transition-all cursor-pointer uppercase ${
                selectedCategory.toUpperCase() === cat.toUpperCase()
                  ? 'bg-black-primary text-primary border-black-primary shadow-xs'
                  : 'bg-white text-black-secondary border-border hover:bg-[#e4e4e7] hover:border-black-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid / Empty State */}
      {filteredArticles.length === 0 ? (
        <div className="bg-surface border border-black-primary rounded-md p-12 text-center font-mono shadow-sm">
          <Article className="w-10 h-10 text-black-secondary mx-auto mb-3" weight="duotone" />
          <h3 className="text-sm font-bold uppercase text-black-primary">
            NO MATCHING ARTICLES FOUND
          </h3>
          <p className="text-xs text-black-secondary mt-1 mb-4">
            Try adjusting your search query or topic filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 bg-primary text-black-primary border border-black-primary rounded-md text-xs font-bold font-mono cursor-pointer hover:bg-emerald-400 shadow-pixel transition-all"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
          {filteredArticles.map((article: ArticleItem) => (
            <div
              key={article.id}
              className="bg-surface border border-black-primary rounded-md p-4 flex flex-col justify-between group hover:border-primary transition-all shadow-sm"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-2.5 border-b border-border pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-black-primary text-white rounded">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-black-secondary">{article.date}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(article.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      article.featured
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : 'bg-white text-black-secondary border-border hover:border-black-primary'
                    }`}
                    title="Toggle Featured on Vault Hero"
                  >
                    <Star className="w-3 h-3 text-amber-600" weight={article.featured ? 'fill' : 'bold'} />
                    <span>{article.featured ? 'FEATURED HERO' : 'STANDARD'}</span>
                  </button>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-bold text-sm text-black-primary group-hover:text-emerald-700 leading-snug mb-1">
                  {article.title}
                </h3>
                {article.subtitle && (
                  <p className="text-xs text-black-secondary font-medium mb-2 italic">
                    {article.subtitle}
                  </p>
                )}
                <p className="text-xs text-black-secondary line-clamp-2 mb-3 bg-white p-2.5 rounded border border-border">
                  {article.excerpt}
                </p>
              </div>

              {/* Footer details */}
              <div className="border-t border-border pt-3 flex items-center justify-between text-[11px] text-black-secondary">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-black-secondary" weight="bold" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-black-secondary" weight="bold" />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" weight="fill" />
                    {article.likes}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewArticle(article)}
                    className="p-1.5 bg-surface hover:bg-border border border-black-primary rounded text-black-primary cursor-pointer transition-colors"
                    title="Preview Full Article"
                  >
                    <Eye className="w-3.5 h-3.5" weight="bold" />
                  </button>
                  <Link
                    href={`/admin/article/${article.id}`}
                    className="p-1.5 bg-blue-100 hover:bg-blue-200 border border-blue-400 text-blue-900 rounded cursor-pointer transition-colors"
                    title="Edit Article"
                  >
                    <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(article.id, article.title)}
                    className="p-1.5 bg-rose-100 hover:bg-rose-200 border border-rose-400 text-rose-800 rounded cursor-pointer transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black-primary/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
          <div className="bg-surface border border-black-primary rounded-md max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between bg-black-primary text-primary p-3 px-4 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider">
                ++ VAULT EDITORIAL INSPECTOR: #{previewArticle.id} ++
              </span>
              <button
                type="button"
                onClick={() => setPreviewArticle(null)}
                className="text-white hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4" weight="bold" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono px-2 py-0.5 bg-black-primary text-white rounded font-bold">
                  {previewArticle.category}
                </span>
                <span className="text-xs text-black-secondary">◉ {previewArticle.date}</span>
                <span className="text-xs text-black-secondary">◉ {previewArticle.readTime}</span>
                {previewArticle.featured && (
                  <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-400 rounded font-bold">
                    ★ FEATURED HERO
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-black text-black-primary tracking-wide leading-snug">
                  {previewArticle.title}
                </h2>
                {previewArticle.subtitle && (
                  <h4 className="text-xs font-semibold text-black-secondary mt-1">
                    ▦ {previewArticle.subtitle}
                  </h4>
                )}
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3 p-2.5 bg-white rounded border border-border">
                <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center font-bold text-xs">
                  {previewArticle.author.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-xs font-bold text-black-primary block">{previewArticle.author}</span>
                  <span className="text-[10px] text-black-secondary">{previewArticle.authorRole || 'Contributor'}</span>
                </div>
              </div>

              {/* Lead Paragraph / Excerpt */}
              <div className="p-3.5 bg-white border border-border rounded text-xs leading-relaxed text-black-primary font-medium">
                {previewArticle.leadParagraph || previewArticle.excerpt}
              </div>

              {/* Sections */}
              {previewArticle.sections && previewArticle.sections.length > 0 && (
                <div className="space-y-3">
                  {previewArticle.sections.map((section, sIdx) => (
                    <div key={sIdx} className="p-3.5 bg-surface border border-black-primary rounded">
                      {section.title && (
                        <h4 className="text-xs font-bold uppercase text-black-primary mb-2 border-b border-border pb-1">
                          {section.title}
                        </h4>
                      )}
                      <div className="space-y-2 text-xs text-black-secondary leading-relaxed">
                        {section.paragraphs.map((p, pIdx) => (
                          <p key={pIdx}>{p}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quote */}
              {previewArticle.quote && (
                <div className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r text-xs italic text-black-primary">
                  &ldquo;{previewArticle.quote.text}&rdquo;
                  <span className="block not-italic font-bold text-[10px] text-black-secondary mt-1">
                    — {previewArticle.quote.author}
                  </span>
                </div>
              )}

              {/* Checklist */}
              {previewArticle.checklist && (
                <div className="p-3.5 bg-white border border-border rounded">
                  <h4 className="text-xs font-bold uppercase text-black-primary mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" weight="bold" />
                    {previewArticle.checklist.title || 'Checklist & Rules'}
                  </h4>
                  <div className="space-y-2 text-xs">
                    {previewArticle.checklist.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-emerald-700 shrink-0">[{idx + 1}]</span>
                        <div>
                          <strong className="text-black-primary">{item.label}:</strong>{' '}
                          <span className="text-black-secondary">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Snippet */}
              {previewArticle.codeSnippet && (
                <div className="p-3 bg-black-primary text-emerald-400 rounded text-xs font-mono">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2 text-[10px] text-zinc-400">
                    <span>{previewArticle.codeSnippet.label || 'TERMINAL'}</span>
                    <span className="text-amber-300 font-bold">{previewArticle.codeSnippet.lang || 'BASH'}</span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{previewArticle.codeSnippet.code}</pre>
                </div>
              )}

              {/* Conclusion */}
              {previewArticle.conclusion && (
                <div className="p-3 bg-white border border-border rounded text-xs">
                  <strong className="block text-black-primary font-bold mb-1">
                    {previewArticle.conclusion.title || 'Conclusion'}
                  </strong>
                  <p className="text-black-secondary leading-relaxed">{previewArticle.conclusion.text}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-black-secondary border-t border-border pt-3">
                <span>Likes: {previewArticle.likes}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewArticle(null)}
                    className="px-4 py-1.5 bg-[#e4e4e7] hover:bg-border text-black-primary rounded text-xs font-bold cursor-pointer"
                  >
                    CLOSE
                  </button>
                  <Link
                    href={`/admin/article/${previewArticle.id}`}
                    className="px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-400 rounded text-xs font-bold transition-colors flex items-center gap-1.5"
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
