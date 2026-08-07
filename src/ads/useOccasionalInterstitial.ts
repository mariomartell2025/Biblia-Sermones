import { useEffect, useRef } from 'react';
import { useInterstitialAd } from 'react-native-google-mobile-ads';
import { useSettings } from '../SettingsContext';
import { INTERSTITIAL_AD_UNIT_ID } from './adUnits';

// "Ocasional y discreto": no se muestra en cada navegación, solo cada
// SHOW_EVERY_N veces que se llama a trigger() (p. ej. cada N cambios de
// capítulo). No se muestra nunca si settings.isPro.
const SHOW_EVERY_N = 6;

export function useOccasionalInterstitial() {
  const settings = useSettings();
  const adUnitId = settings.isPro ? null : INTERSTITIAL_AD_UNIT_ID;
  const { isLoaded, isClosed, load, show } = useInterstitialAd(adUnitId);
  const countRef = useRef(0);

  useEffect(() => {
    if (!settings.isPro) load();
  }, [load, settings.isPro]);

  useEffect(() => {
    if (isClosed) load(); // recargar para la próxima vez que corresponda mostrarlo
  }, [isClosed, load]);

  const trigger = () => {
    if (settings.isPro) return;
    countRef.current += 1;
    if (countRef.current % SHOW_EVERY_N === 0 && isLoaded) {
      show();
    }
  };

  return { trigger };
}
