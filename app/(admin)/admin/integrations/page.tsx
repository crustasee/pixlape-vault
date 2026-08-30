'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  ArrowSquareOut,
  Database,
  ShieldCheck,
  Cpu,
  HardDrives,
  Images,
  Globe,
  Code,
  Copy,
  Check,
  MagnifyingGlass,
  Sparkle,
  Pulse,
  Terminal,
} from '@phosphor-icons/react';

interface IntegrationItem {
  id: string;
  name: string;
  category: 'STORAGE & CDN' | 'DATABASE & ORM' | 'COMPUTE & HOSTING';
  role: string;
  description: string;
  url: string;
  docsUrl?: string;
  envKeys: string[];
  status: 'ACTIVE' | 'CONNECTED' | 'READY' | 'CONFIGURED';
  accentColor: string;
  bgBadge: string;
  icon: React.ComponentType<{ className?: string; size?: number; weight?: 'regular' | 'bold' | 'fill' }>;
  tags: string[];
}

const INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'STORAGE & CDN',
    role: 'R2 Object Storage & Global Edge DNS',
    description:
      'Zero-egress distributed object storage for digital asset vault packages, raw backups, and worldwide DNS protection.',
    url: 'https://dash.cloudflare.com/1f011edac7fb7be65658be3c78c65e52/home',
    docsUrl: 'https://developers.cloudflare.com/r2/',
    envKeys: ['R2_ACCOUNT_ID', 'R2_BUCKET_NAME', 'R2_ACCESS_KEY_ID'],
    status: 'ACTIVE',
    accentColor: 'border-orange-500 text-orange-600',
    bgBadge: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: HardDrives,
    tags: ['R2 BUCKET', 'ZERO EGRESS', 'S3 PROTOCOL', 'EDGE DNS'],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'COMPUTE & HOSTING',
    role: 'Edge Deployment & Next.js Host',
    description:
      'Serverless computing platform with instant global CDN caching, Edge Middleware, Turbopack, and automatic CI/CD deployment.',
    url: 'https://vercel.com/pixlape-projects',
    docsUrl: 'https://vercel.com/docs',
    envKeys: ['VERCEL_URL', 'NEXT_PUBLIC_APP_URL'],
    status: 'ACTIVE',
    accentColor: 'border-black text-black',
    bgBadge: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    icon: Cpu,
    tags: ['NEXT.JS 16', 'SERVERLESS', 'EDGE ROUTING', 'CI/CD'],
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    category: 'STORAGE & CDN',
    role: 'Real-time Image Optimization CDN',
    description:
      'Automated WebP/AVIF format compression (f_auto), quality scaling (q_auto), responsive dimension cropping, and fast image delivery.',
    url: 'https://console.cloudinary.com/app/c-66985e890f332386f893c301031e35/home/dashboard',
    docsUrl: 'https://cloudinary.com/documentation',
    envKeys: ['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'],
    status: 'ACTIVE',
    accentColor: 'border-blue-500 text-blue-600',
    bgBadge: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: Images,
    tags: ['F_AUTO', 'Q_AUTO', 'AVIF / WEBP', 'MEDIA CDN'],
  },
  {
    id: 'neon',
    name: 'Neon DB',
    category: 'DATABASE & ORM',
    role: 'Serverless PostgreSQL Database',
    description:
      'Modern serverless Postgres with instant database branching, scale-to-zero compute efficiency, and high-performance connection pooling.',
    url: 'https://console.neon.tech/',
    docsUrl: 'https://neon.tech/docs',
    envKeys: ['DATABASE_URL', 'DATABASE_URL_UNPOOLED'],
    status: 'CONNECTED',
    accentColor: 'border-emerald-500 text-emerald-600',
    bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    icon: Database,
    tags: ['POSTGRESQL', 'BRANCHING', 'SCALE-TO-ZERO', 'POOLING'],
  },
  {
    id: 'drizzle',
    name: 'Drizzle ORM',
    category: 'DATABASE & ORM',
    role: 'Type-Safe SQL Schema & Studio',
    description:
      'Lightweight TypeScript ORM with schema migrations, SQL dialect safety, and web-based Drizzle Studio data explorer.',
    url: 'https://orm.drizzle.team/',
    docsUrl: 'https://orm.drizzle.team/docs/overview',
    envKeys: ['DRIZZLE_MIGRATIONS', 'DATABASE_URL'],
    status: 'READY',
    accentColor: 'border-lime-500 text-lime-600',
    bgBadge: 'bg-lime-100 text-lime-800 border-lime-300',
    icon: Code,
    tags: ['DRIZZLE STUDIO', 'SCHEMA KIT', 'TYPE-SAFE', 'SQL'],
  },
  {
    id: 'aws',
    name: 'AWS',
    category: 'COMPUTE & HOSTING',
    role: 'Amazon Web Services / S3 API',
    description:
      'Cloud infrastructure ecosystem providing the AWS SDK v3 S3 client architecture, presigned request signatures, and IAM access policies.',
    url: 'https://console.aws.amazon.com/',
    docsUrl: 'https://aws.amazon.com/documentation/',
    envKeys: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'],
    status: 'CONFIGURED',
    accentColor: 'border-amber-500 text-amber-600',
    bgBadge: 'bg-amber-100 text-amber-800 border-amber-300',
    icon: Globe,
    tags: ['AWS-SDK V3', 'IAM POLICY', 'PRESIGNED S3', 'CLOUD'],
  },
];

