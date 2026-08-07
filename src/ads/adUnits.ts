import { TestIds } from 'react-native-google-mobile-ads';

// IDs de anuncio. Usa los de PRUEBA de Google (oficiales, seguros, nunca
// generan ingreso real) hasta que exista una cuenta de AdMob real.
//
// Para activar anuncios reales:
// 1. Crea una cuenta en https://admob.google.com y da de alta la app (Android/iOS).
// 2. Crea una unidad de anuncio de banner y otra de intersticial.
// 3. Reemplaza BANNER_AD_UNIT_ID / INTERSTITIAL_AD_UNIT_ID abajo con los IDs reales.
// 4. Reemplaza también androidAppId/iosAppId en app.json (plugin
//    react-native-google-mobile-ads) con el App ID real de AdMob.
// 5. Recompila (esto es un módulo nativo, no se puede publicar por OTA).
const USE_TEST_ADS = true;

export const BANNER_AD_UNIT_ID = USE_TEST_ADS ? TestIds.BANNER : 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY';
export const INTERSTITIAL_AD_UNIT_ID = USE_TEST_ADS ? TestIds.INTERSTITIAL : 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';
