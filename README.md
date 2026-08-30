# 👾 PIXLAPE VAULT

Discover and download premium digital assets — apps, tools, brushes, templates, icons, and more. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, **Drizzle ORM**, and **PostgreSQL (Neon / Supabase)**.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions)
- **UI & Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + Custom Retro Pixel Design System (`Press Start 2P`, `JetBrains Mono`)
- **Database & ORM**: [Drizzle ORM](https://orm.drizzle.team/) + `node-postgres` (`pg`)
- **Cloud Database**: [Neon Serverless Postgres](https://neon.tech/) / [Supabase PostgreSQL](https://supabase.com/)
- **Media & File Storage**: 
  - [Cloudinary](https://cloudinary.com/) (Images & dynamic image transformations)
  - [Cloudflare R2](https://www.cloudflare.com/products/r2/) (Digital asset downloads & binary distribution)
- **Editor**: [TipTap](https://tiptap.dev/) (Rich Markdown/WYSIWYG Editorial Editor)
- **Icons**: [@phosphor-icons/react](https://phosphoricons.com/) & [lucide-react](https://lucide.dev/)

---

## 📂 Project Structure

```text
pixlape-vault/
├── app/                      # Next.js App Router routes & endpoints
│   ├── (admin)/admin/        # Protected Admin Control Panel
│   │   ├── article/          # Article creation & editorial management
│   │   ├── card/             # Digital asset manager & uploader
│   │   └── integrations/     # Cloud services & telemetry status
│   ├── actions/              # Next.js Server Actions (Auth, Upload, CRUD)
│   ├── api/                  # REST API Route Handlers (articles, cards, team)
│   ├── articles/             # Article reader & editorial directory
│   ├── cards/                # Digital asset detail & download pages
│   ├── changelog/            # Release history & version tracker
│   ├── contact/              # Multi-channel transmission dispatch form
│   ├── help/                 # Interactive FAQ & Knowledge Base
│   ├── pixlteam/             # Core squad directory & profile cards
│   ├── sitemap/              # Visual sitemap & system index
│   ├── globals.css           # Pixel design tokens, fonts, custom UI
│   ├── layout.tsx            # Global layout wrapper
│   └── page.tsx              # Homepage with Hero, Sidebar, & Asset Grid
├── components/               # Modular UI Component Library
│   ├── admin/                # Admin layout, editor, side-panels & uploaders
│   ├── modal/                # Download & donation popup modals
│   ├── ui/                   # Shared primitives (Button, etc.)
│   ├── ArticleSection.tsx    # Editorial article showcase
│   ├── CardGrid.tsx          # Responsive asset grid with filters
│   ├── Footer.tsx            # Terminal-style retro footer
│   ├── Header.tsx            # Navigation header & brand logo
│   ├── HeroBanner.tsx        # Dynamic hero showcase
│   ├── Sidebar.tsx           # Category & tag filter sidebar
│   └── TeamProfileCard.tsx   # Team member terminal cards
├── config/                   # Global configuration (site metadata, nav links)
├── drizzle/                  # Drizzle ORM SQL migrations & snapshots
├── hooks/                    # Custom React hooks (useToast, useAssets, etc.)
├── lib/                      # Core utility libraries & clients
│   ├── db/                   # Database schemas, Drizzle client, seeds & fallback data
│   │   ├── article.ts        # Article model types & static fallback dataset
│   │   ├── card.ts           # Digital asset types & static fallback dataset
│   │   ├── drizzle.ts        # Drizzle database client & connection pool
│   │   ├── schema.ts         # PostgreSQL table schemas (Drizzle definitions)
│   │   ├── seed.ts           # Database seeding runner
│   │   ├── server.ts         # Data fetching services with resilient offline fallbacks
│   │   └── team.ts           # Team member models & fallback dataset
│   ├── auth.ts               # Session cookie management & admin authentication
│   ├── cloudinary.ts         # Cloudinary SDK client & optimization URL builder
│   ├── payments.ts           # Trakteer & Saweria donation helpers
│   ├── r2.ts                 # Cloudflare R2 / S3 client for storage
│   └── utils.ts              # Tailwind `cn()` class merger
├── public/                   # Static assets, retro SVGs, brand logos
└── drizzle.config.ts         # Drizzle Kit CLI configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database Connections (Neon / Supabase PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"

# Admin Authentication
ADMIN_USERNAME="pixladmin"
ADMIN_PASSWORD="your-strong-password"

# Cloudinary (Media & Image Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Cloudflare R2 (Asset Binary Storage)
CLOUDFLARE_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="pixlape"
R2_PUBLIC_URL="https://your-custom-r2-domain.com"

# Donations & Gateways (Optional)
NEXT_PUBLIC_TRAKTEER_URL="https://trakteer.id/yourusername"
NEXT_PUBLIC_SAWERIA_URL="https://saweria.co/yourusername"
```

---

## 💾 Database Management (Drizzle ORM)

| Command | Action |
| :--- | :--- |
| `npm run db:generate` | Generate SQL migration files from `lib/db/schema.ts` |
| `npm run db:push` | Push schema changes directly to the remote database |
| `npm run db:migrate` | Execute pending database migrations |
| `npm run db:seed` | Seed initial assets, articles, and team profiles |
| `npm run db:studio` | Launch Drizzle Studio Web GUI at `https://local.drizzle.studio` |

---

## 🛠️ Development & Production

```bash
# Start local development server (with Turbopack)
npm run dev

# Run TypeScript type validation
npx tsc --noEmit

# Run ESLint validation
npm run lint

# Build optimized production bundle
npm run build

# Start production server
npm run start
```

---

## 🛡️ Key Features

- 🎮 **Retro Cyberpunk / Pixel Aesthetics**: Styled with pixel fonts, terminal borders, scanline accents, and glowing badges.
- ⚡ **Zero Downtime Fallback Mechanism**: The app smoothly renders static in-memory assets if database connectivity is unavailable or during local offline development.
- 🛡️ **Built-in Admin Panel**: Protected `/admin` interface for managing digital assets, publishing editorial articles with Rich TipTap Editor, and tracking service integrations.
- 📦 **Hybrid Cloud Storage**: Automatic media optimization via Cloudinary Fetch API and high-speed asset binary distribution via Cloudflare R2.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.

---

## 📄 License
Distributed under the MIT License.

