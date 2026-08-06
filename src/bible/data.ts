import indexJson from '../../assets/bible/index.json';

export type BookMeta = {
  i: number;
  name: string;
  abbr: string;
  testament: 'AT' | 'NT';
  chapters: number;
};

export type VerseHit = {
  book: number;
  chapter: number;
  verse: number;
  text: string;
  name: string;
  abbr: string;
};

export const BOOKS: BookMeta[] = indexJson as BookMeta[];
export const VERSION = { abbr: 'RVR', name: 'Reina Valera (dominio público)' };

// El texto completo (4 MB) se carga una sola vez, la primera vez que se lee un capítulo.
let full: any = null;
function load(): any[] {
  if (!full) full = require('../../assets/bible/rvr.json');
  return full;
}

export function getChapter(bookIndex: number, chapter: number): string[] {
  const b = load()[bookIndex];
  if (!b) return [];
  return b.chapters[chapter - 1] || [];
}

export function bookByIndex(i: number): BookMeta | undefined {
  return BOOKS[i];
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Búsqueda de texto en toda la Biblia (acentos-insensible).
// Encuentra la frase exacta primero; luego versículos que contengan TODAS las
// palabras escritas (aunque estén separadas). Así basta recordar unas palabras.
export function searchText(query: string, limit = 80): VerseHit[] {
  const q = norm(query.trim());
  if (q.length < 3) return [];
  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  const data = load();
  const phrase: VerseHit[] = [];
  const all: VerseHit[] = [];
  const mk = (bi: number, ci: number, vi: number, text: string): VerseHit => ({
    book: bi, chapter: ci + 1, verse: vi + 1, text, name: BOOKS[bi].name, abbr: BOOKS[bi].abbr,
  });
  for (let bi = 0; bi < data.length; bi++) {
    const chapters = data[bi].chapters;
    for (let ci = 0; ci < chapters.length; ci++) {
      const verses = chapters[ci];
      for (let vi = 0; vi < verses.length; vi++) {
        const t = norm(verses[vi]);
        if (t.includes(q)) {
          if (phrase.length < limit) phrase.push(mk(bi, ci, vi, verses[vi]));
        } else if (tokens.length > 1 && tokens.every((tok) => t.includes(tok))) {
          if (all.length < limit) all.push(mk(bi, ci, vi, verses[vi]));
        }
        if (phrase.length >= limit && all.length >= limit) {
          return [...phrase, ...all].slice(0, limit);
        }
      }
    }
  }
  return [...phrase, ...all].slice(0, limit);
}

// Autocompletar libros: sugiere libros cuyo nombre/abreviatura coincide con el texto.
export function suggestBooks(query: string, limit = 6): BookMeta[] {
  const q = norm(query.trim());
  if (!q) return [];
  const starts = BOOKS.filter((b) => norm(b.name).startsWith(q) || norm(b.abbr).startsWith(q));
  const contains = BOOKS.filter(
    (b) => !starts.includes(b) && (norm(b.name).includes(q) || norm(b.abbr).includes(q))
  );
  return [...starts, ...contains].slice(0, limit);
}

// Texto de un versículo puntual (para vista previa predictiva).
export function getVerseText(book: number, chapter: number, verse: number): string | null {
  const v = getChapter(book, chapter);
  return v[verse - 1] || null;
}

// Interpreta una referencia: "Juan 3:16", "1 Juan 2", "Gn 1:1".
export function parseRef(input: string): { book: number; chapter: number; verse?: number } | null {
  const m = /^\s*(\d?\s?[a-záéíóúñ.]+)\s+(\d+)(?::(\d+))?\s*$/i.exec(input);
  if (!m) return null;
  const nameQ = norm(m[1].replace(/\./g, '').replace(/\s+/g, ' ').trim());
  const book =
    BOOKS.find((b) => norm(b.name) === nameQ || norm(b.abbr) === nameQ) ||
    BOOKS.find((b) => norm(b.name).startsWith(nameQ) || norm(b.abbr).startsWith(nameQ));
  if (!book) return null;
  const chapter = Math.min(Math.max(1, parseInt(m[2], 10)), book.chapters);
  const verse = m[3] ? parseInt(m[3], 10) : undefined;
  return { book: book.i, chapter, verse };
}

// Formatea una cita corta para insertar en un sermón.
export function formatRef(book: number, chapter: number, verse?: number): string {
  const b = BOOKS[book];
  return verse ? `${b.abbr} ${chapter}:${verse}` : `${b.abbr} ${chapter}`;
}
