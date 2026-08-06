import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Sermon } from '../types';
import { theme } from '../theme';

type Props = {
  sermon: Sermon;
  onExit: () => void;
};

export default function PreachScreen({ sermon, onExit }: Props) {
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width, 900);
  const pagerRef = useRef<ScrollView>(null);
  const suppressScrollSync = useRef(false); // ignora onScroll mientras un botón anima
  const [index, setIndex] = useState(0);
  const total = sermon.points.length;

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i));
    suppressScrollSync.current = true;
    // En web el scroll-snap del paginado bloquea scrollTo({behavior:'smooth'});
    // asignar scrollLeft directo sí mueve el contenedor. En nativo usamos la API de RN.
    const node: any = (pagerRef.current as any)?.getScrollableNode?.();
    if (node && typeof node.scrollLeft === 'number') {
      node.scrollLeft = clamped * pageWidth;
    } else {
      pagerRef.current?.scrollTo({ x: clamped * pageWidth, animated: true });
    }
    setIndex(clamped);
    setTimeout(() => { suppressScrollSync.current = false; }, 300);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (suppressScrollSync.current) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    if (i !== index) setIndex(i);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle} numberOfLines={1}>
          {sermon.number ? `#${sermon.number} · ` : ''}
          {sermon.title}
        </Text>
        <Pressable onPress={onExit} hitSlop={12}>
          <Text style={styles.close}>✕ Salir</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {sermon.points.map((item, i) => (
          <ScrollView key={item.id} style={{ width: pageWidth }} contentContainerStyle={styles.page}>
            <Text style={styles.pageBadge}>PUNTO {i + 1} / {total}</Text>
            {!!item.heading && <Text style={styles.pageHeading}>{item.heading}</Text>}
            <Text style={styles.pageBody}>{item.bodyMd}</Text>
          </ScrollView>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.navBtn} onPress={() => goTo(index - 1)} disabled={index === 0}>
          <Text style={[styles.navText, index === 0 && styles.navDisabled]}>‹ Anterior</Text>
        </Pressable>
        <View style={styles.progress}>
          <Text style={styles.progressText}>{index + 1} de {total}</Text>
          <View style={styles.dots}>
            {sermon.points.map((_, i) => (
              <Pressable key={i} onPress={() => goTo(i)}>
                <View style={[styles.dot, i === index && styles.dotActive]} />
              </Pressable>
            ))}
          </View>
        </View>
        <Pressable style={styles.navBtn} onPress={() => goTo(index + 1)} disabled={index >= total - 1}>
          <Text style={[styles.navText, index >= total - 1 && styles.navDisabled]}>Siguiente ›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#05070c' },
  topBar: {
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: { color: theme.textMuted, fontSize: 14, flex: 1, marginRight: 12 },
  close: { color: theme.accent, fontSize: 15, fontWeight: '700' },
  page: { paddingHorizontal: 28, paddingVertical: 24, gap: 18, flexGrow: 1, justifyContent: 'center' },
  pageBadge: { color: theme.accent, fontSize: 15, fontWeight: '800', letterSpacing: 2 },
  pageHeading: { color: '#fff', fontSize: 34, fontWeight: '800', lineHeight: 40 },
  pageBody: { color: '#e8ecf4', fontSize: 24, lineHeight: 36 },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#141c2b',
  },
  navBtn: { paddingVertical: 8, paddingHorizontal: 6, minWidth: 92 },
  navText: { color: theme.accent, fontSize: 16, fontWeight: '700' },
  navDisabled: { color: '#2a3547' },
  progress: { alignItems: 'center', gap: 8 },
  progressText: { color: theme.textMuted, fontSize: 13, fontWeight: '600' },
  dots: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 5, backgroundColor: '#2a3547' },
  dotActive: { backgroundColor: theme.accent, width: 22 },
});
