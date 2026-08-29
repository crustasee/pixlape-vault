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
  PencilSimple,
  Eye,
  X,
  Cards,
  DownloadSimple,
  HardDrives,
  Tag,
} from '@phosphor-icons/react';
import {
  useAssets,
  deleteAssetFromStore,
  CardDetail,
  CardCategory,
  BadgeVariant,
} from '@/lib/db/card';
import Badge, { CategoryBadge } from '@/components/Badge';

const CATEGORIES: ('ALL' | CardCategory)[] = [
  'ALL',
  'APPS',
  'TOOLS',
  'BRUSH',
  'TEMPLATE',
  'ICON',
  'ART FOR SELL',
  'OTHERS',
];

const BADGES: ('ALL' | BadgeVariant)[] = ['ALL', 'free', 'paid', 'premium'];

export default function AssetCardsAdminPage() {
  const assets = useAssets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | CardCategory>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<'ALL' | BadgeVariant>('ALL');
  const [previewAsset, setPreviewAsset] = useState<CardDetail | null>(null);
  const { toasts, addToast, dismissToast } = useToast();

  const filteredAssets = assets.filter((asset: CardDetail) => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      query === '' ||
      asset.title.toLowerCase().includes(query) ||
      asset.description.toLowerCase().includes(query) ||
      (asset.author && asset.author.toLowerCase().includes(query)) ||
      asset.id.toLowerCase().includes(query);

    const matchCategory =
      selectedCategory === 'ALL' ||
      asset.categories.some(
        (cat) =>
          cat.toUpperCase() === selectedCategory.toUpperCase() ||
          cat.toUpperCase().replace(/\s+/g, '_') === selectedCategory.toUpperCase().replace(/\s+/g, '_')
      );

    const matchBadge =
      selectedBadge === 'ALL' || asset.badge.toLowerCase() === selectedBadge.toLowerCase();

    return matchSearch && matchCategory && matchBadge;
  });

  const handleDelete = (id: string, title: string) => {
    deleteAssetFromStore(id);
    if (previewAsset?.id === id) setPreviewAsset(null);
    addToast('info', 'ASSET REMOVED', `"${title}" (#${id}) deleted from vault repository.`);
  };

  return (
    <AdminLayout
      title="DIGITAL ASSETS & CARDS"
      subtitle="Catalog and configure downloadable creative tools, brush packs, vector icon sets, and templates."
      breadcrumbs={[{ label: 'ASSET CARDS' }]}
      actionSlot={
        <Link
          href="/admin/card/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black-primary border border-black-primary shadow-pixel rounded-md text-xs font-mono font-black hover:bg-emerald-400 hover:scale-98 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" weight="bold" />
          <span>ADD NEW ASSET</span>
        </Link>
      }
    >
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-black-primary rounded-md p-4 mb-3 flex flex-col gap-3 font-mono shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <MagnifyingGlass className="w-4 h-4 text-black-secondary absolute left-3 top-1/2 -translate-y-1/2" weight="bold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by title, ID, author, or keywords..."
              className="w-full pl-9 pr-4 py-2 border border-black-primary rounded-md bg-white text-xs font-mono focus:outline-none"
            />
          </div>

          {/* Badge filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-[11px] font-bold text-black-secondary uppercase mr-1">TIER:</span>
            {BADGES.map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => setSelectedBadge(b)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded border transition-all cursor-pointer uppercase ${
                  selectedBadge === b
                    ? 'bg-black-primary text-primary border-black-primary shadow-xs'
                    : 'bg-white text-black-secondary border-border hover:border-black-primary'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 flex-wrap border-t border-border pt-2.5">
          <span className="text-[11px] font-bold text-black-secondary uppercase mr-1">CATEGORY:</span>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded border transition-all cursor-pointer uppercase ${
                selectedCategory === cat
                  ? 'bg-primary text-black-primary border-black-primary font-black shadow-xs'
                  : 'bg-white text-black-secondary border-border hover:bg-[#e4e4e7] hover:border-black-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredAssets.length === 0 ? (
        <div className="bg-surface border border-black-primary rounded-md p-12 text-center font-mono shadow-sm">
          <Cards className="w-10 h-10 text-black-secondary mx-auto mb-3" weight="duotone" />
          <h3 className="text-sm font-bold uppercase text-black-primary">
            NO MATCHING ASSETS FOUND
          </h3>
          <p className="text-xs text-black-secondary mt-1 mb-4">
            Try adjusting your search keywords, tier selector, or category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setSelectedBadge('ALL');
            }}
            className="px-4 py-2 bg-primary text-black-primary border border-black-primary rounded-md text-xs font-bold font-mono cursor-pointer hover:bg-emerald-400 shadow-pixel transition-all"
          >
            RESET ALL FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
          {filteredAssets.map((asset: CardDetail) => (
            <div
              key={asset.id}
              className="bg-surface border border-black-primary rounded-md overflow-hidden flex flex-col justify-between hover:border-primary transition-all shadow-sm group"
            >
              <div>
                {/* Thumbnail header */}
                <div className="h-40 relative bg-border border-b border-black-primary overflow-hidden">
                  <Image
                    src={asset.thumbnail || '/img/minicard001.svg'}
                    alt={asset.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <Badge variant={asset.badge} />
                    <CategoryBadge category={asset.categories[0] || 'TOOLS'} />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black-primary/90 text-white rounded backdrop-blur-xs">
                      #{asset.id}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-bold text-sm text-black-primary group-hover:text-emerald-700 leading-snug line-clamp-1">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-black-secondary line-clamp-2 leading-relaxed">
                    {asset.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-1 text-[11px] text-black-secondary bg-white p-2.5 rounded border border-border">
                    <div>
                      <span className="text-[10px] text-black-secondary/80 block">FORMAT</span>
                      <span className="font-bold text-black-primary">{asset.fileType || asset.fileFormat || '.ZIP'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-black-secondary/80 block">VERSION / SIZE</span>
                      <span className="font-bold text-black-primary">
                        {asset.version || 'v1.0'} ({asset.fileSize || '10MB'})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-3 bg-white border-t border-border flex items-center justify-between">
                <div className="text-[11px] text-black-secondary font-bold">
                  {asset.badge === 'free' ? (
                    <span className="text-emerald-700">FREE DOWNLOAD</span>
                  ) : (
                    <span className="text-amber-800">${asset.price ?? 9.99} USD</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewAsset(asset)}
                    className="p-1.5 bg-surface hover:bg-border border border-black-primary rounded text-black-primary cursor-pointer transition-colors"
                    title="Inspect Asset Details"
                  >
                    <Eye className="w-3.5 h-3.5" weight="bold" />
                  </button>
                  <Link
                    href={`/admin/card/${asset.id}/edit`}
                    className="p-1.5 bg-blue-100 hover:bg-blue-200 border border-blue-400 text-blue-900 rounded cursor-pointer transition-colors"
                    title="Edit Asset"
                  >
                    <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(asset.id, asset.title)}
                    className="p-1.5 bg-rose-100 hover:bg-rose-200 border border-rose-400 text-rose-800 rounded cursor-pointer transition-colors"
                    title="Delete Asset"
                  >
                    <Trash className="w-3.5 h-3.5" weight="bold" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Live Inspector Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black-primary/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
          <div className="bg-surface border border-black-primary rounded-md max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between bg-black-primary text-primary p-3 px-4 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider">
                ++ DIGITAL ASSET INSPECTOR: #{previewAsset.id} ++
              </span>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="text-white hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4" weight="bold" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto">
              <div className="relative h-44 w-full rounded border border-black-primary overflow-hidden bg-border shrink-0">
                <Image
                  src={previewAsset.banner || previewAsset.thumbnail || '/img/banner01.svg'}
                  alt={previewAsset.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge variant={previewAsset.badge} />
                  {previewAsset.categories.map((c) => (
                    <CategoryBadge key={c} category={c} />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black text-black-primary leading-snug">
                  {previewAsset.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-black-secondary mt-1">
                  <span>Author: <strong>{previewAsset.author || 'PIXLape Lab'}</strong></span>
                  <span>•</span>
                  <span>Version: <strong>{previewAsset.version || 'v1.0.0'}</strong></span>
                  <span>•</span>
                  <span>Updated: <strong>{previewAsset.updatedAt || 'Recent'}</strong></span>
                </div>
              </div>

              <div className="p-3.5 bg-white border border-border rounded text-xs leading-relaxed text-black-primary">
                {previewAsset.description}
              </div>

              {/* Requirements & Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white border border-border rounded text-xs">
                  <span className="font-bold text-black-primary block mb-2 uppercase flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" weight="bold" />
                    KEY FEATURES
                  </span>
                  <ul className="space-y-1 text-black-secondary list-disc pl-4">
                    {previewAsset.features && previewAsset.features.length > 0 ? (
                      previewAsset.features.map((f, i) => <li key={i}>{f}</li>)
                    ) : (
                      <li>Optimized pixel vector assets</li>
                    )}
                  </ul>
                </div>

                <div className="p-3.5 bg-white border border-border rounded text-xs">
                  <span className="font-bold text-black-primary block mb-2 uppercase flex items-center gap-1.5">
                    <HardDrives className="w-3.5 h-3.5 text-blue-700" weight="bold" />
                    SYSTEM REQUIREMENTS
                  </span>
                  <ul className="space-y-1 text-black-secondary list-disc pl-4">
                    {previewAsset.requirements && previewAsset.requirements.length > 0 ? (
                      previewAsset.requirements.map((r, i) => <li key={i}>{r}</li>)
                    ) : (
                      <li>Standard graphic software</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-black-secondary">Target Download:</span>
                  <code className="px-2 py-0.5 bg-border rounded text-[11px] truncate max-w-xs block">
                    {previewAsset.downloadUrl || '#'}
                  </code>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewAsset(null)}
                    className="px-4 py-1.5 bg-[#e4e4e7] hover:bg-border text-black-primary rounded text-xs font-bold cursor-pointer"
                  >
                    CLOSE
                  </button>
                  <Link
                    href={`/admin/card/${previewAsset.id}/edit`}
                    className="px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-400 rounded text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <PencilSimple className="w-3.5 h-3.5" weight="bold" />
                    <span>EDIT ASSET</span>
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
