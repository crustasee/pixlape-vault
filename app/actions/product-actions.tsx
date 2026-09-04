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
  mapAssetToCardDetail,
} from '@/lib/db/card';
import {
  addArticleToStore,
  updateArticleInStore,
  deleteArticleFromStore,
  toggleArticleFeatured,
  ArticleItem,
} from '@/lib/db/article';

// ────────────────────────────────────────── Digital Asset Server Actions ──────────────────────────────────────────

function safeRevalidate(paths: string[]) {
  try {
    for (const p of paths) {
      revalidatePath(p);
    }
  } catch {
    // Suppress revalidation errors outside Next.js request context (e.g. testing)
  }
}

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
  specs?: Record<string, string>;
  changelog?: string;
}) {
  try {
    if (!payload.title || payload.title.trim().length < 3) {
      return { success: false, error: 'Asset title must be at least 3 characters long.' };
    }

    const rawId = payload.id && payload.id.trim() !== '' ? payload.id.trim() : `card-${Date.now().toString(36)}`;
    const id = rawId.toLowerCase().replace(/\s+/g, '-');
    const categories: CardCategory[] =
      payload.categories && payload.categories.length > 0 ? payload.categories : ['TOOLS'];
    const badge = (payload.badge ? payload.badge.toLowerCase() : 'free') as BadgeVariant;
    const price = badge === 'free' ? 0 : Number(payload.price) || 0;

    let createdRecord: CardDetail;

    if (isDatabaseConfigured()) {
      try {
        const [inserted] = await db
          .insert(digitalAssets)
          .values({
            id,
            title: payload.title.trim(),
            thumbnail:
              payload.thumbnail ||
              'https://res.cloudinary.com/lbovk2lu/image/upload/v1788330128/bgthumb.svg',
            banner:
              payload.banner ||
              'https://res.cloudinary.com/lbovk2lu/image/upload/v1788330237/minicard006.svg',
            icon:
              payload.icon ||
              'https://res.cloudinary.com/lbovk2lu/image/upload/v1788328831/Printaicon-2.png',
            badge,
            categories,
            description: payload.description?.trim() || 'No description provided.',
            requirements: payload.requirements || [],
            features: payload.features || [],
            downloadUrl: payload.downloadUrl?.trim() || '#',
            donateUrl: payload.donateUrl?.trim() || 'https://trakteer.id',
            price,
            version: payload.version?.trim() || 'v1.0.0',
            fileSize: payload.fileSize?.trim() || '10.0 MB',
            fileType: payload.fileType?.trim() || '.ZIP',
            license: payload.license?.trim() || 'Free Commercial',
            author: payload.author?.trim() || 'PIXLape Lab',
            specs: payload.specs || undefined,
            changelog: payload.changelog || undefined,
          })
          .returning();

        createdRecord = mapAssetToCardDetail(inserted);
      } catch (dbError: unknown) {
        const msg = dbError instanceof Error ? dbError.message : String(dbError);
        console.error('❌ Database insert failed in createAssetAction:', dbError);
        if (msg.includes('unique constraint') || msg.includes('23505') || msg.includes('already exists')) {
          return {
            success: false,
            error: `Asset ID "${id}" is already used in the database. Please choose a different ID.`,
          };
        }
        return { success: false, error: `Database insert failed: ${msg}` };
      }
    } else {
      createdRecord = {
        id,
        title: payload.title.trim(),
        thumbnail:
          payload.thumbnail ||
          'https://res.cloudinary.com/lbovk2lu/image/upload/v1788330128/bgthumb.svg',
        banner:
          payload.banner ||
          'https://res.cloudinary.com/lbovk2lu/image/upload/v1788330237/minicard006.svg',
        icon:
          payload.icon ||
          'https://res.cloudinary.com/lbovk2lu/image/upload/v1788328831/Printaicon-2.png',
        badge,
        categories,
        description: payload.description?.trim() || 'No description provided.',
        requirements: payload.requirements || [],
        features: payload.features || [],
        downloadUrl: payload.downloadUrl?.trim() || '#',
        donateUrl: payload.donateUrl?.trim() || 'https://trakteer.id',
        price,
        version: payload.version?.trim() || 'v1.0.0',
        fileSize: payload.fileSize?.trim() || '10.0 MB',
        fileType: payload.fileType?.trim() || '.ZIP',
        license: payload.license?.trim() || 'Free Commercial',
        author: payload.author?.trim() || 'PIXLape Lab',
      };
    }

    // Sync in-memory store
    addAssetToStore(createdRecord);

    safeRevalidate(['/', '/cards', `/cards/${id}`, '/admin', '/admin/card']);

    return { success: true, asset: createdRecord };
  } catch (error) {
    console.error('Error in createAssetAction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown server error' };
  }
}

