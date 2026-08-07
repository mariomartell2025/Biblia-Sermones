import { useCallback, useEffect, useState } from 'react';
import { isFavorite, addFavorite, removeFavorite } from './favorites';
import { logChapterRead, getHistory, HistoryEntry } from './history';
import { getChapterHighlights, setHighlight, removeHighlight } from './highlights';
import { suggestVerses } from './themes';
import { VerseHit } from './data';

const DEFAULT_VERSION = 'rvr1909';

export function useFavorite(book: number, chapter: number, verse: number, version = DEFAULT_VERSION) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    isFavorite(version, book, chapter, verse).then(fav => {
      if (alive) {
        setIsFav(fav);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, [book, chapter, verse, version]);

  const toggle = async () => {
    if (isFav) {
      await removeFavorite(version, book, chapter, verse);
      setIsFav(false);
    } else {
      await addFavorite(version, book, chapter, verse);
      setIsFav(true);
    }
  };

  return { isFav, toggle, loading };
}

export function useChapterHighlights(book: number, chapter: number, version = DEFAULT_VERSION) {
  const [highlights, setHighlights] = useState<Record<number, string>>({});

  const reload = useCallback(() => {
    getChapterHighlights(version, book, chapter).then(setHighlights);
  }, [book, chapter, version]);

  useEffect(() => { reload(); }, [reload]);

  const apply = async (verse: number, color: string | null) => {
    if (color) {
      await setHighlight(version, book, chapter, verse, color);
      setHighlights((prev) => ({ ...prev, [verse]: color }));
    } else {
      await removeHighlight(version, book, chapter, verse);
      setHighlights((prev) => {
        const next = { ...prev };
        delete next[verse];
        return next;
      });
    }
  };

  return { highlights, apply };
}

export function useLogChapterRead(book: number, chapter: number, version = DEFAULT_VERSION) {
  useEffect(() => {
    let timeout = setTimeout(() => {
      logChapterRead(version, book, chapter);
    }, 2000); // Log después de 2 segundos (evita logs en navegación rápida)

    return () => clearTimeout(timeout);
  }, [book, chapter, version]);
}

export function useReadingHistory(version = DEFAULT_VERSION) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getHistory(version).then(h => {
      if (alive) {
        setHistory(h);
        setLoading(false);
      }
    });
  }, [version]);

  return { history, loading };
}

export function useSuggestedVerses(text: string, limit = 8) {
  const [suggestions, setSuggestions] = useState<VerseHit[]>([]);

  useEffect(() => {
    const sug = suggestVerses(text, limit);
    setSuggestions(sug);
  }, [text, limit]);

  return suggestions;
}
