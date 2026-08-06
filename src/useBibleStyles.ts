import { StyleSheet } from 'react-native';
import { useTheme } from './useTheme';
import { useSettings } from './SettingsContext';

export function useBibleStyles() {
  const themeColors = useTheme();
  const settings = useSettings();

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.bg },
    header: {
      backgroundColor: themeColors.header,
      paddingTop: 52,
      paddingBottom: 14,
      paddingHorizontal: 20,
    },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    h1: { color: themeColors.text, fontSize: 28, fontWeight: '800' },
    versionChip: { borderWidth: 1, borderColor: themeColors.accent, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
    versionText: { color: themeColors.accent, fontWeight: '800', fontSize: 12 },
    searchHeader: {
      backgroundColor: themeColors.header,
      paddingTop: 52,
      paddingBottom: 16,
      paddingHorizontal: 20,
    },
    back: { color: themeColors.accent, fontSize: 16, fontWeight: '600' },
    subTitle: { color: themeColors.text, fontSize: 17, fontWeight: '700' },
    searchInput: {
      backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder,
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: themeColors.text, fontSize: 16,
    },
    searchPlaceholder: { color: themeColors.textMuted, fontSize: 14 },
    bookGroupTitle: {
      color: themeColors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 0.8,
      paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10,
    },
    bookItem: {
      width: '31%', backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder,
      borderRadius: 12, padding: 12, marginBottom: 12,
    },
    bookName: { color: themeColors.text, fontWeight: '700', fontSize: 14 },
    bookMeta: { color: themeColors.textMuted, fontSize: 11, marginTop: 2 },
    chapItem: {
      flex: 1, aspectRatio: 1, backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder,
      borderRadius: 12, alignItems: 'center', justifyContent: 'center', margin: 6,
    },
    chapNum: { color: themeColors.text, fontSize: 17, fontWeight: '700' },
    chapterTitle: { color: themeColors.text, fontSize: 24, fontWeight: '800', marginBottom: 14 },
    verse: { color: themeColors.text, fontSize: settings.fontSize, lineHeight: settings.fontSize * 1.6 },
    verseNum: { color: themeColors.accent, fontSize: 12, fontWeight: '800' },
    readerHint: { color: themeColors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 16, opacity: 0.7 },
    footer: {
      padding: 14, paddingBottom: 22, borderTopWidth: 1, borderTopColor: themeColors.cardBorder,
      backgroundColor: themeColors.bgElevated,
    },
    navText: { color: themeColors.accent, fontWeight: '700', fontSize: 15 },
    footerRef: { color: themeColors.textMuted, fontSize: 12, fontWeight: '700' },
    input: {
      backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder, borderRadius: 12,
      paddingHorizontal: 14, paddingVertical: 12, color: themeColors.text, fontSize: 16,
    },
    suggestItem: {
      backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder,
    },
    suggestText: { color: themeColors.text, fontWeight: '600', fontSize: 14 },
    suggestItemActive: {
      backgroundColor: themeColors.bgElevated, borderWidth: 1, borderColor: themeColors.accent, borderRadius: 12,
    },
  });
}
