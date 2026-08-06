import { BOOKS, VerseHit } from './data';
import * as mem from './data';
import { ready, dbChapter, dbVerse, dbSearch } from './db';

// Capa de consulta unificada: usa SQLite cuando está listo; si no (web sin OPFS,
// o mientras siembra), cae al modo en-memoria. La UI llama siempre a esto.
const DEFAULT_VERSION = 'rvr1909';

export async function chapterOf(book: number, chapter: number, version = DEFAULT_VERSION): Promise<string[]> {
  if (ready) return dbChapter(version, book, chapter);
  return mem.getChapter(book, chapter);
}

export async function verseOf(book: number, chapter: number, verse: number, version = DEFAULT_VERSION): Promise<string | null> {
  if (ready) return dbVerse(version, book, chapter, verse);
  return mem.getVerseText(book, chapter, verse);
}

export async function searchOf(query: string, limit = 80, version = DEFAULT_VERSION): Promise<VerseHit[]> {
  if (ready) {
    const hits = await dbSearch(version, query, limit);
    return hits.map((h) => ({ ...h, name: BOOKS[h.book].name, abbr: BOOKS[h.book].abbr }));
  }
  return mem.searchText(query, limit);
}
