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
          className="flex items-center gap-1.5 px-3 py-2 bg-surface hover:bg-border border border-black-primary rounded-md text-xs font-mono font-bold transition-all shadow-xs"
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
            className="bg-surface border border-black-primary rounded-md p-5 flex flex-col gap-4 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-black-primary pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-black-primary flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-700" weight="bold" />
                ++ ARTICLE EDITORIAL SPECIFICATION ++
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-black-primary text-white font-bold rounded">
                NEW DRAFT
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="font-bold text-xs text-black-primary">
                ARTICLE TITLE <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern High-Performance Asset Distribution Architectures"
                className="border border-black-primary p-2 rounded bg-white text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subtitle" className="font-bold text-xs text-black-primary">
                SUBTITLE / TAGLINE
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Deep dive into lossless compression pipelines and edge caching"
                className="border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
              />
            </div>

            {/* External URL */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="externalUrl" className="font-bold text-xs text-black-primary">
                EXTERNAL ARTICLE URL (BLOG LINK)
              </label>
              <input
                type="url"
                id="externalUrl"
                name="externalUrl"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://pixlblog-page.pixlape.workers.dev/..."
                className="border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
              />
            </div>

            {/* Category & Read Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className="font-bold text-xs text-black-secondary">
                  TOPIC / CATEGORY
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono font-bold cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="readTime" className="font-bold text-xs text-black-secondary">
                  ESTIMATED READ TIME
                </label>
                <input
                  type="text"
                  id="readTime"
                  name="readTime"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g. 5 MIN READ"
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Author Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="author" className="font-bold text-xs text-black-secondary">
                AUTHOR NAME
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Brandon Herera"
                className="border border-black-primary p-2 rounded bg-white text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            {/* Cover Image Upload */}
            <div className="border-t border-border pt-3">
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
              <label htmlFor="excerpt" className="font-bold text-xs text-black-primary">
                ARTICLE EXCERPT & OVERVIEW <span className="text-rose-600">*</span>
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
            <div className="flex items-center gap-3 p-3 bg-white border border-border rounded-md">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-black-primary cursor-pointer accent-emerald-600"
              />
              <label htmlFor="featured" className="text-xs font-bold text-black-primary cursor-pointer select-none">
                Pin to Vault Hero Showcase (Featured Article)
              </label>
            </div>

            {/* Submit Action Button */}
            <div className="mt-2 pt-4 border-t border-black-primary flex items-center justify-between">
              <span className="text-[11px] text-black-secondary">
                * Published articles immediately syndicate to PIXLApe Vault feed
              </span>
              <SubmitButton label="PUBLISH ARTICLE" loadingLabel="PUBLISHING..." />
            </div>
          </form>
        </div>

        {/* Right Preview Column (1 col) */}
        <div className="flex flex-col gap-4">
          <div className="border border-black-primary rounded-md p-4 bg-surface flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-black-secondary flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" weight="bold" />
                LIVE ARTICLE CARD PREVIEW
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  featured
                    ? 'bg-amber-100 text-amber-900 border-amber-400'
                    : 'bg-white text-black-secondary border-border'
                }`}
              >
                {featured ? '★ FEATURED' : 'STANDARD'}
              </span>
            </div>

            {/* Card Content */}
            <div className="bg-white border border-black-primary rounded-md p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 border-b border-border pb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-black-primary text-white rounded">
                    {category}
                  </span>
                  <span className="text-[11px] text-black-secondary">TODAY</span>
                </div>

                <h3 className="font-bold text-sm text-black-primary leading-snug mb-1">
                  {title || 'Untitled Article Documentation'}
                </h3>
                {subtitle && (
                  <p className="text-xs text-black-secondary font-medium mb-2 italic">
                    {subtitle}
                  </p>
                )}
                <p className="text-xs text-black-secondary line-clamp-3 mb-3 bg-surface p-2.5 rounded border border-border">
                  {excerpt || 'Write an excerpt in the form on the left to see how your article will display in the vault catalog.'}
                </p>
              </div>

              <div className="border-t border-border pt-2 flex items-center justify-between text-[11px] text-black-secondary">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-black-secondary" weight="bold" />
                    {author || 'Brandon Herera'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-black-secondary" weight="bold" />
                    {readTime || '4 MIN READ'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" weight="fill" />
                    0
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-1 flex items-center justify-center p-2 rounded bg-white border border-border">
              <div className="flex items-center gap-2">
                <Image
                  src={image || 'https://res.cloudinary.com/lbovk2lu/image/upload/v1788330171/minicard007.svg'}
                  alt="Cover Preview"
                  width={100}
                  height={100}
                  className="rounded object-contain shrink-0"
                />
                <span className="text-[11px] text-black-secondary font-mono truncate">
                  Cover: {image}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-black-primary text-white border border-black-primary rounded-md p-4 text-xs font-mono">
            <span className="font-bold text-primary text-xs uppercase block mb-2">
              EDITORIAL GUIDELINES
            </span>
            <ul className="space-y-1.5 text-[11px] text-zinc-300">
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
