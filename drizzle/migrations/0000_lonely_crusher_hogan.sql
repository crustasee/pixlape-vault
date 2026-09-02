DO $$ BEGIN
 CREATE TYPE "public"."BadgeVariant" AS ENUM('free', 'paid', 'premium');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."CardCategory" AS ENUM('APPS', 'TOOLS', 'BRUSH', 'TEMPLATE', 'ICON', 'ART FOR SELL', 'OTHERS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"excerpt" text,
	"content" text,
	"date" text NOT NULL,
	"readTime" text,
	"author" text NOT NULL,
	"authorAvatar" text,
	"authorRole" text,
	"image" text,
	"category" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"leadParagraph" text,
	"sections" jsonb,
	"quote" jsonb,
	"checklist" jsonb,
	"codeSnippet" jsonb,
	"conclusion" jsonb,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"thumbnail" text NOT NULL,
	"banner" text NOT NULL,
	"icon" text NOT NULL,
	"badge" "BadgeVariant" NOT NULL,
	"categories" "CardCategory"[] NOT NULL,
	"description" text NOT NULL,
	"requirements" text[] DEFAULT ARRAY[]::text[],
	"downloadUrl" text NOT NULL,
	"donateUrl" text,
	"price" double precision,
	"version" text,
	"fileSize" text,
	"fileType" text,
	"license" text,
	"author" text,
	"checksum" text,
	"features" text[] DEFAULT ARRAY[]::text[],
	"specs" jsonb,
	"changelog" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_members" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"avatar" text,
	"bio" text,
	"experienceYears" integer DEFAULT 0 NOT NULL,
	"joinedYear" integer NOT NULL,
	"skills" text[] DEFAULT ARRAY[]::text[],
	"resume" jsonb,
	"socials" jsonb,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
