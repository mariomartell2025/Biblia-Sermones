import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark' | 'sepia';

export interface AppSettings {
  language: Language;
  languageChosen: boolean; // true tras elegir idioma en la pantalla de bienvenida
  theme: Theme;
  fontSize: number; // 14-30
  defaultVersion: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'es',
  languageChosen: false,
  theme: 'dark',
  fontSize: 17,
  defaultVersion: 'rvr1909',
};

const STORAGE_KEY = 'app:settings';

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    // Si ya había configuración guardada (instalación existente), no forzar el
    // onboarding de idioma solo porque el campo 'languageChosen' es nuevo.
    return { ...DEFAULT_SETTINGS, languageChosen: true, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Error loading settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    const current = await loadSettings();
    const next = { ...current, ...settings };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn('Error saving settings:', e);
  }
}

// Strings por idioma
export const i18n = {
  es: {
    biblia: 'Biblia',
    sermones: 'Sermones',
    devocional: 'Devocional',
    ajustes: 'Ajustes',
    versiculos: 'Versículos',
    buscar: 'Buscar',
    tema: 'Tema',
    idioma: 'Idioma',
    tamaño: 'Tamaño de fuente',
    claro: 'Claro',
    oscuro: 'Oscuro',
    sepia: 'Sepia',
    español: 'Español',
    ingles: 'Inglés',
    favoritos: 'Favoritos',
    historial: 'Historial',
    versiculosPropuestos: 'Versículos sugeridos',
    conectar: 'Conectar a un sermón',
    copiar: 'Copiar versículo',
    marcarFavorito: 'Marcar favorito',
    cancelar: 'Cancelar',
  },
  en: {
    biblia: 'Bible',
    sermones: 'Sermons',
    devocional: 'Devotional',
    ajustes: 'Settings',
    versiculos: 'Verses',
    buscar: 'Search',
    tema: 'Theme',
    idioma: 'Language',
    tamaño: 'Font size',
    claro: 'Light',
    oscuro: 'Dark',
    sepia: 'Sepia',
    español: 'Spanish',
    ingles: 'English',
    favoritos: 'Favorites',
    historial: 'History',
    versiculosPropuestos: 'Suggested verses',
    conectar: 'Connect to a sermon',
    copiar: 'Copy verse',
    marcarFavorito: 'Mark favorite',
    cancelar: 'Cancel',
  },
};

export function t(key: keyof typeof i18n.es, language: Language = 'es'): string {
  return i18n[language][key] ?? key;
}
