'use server';

import { revalidatePath } from 'next/cache';
import { db, isDatabaseConfigured } from '@/lib/db/drizzle';
import { digitalAssets, articles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import {
  addAssetToStore,
  updateAssetInStore,
  deleteAssetFromStore,
  CardDetail,
  CardCategory,
  BadgeVariant,
} from '@/lib/db/card';
import {
  addArticleToStore,
  updateArticleInStore,
  deleteArticleFromStore,
  toggleArticleFeatured,
  ArticleItem,
} from '@/lib/db/article';

// ────────────────────────────────────────── Digital Asset Server Actions ──────────────────────────────────────────

export async function createAssetAction(payload: {
  id?: string;
  title: string;
  thumbnail?: string;
  banner?: string;
  icon?: string;
  badge?: BadgeVariant;
  categories?: CardCategory[];
  description?: string;
  requirements?: string[];
  features?: string[];
  downloadUrl?: string;
  donateUrl?: string;
  price?: number;
  version?: string;
  fileSize?: string;
  fileType?: string;
  license?: string;
  author?: string;
}) {
  try {
    const id = payload.id && payload.id.trim() !== '' ? payload.id.trim() : `card-${Date.now().toString(36)}`;
    const categories: CardCategory[] = payload.categories && payload.categories.length > 0 ? payload.categories : ['TOOLS'];
    const badge: BadgeVariant = payload.badge || 'free';

    // 1. Sync in-memory store
    const createdMemory = addAssetToStore({
      ...payload,
      id,
      categories,
      badge,
    });

    // 2. Persist to Postgres database if configured
    if (isDatabaseConfigured()) {
      try {
        await db.insert(digitalAssets).values({
          id,
          title: payload.title,
          thumbnail: payload.thumbnail || '/img/minicard001.svg',
          banner: payload.banner || '/img/banner01.svg',
          icon: payload.icon || '/img/Icontemp1.svg',
          badge,
          categories,
          description: payload.description || 'No description provided.',
          requirements: payload.requirements || [],
          features: payload.features || [],
          downloadUrl: payload.downloadUrl || '#',
          donateUrl: payload.donateUrl || 'https://trakteer.id',
          price: payload.price ?? 0,
          version: payload.version || 'v1.0.0',
          fileSize: payload.fileSize || '10 MB',
          fileType: payload.fileType || '.ZIP',
          license: payload.license || 'Free Commercial',
          author: payload.author || 'PIXLape Lab',
        });
      } catch (dbError) {
        console.warn('⚠️ Warning: DB insert failed, asset saved in memory:', dbError);
      }
    }

    revalidatePath('/');
    revalidatePath('/cards');
    revalidatePath('/admin');
    revalidatePath('/admin/card');

    return { success: true, asset: createdMemory };
  } catch (error) {
    console.error('Error creating asset:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateAssetAction(
  id: string,
  payload: Partial<CardDetail>
) {
  try {
    const updatedMemory = updateAssetInStore(id, payload);

    if (isDatabaseConfigured()) {
      try {
        const updateData: Record<string, unknown> = {};
        if (payload.title !== undefined) updateData.title = payload.title;
        if (payload.thumbnail !== undefined) updateData.thumbnail = payload.thumbnail;
        if (payload.banner !== undefined) updateData.banner = payload.banner;
        if (payload.icon !== undefined) updateData.icon = payload.icon;
        if (payload.badge !== undefined) updateData.badge = payload.badge;
        if (payload.categories !== undefined) updateData.categories = payload.categories;
        if (payload.description !== undefined) updateData.description = payload.description;
        if (payload.requirements !== undefined) updateData.requirements = payload.requirements;
        if (payload.features !== undefined) updateData.features = payload.features;
        if (payload.downloadUrl !== undefined) updateData.downloadUrl = payload.downloadUrl;
        if (payload.donateUrl !== undefined) updateData.donateUrl = payload.donateUrl;
        if (payload.price !== undefined) updateData.price = payload.price;
        if (payload.version !== undefined) updateData.version = payload.version;
        if (payload.fileSize !== undefined) updateData.fileSize = payload.fileSize;
        if (payload.fileType !== undefined) updateData.fileType = payload.fileType;
        if (payload.license !== undefined) updateData.license = payload.license;
        if (payload.author !== undefined) updateData.author = payload.author;
        if (payload.changelog !== undefined) {
          updateData.changelog = Array.isArray(payload.changelog)
            ? payload.changelog.join('\n')
            : payload.changelog;
        }

        await db
          .update(digitalAssets)
          .set(updateData)
          .where(eq(digitalAssets.id, id));
      } catch (dbError) {
        console.warn('⚠️ Warning: DB update failed, asset updated in memory:', dbError);
      }
    }

    revalidatePath('/');
    revalidatePath('/cards');
    revalidatePath(`/cards/${id}`);
    revalidatePath('/admin');
    revalidatePath('/admin/card');

    return { success: true, asset: updatedMemory };
  } catch (error) {
    console.error('Error updating asset:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteAssetAction(id: string) {
  try {
    deleteAssetFromStore(id);

    if (isDatabaseConfigured()) {
      try {
        await db.delete(digitalAssets).where(eq(digitalAssets.id, id));
      } catch (dbError) {
        console.warn('⚠️ Warning: DB delete failed, asset deleted from memory:', dbError);
      }
    }

    revalidatePath('/');
    revalidatePath('/cards');
    revalidatePath('/admin');
    revalidatePath('/admin/card');

    return { success: true };
  } catch (error) {
    console.error('Error deleting asset:', error);
    return { success: false, error: (error as Error).message };
  }
}

// ────────────────────────────────────────── Editorial Article Server Actions ──────────────────────────────────────────

export async function createArticleAction(payload: {
  id?: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  authorRole?: string;
  readTime?: string;
  image?: string;
  featured?: boolean;
  externalUrl?: string;
}) {
  try {
    const createdMemory = addArticleToStore({
      ...payload,
      category: payload.category || 'DEV',
      author: payload.author || 'Brandon Herera',
    });

    if (isDatabaseConfigured()) {
      try {
        const id = createdMemory.id;
        await db.insert(articles).values({
          id,
          title: payload.title,
          subtitle: payload.subtitle || null,
          excerpt: payload.excerpt || null,
          content: payload.content || null,
          date: createdMemory.date,
          readTime: payload.readTime || '4 MIN READ',
          author: payload.author || 'Brandon Herera',
          authorRole: payload.authorRole || 'Contributor',
          image: payload.image || '/img/article1.svg',
          category: payload.category || 'DEV',
          likes: 0,
          featured: Boolean(payload.featured),
          externalUrl: payload.externalUrl || 'https://pixlblog-page.pixlape.workers.dev/',
        });
      } catch (dbError) {
        console.warn('⚠️ Warning: DB article insert failed, saved in memory:', dbError);
      }
    }

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath('/admin/article');

    return { success: true, article: createdMemory };
  } catch (error) {
    console.error('Error creating article:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function updateArticleAction(
  id: string,
  payload: Partial<ArticleItem>
) {
  try {
    const updatedMemory = updateArticleInStore(id, payload);

    if (isDatabaseConfigured()) {
      try {
        const updateData: Record<string, unknown> = {};
        if (payload.title !== undefined) updateData.title = payload.title;
        if (payload.subtitle !== undefined) updateData.subtitle = payload.subtitle;
        if (payload.excerpt !== undefined) updateData.excerpt = payload.excerpt;
        if (payload.category !== undefined) updateData.category = payload.category;
        if (payload.author !== undefined) updateData.author = payload.author;
        if (payload.authorRole !== undefined) updateData.authorRole = payload.authorRole;
        if (payload.readTime !== undefined) updateData.readTime = payload.readTime;
        if (payload.image !== undefined) updateData.image = payload.image;
        if (payload.featured !== undefined) updateData.featured = payload.featured;
        if (payload.externalUrl !== undefined) updateData.externalUrl = payload.externalUrl;
        if (payload.leadParagraph !== undefined) updateData.leadParagraph = payload.leadParagraph;

        await db
          .update(articles)
          .set(updateData)
          .where(eq(articles.id, id));
      } catch (dbError) {
        console.warn('⚠️ Warning: DB article update failed, updated in memory:', dbError);
      }
    }

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath('/admin/article');

    return { success: true, article: updatedMemory };
  } catch (error) {
    console.error('Error updating article:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteArticleAction(id: string) {
  try {
    deleteArticleFromStore(id);

    if (isDatabaseConfigured()) {
      try {
        await db.delete(articles).where(eq(articles.id, id));
      } catch (dbError) {
        console.warn('⚠️ Warning: DB article delete failed, deleted from memory:', dbError);
      }
    }

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath('/admin/article');

    return { success: true };
  } catch (error) {
    console.error('Error deleting article:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function toggleArticleFeaturedAction(id: string) {
  try {
    const isFeatured = toggleArticleFeatured(id);

    if (isDatabaseConfigured()) {
      try {
        await db
          .update(articles)
          .set({ featured: isFeatured })
          .where(eq(articles.id, id));
      } catch (dbError) {
        console.warn('⚠️ Warning: DB toggle featured failed:', dbError);
      }
    }

    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/admin');
    revalidatePath('/admin/article');

    return { success: true, featured: isFeatured };
  } catch (error) {
    console.error('Error toggling featured article:', error);
    return { success: false, error: (error as Error).message };
  }
}
