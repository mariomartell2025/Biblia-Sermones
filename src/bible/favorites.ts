import * as SQLite from 'expo-sqlite';
import { ready } from './db';
import { newId } from '../split';

let db: SQLite.SQLiteDatabase | null = null;

export async function initFavDb(database: SQLite.SQLiteDatabase) {
  db = database;
}

export async function addFavorite(version: string, book: number, chapter: number, verse: number): Promise<boolean> {
  if (!db || !ready) return false;
  try {
    await db.runAsync(
      `INSERT OR IGNORE INTO user_favorites (id, version, book, chapter, verse, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      newId(), version, book, chapter, verse, Date.now()
    );
    return true;
  } catch (e) {
    console.warn('Error adding favorite:', e);
    return false;
  }
}

export async function removeFavorite(version: string, book: number, chapter: number, verse: number): Promise<boolean> {
  if (!db || !ready) return false;
  try {
    await db.runAsync(
      `DELETE FROM user_favorites WHERE version=? AND book=? AND chapter=? AND verse=?`,
      version, book, chapter, verse
    );
    return true;
  } catch (e) {
    console.warn('Error removing favorite:', e);
    return false;
  }
}

export async function isFavorite(version: string, book: number, chapter: number, verse: number): Promise<boolean> {
  if (!db || !ready) return false;
  try {
    const row = await db.getFirstAsync(
      `SELECT id FROM user_favorites WHERE version=? AND book=? AND chapter=? AND verse=? LIMIT 1`,
      version, book, chapter, verse
    );
    return !!row;
  } catch (e) {
    console.warn('Error checking favorite:', e);
    return false;
  }
}

export type FavoriteVerse = {
  version: string;
  book: number;
  chapter: number;
  verse: number;
  createdAt: number;
};

export async function getFavorites(version: string, limit = 100): Promise<FavoriteVerse[]> {
  if (!db || !ready) return [];
  try {
    const rows = await db.getAllAsync<FavoriteVerse>(
      `SELECT version, book, chapter, verse, createdAt FROM user_favorites
       WHERE version=? ORDER BY createdAt DESC LIMIT ?`,
      version, limit
    );
    return rows || [];
  } catch (e) {
    console.warn('Error getting favorites:', e);
    return [];
  }
}
