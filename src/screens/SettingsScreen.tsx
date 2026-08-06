import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Switch } from 'react-native';
import { theme } from '../theme';
import { useSettings } from '../SettingsContext';
import { t, Theme, Language } from '../settings';

export default function SettingsScreen() {
  const settings = useSettings();
  const lang = settings.language;

  const themeOptions: Theme[] = ['light', 'dark', 'sepia'];
  const languageOptions: Language[] = ['es', 'en'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️  {t('ajustes', lang)}</Text>
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
                <Text style={[styles.optionText, settings.theme === th && styles.optionTextActive]}>
                  {th === 'light' ? '☀️' : th === 'dark' ? '🌙' : '📖'} {t(th as any, lang)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tamaño de fuente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('tamaño', lang)}</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>14</Text>
            <View style={styles.sliderTrack}>
              {[14, 15, 16, 17, 18, 19, 20].map((size) => (
                <Pressable
                  key={size}
                  style={[styles.sliderDot, settings.fontSize === size && styles.sliderDotActive]}
                  onPress={() => settings.setFontSize(size)}
                />
              ))}
            </View>
            <Text style={styles.sliderLabel}>20</Text>
          </View>
          <Text style={[styles.preview, { fontSize: settings.fontSize }]}>
            Abc 123 Versículo
          </Text>
        </View>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Biblia + Sermones v1.0</Text>
          <Text style={styles.infoSubtext}>Offline. Libre. Para predicadores.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: {
    backgroundColor: theme.header,
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerTitle: { color: theme.text, fontSize: 20, fontWeight: '800' },
  body: { padding: 20, gap: 24, paddingBottom: 60 },
  section: { gap: 10 },
  sectionTitle: { color: theme.text, fontSize: 16, fontWeight: '800' },
  optionRow: { flexDirection: 'row', gap: 10 },
  optionBtn: {
    flex: 1,
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  optionBtnActive: { borderColor: theme.accent, backgroundColor: '#1a2740' },
  optionText: { color: theme.text, fontWeight: '600', fontSize: 13, textAlign: 'center' },
  optionTextActive: { color: theme.accent, fontWeight: '800' },
  sliderContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sliderLabel: { color: theme.textMuted, fontWeight: '700', fontSize: 12, width: 20 },
  sliderTrack: { flex: 1, flexDirection: 'row', gap: 3, alignItems: 'center' },
  sliderDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.cardBorder },
  sliderDotActive: { backgroundColor: theme.accent, width: 12, height: 12, borderRadius: 6 },
  preview: { color: theme.text, textAlign: 'center', marginTop: 12, fontWeight: '500', lineHeight: 26 },
  infoBox: { marginTop: 20, padding: 16, backgroundColor: theme.bgElevated, borderRadius: 12, borderWidth: 1, borderColor: theme.cardBorder, alignItems: 'center' },
  infoText: { color: theme.text, fontWeight: '800', fontSize: 14 },
  infoSubtext: { color: theme.textMuted, fontSize: 12, marginTop: 4 },
});
