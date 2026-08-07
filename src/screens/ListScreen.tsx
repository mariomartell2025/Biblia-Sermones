import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { Sermon } from '../types';
import { theme } from '../theme';
import { useSettings } from '../SettingsContext';
import { t } from '../settings';

type Props = {
  sermons: Sermon[];
  onOpen: (id: string) => void;
  onNew: () => void;
};

export default function ListScreen({ sermons, onOpen, onNew }: Props) {
  const settings = useSettings();
  const lang = settings.language as 'es' | 'en';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('sermones', lang)}</Text>
        <Pressable style={styles.newBtn} onPress={onNew}>
          <Text style={styles.newBtnText}>+ {lang === 'es' ? 'Nuevo' : 'New'}</Text>
        </Pressable>
      </View>

      <FlatList
        data={sermons}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>{lang === 'es' ? 'Aún no tienes sermones. Toca “+ Nuevo”.' : 'You don\'t have any sermons yet. Tap “+ New”.'}</Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => onOpen(item.id)}>
            <View style={styles.thumb}>
              <Text style={styles.thumbNum}>#{item.number || '—'}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.number ? `#${item.number} | ` : ''}
                {item.title}
              </Text>
              <Text style={styles.cardDate}>Publicado el {item.date}</Text>
              <Text style={styles.cardExcerpt} numberOfLines={2}>
                {item.intro || `${item.points.length} puntos`}
              </Text>
              <Text style={styles.cardMeta}>{item.points.length} puntos ›</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: {
    backgroundColor: theme.header,
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: theme.text, fontSize: 28, fontWeight: '700' },
  newBtn: {
    backgroundColor: theme.accent,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
  },
  newBtnText: { color: theme.accentText, fontWeight: '700' },
  listContent: { padding: 16, gap: 14 },
  empty: { color: theme.textMuted, textAlign: 'center', marginTop: 40 },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    overflow: 'hidden',
  },
  thumb: {
    width: 84,
    backgroundColor: '#22304d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbNum: { color: theme.accent, fontWeight: '800', fontSize: 16 },
  cardBody: { flex: 1, padding: 14, gap: 4 },
  cardTitle: { color: theme.text, fontSize: 17, fontWeight: '700' },
  cardDate: { color: theme.textMuted, fontSize: 12 },
  cardExcerpt: { color: theme.textMuted, fontSize: 13, marginTop: 2 },
  cardMeta: { color: theme.accent, fontSize: 12, fontWeight: '600', marginTop: 4 },
});
