// hooks/useAssets.ts
'use client';

import { useState, useEffect } from 'react';
import { CardDetail, memoryCards, listeners, setMemoryCards } from '@/lib/db/card';

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
