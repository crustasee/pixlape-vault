'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import SubmitButton from '@/components/admin/SubmitButton';
import Toast from '@/components/admin/Toast';
import ProductIdInput from '@/components/admin/ProductInput';
import RichEditor from '@/components/admin/RichEditor';
import ImageUpload from '@/components/admin/image-upload';
import FileUpload from '@/components/admin/file-upload';
import { useToast } from '@/hooks/useToast';
import {
  updateAssetInStore,
  CardDetail,
  CardCategory,
  BadgeVariant,
} from '@/lib/db/card';
import { useAssets } from '@/hooks/useAssets';
import { updateAssetAction } from '@/app/actions/product-actions';
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

export default function EditAssetPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;
  const assetId = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const assets = useAssets();
  const currentAsset = assets.find(
    (a) => a.id === assetId || a.id === `card-${assetId}` || a.id.endsWith(assetId || '')
  );

  const [directAsset, setDirectAsset] = useState<CardDetail | null>(null);
  const [isFetchingDirect, setIsFetchingDirect] = useState(false);
  const effectiveAsset = currentAsset || directAsset;

  const [productId, setProductId] = useState(assetId || '');
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

  const [thumbnail, setThumbnail] = useState('https://res.cloudinary.com/lbovk2lu/image/upload/v1788330128/bgthumb.svg');
  const [banner, setBanner] = useState('');
  const [icon, setIcon] = useState('');

  const [downloadUrl, setDownloadUrl] = useState('');
  const [donateUrl, setDonateUrl] = useState('https://trakteer.id');
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newReq, setNewReq] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const { toasts, addToast, dismissToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedAssetId, setLoadedAssetId] = useState<string | null>(null);

  // Direct fetch from database API if not found immediately in cache
  useEffect(() => {
    if (!currentAsset && assetId) {
      let isMounted = true;
      setIsFetchingDirect(true);
      fetch(`/api/cards/${assetId}`)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.success && data.data) {
            setDirectAsset(data.data);
          }
        })
        .catch((err) => {
          console.warn('Error fetching asset directly from database:', err);
        })
        .finally(() => {
          if (isMounted) setIsFetchingDirect(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [currentAsset, assetId]);

  // Synchronize form fields when asset is resolved
  useEffect(() => {
    if (effectiveAsset && loadedAssetId !== effectiveAsset.id) {
      setLoadedAssetId(effectiveAsset.id);
      setProductId(effectiveAsset.id || assetId || '');
      setTitle(effectiveAsset.title || '');
      setDescription(effectiveAsset.description || '');
      setCategory((effectiveAsset.categories?.[0] as CardCategory) || 'TOOLS');
      setFileFormat(effectiveAsset.fileType || effectiveAsset.fileFormat || '.ZIP');
      setBadge(effectiveAsset.badge || 'free');
      setPrice(effectiveAsset.price ?? (effectiveAsset.badge === 'free' ? 0 : 9.99));
      setVersion(effectiveAsset.version || 'v1.0.0');
      setFileSize(effectiveAsset.fileSize || '18.5 MB');
      setLicense(effectiveAsset.license || 'Free Commercial');
      setAuthor(effectiveAsset.author || 'PIXLape Lab');
      setThumbnail(effectiveAsset.thumbnail || 'https://res.cloudinary.com/lbovk2lu/image/upload/v1788330128/bgthumb.svg');
      setBanner(effectiveAsset.banner || '');
      setIcon(effectiveAsset.icon || '');
      setDownloadUrl(effectiveAsset.downloadUrl || '');
      setDonateUrl(effectiveAsset.donateUrl || 'https://trakteer.id');
      setRequirements(effectiveAsset.requirements || []);
      setFeatures(effectiveAsset.features || []);
    }
  }, [effectiveAsset, loadedAssetId, assetId]);

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

    const targetId = effectiveAsset?.id || assetId;
    if (!targetId) {
      addToast('error', 'NOT FOUND', 'Target asset could not be located.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        categories: [category],
        fileType: fileFormat,
        badge,
        version: version.trim(),
        fileSize: fileSize.trim(),
        license: license.trim(),
        author: author.trim(),
        thumbnail,
        banner,
        icon,
        donateUrl: donateUrl.trim(),
        price: badge === 'free' ? 0 : Number(price) || 0,
        downloadUrl: downloadUrl.trim() || '#',
        requirements,
        features,
      };

      // 1. Persist changes to Neon database via Server Action
      const res = await updateAssetAction(targetId, payload);

      if (!res.success) {
        addToast('error', 'DATABASE ERROR', res.error || 'Could not update asset in database.');
        setIsSubmitting(false);
        return;
      }

      // 2. Sync local store
      updateAssetInStore(targetId, payload);

      addToast('success', 'ASSET SAVED', `Changes to "${title}" successfully saved to database.`);
      setTimeout(() => {
        router.push('/admin/card');
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not update asset in database.';
      addToast('error', 'SAVE FAILED', msg);
      setIsSubmitting(false);
    }
  };

  if (isFetchingDirect) {
    return (
      <AdminLayout
        title={`LOADING ASSET #${assetId}...`}
        subtitle="Retrieving asset specifications from database repository."
        breadcrumbs={[
          { label: 'ASSET CARDS', href: '/admin/card' },
          { label: 'LOADING' },
        ]}
      >
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-12 text-center font-mono shadow-sm">
          <p className="text-xs text-zinc-400 animate-pulse">
            Querying Neon database for asset #{assetId}...
          </p>
        </div>
      </AdminLayout>
    );
  }

  if (!isFetchingDirect && !effectiveAsset) {
    return (
      <AdminLayout
        title="ASSET NOT FOUND"
        subtitle="The requested digital asset could not be located in the repository."
        breadcrumbs={[
          { label: 'ASSET CARDS', href: '/admin/card' },
          { label: 'NOT FOUND' },
        ]}
      >
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-md p-12 text-center font-mono shadow-sm">
          <h3 className="text-sm font-bold uppercase text-zinc-200 mb-2">
            {`ASSET ID #${assetId} NOT FOUND`}
          </h3>
          <p className="text-xs text-zinc-400 mb-4">
            This card may have been removed or the ID in the route URL is invalid.
          </p>
          <Link
            href="/admin/card"
            className="px-4 py-2 bg-primary text-black font-black border border-primary rounded-md text-xs font-mono shadow-pixel inline-block hover:bg-emerald-400"
          >
            RETURN TO ASSET LIST
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const pageTitle = currentAsset ? `EDIT ASSET: #${currentAsset.id}` : `EDIT ASSET: #${assetId}`;

  return (
    <AdminLayout
      title={pageTitle}
      subtitle="Modify asset metadata, requirements, licensing, download links, and banner images."
      breadcrumbs={[
        { label: 'ASSET CARDS', href: '/admin/card' },
        { label: `EDIT (#${assetId})` },
      ]}
      actionSlot={
        <Link
          href="/admin/card"
          className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-primary rounded-md text-xs font-mono font-bold transition-all shadow-xs"
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
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-primary" weight="bold" />
                ++ ASSET SPECIFICATION FORM ++
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-primary text-black font-black rounded">
                EDIT ASSET
              </span>
            </div>

            {/* Read-Only Asset ID display */}
            <ProductIdInput
              value={productId}
              onChange={setProductId}
              label="CARD ASSET ID"
              readOnly
              disabled
              helperText="Asset identifier is fixed to preserve existing routing and links."
            />

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="font-bold text-xs text-zinc-300">
                ASSET TITLE <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pixprint Utility V.1.02"
                className="border border-zinc-700 p-2 rounded bg-zinc-950 text-zinc-100 text-xs font-mono font-bold focus:outline-none focus:border-primary"
              />
            </div>

            {/* Category, Badge, Price & File Format (1 Baris) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Category */}
              <div className="flex flex-col gap-1">
                <label htmlFor="category" className="font-bold text-xs text-zinc-300">
                  PRIMARY CATEGORY <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CardCategory)}
                  className="border border-zinc-700 p-1.5 rounded bg-zinc-950 text-zinc-100 text-[10px] font-mono font-bold cursor-pointer focus:border-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge */}
              <div className="flex flex-col gap-1">
                <label htmlFor="badge" className="font-bold text-xs text-zinc-300">
                  BADGE / TIER <span className="text-rose-500">*</span>
                </label>
                <select
                  id="badge"
                  name="badge"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value as BadgeVariant)}
                  className="border border-zinc-700 p-1.5 rounded bg-zinc-950 text-zinc-100 text-[10px] font-mono font-bold cursor-pointer uppercase focus:border-primary"
                >
                  <option value="free">FREE</option>
                  <option value="paid">PAID</option>
                  <option value="premium">PREMIUM</option>
                </select>
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1">
                <label htmlFor="price" className="font-bold text-xs text-zinc-300">
                  PRICE (USD) {badge === 'free' ? '(Free)' : ''}
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
                  className="border border-zinc-700 p-1.5 rounded bg-zinc-950 text-zinc-100 text-[10px] font-mono font-bold focus:outline-none focus:border-primary disabled:text-zinc-600"
                />
              </div>

              {/* File Format */}
              <div className="flex flex-col gap-1">
                <label htmlFor="fileFormat" className="font-bold text-xs text-zinc-300">
                  FILE FORMAT / EXTENSION
                </label>
                <select
                  id="fileFormat"
                  name="fileFormat"
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value)}
                  className="border border-zinc-700 p-1.5 rounded bg-zinc-950 text-zinc-100 text-[10px] font-mono font-bold cursor-pointer focus:border-primary"
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Version & File Size & Author & License */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="version" className="font-bold text-xs text-zinc-300">
                  VERSION
                </label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v1.0.0"
                  className="border border-zinc-700 p-1.5 rounded bg-zinc-950 text-zinc-100 text-[10px] font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="fileSize" className="font-bold text-xs text-zinc-300">
                  FILE SIZE
                </label>
                <input
                  type="text"
                  id="fileSize"
                  name="fileSize"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="18.4 MB"
                  className="border border-zinc-700 p-1.5 rounded bg-zinc-950 text-zinc-100 text-[10px] font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="license" className="font-bold text-xs text-zinc-300">
                  LICENSE
                </label>
                <input
                  type="text"
                  id="license"
                  name="license"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="Free Commercial"
                  className="border border-zinc-700 p-1.5 rounded bg-zinc-950 text-zinc-100 text-[10px] font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="author" className="font-bold text-xs text-zinc-300">
                  AUTHOR / CREATOR
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="PIXLape Lab"
                  className="border border-zinc-700 p-1.5 rounded bg-zinc-950 text-zinc-100 text-[10px] font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label htmlFor="description" className="font-bold text-xs text-zinc-300">
                DESCRIPTION & OVERVIEW <span className="text-rose-500">*</span>
              </label>
              <RichEditor
                name="description"
                value={description}
                onChange={setDescription}
                placeholder="Provide details about features, compatibility, and asset contents..."
                minHeight="150px"
              />
            </div>

            {/* Images: Thumbnail, Banner, Icon */}
            <div className="flex flex-col border border-zinc-800 text-zinc-200 p-3 rounded-md bg-zinc-950/60 gap-3 shadow-pixel-sm">
              <ImageUpload
                name="thumbnail"
                label="THUMBNAIL"
                value={thumbnail}
                onChange={setThumbnail}
                folder="thumbnails"
                aspectRatio="square"
                recommendedSize="400x300 recommended (PNG, SVG, WEBP)"
              />

              <ImageUpload
                name="banner"
                label="DETAIL BANNER"
                value={banner}
                onChange={setBanner}
                folder="banners"
                aspectRatio="banner"
                recommendedSize="1200x500 banner (PNG, SVG, WEBP)"
              />

              <ImageUpload
                name="icon"
                label="ASSET ICON"
                value={icon}
                onChange={setIcon}
                folder="icons"
                aspectRatio="icon"
                recommendedSize="128x128 pixel/vector icon"
              />
            </div>

            {/* Download File Package (Cloudflare R2)*/}
            <div className="flex flex-col gap-4 border-zinc-800 pt-2">
              <FileUpload
                name="downloadUrl"
                label="VAULT ASSET DOWNLOAD PACKAGE"
                value={downloadUrl}
                onChange={setDownloadUrl}
                onFileMeta={({ size, format }) => {
                  if (size) setFileSize(size);
                  if (format) setFileFormat(format);
                }}
                folder="packages"
                acceptedTypes=".zip,.rar,.psd,.abr,.ai,.fig,.sketch,.pdf,.apk,.tar.gz,.7z,.exe"
              />
            </div>

            {/* Dynamic Requirements Manager */}
            <div className="flex flex-col gap-2 border-t border-zinc-800 pt-3">
              <label className="font-bold text-xs text-zinc-400 uppercase">
                SYSTEM REQUIREMENTS
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  placeholder="Add requirement item..."
                  className="flex-1 border border-zinc-700 p-2 rounded bg-zinc-950 text-zinc-100 text-xs font-mono focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" weight="bold" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs bg-zinc-950 border border-zinc-800 text-zinc-200 px-2.5 py-1 rounded"
                  >
                    <span>{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Dynamic Features Manager */}
            <div className="flex flex-col gap-2 border-t border-zinc-800 pt-3">
              <label className="font-bold text-xs text-zinc-400 uppercase">
                KEY HIGHLIGHT FEATURES
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature bullet point..."
                  className="flex-1 border border-zinc-700 p-2 rounded bg-zinc-950 text-zinc-100 text-xs font-mono focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" weight="bold" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs bg-zinc-950 border border-zinc-800 text-zinc-200 px-2.5 py-1 rounded"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-3 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                * Updates will instantly propagate to the public vault
              </span>
              <SubmitButton
                label="SAVE ASSET CHANGES"
                loadingLabel="COMMITTING TO DB..."
                loading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>

        {/* Right Live Card Preview (1 col) */}
        <div className="flex flex-col gap-4">
          <div className="border border-zinc-800 rounded-md p-4 bg-zinc-900/90 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-primary" weight="bold" />
                LIVE VAULT CARD PREVIEW
              </span>
              <span className="text-[10px] bg-zinc-950 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded font-bold uppercase">
                {badge}
              </span>
            </div>

            {/* Preview Card Component */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-md overflow-hidden flex flex-col">
              {/* Card thumbnail with border background, white grid texture, and centered product icon */}
              <div
                className="h-44 relative overflow-hidden bg-zinc-900 border-b border-zinc-800 flex items-center justify-center"
              >
                <div className="relative z-10 w-20 h-20 flex items-center justify-center transition-transform duration-300">
                  <Image
                    src={icon || thumbnail || 'https://res.cloudinary.com/lbovk2lu/image/upload/v1788330203/icon_admin2.svg'}
                    alt="Asset Icon Preview"
                    width={100}
                    height={100}
                    unoptimized
                    className="object-contain w-full h-full drop-shadow-md"
                  />
                </div>
              </div>

              {/* Badge & Category tag */}
              <div className="px-4 pt-3 flex items-center justify-between">
                <Badge variant={badge} />
                <CategoryBadge category={category} />
              </div>

              <div className="p-4 pt-2.5 flex flex-col gap-2">
                <h3 className="font-bold text-sm text-zinc-100 leading-snug">
                  {title || 'Untitled Asset Title'}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-3 bg-zinc-900/80 p-2 rounded border border-zinc-800">
                  {description || 'Provide an asset description in the form to preview how it will appear in the public vault catalog.'}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 mt-1">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">FORMAT:</span>
                    <strong className="text-zinc-200">{fileFormat}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">VERSION:</span>
                    <strong className="text-zinc-200">{version} ({fileSize})</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">By {author || 'PIXLape Lab'}</span>
                  <span className="font-black text-zinc-100">
                    {badge === 'free' ? 'FREE' : `$${price} USD`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-md p-4 text-xs font-mono shadow-sm">
            <span className="font-bold text-primary text-xs uppercase block mb-2">
              VAULT ASSET RULES
            </span>
            <ul className="space-y-1.5 text-[11px] text-zinc-400">
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