export async function updateAssetAction(
  id: string,
  payload: Partial<CardDetail>
) {
  try {
    if (!id || id.trim() === '') {
      return { success: false, error: 'Target asset ID is required.' };
    }

    const cleanId = id.trim();
    let updatedRecord: CardDetail | null = null;

    if (isDatabaseConfigured()) {
      try {
        const updateData: Record<string, unknown> = {};
        if (payload.title !== undefined) updateData.title = payload.title.trim();
        if (payload.thumbnail !== undefined) updateData.thumbnail = payload.thumbnail;
        if (payload.banner !== undefined) updateData.banner = payload.banner;
        if (payload.icon !== undefined) updateData.icon = payload.icon;
        if (payload.badge !== undefined) {
          updateData.badge = (payload.badge.toLowerCase() as BadgeVariant);
        }
        if (payload.categories !== undefined) updateData.categories = payload.categories;
        if (payload.description !== undefined) updateData.description = payload.description.trim();
        if (payload.requirements !== undefined) updateData.requirements = payload.requirements;
        if (payload.features !== undefined) updateData.features = payload.features;
        if (payload.downloadUrl !== undefined) updateData.downloadUrl = payload.downloadUrl.trim();
        if (payload.donateUrl !== undefined) updateData.donateUrl = payload.donateUrl.trim();
        if (payload.price !== undefined) {
          updateData.price = payload.badge === 'free' ? 0 : Number(payload.price) || 0;
        }
        if (payload.version !== undefined) updateData.version = payload.version.trim();
        if (payload.fileSize !== undefined) updateData.fileSize = payload.fileSize.trim();
        if (payload.fileType !== undefined) updateData.fileType = payload.fileType.trim();
        if (payload.license !== undefined) updateData.license = payload.license.trim();
        if (payload.author !== undefined) updateData.author = payload.author.trim();
        if (payload.specs !== undefined) updateData.specs = payload.specs;
        if (payload.changelog !== undefined) {
          updateData.changelog = Array.isArray(payload.changelog)
            ? payload.changelog.join('\n')
            : payload.changelog;
        }

        const [updated] = await db
          .update(digitalAssets)
          .set(updateData)
          .where(eq(digitalAssets.id, cleanId))
          .returning();

        if (updated) {
          updatedRecord = mapAssetToCardDetail(updated);
        } else {
          // If no row matched cleanId, check alternate prefixed / un-prefixed ID
          const altId = cleanId.toLowerCase().startsWith('card-')
            ? cleanId.replace(/^card-/, '')
            : `card-${cleanId}`;
          const [altUpdated] = await db
            .update(digitalAssets)
            .set(updateData)
            .where(eq(digitalAssets.id, altId))
            .returning();
          if (altUpdated) {
            updatedRecord = mapAssetToCardDetail(altUpdated);
          }
        }
      } catch (dbError: unknown) {
        const msg = dbError instanceof Error ? dbError.message : String(dbError);
        console.error(`❌ Database update failed for asset ${cleanId}:`, dbError);
        return { success: false, error: `Database update failed: ${msg}` };
      }
    }

    // Sync in-memory store
    const memUpdated = updateAssetInStore(cleanId, payload);
    const finalAsset = updatedRecord || memUpdated;

    safeRevalidate(['/', '/cards', `/cards/${cleanId}`, '/admin', '/admin/card']);

    return { success: true, asset: finalAsset };
  } catch (error) {
    console.error('Error updating asset:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteAssetAction(id: string) {
  try {
    if (!id || id.trim() === '') {
      return { success: false, error: 'Asset ID is required.' };
    }

    const cleanId = id.trim();

    if (isDatabaseConfigured()) {
      try {
        await db.delete(digitalAssets).where(eq(digitalAssets.id, cleanId));
        // Also attempt alternative format
        const altId = cleanId.toLowerCase().startsWith('card-')
          ? cleanId.replace(/^card-/, '')
          : `card-${cleanId}`;
        await db.delete(digitalAssets).where(eq(digitalAssets.id, altId));
      } catch (dbError: unknown) {
        const msg = dbError instanceof Error ? dbError.message : String(dbError);
        console.error(`❌ Database delete failed for asset ${cleanId}:`, dbError);
        return { success: false, error: `Database delete failed: ${msg}` };
      }
    }

    deleteAssetFromStore(cleanId);

    safeRevalidate(['/', '/cards', '/admin', '/admin/card']);

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
        if (payload.readTime !== undefined) updateData.readTime = payload.readTime;
        if (payload.image !== undefined) updateData.image = payload.image;
        if (payload.featured !== undefined) updateData.featured = payload.featured;
        if (payload.externalUrl !== undefined) updateData.externalUrl = payload.externalUrl;

        await db
          .update(articles)
          .set(updateData)
          .where(eq(articles.id, id));
      } catch (dbError) {
        console.warn('⚠️ Warning: DB article update failed, updated in memory:', dbError);
      }
    }

    revalidatePath('/');
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
    revalidatePath('/admin');
    revalidatePath('/admin/article');

    return { success: true, featured: isFeatured };
  } catch (error) {
    console.error('Error toggling featured article:', error);
    return { success: false, error: (error as Error).message };
  }
}
