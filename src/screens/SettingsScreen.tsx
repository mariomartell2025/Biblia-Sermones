import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import * as Updates from 'expo-updates';
import { useTheme } from '../useTheme';
import { useSettings } from '../SettingsContext';
import { t, Theme, Language } from '../settings';

export default function SettingsScreen() {
  const settings = useSettings();
  const themeColors = useTheme();
  const lang = settings.language;
  const [updating, setUpdating] = useState(false);

  const themeOptions: Theme[] = ['light', 'dark', 'sepia'];
  const languageOptions: Language[] = ['es', 'en'];

  const checkForUpdates = async () => {
    try {
      setUpdating(true);
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        alert(lang === 'es' ? '✅ Ya tienes la última versión' : '✅ You are already up to date');
      }
    } catch (e) {
      // En desarrollo, es normal que falle. Se habilita cuando publiquemos con eas update
      alert(lang === 'es' ? '📱 Las actualizaciones se habilitan cuando se publiquen cambios' : '📱 Updates will be available when changes are published');
    } finally {
      setUpdating(false);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.bg },
    header: {
      backgroundColor: themeColors.header,
      paddingTop: 52,
      paddingBottom: 14,
      paddingHorizontal: 20,
    },
    headerTitle: { color: themeColors.text, fontSize: 20, fontWeight: '800' },
    body: { padding: 20, gap: 24, paddingBottom: 60 },
    section: { gap: 10 },
    sectionTitle: { color: themeColors.text, fontSize: 16, fontWeight: '800' },
    optionRow: { flexDirection: 'row', gap: 10 },
    optionBtn: {
      flex: 1,
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.cardBorder,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    optionBtnActive: { borderColor: themeColors.accent, backgroundColor: themeColors.bgElevated },
    optionText: { color: themeColors.text, fontWeight: '600', fontSize: 13, textAlign: 'center' },
    optionTextActive: { color: themeColors.accent, fontWeight: '800' },
    sliderContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    sliderLabel: { color: themeColors.textMuted, fontWeight: '700', fontSize: 12, width: 20 },
    sliderTrack: { flex: 1, flexDirection: 'row', gap: 3, alignItems: 'center' },
    sliderDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: themeColors.cardBorder },
    sliderDotActive: { backgroundColor: themeColors.accent, width: 12, height: 12, borderRadius: 6 },
    preview: { color: themeColors.text, textAlign: 'center', marginTop: 12, fontWeight: '500', lineHeight: 26, fontSize: settings.fontSize },
    updateBtn: { backgroundColor: themeColors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
    updateBtnDisabled: { opacity: 0.6 },
    updateBtnText: { color: themeColors.accentText, fontWeight: '800', fontSize: 15 },
    infoBox: { marginTop: 20, padding: 16, backgroundColor: themeColors.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: themeColors.cardBorder, alignItems: 'center' },
    infoText: { color: themeColors.text, fontWeight: '800', fontSize: 14 },
    infoSubtext: { color: themeColors.textMuted, fontSize: 12, marginTop: 4 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️  {t('ajustes', lang)}</Text>
        <Text style={{ color: themeColors.textMuted, fontSize: 11, marginTop: 2 }}>Actualizado vía OTA ✓</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {/* Idioma */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('idioma', lang)}</Text>
          <View style={styles.optionRow}>
            {languageOptions.map((l) => (
              <Pressable
                key={l}
                style={[styles.optionBtn, settings.language === l && styles.optionBtnActive]}
                onPress={() => settings.setLanguage(l)}
              >
                <Text style={[styles.optionText, settings.language === l && styles.optionTextActive]}>
                  {l === 'es' ? t('español', l) : t('ingles', l)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tema */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('tema', lang)}</Text>
          <View style={styles.optionRow}>
            {themeOptions.map((th) => (
              <Pressable
                key={th}
                style={[styles.optionBtn, settings.theme === th && styles.optionBtnActive]}
                onPress={() => settings.setTheme(th)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 16 }}>{th === 'light' ? '☀️' : th === 'dark' ? '🌙' : '📖'}</Text>
                  <Text style={[styles.optionText, settings.theme === th && styles.optionTextActive, { marginTop: 0 }]}>
                    {t(th as any, lang)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tamaño de fuente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('tamaño', lang)}</Text>
          <View style={[styles.sliderContainer, { justifyContent: 'center' }]}>
            <Pressable
              style={[styles.optionBtn, { flex: 0, width: 50 }]}
              onPress={() => settings.setFontSize(Math.max(14, settings.fontSize - 1))}
            >
              <Text style={[styles.optionText, { fontSize: 20 }]}>−</Text>
            </Pressable>
            <Text style={[styles.sliderLabel, { width: 'auto', marginHorizontal: 16, fontSize: 16, fontWeight: '800', color: themeColors.text }]}>
              {settings.fontSize}
            </Text>
            <Pressable
              style={[styles.optionBtn, { flex: 0, width: 50 }]}
              onPress={() => settings.setFontSize(Math.min(30, settings.fontSize + 1))}
            >
              <Text style={[styles.optionText, { fontSize: 20 }]}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.preview}>
            Abc 123 Versículo
          </Text>
        </View>

        {/* Actualizar */}
        <Pressable
          style={[styles.updateBtn, updating && styles.updateBtnDisabled]}
          onPress={checkForUpdates}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color={themeColors.accentText} />
          ) : (
            <Text style={styles.updateBtnText}>🔄 Actualizar App</Text>
          )}
        </Pressable>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Biblia + Sermones v1.0</Text>
          <Text style={styles.infoSubtext}>Offline. Libre. Para predicadores.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
