# 👾 PIXLAPE TROVE / VAULT

Discover and download premium digital assets — apps, tools, brushes, templates, icons, and more. Built with **Next.js 16 (App Router)**, **Tailwind CSS 4**, **Prisma 7 (ORM)**, and **Supabase PostgreSQL**.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI & Styling**: Vanilla CSS + [Tailwind CSS 4](https://tailwindcss.com/) with pixelated font tokens (`Press Start 2P`, `JetBrains Mono`)
- **Database & ORM**: [Prisma ORM 7](https://www.prisma.io/) + [@prisma/adapter-pg](https://www.prisma.io/docs/orm/overview/databases/postgresql)
- **Cloud Database**: [Supabase PostgreSQL](https://supabase.com/)
- **Icons & Assets**: Scalable retro SVG icons and vector illustrations

---

## 📂 Folder Structure

```text
pixlape-vault/
├── app/                  # Next.js App Router routes & pages
│   ├── article/          # Article listing & [id] detail page
│   ├── card/             # [id] Digital Asset detail page
│   ├── changelog/        # Version logs & release history
│   ├── contact/          # Multi-channel transmission dispatch form
│   ├── help/             # Interactive FAQ & Knowledge Base
│   ├── pixlteam/         # Team member directory & profile cards
│   ├── sitemap/          # Visual sitemap & system index
│   ├── globals.css       # Design tokens, fonts, custom scrollbars
│   ├── layout.tsx        # Root layout wrapper
│   └── page.tsx          # Main homepage layout with sidebar & grid
├── components/           # Reusable UI components
│   ├── cardview/         # Asset detail view & markdown description renderer
│   ├── modal/            # Download & donation popup modals
│   ├── ArticleSection.tsx
│   ├── CardGrid.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── HeroBanner.tsx
│   ├── Sidebar.tsx
│   ├── SiteMap.tsx
│   └── TeamProfileCard.tsx
├── data/                 # Application data models & fallback datasets
│   ├── article.ts
│   ├── card.ts
│   └── team.ts
├── lib/                  # Server-side utilities & Prisma client instance
│   └── prisma.ts
├── prisma/               # Prisma database setup
│   ├── migrations/       # SQL migration history
│   ├── schema.prisma     # Prisma database schema definition
│   └── seed.ts           # Database seeding script
├── prisma.config.ts      # Prisma 7 CLI configuration file
└── public/               # Static images, icons, and SVG assets
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20.19.0+
- **npm**: v10+

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-key>

# Connect via transaction-mode pooler (for client queries)
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Connect via session-mode pooler (for migrations)
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

### 3. Database Migration & Seeding
Run Prisma migrations and seed the initial dataset:

```bash
# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed database records
npx prisma db seed
```

### 4. Development Server
Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Production Build

To verify code quality and build for production:

```bash
# Run TypeScript type check
npx tsc --noEmit

# Run ESLint check
npm run lint

# Build optimized production bundle
npm run build
```

---

## 📄 License
Distributed under the MIT License.
