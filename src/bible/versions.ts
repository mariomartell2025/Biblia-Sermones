// Registro de versiones bíblicas: deja la app LISTA para el modelo free/suscripción.
// - 'bundled'      = empaquetada en la app desde el primer momento (offline, sin descarga).
// - 'downloadable' = dominio público, gratis, pero se descarga bajo demanda la primera
//                    vez que el usuario la elige (no infla el tamaño de la app/updates).
// - 'api'          = se sirve desde tu backend / API.Bible SOLO a suscriptores (con licencia).
// Ver LICENCIAS_Y_MONETIZACION.md para costos y licencias.

const RELEASE_BASE = 'https://github.com/mariomartell2025/Biblia-Sermones/releases/download/bible-data-v1';

export type BibleVersionMeta = {
  id: string;
  abbr: string;
  name: string;
  language: 'es' | 'en' | 'pt';
  tier: 'free' | 'premium';
  source: 'bundled' | 'downloadable' | 'api';
  license: 'dominio-publico' | 'licenciada';
  available: boolean; // false = anunciada pero aún sin licencia/datos
  downloadUrl?: string; // solo para source: 'downloadable'
};

export const VERSIONS: BibleVersionMeta[] = [
  // ===== GRATIS, empaquetadas desde el primer momento (una en español, una en inglés) =====
  { id: 'rvr1909', abbr: 'RVR', name: 'Reina Valera 1909', language: 'es', tier: 'free', source: 'bundled', license: 'dominio-publico', available: true },
  { id: 'kjv', abbr: 'KJV', name: 'King James Version', language: 'en', tier: 'free', source: 'bundled', license: 'dominio-publico', available: true },

  // ===== GRATIS, se descargan bajo demanda la primera vez que se eligen =====
  { id: 'rva1865', abbr: 'RVA', name: 'Reina Valera 1865', language: 'es', tier: 'free', source: 'downloadable', license: 'dominio-publico', available: true, downloadUrl: `${RELEASE_BASE}/rva1865.json` },
  { id: 'asv', abbr: 'ASV', name: 'American Standard Version', language: 'en', tier: 'free', source: 'downloadable', license: 'dominio-publico', available: true, downloadUrl: `${RELEASE_BASE}/asv.json` },

  // ===== PREMIUM (requieren licencia; se sirven vía backend/API.Bible) =====
  { id: 'rvr1960', abbr: 'RV60', name: 'Reina Valera 1960', language: 'es', tier: 'premium', source: 'api', license: 'licenciada', available: false },
  { id: 'nvi', abbr: 'NVI', name: 'Nueva Versión Internacional', language: 'es', tier: 'premium', source: 'api', license: 'licenciada', available: false },
  { id: 'ntv', abbr: 'NTV', name: 'Nueva Traducción Viviente', language: 'es', tier: 'premium', source: 'api', license: 'licenciada', available: false },
  { id: 'lbla', abbr: 'LBLA', name: 'La Biblia de las Américas', language: 'es', tier: 'premium', source: 'api', license: 'licenciada', available: false },
  { id: 'rvc', abbr: 'RVC', name: 'Reina Valera Contemporánea', language: 'es', tier: 'premium', source: 'api', license: 'licenciada', available: false },
  { id: 'esv', abbr: 'ESV', name: 'English Standard Version', language: 'en', tier: 'premium', source: 'api', license: 'licenciada', available: false },
  { id: 'nkjv', abbr: 'NKJV', name: 'New King James Version', language: 'en', tier: 'premium', source: 'api', license: 'licenciada', available: false },
];

// Recursos de estudio: concordancia y diccionario (Strong = dominio público → gratis).
export type StudyResourceMeta = {
  id: string;
  name: string;
  kind: 'concordancia' | 'diccionario' | 'comentario';
  tier: 'free' | 'premium';
  license: 'dominio-publico' | 'licenciada';
  available: boolean;
};

export const STUDY_RESOURCES: StudyResourceMeta[] = [
  { id: 'strong', name: 'Concordancia y diccionario Strong', kind: 'concordancia', tier: 'free', license: 'dominio-publico', available: false },
  { id: 'dic-pd', name: 'Diccionario bíblico (dominio público)', kind: 'diccionario', tier: 'free', license: 'dominio-publico', available: false },
  { id: 'com-mh', name: 'Comentario Matthew Henry', kind: 'comentario', tier: 'premium', license: 'licenciada', available: false },
];

export function freeVersions() { return VERSIONS.filter((v) => v.tier === 'free' && v.available); }
export function premiumVersions() { return VERSIONS.filter((v) => v.tier === 'premium'); }
export function comingSoonVersions() { return VERSIONS.filter((v) => !v.available); }
