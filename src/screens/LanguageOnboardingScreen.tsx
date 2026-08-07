import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useSettings } from '../SettingsContext';

export default function LanguageOnboardingScreen() {
  const settings = useSettings();

  return (
    <View style={styles.container}>
      <Ionicons name="book" size={56} color={theme.accent} />
      <Text style={styles.title}>Elige tu idioma{'\n'}Choose your language</Text>
      <Pressable style={styles.optionBtn} onPress={() => settings.setLanguage('es')}>
        <Text style={styles.optionText}>Español</Text>
      </Pressable>
      <Pressable style={styles.optionBtn} onPress={() => settings.setLanguage('en')}>
        <Text style={styles.optionText}>English</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 16 },
  title: { color: theme.text, fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 16, lineHeight: 28 },
  optionBtn: {
    width: '100%', maxWidth: 320,
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  optionText: { color: theme.text, fontSize: 17, fontWeight: '700' },
});
