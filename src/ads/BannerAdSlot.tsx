import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useSettings } from '../SettingsContext';
import { BANNER_AD_UNIT_ID } from './adUnits';

// Banner pequeño (320x50) y discreto. No se muestra si el usuario tiene la
// versión PRO (settings.isPro) — hoy siempre false, sin flujo de compra real
// todavía conectado.
export default function BannerAdSlot() {
  const settings = useSettings();
  if (settings.isPro) return null;

  return (
    <View style={styles.wrap}>
      <BannerAd unitId={BANNER_AD_UNIT_ID} size={BannerAdSize.BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 6 },
});
