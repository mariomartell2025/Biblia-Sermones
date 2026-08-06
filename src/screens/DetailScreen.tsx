import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Sermon } from '../types';
import { theme } from '../theme';

type Props = {
  sermon: Sermon;
  onBack: () => void;
  onPreach: () => void;
  onEdit: () => void;
};

export default function DetailScreen({ sermon, onBack, onPreach, onEdit }: Props) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width, 640) - 32;
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (cardWidth + 12));
    if (i !== index) setIndex(i);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Sermones</Text>
        </Pressable>
        <Pressable onPress={onEdit} hitSlop={12}>
          <Text style={styles.edit}>Editar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.intro}>
          <Text style={styles.title}>
            {sermon.number ? `#${sermon.number} | ` : ''}
            {sermon.title}
          </Text>
          <Text style={styles.date}>Publicado el {sermon.date}</Text>
          {!!sermon.keyVerse && (
            <View style={styles.keyVerse}>
              <Text style={styles.keyVerseRef}>✝  {sermon.keyVerse.ref}</Text>
              <Text style={styles.keyVerseText}>{sermon.keyVerse.text}</Text>
            </View>
          )}
          {!!sermon.intro && <Text style={styles.introText}>{sermon.intro}</Text>}
        </View>

        <View style={styles.carouselHeaderRow}>
          <Text style={styles.sectionLabel}>Puntos del sermón</Text>
          <Text style={styles.counter}>
            {sermon.points.length ? `${index + 1} de ${sermon.points.length}` : '0'}
          </Text>
        </View>

        <FlatList
          data={sermon.points}
          keyExtractor={(p) => p.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 12}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          renderItem={({ item, index: i }) => (
            <View style={[styles.pointCard, { width: cardWidth }]}>
              <Text style={styles.pointBadge}>Punto {i + 1}</Text>
              {!!item.heading && <Text style={styles.pointHeading}>{item.heading}</Text>}
              <Text style={styles.pointBody}>{item.bodyMd}</Text>
            </View>
          )}
        />

        <View style={styles.dots}>
          {sermon.points.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.preachBtn} onPress={onPreach}>
          <Text style={styles.preachText}>▶  Modo Predicar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: {
    backgroundColor: theme.header,
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  back: { color: theme.accent, fontSize: 16, fontWeight: '600' },
  edit: { color: theme.accent, fontSize: 16, fontWeight: '600' },
  intro: { padding: 20, gap: 8 },
  title: { color: theme.text, fontSize: 26, fontWeight: '800', lineHeight: 32 },
  date: { color: theme.textMuted, fontSize: 13 },
  introText: { color: theme.text, fontSize: 16, lineHeight: 24, marginTop: 6, opacity: 0.9 },
  keyVerse: { backgroundColor: '#1a2740', borderLeftWidth: 3, borderLeftColor: theme.accent, borderRadius: 10, padding: 14, marginTop: 12 },
  keyVerseRef: { color: theme.accent, fontWeight: '800', fontSize: 14, marginBottom: 6 },
  keyVerseText: { color: theme.text, fontSize: 16, lineHeight: 24, fontStyle: 'italic' },
  carouselHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 10,
  },
  sectionLabel: { color: theme.textMuted, fontSize: 13, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  counter: { color: theme.accent, fontSize: 13, fontWeight: '700' },
  pointCard: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 20,
    minHeight: 220,
    gap: 10,
  },
  pointBadge: { color: theme.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  pointHeading: { color: theme.text, fontSize: 20, fontWeight: '700' },
  pointBody: { color: theme.text, fontSize: 16, lineHeight: 25, opacity: 0.92 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 16 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.cardBorder },
  dotActive: { backgroundColor: theme.accent, width: 20 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: theme.cardBorder, backgroundColor: theme.bgElevated },
  preachBtn: {
    backgroundColor: theme.accent,
    paddingVertical: 15,
    borderRadius: 999,
    alignItems: 'center',
  },
  preachText: { color: theme.accentText, fontSize: 17, fontWeight: '800' },
});
