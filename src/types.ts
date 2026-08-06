// Modelo de datos del módulo de sermones.
// El cuerpo canónico de un sermón es Markdown: `intro` + puntos (cada punto = una tarjeta del carrusel).

export type SermonPoint = {
  id: string;
  heading: string; // título del punto (opcional)
  bodyMd: string;  // notas del punto en markdown/texto
};

// Versículo central/base de la prédica (enlazado a la Biblia).
export type KeyVerse = {
  book: number;      // índice de libro
  chapter: number;
  verse: number;
  ref: string;       // cita corta, ej. "2Co 12:9"
  text: string;      // texto del versículo
};

// Un punto del carrusel de un devocional: pensamiento, frase, aplicación u oración.
export type DevotionalPoint = {
  id: string;
  kind: 'pensamiento' | 'reflexion' | 'aplicacion' | 'oracion';
  heading: string;
  body: string;
};

export type Devotional = {
  id: string;
  date: string;        // "05/08/2026"
  title: string;
  theme: string;       // tema breve, ej. "Esperar en Dios"
  keyVerse: KeyVerse;
  points: DevotionalPoint[];
  source: 'curado' | 'ia'; // curado (semilla) o generado con IA
  createdAt: number;
};

export type Sermon = {
  id: string;
  number?: string;   // ej. "985"
  title: string;     // ej. "Estigma"
  date: string;      // ISO o texto libre, ej. "24/07/2026"
  intro: string;     // descripción / introducción
  keyVerse?: KeyVerse; // versículo base de la prédica
  points: SermonPoint[];
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
};
