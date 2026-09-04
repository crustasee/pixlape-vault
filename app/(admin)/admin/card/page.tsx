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
  HardDrives,
  Tag,
  SquaresFour,
  Table,
} from '@phosphor-icons/react';
import {
  deleteAssetFromStore,
  CardDetail,
  CardCategory,
  BadgeVariant,
} from '@/lib/db/card';
import { deleteAssetAction } from '@/app/actions/product-actions';
import { useAssets } from '@/hooks/useAssets';
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
const ITEMS_PER_PAGE = 8;

export default function AssetCardsAdminPage() {
  const assets = useAssets();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | CardCategory>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<'ALL' | BadgeVariant>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
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

  const [prevFilter, setPrevFilter] = useState({ searchQuery, selectedCategory, selectedBadge });

  // Reset pagination during render when search or filters change
  if (
    searchQuery !== prevFilter.searchQuery ||
    selectedCategory !== prevFilter.selectedCategory ||
    selectedBadge !== prevFilter.selectedBadge
  ) {
    setPrevFilter({ searchQuery, selectedCategory, selectedBadge });
    setCurrentPage(1);
  }

  // Pagination calculation (max 8 items per page)
  const totalPages = Math.max(1, Math.ceil(filteredAssets.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(currentPage, totalPages);
  const startIndex = (effectivePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedAssets = filteredAssets.slice(startIndex, endIndex);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" (#${id}) from database?`)) {
      return;
    }

    try {
      const res = await deleteAssetAction(id);
      if (!res.success) {
        addToast('error', 'DELETE FAILED', res.error || 'Could not delete asset from database.');
        return;
      }

      deleteAssetFromStore(id);
      if (previewAsset?.id === id) setPreviewAsset(null);
      addToast('info', 'ASSET REMOVED', `"${title}" (#${id}) permanently deleted from database.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete asset';
      addToast('error', 'DELETE ERROR', msg);
    }
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

      {/* Filter, Search & View Switch Bar */}
      <div className="bg-surface border border-black-primary rounded-md p-4 mb-4 flex flex-col gap-2 font-mono shadow-sm">
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

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
            {/* View Mode Toggle (Grid vs Table) */}
            <div className="flex items-center bg-white p-1 rounded-md border border-black-primary shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-border text-black-primary border border-black-primary shadow-xs'
                    : 'text-black-secondary hover:text-black-primary'
                }`}
                title="Switch to Grid View"
              >
                <SquaresFour className="w-3.5 h-3.5" weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-border text-black-primary border border-black-primary shadow-xs'
                    : 'text-black-secondary hover:text-black-primary'
                }`}
                title="Switch to Table View"
              >
                <Table className="w-3.5 h-3.5" weight="bold" />
              </button>
            </div>

            {/* Badge filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-black-secondary uppercase mr-1">TIER:</span>
              {BADGES.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setSelectedBadge(b)}
                  className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-md border transition-all cursor-pointer uppercase ${
                    selectedBadge === b
                      ? 'bg-primary text-black-primary border-black-primary shadow-xs'
                      : 'bg-white text-black-secondary border-border hover:border-black-primary'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-black-secondary uppercase mr-1">CATEGORY:</span>
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-md border transition-all cursor-pointer uppercase ${
                selectedCategory === cat
                  ? 'bg-primary text-black-primary border-black-primary font-black shadow-xs'
                  : 'bg-white text-black-secondary border-surface hover:border-black-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Display List */}
      {filteredAssets.length === 0 ? (
        <div className="bg-surface border border-black-primary rounded-md p-8 text-center font-mono shadow-sm">
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
      ) : viewMode === 'grid' ? (
        /* ======================== GRID VIEW (Max 8 cards per page) ======================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {displayedAssets.map((asset: CardDetail) => (
            <div
              key={asset.id}
              className="bg-surface border border-black-primary rounded-md overflow-hidden flex flex-col justify-between hover:border-primary transition-all shadow-sm group hover:scale-[1.01]"
            >
              <div>
                {/* Thumbnail header with background image and centered product icon */}
                <div className="h-24 relative overflow-hidden bg-surface border-b border-black-primary flex items-center justify-center group/thumb">
                  <Image
                    src={asset.thumbnail || "https://res.cloudinary.com/lbovk2lu/image/upload/v1788330128/bgthumb.svg"}
                    alt={`${asset.title} background`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 z-20">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black-primary/90 text-white rounded backdrop-blur-xs">
                      #{asset.id}
                    </span>
                  </div>

                  <div className="relative z-10 w-20 h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={asset.icon || '/img/Icontemp1.svg'}
                      alt={`${asset.title} icon`}
                      width={80}
                      height={80}
                      unoptimized
                      className="object-contain w-full h-full drop-shadow-md"
                    />
                  </div>
                </div>

                {/* Badge & Category tag */}
                <div className="px-4 pt-3 flex items-center justify-between">
                  <Badge variant={asset.badge} />
                  <CategoryBadge category={asset.categories[0] || 'TOOLS'} />
                </div>

                {/* Body Content */}
                <div className="p-4 pt-2.5 flex flex-col gap-2">
                  <h3 className="font-bold text-sm text-black-primary group-hover:text-emerald-700 leading-snug line-clamp-1">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-black-secondary line-clamp-2 leading-relaxed">
                    {asset.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-1 text-[11px] text-black-secondary bg-white p-2.5 rounded border border-border">
                    <div>
                      <span className="text-[10px] text-black-secondary/80 block">FORMAT</span>
                      <span className="font-bold text-black-primary truncate block">{asset.fileType || asset.fileFormat || '.ZIP'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-black-secondary/80 block">VERSION / SIZE</span>
                      <span className="font-bold text-black-primary truncate block">
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
                    <span className="text-emerald-700">FREE</span>
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
      ) : (
        /* ======================== TABLE VIEW (Max 8 rows per page) ======================== */
        <div className="bg-white border border-black-primary rounded-md overflow-hidden font-mono shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-black-primary text-white border-b border-black uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 font-bold">ASSET</th>
                  <th className="py-3 px-3 font-bold">CATEGORIES</th>
                  <th className="py-3 px-3 font-bold">TIER</th>
                  <th className="py-3 px-3 font-bold">FORMAT / SIZE</th>
                  <th className="py-3 px-3 font-bold">AUTHOR & VERSION</th>
                  <th className="py-3 px-3 font-bold">PRICE</th>
                  <th className="py-3 px-4 font-bold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedAssets.map((asset: CardDetail) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-emerald-50/50 transition-colors group"
                  >
                    {/* Asset thumbnail & title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 relative rounded border border-black-primary overflow-hidden shrink-0 bg-border flex items-center justify-center"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, rgba(255, 255, 255, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.45) 1px, transparent 1px)",
                            backgroundSize: "12px 12px",
                          }}
                        >
                          <Image
                            src={asset.icon || asset.thumbnail || '/img/Icontemp1.svg'}
                            alt={asset.title}
                            width={32}
                            height={32}
                            unoptimized
                            className="object-contain w-8 h-8 drop-shadow-xs"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-black-primary group-hover:text-emerald-700 truncate max-w-xs block">
                            {asset.title}
                          </span>
                          <span className="text-[10px] text-black-secondary font-semibold">
                            #{asset.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {asset.categories.map((cat) => (
                          <CategoryBadge key={cat} category={cat} />
                        ))}
                      </div>
                    </td>

                    {/* Tier / Badge */}
                    <td className="py-3 px-3">
                      <Badge variant={asset.badge} />
                    </td>

                    {/* Format & Size */}
                    <td className="py-3 px-3 text-black-secondary">
                      <span className="font-bold text-black-primary block">
                        {asset.fileType || asset.fileFormat || '.ZIP'}
                      </span>
                      <span className="text-[10px]">{asset.fileSize || '10MB'}</span>
                    </td>

                    {/* Author & Version */}
                    <td className="py-3 px-3 text-black-secondary">
                      <span className="font-bold text-black-primary block">
                        {asset.version || 'v1.0.0'}
                      </span>
                      <span className="text-[10px] text-black-secondary truncate block max-w-30">
                        {asset.author || 'PIXLape Lab'}
                      </span>
                    </td>

                    {/* Price / Type */}
                    <td className="py-3 px-3 font-bold">
                      {asset.badge === 'free' ? (
                        <span className="text-emerald-700">FREE</span>
                      ) : (
                        <span className="text-amber-800">${asset.price ?? 9.99}</span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Bar (Max 8 items per page) */}
      {filteredAssets.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-3 bg-surface border border-black-primary rounded-md font-mono shadow-sm">
          {/* Count / Status Info */}
          <div className="text-xs text-black-secondary">
            SHOWING <span className="font-bold text-black-primary">{startIndex + 1}</span>-
            <span className="font-bold text-black-primary">
              {Math.min(endIndex, filteredAssets.length)}
            </span>{" "}
            OF <span className="font-bold text-black-primary">{filteredAssets.length}</span> ASSETS
            {totalPages > 1 && (
              <span className="ml-2 text-text-secondary font-semibold">
                [PAGE {effectivePage} / {totalPages}]
              </span>
            )}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={effectivePage <= 1}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded border transition-all ${
                  effectivePage <= 1
                    ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-white border-black-primary text-black-primary shadow-xs hover:bg-primary cursor-pointer hover:scale-95"
                }`}
              >
                &lt; PREV
              </button>

              {/* Numbered Page Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 flex items-center justify-center text-xs font-mono font-bold rounded border transition-all ${
                      effectivePage === pageNum
                        ? "bg-primary border-black-primary text-black font-black shadow-xs"
                        : "bg-white border-border text-black-secondary hover:border-black-primary hover:text-black-primary cursor-pointer"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={effectivePage >= totalPages}
                className={`px-3 py-1 text-xs font-mono font-semibold rounded border transition-all ${
                  effectivePage >= totalPages
                    ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-white border-black-primary text-black-primary shadow-xs hover:bg-primary cursor-pointer hover:scale-95"
                }`}
              >
                NEXT &gt;
              </button>
            </div>
          )}
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
                  <span className="font-bold text-black-primary mb-2 uppercase flex items-center gap-1.5">
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
                  <span className="font-bold text-black-primary mb-2 uppercase flex items-center gap-1.5">
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
                    className="px-4 py-1.5 bg-surface hover:bg-border text-black-primary rounded text-xs font-bold cursor-pointer"
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
