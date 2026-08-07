import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator,
  useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Devotional } from '../types';
import { loadDevotionals, saveDevotionals, generateDevotional } from '../devocional/generate';

const KIND_LABEL: Record<string, string> = {
  pensamiento: '💭 Pensamiento',
  reflexion: '🔎 Reflexión',
  aplicacion: '🌱 Para hoy',
  oracion: '🙏 Oración',
};

export default function DevocionalScreen() {
  const [items, setItems] = useState<Devotional[] | null>(null);
  const [selId, setSelId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [reading, setReading] = useState(false);

  useEffect(() => {
    loadDevotionals().then((list) => { setItems(list); setSelId(list[0]?.id ?? null); });
  }, []);

  const notify = (m: string) => (typeof alert === 'function' ? alert(m) : Alert.alert('Devocional', m));
  const sel = useMemo(() => items?.find((d) => d.id === selId) || items?.[0], [items, selId]);

  const onGenerate = async () => {
    if (!items) return;
    try {
      setGenerating(true);
      const d = await generateDevotional(undefined, items);
      const next = [d, ...items];
      setItems(next); setSelId(d.id); saveDevotionals(next);
      notify(d.source === 'ia' ? 'Devocional generado con IA.' : 'Nuevo devocional (repertorio). Conecta tu backend para generarlos con IA.');
    } catch (e: any) {
      notify(`No se pudo generar: ${e?.message || e}`);
    } finally { setGenerating(false); }
  };

  if (!items || !sel) {
    return <View style={[styles.container, styles.center]}><ActivityIndicator color={theme.accent} /></View>;
  }
  if (reading) return <Reader devotional={sel} onExit={() => setReading(false)} />;

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.h1}>Devocional</Text>
        <Pressable style={[styles.genBtn, generating && { opacity: 0.6 }]} onPress={onGenerate} disabled={generating}>
          {generating ? (
            <Text style={styles.genBtnText}>…</Text>
          ) : (
            <>
              <Ionicons name="add" size={16} color={theme.accentText} />
              <Text style={styles.genBtnText}>Generar</Text>
            </>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.pad}>
          <Text style={styles.title}>{sel.title}</Text>
          <View style={styles.keyVerse}>
            <Text style={styles.keyVerseRef}>✝  {sel.keyVerse.ref}</Text>
            <Text style={styles.keyVerseText}>{sel.keyVerse.text}</Text>
          </View>
        </View>

        <Carousel devotional={sel} />

        <View style={styles.pad}>
          <Pressable style={styles.readBtn} onPress={() => setReading(true)}>
            <Text style={styles.readBtnText}>▶  Modo lectura</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Anteriores</Text>
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {items.map((d) => (
            <Pressable key={d.id} style={[styles.histCard, d.id === sel.id && styles.histCardOn]} onPress={() => setSelId(d.id)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.histTitle} numberOfLines={1}>{d.title}</Text>
                <Text style={styles.histMeta}>{d.date} · {d.keyVerse.ref}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* Carrusel horizontal de puntos con dots */
function Carousel({ devotional }: { devotional: Devotional }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width, 640) - 32;
  const [index, setIndex] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (cardWidth + 12));
    if (i !== index) setIndex(i);
  };
  return (
    <View>
      <View style={styles.rowlbl}>
        <Text style={styles.sectionLabel2}>Puntos</Text>
        <Text style={styles.counter}>{index + 1} de {devotional.points.length}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={cardWidth + 12}
        decelerationRate="fast" onScroll={onScroll} scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {devotional.points.map((p) => (
          <View key={p.id} style={[styles.point, { width: cardWidth }]}>
            <Text style={styles.pointKind}>{KIND_LABEL[p.kind] || p.kind}</Text>
            {!!p.heading && <Text style={styles.pointHeading}>{p.heading}</Text>}
            <Text style={styles.pointBody}>{p.body}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {devotional.points.map((_, i) => <View key={i} style={[styles.dot, i === index && styles.dotOn]} />)}
      </View>
    </View>
  );
}

/* Modo lectura a pantalla completa */
function Reader({ devotional, onExit }: { devotional: Devotional; onExit: () => void }) {
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width, 900);
  const pagerRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const total = devotional.points.length;
  const suppress = useRef(false);
  const goTo = (i: number) => {
    const c = Math.max(0, Math.min(total - 1, i));
    suppress.current = true;
    const node: any = (pagerRef.current as any)?.getScrollableNode?.();
    if (node && typeof node.scrollLeft === 'number') node.scrollLeft = c * pageWidth;
    else pagerRef.current?.scrollTo({ x: c * pageWidth, animated: true });
    setIndex(c); setTimeout(() => { suppress.current = false; }, 300);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (suppress.current) return;
    const i = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    if (i !== index) setIndex(i);
  };
  return (
    <View style={styles.readerRoot}>
      <View style={styles.readerTop}>
        <Text style={styles.readerTitle} numberOfLines={1}>{devotional.title}</Text>
        <Pressable onPress={onExit} hitSlop={12}><Text style={styles.close}>✕ Salir</Text></Pressable>
      </View>
      <ScrollView ref={pagerRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={onScroll} scrollEventThrottle={16} style={{ flex: 1 }}>
        {devotional.points.map((p) => (
          <ScrollView key={p.id} style={{ width: pageWidth }} contentContainerStyle={styles.readerPage}>
            <Text style={styles.readerKind}>{KIND_LABEL[p.kind] || p.kind}</Text>
            {!!p.heading && <Text style={styles.readerHeading}>{p.heading}</Text>}
            <Text style={styles.readerBody}>{p.body}</Text>
          </ScrollView>
        ))}
      </ScrollView>
      <View style={styles.readerBottom}>
        <Pressable style={styles.nav} onPress={() => goTo(index - 1)}><Text style={[styles.navText, index === 0 && styles.navOff]}>‹ Anterior</Text></Pressable>
        <Text style={styles.progress}>{index + 1} de {total}</Text>
        <Pressable style={styles.nav} onPress={() => goTo(index + 1)}><Text style={[styles.navText, index >= total - 1 && styles.navOff]}>Siguiente ›</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  head: { backgroundColor: theme.header, paddingTop: 52, paddingBottom: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h1: { color: theme.text, fontSize: 28, fontWeight: '800' },
  genBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: theme.accent, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 },
  genBtnText: { color: theme.accentText, fontWeight: '800', fontSize: 14 },
  pad: { padding: 16 },
  title: { color: theme.text, fontSize: 25, fontWeight: '800', letterSpacing: -0.5 },
  keyVerse: { backgroundColor: '#1a2740', borderLeftWidth: 3, borderLeftColor: theme.accent, borderRadius: 10, padding: 14, marginTop: 12 },
  keyVerseRef: { color: theme.accent, fontWeight: '800', fontSize: 14, marginBottom: 6 },
  keyVerseText: { color: theme.text, fontSize: 15, lineHeight: 22, fontStyle: 'italic' },
  rowlbl: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 4, marginBottom: 10 },
  sectionLabel2: { color: theme.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  counter: { color: theme.accent, fontSize: 13, fontWeight: '800' },
  point: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: theme.radius, padding: 18, minHeight: 200, gap: 8 },
  pointKind: { color: theme.accent, fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  pointHeading: { color: theme.text, fontSize: 19, fontWeight: '700' },
  pointBody: { color: theme.text, fontSize: 15, lineHeight: 24, opacity: 0.92 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 14 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.cardBorder },
  dotOn: { backgroundColor: theme.accent, width: 20 },
  readBtn: { backgroundColor: theme.accent, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  readBtnText: { color: theme.accentText, fontWeight: '800', fontSize: 16 },
  sectionLabel: { color: theme.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', paddingHorizontal: 20, marginTop: 18, marginBottom: 10 },
  histCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 12, padding: 14 },
  histCardOn: { borderColor: theme.accent },
  histTitle: { color: theme.text, fontWeight: '700', fontSize: 15 },
  histMeta: { color: theme.textMuted, fontSize: 12, marginTop: 2 },

  readerRoot: { flex: 1, backgroundColor: '#05070c' },
  readerTop: { paddingTop: 50, paddingBottom: 12, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readerTitle: { color: theme.textMuted, fontSize: 14, flex: 1, marginRight: 12 },
  close: { color: theme.accent, fontWeight: '700', fontSize: 15 },
  readerPage: { paddingHorizontal: 26, paddingVertical: 24, gap: 16, flexGrow: 1, justifyContent: 'center' },
  readerKind: { color: theme.accent, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  readerHeading: { color: '#fff', fontSize: 30, fontWeight: '800', lineHeight: 38 },
  readerBody: { color: '#e8ecf4', fontSize: 21, lineHeight: 33 },
  readerBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 28, borderTopWidth: 1, borderTopColor: '#141c2b' },
  nav: { minWidth: 92 },
  navText: { color: theme.accent, fontWeight: '700', fontSize: 15 },
  navOff: { color: '#2a3547' },
  progress: { color: theme.textMuted, fontSize: 13, fontWeight: '600' },
});
