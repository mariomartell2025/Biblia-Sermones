import AsyncStorage from '@react-native-async-storage/async-storage';
import { Devotional } from '../types';
import { newId } from '../split';
import { seedDevotionals } from './seed';

const KEY = 'devocionales:v1';

// URL de TU backend de IA. Déjala vacía para usar los devocionales curados de respaldo.
// Cuando despliegues el endpoint (ver server/devocional-endpoint.js), pon aquí su URL.
export const BACKEND_URL = '';

// Debe coincidir con DEVOCIONAL_API_KEY del servidor (ver server/devocional-endpoint.js).
// Déjala vacía si no vas a usar el backend de IA.
export const BACKEND_API_KEY = '';

export async function loadDevotionals(): Promise<Devotional[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      const seeded = seedDevotionals();
      await saveDevotionals(seeded);
      return seeded;
    }
    return JSON.parse(raw) as Devotional[];
  } catch {
    return seedDevotionals();
  }
}

export async function saveDevotionals(list: Devotional[]): Promise<void> {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

function today(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

/**
 * Genera un devocional nuevo. Si BACKEND_URL está configurada, pide a tu backend
 * (que llama a Claude de forma segura con tu API key). Si no, rota el repertorio curado.
 * `theme` es opcional: un tema que el usuario quiera ("perdón", "ansiedad", "gratitud").
 */
export async function generateDevotional(theme?: string, existing: Devotional[] = []): Promise<Devotional> {
  if (BACKEND_URL) {
    const res = await fetch(`${BACKEND_URL}/devocional`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': BACKEND_API_KEY },
      body: JSON.stringify({ theme, date: today() }),
    });
    if (!res.ok) throw new Error(`Backend respondió ${res.status}`);
    const data = await res.json();
    return normalize(data);
  }
  // Respaldo sin internet: rota el repertorio curado para no repetir el último.
  const pool = seedDevotionals();
  const lastTitle = existing[0]?.title;
  const pick = pool.find((d) => d.title !== lastTitle) || pool[0];
  return { ...pick, id: newId('d'), date: today(), createdAt: Date.now() };
}

// Da forma segura a la respuesta del backend (por si faltan ids).
function normalize(d: any): Devotional {
  return {
    id: newId('d'),
    date: d.date || today(),
    title: d.title || 'Devocional',
    theme: d.theme || '',
    keyVerse: d.keyVerse,
    source: 'ia',
    createdAt: Date.now(),
    points: (d.points || []).map((p: any) => ({
      id: newId(),
      kind: p.kind || 'pensamiento',
      heading: p.heading || '',
      body: p.body || '',
    })),
  };
}
