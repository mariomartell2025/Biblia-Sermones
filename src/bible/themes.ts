import { BOOKS, VerseHit, getVerseText } from './data';

type ThemeRef = { book: number; chapter: number; verse: number };

type Theme = {
  keywords: string[];
  verses: ThemeRef[];
};

export const SERMON_THEMES: Record<string, Theme> = {
  amor: {
    keywords: ['amor', 'amar', 'caridad', 'amado'],
    verses: [
      { book: 42, chapter: 3, verse: 16 }, // Juan 3:16
      { book: 45, chapter: 13, verse: 1 }, // 1 Cor 13:1
      { book: 62, chapter: 4, verse: 7 }, // 1 Juan 4:7
      { book: 62, chapter: 4, verse: 8 }, // 1 Juan 4:8
      { book: 45, chapter: 13, verse: 4 }, // 1 Cor 13:4
      { book: 60, chapter: 5, verse: 2 }, // Efesios 5:2
    ],
  },
  fe: {
    keywords: ['fe', 'creer', 'confianza', 'creencia'],
    verses: [
      { book: 58, chapter: 11, verse: 1 }, // Hebreos 11:1
      { book: 45, chapter: 3, verse: 22 }, // Rom 3:22
      { book: 62, chapter: 5, verse: 4 }, // 1 Juan 5:4
      { book: 41, chapter: 11, verse: 24 }, // Marcos 11:24
      { book: 42, chapter: 3, verse: 16 }, // Juan 3:16
    ],
  },
  arrepentimiento: {
    keywords: ['arrepent', 'perdón', 'pecado', 'perdonar'],
    verses: [
      { book: 44, chapter: 2, verse: 38 }, // Hechos 2:38
      { book: 47, chapter: 7, verse: 10 }, // 2 Cor 7:10
      { book: 62, chapter: 1, verse: 9 }, // 1 Juan 1:9
      { book: 42, chapter: 8, verse: 11 }, // Juan 8:11
      { book: 50, chapter: 3, verse: 9 }, // Colosenses 3:9
    ],
  },
  esperanza: {
    keywords: ['esperanza', 'esperar', 'futuro', 'promesa'],
    verses: [
      { book: 58, chapter: 6, verse: 18 }, // Hebreos 6:18
      { book: 45, chapter: 15, verse: 13 }, // Rom 15:13
      { book: 60, chapter: 3, verse: 14 }, // Efesios 3:14
      { book: 62, chapter: 3, verse: 3 }, // 1 Juan 3:3
      { book: 25, chapter: 31, verse: 24 }, // Lamentaciones 3:24
    ],
  },
  gracia: {
    keywords: ['gracia', 'gratuito', 'favor', 'misericordia'],
    verses: [
      { book: 45, chapter: 3, verse: 24 }, // Rom 3:24
      { book: 60, chapter: 2, verse: 8 }, // Efesios 2:8
      { book: 45, chapter: 5, verse: 15 }, // Rom 5:15
      { book: 54, chapter: 1, verse: 2 }, // 1 Timoteo 1:2
      { book: 58, chapter: 4, verse: 16 }, // Hebreos 4:16
    ],
  },
  paz: {
    keywords: ['paz', 'tranquil', 'calma', 'serenidad'],
    verses: [
      { book: 60, chapter: 2, verse: 14 }, // Efesios 2:14
      { book: 50, chapter: 4, verse: 7 }, // Colosenses 4:7
      { book: 42, chapter: 14, verse: 27 }, // Juan 14:27
      { book: 45, chapter: 5, verse: 1 }, // Rom 5:1
      { book: 50, chapter: 3, verse: 15 }, // Colosenses 3:15
    ],
  },
  alegría: {
    keywords: ['alegr', 'gozo', 'felicidad', 'regocij'],
    verses: [
      { book: 50, chapter: 3, verse: 1 }, // Colosenses 3:1
      { book: 50, chapter: 4, verse: 4 }, // Colosenses 4:4
      { book: 45, chapter: 14, verse: 17 }, // Rom 14:17
      { book: 19, chapter: 16, verse: 11 }, // Salmos 16:11
      { book: 42, chapter: 15, verse: 11 }, // Juan 15:11
    ],
  },
  verdad: {
    keywords: ['verdad', 'veraz', 'sincero', 'honesto'],
    verses: [
      { book: 42, chapter: 8, verse: 32 }, // Juan 8:32
      { book: 42, chapter: 14, verse: 6 }, // Juan 14:6
      { book: 62, chapter: 1, verse: 6 }, // 1 Juan 1:6
      { book: 60, chapter: 4, verse: 25 }, // Efesios 4:25
      { book: 42, chapter: 17, verse: 17 }, // Juan 17:17
    ],
  },
  justicia: {
    keywords: ['justicia', 'justo', 'recto', 'derecho'],
    verses: [
      { book: 45, chapter: 3, verse: 28 }, // Rom 3:28
      { book: 19, chapter: 37, verse: 28 }, // Salmos 37:28
      { book: 23, chapter: 21, verse: 3 }, // Isaías 21:3
      { book: 60, chapter: 6, verse: 14 }, // Efesios 6:14
      { book: 45, chapter: 6, verse: 13 }, // Rom 6:13
    ],
  },
  humildad: {
    keywords: ['humild', 'humil', 'soberbia', 'orgullo'],
    verses: [
      { book: 60, chapter: 4, verse: 2 }, // Efesios 4:2
      { book: 19, chapter: 51, verse: 17 }, // Salmos 51:17
      { book: 40, chapter: 23, verse: 12 }, // Mateo 23:12
      { book: 60, chapter: 5, verse: 21 }, // Efesios 5:21
      { book: 50, chapter: 3, verse: 12 }, // Colosenses 3:12
    ],
  },
};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function suggestVerses(text: string, limit = 8): VerseHit[] {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (!words.length) return [];

  const scores = new Map<string, number>();

  for (const [themeName, theme] of Object.entries(SERMON_THEMES)) {
    let score = 0;
    for (const keyword of theme.keywords) {
      if (words.some(w => w.includes(keyword))) score++;
    }
    if (score > 0) scores.set(themeName, score);
  }

  if (scores.size === 0) return [];

  const topThemes = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => SERMON_THEMES[name].verses)
    .flat();

  const results: VerseHit[] = [];
  const seen = new Set<string>();

  for (const ref of topThemes) {
    const key = `${ref.book}:${ref.chapter}:${ref.verse}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const text = getVerseText(ref.book, ref.chapter, ref.verse);
    if (text) {
      results.push({
        book: ref.book,
        chapter: ref.chapter,
        verse: ref.verse,
        text,
        name: BOOKS[ref.book].name,
        abbr: BOOKS[ref.book].abbr,
      });
    }

    if (results.length >= limit) break;
  }

  return results;
}
