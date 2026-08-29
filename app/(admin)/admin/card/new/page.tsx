'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SubmitButton from '@/components/admin/SubmitButton';
import Toast from '@/components/admin/Toast';
import ProductIdInput from '@/components/admin/ProductInput';
import { useToast } from '@/hooks/useToast';
import { addAssetToStore, CardCategory, BadgeVariant } from '@/lib/db/card';
import { createAssetAction } from '@/app/actions/product-actions';
import Badge, { CategoryBadge } from '@/components/Badge';
import {
  ArrowLeft,
  Plus,
  Trash,
  CheckCircle,
  Eye,
  Tag,
} from '@phosphor-icons/react';

const CATEGORIES: CardCategory[] = [
  'APPS',
  'TOOLS',
  'BRUSH',
  'TEMPLATE',
  'ICON',
  'ART FOR SELL',
  'OTHERS',
];

const FORMATS = ['.ZIP', '.RAR', '.PSD', '.AI', '.EPS', '.SVG', '.PNG', '.APK / .ZIP', 'OTHERS'];

const THUMBNAIL_PRESETS = [
  { label: 'Minicard 01 (App)', path: '/img/minicard001.svg' },
  { label: 'Minicard 02 (Brush)', path: '/img/minicard002.svg' },
  { label: 'Minicard 03 (Icons)', path: '/img/minicard003.svg' },
  { label: 'Minicard 04 (Layout)', path: '/img/minicard004.svg' },
  { label: 'Minicard 05 (Dev)', path: '/img/minicard005.svg' },
  { label: 'Minicard 06 (Poster)', path: '/img/minicard006.svg' },
  { label: 'Minicard 07 (Bundle)', path: '/img/minicard007.svg' },
];

const BANNER_PRESETS = [
  { label: 'Banner 01 (Green/Black)', path: '/img/banner01.svg' },
  { label: 'Temp Banner (Retro Grid)', path: '/img/tempbnr.svg' },
];

const ICON_PRESETS = [
  { label: 'Icon Temp 1 (Floppy)', path: '/img/Icontemp1.svg' },
  { label: 'Icon Temp 2 (Palette)', path: '/img/Icontemp2.svg' },
];

