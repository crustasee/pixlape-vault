// hooks/useAssets.ts
'use client';

import { useState, useEffect } from 'react';
import { CardDetail, memoryCards, listeners } from '@/lib/db/card';

/**
 * React hook to subscribe to asset cards in-memory state changes in client components
 */
export function useAssets(): CardDetail[] {
  const [assets, setAssets] = useState<CardDetail[]>(() => [...memoryCards]);

  useEffect(() => {
    const update = () => setAssets([...memoryCards]);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  return assets;
}
