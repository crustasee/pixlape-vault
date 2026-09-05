// hooks/useAssets.ts
'use client';

import { useState, useEffect } from 'react';
import {
  CardDetail,
  memoryCards,
  listeners,
  setMemoryCards,
  getCardById,
  addAssetToStore,
} from '@/lib/db/card';

/**
 * React hook to subscribe to asset cards in client components,
 * automatically hydrating from the database (/api/cards) while supporting real-time local updates.
 */
export function useAssets(): CardDetail[] {
  const [assets, setAssets] = useState<CardDetail[]>(() => [...memoryCards]);

  useEffect(() => {
    let isMounted = true;

    const update = () => {
      if (isMounted) {
        setAssets([...memoryCards]);
      }
    };
    listeners.add(update);

    // Hydrate fresh cards from database
    fetch('/api/cards?limit=100')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setMemoryCards(json.data);
          setAssets(json.data);
        }
      })
      .catch((err) => {
        console.warn('⚠️ Could not fetch cards from database in useAssets:', err);
      });

    return () => {
      isMounted = false;
      listeners.delete(update);
    };
  }, []);

  return assets;
}

/**
 * Hook to retrieve a single asset by ID, hydrating from /api/cards/[id] if not found in memory
 */
export function useAsset(id: string): { asset: CardDetail | undefined; isLoading: boolean } {
  const [asset, setAsset] = useState<CardDetail | undefined>(() => getCardById(id));
  const [isLoading, setIsLoading] = useState<boolean>(!asset);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    // Check store first
    const current = getCardById(id);
    if (current) {
      setAsset(current);
      setIsLoading(false);
    }

    const update = () => {
      if (isMounted) {
        const fresh = getCardById(id);
        if (fresh) {
          setAsset(fresh);
          setIsLoading(false);
        }
      }
    };
    listeners.add(update);

    // Fetch from database API
    fetch(`/api/cards/${encodeURIComponent(id)}`)
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json.success && json.data) {
          const cardData = json.data as CardDetail;
          setAsset(cardData);
          // Also register into in-memory store so other components know about it
          addAssetToStore(cardData);
        }
      })
      .catch((err) => {
        console.warn(`⚠️ Could not fetch asset ${id} from API:`, err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
      listeners.delete(update);
    };
  }, [id]);

  return { asset, isLoading };
}