export default function AddAssetCardPage() {
  const router = useRouter();
  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CardCategory>('TOOLS');
  const [fileFormat, setFileFormat] = useState('.ZIP');
  const [badge, setBadge] = useState<BadgeVariant>('free');
  const [price, setPrice] = useState<number>(0);
  const [version, setVersion] = useState('v1.0.0');
  const [fileSize, setFileSize] = useState('18.5 MB');
  const [license, setLicense] = useState('Free Commercial');
  const [author, setAuthor] = useState('PIXLape Lab');

  const [thumbnail, setThumbnail] = useState('/img/minicard001.svg');
  const [banner, setBanner] = useState('/img/banner01.svg');
  const [icon, setIcon] = useState('/img/Icontemp1.svg');

  const [downloadUrl, setDownloadUrl] = useState('');
  const [donateUrl, setDonateUrl] = useState('https://trakteer.id');
  const [requirements, setRequirements] = useState<string[]>([
    'Compatible with Windows 10/11 & macOS',
    'Standard graphic editor required',
  ]);
  const [newReq, setNewReq] = useState('');
  const [features, setFeatures] = useState<string[]>([
    'Zero-latency vector scaling',
    'Commercial license included',
  ]);
  const [newFeature, setNewFeature] = useState('');

  const { toasts, addToast, dismissToast } = useToast();

  const handleAddRequirement = () => {
    if (!newReq.trim()) return;
    setRequirements([...requirements, newReq.trim()]);
    setNewReq('');
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 3) {
      addToast('error', 'VALIDATION ERROR', 'Asset title must be at least 3 characters.');
      return;
    }

    try {
      const payload = {
        id: productId.trim() || undefined,
        title,
        description,
        categories: [category],
        fileType: fileFormat,
        badge,
        version,
        fileSize,
        license,
        author,
        thumbnail,
        banner,
        icon,
        donateUrl,
        price: badge === 'free' ? 0 : Number(price) || 9.99,
        downloadUrl: downloadUrl || '#',
        requirements,
        features,
      };

      // 1. Sync store immediately
      addAssetToStore(payload);

      // 2. Trigger server action in background for DB persistence
      createAssetAction(payload);

      addToast('success', 'ASSET CREATED', `"${title}" has been added to the vault.`);
      setTimeout(() => {
        router.push('/admin/card');
      }, 900);
    } catch {
      addToast('error', 'SAVE FAILED', 'Could not create asset in vault repository.');
    }
  };

  return (
    <AdminLayout
      title="CREATE DIGITAL ASSET CARD"
      subtitle="Register creative packs, tools, brush bundles, and downloadable software in PIXLApe Vault."
      breadcrumbs={[
        { label: 'ASSET CARDS', href: '/admin/card' },
        { label: 'ADD NEW ASSET' },
      ]}
      actionSlot={
        <Link
          href="/admin/card"
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
                <Tag className="w-4 h-4 text-emerald-700" weight="bold" />
                ++ ASSET SPECIFICATION FORM ++
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-black-primary text-primary font-bold rounded">
                NEW DRAFT
              </span>
            </div>

            {/* Product ID Input Component */}
            <ProductIdInput
              value={productId}
              onChange={setProductId}
              label="CARD ASSET ID"
              placeholder="e.g. card-pix1"
              helperText="Unique identifier for URL routing (/cards/[id]). Auto-generated if left empty."
            />

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="font-bold text-xs text-black-primary">
                ASSET TITLE <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pixprint Utility V.1.02"
                className="border border-black-primary p-2 rounded bg-white text-xs font-mono font-bold focus:outline-none"
              />
            </div>

            {/* Category & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="category" className="font-bold text-xs text-black-secondary">
                  PRIMARY CATEGORY <span className="text-rose-600">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CardCategory)}
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
                <label htmlFor="badge" className="font-bold text-xs text-black-secondary">
                  BADGE / TIER <span className="text-rose-600">*</span>
                </label>
                <select
                  id="badge"
                  name="badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value as BadgeVariant)}
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono font-bold cursor-pointer uppercase"
                >
                  <option value="free">FREE</option>
                  <option value="paid">PAID</option>
                  <option value="premium">PREMIUM</option>
                </select>
              </div>
            </div>

            {/* Price (if paid/premium) & File Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="price" className="font-bold text-xs text-black-secondary">
                  PRICE (USD) {badge === 'free' ? '(Disabled for Free)' : ''}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="price"
                  name="price"
                  disabled={badge === 'free'}
                  value={badge === 'free' ? 0 : price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono font-bold focus:outline-none disabled:bg-surface disabled:text-black-secondary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fileFormat" className="font-bold text-xs text-black-secondary">
                  FILE FORMAT / EXTENSION
                </label>
                <select
                  id="fileFormat"
                  name="fileFormat"
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value)}
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono font-bold cursor-pointer"
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Version & File Size & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="version" className="font-bold text-xs text-black-secondary">
                  VERSION
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v1.0.0"
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fileSize" className="font-bold text-xs text-black-secondary">
                  FILE SIZE
                </label>
                <input
                  type="text"
                  id="fileSize"
                  name="fileSize"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="18.4 MB"
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="author" className="font-bold text-xs text-black-secondary">
                  AUTHOR / CREATOR
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="PIXLape Lab"
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="font-bold text-xs text-black-primary">
                DESCRIPTION & OVERVIEW <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about features, compatibility, and asset contents..."
                className="border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
              />
            </div>

            {/* Images: Thumbnail, Banner, Icon */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-border pt-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="thumbnail" className="font-bold text-xs text-black-secondary">
                  THUMBNAIL PRESET
                </label>
                <select
                  id="thumbnail"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono cursor-pointer"
                >
                  {THUMBNAIL_PRESETS.map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="border border-border p-1.5 rounded bg-white text-[11px] font-mono"
                  placeholder="Custom /img/..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="banner" className="font-bold text-xs text-black-secondary">
                  DETAIL BANNER
                </label>
                <select
                  id="banner"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono cursor-pointer"
                >
                  {BANNER_PRESETS.map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  className="border border-border p-1.5 rounded bg-white text-[11px] font-mono"
                  placeholder="Custom banner path"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="icon" className="font-bold text-xs text-black-secondary">
                  ICON PRESET
                </label>
                <select
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono cursor-pointer"
                >
                  {ICON_PRESETS.map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="border border-border p-1.5 rounded bg-white text-[11px] font-mono"
                  placeholder="Custom icon path"
                />
              </div>
            </div>

            {/* Download & Donate URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border pt-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="downloadUrl" className="font-bold text-xs text-black-secondary">
                  DOWNLOAD PACKAGE URL
                </label>
                <input
                  type="text"
                  id="downloadUrl"
                  name="downloadUrl"
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  placeholder="https://mediafire.com/... or /downloads/..."
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="donateUrl" className="font-bold text-xs text-black-secondary">
                  DONATE / SUPPORT URL
                </label>
                <input
                  type="text"
                  id="donateUrl"
                  name="donateUrl"
                  value={donateUrl}
                  onChange={(e) => setDonateUrl(e.target.value)}
                  placeholder="https://trakteer.id/..."
                  className="border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Dynamic Requirements Manager */}
            <div className="flex flex-col gap-2 border-t border-border pt-3">
              <label className="font-bold text-xs text-black-secondary uppercase">
                SYSTEM REQUIREMENTS
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  placeholder="Add requirement item..."
                  className="flex-1 border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="px-3 py-2 bg-surface hover:bg-border border border-black-primary rounded text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" weight="bold" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs bg-white border border-border px-2.5 py-1 rounded"
                  >
                    <span>{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      className="text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic Features Manager */}
            <div className="flex flex-col gap-2 border-t border-border pt-3">
              <label className="font-bold text-xs text-black-secondary uppercase">
                KEY HIGHLIGHT FEATURES
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature bullet point..."
                  className="flex-1 border border-black-primary p-2 rounded bg-white text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-surface hover:bg-border border border-black-primary rounded text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" weight="bold" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs bg-white border border-border px-2.5 py-1 rounded"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-3 pt-4 border-t border-black-primary flex items-center justify-between">
              <span className="text-[11px] text-black-secondary">
                * Digital assets immediately syndicate to PIXLApe Vault public feed
              </span>
              <SubmitButton label="SAVE" loadingLabel="COMMITTING..." />
            </div>
          </form>
        </div>

        {/* Right Live Card Preview (1 col) */}
        <div className="flex flex-col gap-4">
          <div className="border border-black-primary rounded-md p-4 bg-surface flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-black-primary flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-700" weight="bold" />
                LIVE VAULT CARD PREVIEW
              </span>
              <span className="text-[10px] bg-black-primary text-white px-2 py-0.5 rounded font-bold uppercase">
                {badge}
              </span>
            </div>

            {/* Preview Card Component */}
            <div className="bg-white border border-black-primary rounded-md overflow-hidden flex flex-col shadow-pixel">
              <div className="h-44 relative bg-border border-b border-black-primary overflow-hidden">
                <Image
                  src={thumbnail || '/img/minicard001.svg'}
                  alt="Asset Thumbnail Preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <Badge variant={badge} />
                  <CategoryBadge category={category} />
                </div>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-sm text-black-primary leading-snug">
                  {title || 'Untitled Asset Title'}
                </h3>
                <p className="text-xs text-black-secondary line-clamp-3 bg-surface p-2 rounded border border-border">
                  {description || 'Provide an asset description in the form to preview how it will appear in the public vault catalog.'}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-black-secondary mt-1">
                  <div>
                    <span className="text-[10px] text-black-secondary/80 block">FORMAT:</span>
                    <strong className="text-black-primary">{fileFormat}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-black-secondary/80 block">VERSION:</span>
                    <strong className="text-black-primary">{version} ({fileSize})</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-black-secondary">By {author || 'PIXLape Lab'}</span>
                  <span className="font-black text-black-primary">
                    {badge === 'free' ? 'FREE' : `$${price} USD`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-black-primary text-white border border-black-primary rounded-md p-4 text-xs font-mono">
            <span className="font-bold text-primary text-xs uppercase block mb-2">
              VAULT ASSET RULES
            </span>
            <ul className="space-y-1.5 text-[11px] text-zinc-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" weight="bold" />
                Asset cards link to /cards/[id] detail pages
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" weight="bold" />
                Provide direct verified download links
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" weight="bold" />
                Category filters apply across sidebar and search
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}