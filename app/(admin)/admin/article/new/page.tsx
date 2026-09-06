'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SubmitButton from '@/components/admin/SubmitButton';
import Toast from '@/components/admin/Toast';
import RichEditor from '@/components/admin/RichEditor';
import ImageUpload from '@/components/admin/image-upload';
import { useToast } from '@/hooks/useToast';
import { addArticleToStore } from '@/lib/db/article';
import { createArticleAction } from '@/app/actions/product-actions';
import {
  ArrowLeft,
  User,
  Clock,
  Heart,
  CheckCircle,
  BookOpen,
} from '@phosphor-icons/react';

const CATEGORIES = [
  'DEV',
  'SYSTEMS',
  'DESIGN',
  'ASSETS',
  'UX',
  'TUTORIAL',
  'NEWS',
  'COMMUNITY',
];

export default function AddArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('DEV');
  const [author, setAuthor] = useState('Brandon Herera');
  const [readTime, setReadTime] = useState('4 MIN READ');
  const [image, setImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [externalUrl, setExternalUrl] = useState('');
  const { toasts, addToast, dismissToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 3) {
      addToast('error', 'VALIDATION ERROR', 'Article title must be at least 3 characters.');
      return;
    }

    if (!excerpt.trim()) {
      addToast('error', 'VALIDATION ERROR', 'Article excerpt summary is required.');
      return;
    }

    try {
      const payload = {
        title,
        subtitle: subtitle.trim() || 'Technical documentation from PIXLApe Vault',
        excerpt,
        category,
        author: author.trim() || 'Brandon Herera',
        readTime: readTime.trim() || '4 MIN READ',
        image,
        featured,
        externalUrl: externalUrl.trim() || 'https://pixlblog-page.pixlape.workers.dev/',
      };

      // 1. In-memory store
      addArticleToStore(payload);

      // 2. Server action DB sync
      createArticleAction(payload);

      addToast('success', 'ARTICLE PUBLISHED', `"${title}" has been added to Vault Editorial.`);
      setTimeout(() => {
        router.push('/admin/article');
      }, 900);
    } catch {
      addToast('error', 'SAVE FAILED', 'Could not save article to editorial store.');
    }
  };

  return (
    <AdminLayout
      title="PUBLISH EDITORIAL ARTICLE"
      subtitle="Draft technical documentation, design tutorials, and changelog updates in PIXLApe Vault."
      breadcrumbs={[
        { label: 'EDITORIAL ARTICLES', href: '/admin/article' },
        { label: 'PUBLISH ARTICLE' },
      ]}
      actionSlot={
        <Link
          href="/admin/article"
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded-md text-xs font-mono font-bold transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" weight="bold" />
          <span>BACK TO LIST</span>
        </Link>
      }
    >
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono">
        {/* Left Form (2 cols) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900/90 border border-zinc-800 rounded-md p-5 flex flex-col gap-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" weight="bold" />
                ++ ARTICLE EDITORIAL SPECIFICATION ++
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 font-bold rounded">
                NEW DRAFT
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="font-bold text-xs text-zinc-200">
                ARTICLE TITLE <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern High-Performance Asset Distribution Architectures"
                className="border border-zinc-800 p-2 rounded bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs font-mono font-bold focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subtitle" className="font-bold text-xs text-zinc-300">
                SUBTITLE / TAGLINE
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Deep dive into lossless compression pipelines and edge caching"
                className="border border-zinc-800 p-2 rounded bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            {/* External URL */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="externalUrl" className="font-bold text-xs text-zinc-300">
                EXTERNAL ARTICLE URL (BLOG LINK)
              </label>
              <input
                type="url"
                id="externalUrl"
                name="externalUrl"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://pixlblog-page.pixlape.workers.dev/..."
                className="border border-zinc-800 p-2 rounded bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            {/* Category & Read Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className="font-bold text-xs text-zinc-400">
                  TOPIC / CATEGORY
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-zinc-800 p-2 rounded bg-zinc-950 text-zinc-100 text-xs font-mono font-bold cursor-pointer focus:outline-none focus:border-zinc-700"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-zinc-950 text-zinc-100">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="readTime" className="font-bold text-xs text-zinc-400">
                  ESTIMATED READ TIME
                </label>
                <input
                  type="text"
                  id="readTime"
                  name="readTime"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 MIN READ"
                  className="border border-zinc-800 p-2 rounded bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs font-mono font-bold focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

            {/* Author Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="author" className="font-bold text-xs text-zinc-400">
                AUTHOR NAME
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Brandon Herera"
                className="border border-zinc-800 p-2 rounded bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs font-mono font-bold focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            {/* Cover Image Upload */}
            <div className="border-t border-zinc-800 pt-3">
              <ImageUpload
                name="image"
                label="ARTICLE COVER IMAGE"
                value={image}
                onChange={setImage}
                folder="articles"
                aspectRatio="banner"
                recommendedSize="1200x630 or 16:9 banner (PNG, JPG, WEBP, SVG)"
              />
            </div>

            {/* Excerpt / Summary */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="excerpt" className="font-bold text-xs text-zinc-200">
                ARTICLE EXCERPT & OVERVIEW <span className="text-rose-500">*</span>
              </label>
              <RichEditor
                name="excerpt"
                value={excerpt}
                onChange={setExcerpt}
                placeholder="Write an informative overview, technical tutorial, or rich documentation..."
                minHeight="180px"
              />
            </div>

            {/* Featured Showcase Option */}
            <div className="flex items-center gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-md">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-zinc-700 cursor-pointer accent-primary"
              />
              <label htmlFor="featured" className="text-xs font-bold text-zinc-200 cursor-pointer select-none">
                Pin to Vault Hero Showcase (Featured Article)
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="mt-2 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                * Published articles immediately syndicate to PIXLApe Vault feed
              </span>
              <SubmitButton label="PUBLISH ARTICLE" loadingLabel="PUBLISHING..." />
            </div>
          </form>
        </div>

        {/* Right Preview Column (1 col) */}
        <div className="flex flex-col gap-4">
          <div className="border border-zinc-800 rounded-md p-4 bg-zinc-900/90 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" weight="bold" />
                LIVE ARTICLE CARD PREVIEW
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  featured
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {featured ? '★ FEATURED' : 'STANDARD'}
              </span>
            </div>

            {/* Card Content */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded">
                    {category}
                  </span>
                  <span className="text-[11px] text-zinc-500">TODAY</span>
                </div>

                <h3 className="font-bold text-sm text-zinc-100 leading-snug mb-1">
                  {title || 'Untitled Article Documentation'}
                </h3>
                {subtitle && (
                  <p className="text-xs text-zinc-400 font-medium mb-2 italic">
                    {subtitle}
                  </p>
                )}
                <p className="text-xs text-zinc-300 line-clamp-3 mb-3 bg-zinc-900 p-2.5 rounded border border-zinc-800">
                  {excerpt || 'Write an excerpt in the form on the left to see how your article will display in the vault catalog.'}
                </p>
              </div>

              <div className="border-t border-zinc-800 pt-2 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-zinc-500" weight="bold" />
                    {author || 'Brandon Herera'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" weight="bold" />
                    {readTime || '4 MIN READ'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-400" weight="fill" />
                    0
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-center p-2 rounded bg-zinc-950 border border-zinc-800">
              <div className="flex items-center gap-2">
                <Image
                  src={image || 'https://res.cloudinary.com/lbovk2lu/image/upload/v1788330171/minicard007.svg'}
                  alt="Cover Preview"
                  width={100}
                  height={100}
                  className="rounded object-contain shrink-0"
                />
                <span className="text-[11px] text-zinc-400 font-mono truncate">
                  Cover: {image}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-zinc-900/90 text-zinc-100 border border-zinc-800 rounded-md p-4 text-xs font-mono shadow-sm">
            <span className="font-bold text-primary text-xs uppercase block mb-2">
              EDITORIAL GUIDELINES
            </span>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" weight="bold" />
                Keep code samples modular and annotated
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" weight="bold" />
                Provide clear prerequisites in the summary
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" weight="bold" />
                Featured posts appear in the Hero showcase
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
