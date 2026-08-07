import * as SQLite from 'expo-sqlite';

// Motor SQLite de la Biblia: base de datos en el teléfono (offline, $0 servidor).
// Guarda los versículos en una tabla consultable, base para varias versiones,
// búsqueda rápida y (a futuro) la concordancia Strong.
//
// Diseño tolerante: si SQLite no está disponible (p.ej. web sin cabeceras OPFS),
// `ready` queda en false y la capa de consulta cae al modo en-memoria. En nativo
// (iOS/Android, el objetivo real) SQLite corre siempre.

let db: SQLite.SQLiteDatabase | null = null;
export let ready = false;

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Versiones que van empaquetadas en la app desde el primer momento (offline,
// sin descarga): una en español y una en inglés. El resto (ASV, RVA1865...)
// se descarga bajo demanda vía downloadAndSeedVersion, para no inflar el
// tamaño de cada actualización con texto que la mayoría no va a usar.
// Estructura de cada archivo: [{ name, abbr, testament, chapters: [[verso,...]] }]
const BUNDLED_SEEDS: Record<string, () => any[]> = {
  rvr1909: () => require('../../assets/bible/rvr.json'),
  kjv: () => require('../../assets/bible/kjv.json'),
};

export async function initBibleDb(): Promise<boolean> {
  if (ready) return true;
  try {
    db = await SQLite.openDatabaseAsync('biblia.db');
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS verses (
        version TEXT NOT NULL,
        book    INTEGER NOT NULL,
        chapter INTEGER NOT NULL,
        verse   INTEGER NOT NULL,
        text    TEXT NOT NULL,
        norm    TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_ref ON verses(version, book, chapter);

      CREATE TABLE IF NOT EXISTS user_favorites (
        id TEXT PRIMARY KEY,
        version TEXT NOT NULL,
        book INTEGER NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        UNIQUE(version, book, chapter, verse)
      );
      CREATE INDEX IF NOT EXISTS idx_fav ON user_favorites(createdAt DESC);

      CREATE TABLE IF NOT EXISTS reading_history (
        id TEXT PRIMARY KEY,
        version TEXT NOT NULL,
        book INTEGER NOT NULL,
        chapter INTEGER NOT NULL,
        readAt INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_hist ON reading_history(readAt DESC);

      CREATE TABLE IF NOT EXISTS verse_highlights (
        version TEXT NOT NULL,
        book INTEGER NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        color TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        PRIMARY KEY (version, book, chapter, verse)
      );
    `);

    // Sembrar las versiones empaquetadas que aún no estén en la base.
    for (const version of Object.keys(BUNDLED_SEEDS)) {
      const row = await db.getFirstAsync<{ n: number }>(
        `SELECT COUNT(*) AS n FROM verses WHERE version = ?`, version
      );
      if (!row || row.n === 0) {
        await seedVersionData(version, BUNDLED_SEEDS[version]());
      }
    }
    // Inicializar módulos de favoritos, historial y resaltados
    const { initFavDb } = await import('./favorites');
    const { initHistoryDb } = await import('./history');
    const { initHighlightsDb } = await import('./highlights');
    await initFavDb(db);
    await initHistoryDb(db);
    await initHighlightsDb(db);

    ready = true;
    console.log('SQLite Biblia lista');
    return true;
  } catch (e) {
    console.warn('SQLite no disponible, uso modo en-memoria:', e);
    ready = false;
    return false;
  }
}

async function seedVersionData(version: string, data: any[]) {
  if (!db) return;
  await db.withTransactionAsync(async () => {
    const stmt = await db!.prepareAsync(
      `INSERT INTO verses (version, book, chapter, verse, text, norm) VALUES (?, ?, ?, ?, ?, ?)`
    );
    try {
      for (let bi = 0; bi < data.length; bi++) {
        const chapters = data[bi].chapters;
        for (let ci = 0; ci < chapters.length; ci++) {
          const vs = chapters[ci];
          for (let vi = 0; vi < vs.length; vi++) {
            await stmt.executeAsync(version, bi, ci + 1, vi + 1, vs[vi], norm(vs[vi]));
          }
        }
      }
    } finally {
      await stmt.finalizeAsync();
    }
  });
}

// ¿Ya están los versículos de esta versión en la base (empaquetada o
// descargada antes)?
export async function isVersionSeeded(version: string): Promise<boolean> {
  if (!db || !ready) return false;
  const row = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM verses WHERE version = ?`, version
  );
  return !!row && row.n > 0;
}

// Descarga el JSON de una versión (formato igual al de los archivos
// empaquetados) y la siembra en SQLite. Solo necesita internet la primera
// vez; después queda disponible offline como cualquier otra versión.
export async function downloadAndSeedVersion(version: string, url: string): Promise<boolean> {
  if (!db || !ready) return false;
  if (await isVersionSeeded(version)) return true;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo descargar (${res.status})`);
  const data = await res.json();
  await seedVersionData(version, data);
  return true;
}

export async function dbChapter(version: string, book: number, chapter: number): Promise<string[]> {
  if (!db) return [];
  const rows = await db.getAllAsync<{ text: string }>(
    `SELECT text FROM verses WHERE version=? AND book=? AND chapter=? ORDER BY verse`,
    version, book, chapter
  );
  return rows.map((r) => r.text);
}

export async function dbVerse(version: string, book: number, chapter: number, verse: number): Promise<string | null> {
  if (!db) return null;
  const row = await db.getFirstAsync<{ text: string }>(
    `SELECT text FROM verses WHERE version=? AND book=? AND chapter=? AND verse=?`,
    version, book, chapter, verse
  );
  return row?.text ?? null;
}

export type DbHit = { book: number; chapter: number; verse: number; text: string };

// Búsqueda: frase exacta primero, luego versículos con TODAS las palabras.
export async function dbSearch(version: string, query: string, limit = 80): Promise<DbHit[]> {
  if (!db) return [];
  const q = norm(query.trim());
  if (q.length < 3) return [];
  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);

  const phrase = await db.getAllAsync<DbHit>(
    `SELECT book, chapter, verse, text FROM verses WHERE version=? AND norm LIKE ? LIMIT ?`,
    version, `%${q}%`, limit
  );
  if (phrase.length >= limit || tokens.length <= 1) return phrase.slice(0, limit);

  const where = tokens.map(() => 'norm LIKE ?').join(' AND ');
  const params: any[] = [version, ...tokens.map((t) => `%${t}%`), limit];
  const all = await db.getAllAsync<DbHit>(
    `SELECT book, chapter, verse, text FROM verses WHERE version=? AND ${where} LIMIT ?`,
    ...params
  );
  const seen = new Set(phrase.map((h) => `${h.book}:${h.chapter}:${h.verse}`));
  const merged = [...phrase];
  for (const h of all) {
    const k = `${h.book}:${h.chapter}:${h.verse}`;
    if (!seen.has(k)) { seen.add(k); merged.push(h); if (merged.length >= limit) break; }
  }
  return merged.slice(0, limit);
}
