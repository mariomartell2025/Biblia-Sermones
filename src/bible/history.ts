import * as SQLite from 'expo-sqlite';
import { ready } from './db';
import { newId } from '../split';

let db: SQLite.SQLiteDatabase | null = null;

export async function initHistoryDb(database: SQLite.SQLiteDatabase) {
  db = database;
}

export async function logChapterRead(version: string, book: number, chapter: number): Promise<void> {
  if (!db || !ready) return;
  try {
    await db.runAsync(
      `INSERT INTO reading_history (id, version, book, chapter, readAt) VALUES (?, ?, ?, ?, ?)`,
      newId(), version, book, chapter, Date.now()
    );
  } catch (e) {
    console.warn('Error logging chapter read:', e);
  }
}

export type HistoryEntry = {
  version: string;
  book: number;
  chapter: number;
  readAt: number;
};

export async function getHistory(version: string, limit = 50): Promise<HistoryEntry[]> {
  if (!db || !ready) return [];
  try {
    const rows = await db.getAllAsync<HistoryEntry>(
      `SELECT DISTINCT version, book, chapter, MAX(readAt) as readAt
       FROM reading_history WHERE version=?
       GROUP BY book, chapter
       ORDER BY readAt DESC LIMIT ?`,
      version, limit
    );
    return rows || [];
  } catch (e) {
    console.warn('Error getting history:', e);
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  if (!db || !ready) return;
  try {
    await db.runAsync(`DELETE FROM reading_history`);
  } catch (e) {
    console.warn('Error clearing history:', e);
  }
}
