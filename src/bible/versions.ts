// Registro de versiones bíblicas: deja la app LISTA para el modelo free/suscripción.
// - 'bundled' = empaquetada en la app (offline, dominio público, gratis).
// - 'api'     = se sirve desde tu backend / API.Bible SOLO a suscriptores (con licencia).
// Ver LICENCIAS_Y_MONETIZACION.md para costos y licencias.

export type BibleVersionMeta = {
  id: string;
  abbr: string;
  name: string;
  language: 'es' | 'en' | 'pt';
  tier: 'free' | 'premium';
  source: 'bundled' | 'api';
  license: 'dominio-publico' | 'licenciada';
  available: boolean; // false = anunciada pero aún sin licencia/datos
};

export const VERSIONS: BibleVersionMeta[] = [
  // ===== GRATIS (dominio público, ya empaquetada, offline) =====
  { id: 'rvr1909', abbr: 'RVR', name: 'Reina Valera 1909', language: 'es', tier: 'free', source: 'bundled', license: 'dominio-publico', available: true },
  { id: 'rva', abbr: 'RVA', name: 'Reina Valera Antigua', language: 'es', tier: 'free', source: 'bundled', license: 'dominio-publico', available: false },
  { id: 'kjv', abbr: 'KJV', name: 'King James Version', language: 'en', tier: 'free', source: 'bundled', license: 'dominio-publico', available: false },
  { id: 'asv', abbr: 'ASV', name: 'American Standard Version', language: 'en', tier: 'free', source: 'bundled', license: 'dominio-publico', available: false },

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
