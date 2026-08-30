// hooks/useArticles.ts
'use client';

import { useState, useEffect } from 'react';
import { ArticleItem, memoryArticles, articleListeners } from '@/lib/db/article';

/**
 * React hook to subscribe to editorial articles in-memory state changes in client components
 */
export function useArticles(): ArticleItem[] {
  const [articles, setArticles] = useState<ArticleItem[]>(() => [...memoryArticles]);

  useEffect(() => {
    const update = () => setArticles([...memoryArticles]);
    articleListeners.add(update);
    return () => {
      articleListeners.delete(update);
    };
  }, []);

  return articles;
}
