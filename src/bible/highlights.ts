import * as SQLite from 'expo-sqlite';
import { ready } from './db';

let db: SQLite.SQLiteDatabase | null = null;

export async function initHighlightsDb(database: SQLite.SQLiteDatabase) {
  db = database;
}

// Colores disponibles para resaltar versículos (nombre + valor hex).
export const HIGHLIGHT_COLORS: { name: string; value: string }[] = [
  { name: 'yellow', value: '#f6d860' },
  { name: 'green', value: '#7bd88f' },
  { name: 'blue', value: '#7cb8f2' },
  { name: 'pink', value: '#f28cc0' },
  { name: 'orange', value: '#f2a65a' },
];

export async function setHighlight(version: string, book: number, chapter: number, verse: number, color: string): Promise<boolean> {
  if (!db || !ready) return false;
  try {
    await db.runAsync(
      `INSERT INTO verse_highlights (version, book, chapter, verse, color, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(version, book, chapter, verse) DO UPDATE SET color=excluded.color`,
      version, book, chapter, verse, color, Date.now()
    );
    return true;
  } catch (e) {
    console.warn('Error setting highlight:', e);
    return false;
  }
}

export async function removeHighlight(version: string, book: number, chapter: number, verse: number): Promise<boolean> {
  if (!db || !ready) return false;
  try {
    await db.runAsync(
      `DELETE FROM verse_highlights WHERE version=? AND book=? AND chapter=? AND verse=?`,
      version, book, chapter, verse
    );
    return true;
  } catch (e) {
    console.warn('Error removing highlight:', e);
    return false;
  }
}

export async function getChapterHighlights(version: string, book: number, chapter: number): Promise<Record<number, string>> {
  if (!db || !ready) return {};
  try {
    const rows = await db.getAllAsync<{ verse: number; color: string }>(
      `SELECT verse, color FROM verse_highlights WHERE version=? AND book=? AND chapter=?`,
      version, book, chapter
    );
    const map: Record<number, string> = {};
    for (const r of rows) map[r.verse] = r.color;
    return map;
  } catch (e) {
    console.warn('Error getting chapter highlights:', e);
    return {};
  }
}