const CATEGORIES = ['ALL', 'STORAGE & CDN', 'DATABASE & ORM', 'COMPUTE & HOSTING'] as const;

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredIntegrations = INTEGRATIONS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout
      title="SYSTEM INTEGRATIONS & CLOUD MATRIX"
      subtitle="Overview of connected cloud platforms, serverless databases, storage providers, and external developer consoles."
      breadcrumbs={[
        { label: 'ADMIN', href: '/admin' },
        { label: 'INTEGRATIONS' },
      ]}
      actionSlot={
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="px-3 py-1.5 bg-surface hover:bg-border text-black-primary border border-black-primary rounded-md text-xs font-mono font-bold shadow-pixel transition-all hover:scale-98"
          >
            ← BACK TO DASHBOARD
          </Link>
        </div>
      }
    >
      {/* Top Controls: Search & Category Filter */}
      <div className="bg-surface border border-black-primary rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-border text-black-primary border-black-primary shadow-pixel'
                  : 'bg-white text-black-secondary border-border hover:border-black-primary hover:text-black-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <MagnifyingGlass
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black-secondary w-3.5 h-3.5"
            weight="bold"
          />
          <input
            type="text"
            placeholder="Search provider, protocol, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-white border border-black-primary rounded-md focus:outline-none focus:ring-1 focus:ring-black-primary"
          />
        </div>
      </div>

      {/* Integration Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
        {filteredIntegrations.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-green-100 border border-black-primary rounded-md p-3 flex flex-col justify-between gap-2 hover:-translate-y-0.5 transition-all relative overflow-hidden group"
            >
              {/* Top Row: Provider Identity & Status */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-white border border-black-primary flex items-center justify-center shadow-xs group-hover:bg-primary transition-colors">
                      <Icon className="w-5 h-5 text-black-primary" weight="bold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-black-primary tracking-wide flex items-center gap-1.5">
                        {item.name}
                      </h3>
                      <span className="text-[10px] font-mono text-black-secondary uppercase block">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Status Indicator Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${item.bgBadge}`}
                  >
                    <Pulse className="w-2.5 h-2.5 animate-pulse text-emerald-600" weight="bold" />
                    {item.status}
                  </span>
                </div>

                {/* Subtitle / Role */}
                <div className="text-xs font-bold text-black-primary mb-2 flex items-center gap-3">
                    <span className='text-xs text-black-secondary'>▣</span>  
                  <span>{item.role}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-black-secondary leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              {/* Bottom Row: Environment Keys & External Action Links */}
              <div className="pt-3.5 flex flex-col gap-3">
                {/* Associated Env Variables */}
                <div>
                  <span className="text-[10px] font-bold text-black-secondary uppercase mb-1.5 flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-black-secondary" />
                    ENV IDENTIFIERS:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.envKeys.map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => handleCopyKey(k)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded text-[9px] font-mono text-zinc-700 cursor-pointer transition-colors"
                        title={`Click to copy: ${k}`}
                      >
                        <code>{k}</code>
                        {copiedKey === k ? (
                          <Check className="w-2.5 h-2.5 text-emerald-600" weight="bold" />
                        ) : (
                          <Copy className="w-2.5 h-2.5 text-zinc-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Launch Console Button */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-green-400 text-black-primary shadow-pixel hover:bg-scale-95 border border-black-primary rounded-md text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>OPEN CONSOLE</span>
                    <ArrowSquareOut className="w-3.5 h-3.5" weight="bold" />
                  </a>

                  {item.docsUrl && (
                    <a
                      href={item.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 bg-white text-black-secondary hover:text-black-primary border border-border hover:border-black-primary rounded-md text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer"
                      title={`${item.name} Official Documentation`}
                    >
                      <Sparkle className="w-3.5 h-3.5" weight="bold" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredIntegrations.length === 0 && (
        <div className="bg-surface border border-black-primary rounded-md p-12 text-center font-mono mt-4">
          <ShieldCheck className="w-8 h-8 text-black-secondary mx-auto mb-2" />
          <h3 className="text-sm font-bold uppercase text-black-primary mb-1">
            NO INTEGRATIONS FOUND
          </h3>
          <p className="text-xs text-black-secondary">
            No cloud services or providers matched your search query &quot;{searchQuery}&quot;.
          </p>
        </div>
      )}
    </AdminLayout>
  );
}