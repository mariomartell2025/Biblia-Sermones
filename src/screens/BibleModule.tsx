import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  FlatList,
  TextInput,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from '../useTheme';
import { useSettings } from '../SettingsContext';
import { Sermon } from '../types';
import { useResponsive } from '../useResponsive';
import { responsiveStyles } from '../responsiveStyles';
import VersionPicker from '../bible/VersionPicker';
import {
  BOOKS,
  VERSION,
  BookMeta,
  VerseHit,
  parseRef,
  suggestBooks,
  getVerseText,
  formatRef,
} from '../bible/data';
import { chapterOf, searchOf } from '../bible/query';
import { useFavorite, useLogChapterRead } from '../bible/useBible';
import { searchDictionary } from '../bible/dictionary';
import { theme } from '../theme';

type ConnectFn = (sermonId: string, v: { ref: string; text: string }) => void;

type View =
  | { name: 'books' }
  | { name: 'chapters'; book: number }
  | { name: 'verses'; book: number; chapter: number }
  | { name: 'reader'; book: number; chapter: number; target?: number }
  | { name: 'search' };

const LAST_KEY = 'bible:last';
const DEFAULT_POS = { book: 42, chapter: 1 }; // Juan 1 la primera vez

export default function BibleModule({ sermons, onConnectVerse, onSettings }: { sermons: Sermon[]; onConnectVerse: ConnectFn; onSettings?: () => void }) {
  const themeColors = useTheme();
  const settings = useSettings();

  // Arranca en el lector, en la última posición leída (o Juan 1 la 1a vez).
  const [view, setView] = useState<View | null>(null);
  const [pos, setPos] = useState(DEFAULT_POS); // última posición del lector

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: themeColors.bg },
    head: {
      backgroundColor: themeColors.header,
      paddingTop: 52,
      paddingBottom: 14,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    h1: { color: themeColors.text, fontSize: 28, fontWeight: '800' },
    versionChip: { borderWidth: 1, borderColor: themeColors.accent, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
    versionText: { color: themeColors.accent, fontWeight: '800', fontSize: 12 },
    subHead: {
      backgroundColor: themeColors.header,
      paddingTop: 52,
      paddingBottom: 14,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    back: { color: themeColors.accent, fontSize: 16, fontWeight: '600' },
    subTitle: { color: themeColors.text, fontSize: 17, fontWeight: '700' },
    searchIconBtn: { fontSize: 18 },
    searchBar: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      marginHorizontal: 16, marginTop: 14, marginBottom: 4,
      backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder,
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    },
    searchIcon: { fontSize: 14 },
    searchPlaceholder: { color: themeColors.textMuted, fontSize: 14 },
    sectionHeader: {
      color: themeColors.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 0.8,
      textTransform: 'uppercase', paddingHorizontal: 20, marginTop: 20, marginBottom: 10,
    },
    bookGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
    bookChip: {
      width: '31%', backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder,
      borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10, marginBottom: 2,
    },
    bookName: { color: themeColors.text, fontWeight: '700', fontSize: 14 },
    bookMeta: { color: themeColors.textMuted, fontSize: 11, marginTop: 2 },
    chapCell: {
      flex: 1, aspectRatio: 1, backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder,
      borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    },
    chapNum: { color: themeColors.text, fontSize: 17, fontWeight: '700' },
    readerBody: { padding: 20, paddingBottom: 8 },
    chapterTitle: { color: themeColors.text, fontSize: 24, fontWeight: '800', marginBottom: 14 },
    verseRow: { marginBottom: 6, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4, marginHorizontal: -6 } as any,
    verse: { color: themeColors.text, fontSize: settings.fontSize, lineHeight: settings.fontSize * 1.6 },
    verseNum: { color: themeColors.accent, fontSize: 12, fontWeight: '800' },
    verseHighlight: { backgroundColor: themeColors.bgElevated, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: themeColors.accent },
    readerHint: { color: themeColors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 16, opacity: 0.7 },
    readerFooter: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: 14, paddingBottom: 22, borderTopWidth: 1, borderTopColor: themeColors.cardBorder,
      backgroundColor: themeColors.bgElevated,
    },
    navBtn: { paddingVertical: 6, paddingHorizontal: 8, minWidth: 92 },
    navText: { color: themeColors.accent, fontWeight: '700', fontSize: 15 },
    footerRef: { color: themeColors.textMuted, fontSize: 12, fontWeight: '700' },
    searchInput: {
      backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder, borderRadius: 12,
      paddingHorizontal: 14, paddingVertical: 12, color: themeColors.text, fontSize: 16,
    },
    suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
    suggestChip: {
      backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder,
      borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8,
    },
    suggestText: { color: themeColors.text, fontWeight: '600', fontSize: 14 },
    refJump: {
      backgroundColor: themeColors.bgElevated, borderWidth: 1, borderColor: themeColors.accent, borderRadius: 12,
      padding: 14, marginBottom: 12,
    },
    refJumpText: { color: themeColors.accent, fontWeight: '800', fontSize: 15 },
    refPreview: { color: themeColors.text, fontSize: 14, lineHeight: 20, marginTop: 8, opacity: 0.9 },
    hit: {
      backgroundColor: themeColors.card, borderWidth: 1, borderColor: themeColors.cardBorder, borderRadius: 12,
      padding: 14, marginBottom: 10, gap: 4,
    },
    hitRef: { color: themeColors.accent, fontWeight: '800', fontSize: 13 },
    hitText: { color: themeColors.text, fontSize: 14, lineHeight: 20, opacity: 0.9 },
    noResults: { color: themeColors.textMuted, textAlign: 'center', marginTop: 30 },
    sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
    sheet: {
      backgroundColor: themeColors.bgElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20,
      padding: 20, paddingBottom: 34, borderTopWidth: 1, borderColor: themeColors.cardBorder,
    },
    sheetRef: { color: themeColors.accent, fontWeight: '800', fontSize: 15, marginBottom: 6 },
    sheetText: { color: themeColors.text, fontSize: 15, lineHeight: 22, marginBottom: 16 },
    sheetActions: { gap: 10 },
    sheetBtnPrimary: { backgroundColor: themeColors.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    sheetBtnPrimaryText: { color: themeColors.accentText, fontWeight: '800', fontSize: 15 },
    sheetBtnSecondary: { backgroundColor: themeColors.card, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: themeColors.cardBorder },
    sheetBtnSecondaryText: { color: themeColors.text, fontWeight: '800', fontSize: 15 },
  });

  useEffect(() => {
    AsyncStorage.getItem(LAST_KEY)
      .then((raw) => {
        const p = raw ? JSON.parse(raw) : DEFAULT_POS;
        setPos(p);
        setView({ name: 'reader', book: p.book, chapter: p.chapter });
      })
      .catch(() => setView({ name: 'reader', ...DEFAULT_POS }));
  }, []);

  // Abre el lector y recuerda la posición para la próxima vez.
  const openReader = (book: number, chapter: number, target?: number) => {
    setPos({ book, chapter });
    setView({ name: 'reader', book, chapter, target });
    AsyncStorage.setItem(LAST_KEY, JSON.stringify({ book, chapter })).catch(() => {});
  };

  if (!view) return <View style={styles.container} />;

  switch (view.name) {
    case 'chapters':
      return (
        <Chapters
          book={view.book}
          styles={styles}
          onBack={() => setView({ name: 'books' })}
          onPick={(chapter) => setView({ name: 'verses', book: view.book, chapter })}
        />
      );
    case 'verses':
      return (
        <VerseSelector
          book={view.book}
          chapter={view.chapter}
          styles={styles}
          onBack={() => setView({ name: 'chapters', book: view.book })}
          onSelectVerse={(verse) => openReader(view.book, view.chapter, verse)}
          onViewAll={() => openReader(view.book, view.chapter)}
        />
      );
    case 'reader':
      return (
        <Reader
          book={view.book}
          chapter={view.chapter}
          target={view.target}
          sermons={sermons}
          styles={styles}
          onConnectVerse={onConnectVerse}
          onBooks={() => setView({ name: 'books' })}
          onChapters={() => setView({ name: 'chapters', book: view.book })}
          onSearch={() => setView({ name: 'search' })}
          onSettings={onSettings}
          onChange={(book, chapter) => openReader(book, chapter)}
        />
      );
    case 'search':
      return (
        <Search
          styles={styles}
          onBack={() => setView({ name: 'reader', book: pos.book, chapter: pos.chapter })}
          onOpen={(book, chapter, verse) => openReader(book, chapter, verse)}
        />
      );
    default:
      return (
        <Books
          styles={styles}
          onSearch={() => setView({ name: 'search' })}
          onPick={(book) => setView({ name: 'chapters', book })}
          onBack={() => setView({ name: 'reader', book: pos.book, chapter: pos.chapter })}
        />
      );
  }
}

/* ---------- Libros ---------- */
function Books({ onPick, onSearch, onBack, styles }: { onPick: (b: number) => void; onSearch: () => void; onBack?: () => void; styles: any }) {
  const [versionId, setVersionId] = useState('rvr1909'); // versión activa (única disponible por ahora)
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const notify = (m: string) => (typeof alert === 'function' ? alert(m) : null);

  const sections = useMemo(() => {
    const at = BOOKS.filter((b) => b.testament === 'AT');
    const nt = BOOKS.filter((b) => b.testament === 'NT');
    return [
      { title: 'Antiguo Testamento', data: at },
      { title: 'Nuevo Testamento', data: nt },
    ];
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          {onBack && <Pressable onPress={onBack} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable>}
          <Text style={styles.h1}>Biblia</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Pressable onPress={() => setIsListView(!isListView)} style={styles.versionChip}>
            <Text style={styles.versionText}>{isListView ? '■■' : '⊞⊞'}</Text>
          </Pressable>
          <Pressable style={styles.versionChip} onPress={() => setPickerOpen(true)}>
            <Text style={styles.versionText}>{VERSION.abbr}  ▾</Text>
          </Pressable>
        </View>
      </View>
      <VersionPicker
        visible={pickerOpen}
        currentId={versionId}
        onClose={() => setPickerOpen(false)}
        onPick={(v) => { setVersionId(v.id); setPickerOpen(false); }}
        onLocked={(v) => notify(`${v.name} estará disponible con la suscripción. Estamos gestionando la licencia.`)}
      />
      <Pressable style={styles.searchBar} onPress={onSearch}>
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Buscar versículo o referencia (Juan 3:16)</Text>
      </Pressable>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {sections.map((sec) => (
          <View key={sec.title}>
            <Text style={styles.sectionHeader}>{sec.title}</Text>
            {isListView ? (
              <View style={{ paddingHorizontal: 12 }}>
                {sec.data.map((b) => (
                  <Pressable
                    key={b.i}
                    style={[styles.bookChip, { width: '100%', marginBottom: 8 }]}
                    onPress={() => onPick(b.i)}
                  >
                    <Text style={styles.bookName}>{b.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.bookGrid}>
                {sec.data.map((b) => (
                  <Pressable key={b.i} style={styles.bookChip} onPress={() => onPick(b.i)}>
                    <Text style={styles.bookName} numberOfLines={1}>{b.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------- Capítulos ---------- */
function Chapters({ book, onBack, onPick, styles }: { book: number; onBack: () => void; onPick: (c: number) => void; styles: any }) {
  const b: BookMeta = BOOKS[book];
  const nums = Array.from({ length: b.chapters }, (_, i) => i + 1);
  return (
    <View style={styles.container}>
      <View style={styles.subHead}>
        <Pressable onPress={onBack} hitSlop={12}><Text style={styles.back}>‹ Biblia</Text></Pressable>
        <Text style={styles.subTitle}>{b.name}</Text>
        <View style={{ width: 60 }} />
      </View>
      <FlatList
        data={nums}
        keyExtractor={(n) => String(n)}
        numColumns={5}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <Pressable style={styles.chapCell} onPress={() => onPick(item)}>
            <Text style={styles.chapNum}>{item}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

/* ---------- Lector ---------- */
function Reader({
  book,
  chapter,
  target,
  sermons,
  styles,
  onConnectVerse,
  onBooks,
  onChapters,
  onSearch,
  onSettings,
  onChange,
}: {
  book: number;
  chapter: number;
  target?: number;
  sermons: Sermon[];
  styles: any;
  onConnectVerse: ConnectFn;
  onBooks: () => void;
  onChapters: () => void;
  onSearch: () => void;
  onSettings?: () => void;
  onChange: (book: number, chapter: number) => void;
}) {
  const themeColors = useTheme();
  const b = BOOKS[book];
  const responsive = useResponsive();
  const rStyles = responsiveStyles(responsive);
  const [verses, setVerses] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    chapterOf(book, chapter).then(v => { if (alive) setVerses(v); });
    return () => { alive = false; };
  }, [book, chapter]);

  useEffect(() => {
    // Depende también de `verses`: si el capítulo es nuevo, los versículos (y sus
    // refs) aún no existen cuando `target` cambia, así que sin esto el scroll
    // no se dispara nunca al abrir un resultado de búsqueda en otro capítulo.
    if (target && scrollRef.current && verseRefs.current[target]) {
      setTimeout(() => {
        verseRefs.current[target]?.measure((x, y, width, height, pageX, pageY) => {
          scrollRef.current?.scrollTo({ y: Math.max(0, pageY - 100), animated: true });
        });
      }, 150);
    }
  }, [target, verses]);

  useLogChapterRead(book, chapter);
  const scrollRef = useRef<ScrollView>(null);
  const verseRefs = useRef<{ [key: number]: any }>({});
  const [selected, setSelected] = useState<number | null>(null); // versículo con menú abierto
  const [tapped, setTapped] = useState<number | null>(null); // versículo resaltado con un toque

  useEffect(() => {
    setTapped(null);
    setSelected(null);
  }, [book, chapter]);

  const [versionId, setVersionId] = useState('rvr1909');
  const [pickerOpen, setPickerOpen] = useState(false);

  const prev = () => {
    if (chapter > 1) onChange(book, chapter - 1);
    else if (book > 0) onChange(book - 1, BOOKS[book - 1].chapters);
  };
  const next = () => {
    if (chapter < b.chapters) onChange(book, chapter + 1);
    else if (book < BOOKS.length - 1) onChange(book + 1, 1);
  };

  const selVerse =
    selected != null
      ? { ref: formatRef(book, chapter, selected), text: verses[selected - 1] }
      : null;

  // Deslizar horizontalmente cambia de capítulo; solo se activa cuando el
  // movimiento es claramente horizontal para no interferir con el scroll vertical.
  // navRef evita que el PanResponder (creado una sola vez) quede con next/prev
  // obsoletos de un capítulo anterior.
  const navRef = useRef({ next, prev });
  useEffect(() => { navRef.current = { next, prev }; });
  const swipeX = useRef(new Animated.Value(0)).current;
  const swipe = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 24 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
      onPanResponderMove: (_, g) => swipeX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dx < -60) navRef.current.next();
        else if (g.dx > 60) navRef.current.prev();
        Animated.timing(swipeX, { toValue: 0, duration: 180, useNativeDriver: true }).start();
      },
      onPanResponderTerminate: () => {
        Animated.timing(swipeX, { toValue: 0, duration: 180, useNativeDriver: true }).start();
      },
    })
  ).current;
  const prevTrailOpacity = swipeX.interpolate({ inputRange: [0, 90], outputRange: [0, 0.9], extrapolate: 'clamp' });
  const nextTrailOpacity = swipeX.interpolate({ inputRange: [-90, 0], outputRange: [0.9, 0], extrapolate: 'clamp' });

  return (
    <View style={styles.container} {...swipe.panHandlers}>
      {/* Rastro sutil que aparece mientras se desliza para cambiar de capítulo */}
      <Animated.View
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, zIndex: 5, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 8, opacity: prevTrailOpacity }}
      >
        <Ionicons name="chevron-back" size={30} color={themeColors.accent} />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, zIndex: 5, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 8, opacity: nextTrailOpacity }}
      >
        <Ionicons name="chevron-forward" size={30} color={themeColors.accent} />
      </Animated.View>
      <View style={styles.subHead}>
        <Pressable onPress={onBooks} hitSlop={12} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="chevron-back" size={22} color={themeColors.accent} />
          <Text style={[styles.back, { fontSize: 18, fontWeight: '800' }]}>Libros</Text>
        </Pressable>
        <Pressable onPress={onChapters} hitSlop={12}><Text style={styles.subTitle}>{b.name} {chapter}</Text></Pressable>
        <Pressable
          style={[styles.versionChip, { borderRadius: 6, marginLeft: 6 }]}
          onPress={() => setPickerOpen(true)}
        >
          <Text style={styles.versionText}>{VERSION.abbr}</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable onPress={onSearch} hitSlop={12}><Ionicons name="search" size={20} color={themeColors.accent} /></Pressable>
        <Pressable onPress={onSettings} hitSlop={12} style={{ marginLeft: 12 }}><Ionicons name="settings-outline" size={20} color={themeColors.accent} /></Pressable>
      </View>
      <VersionPicker
        visible={pickerOpen}
        currentId={versionId}
        onClose={() => setPickerOpen(false)}
        onPick={(v) => { setVersionId(v.id); setPickerOpen(false); }}
        onLocked={(v) => (typeof alert === 'function' ? alert(`${v.name} estará disponible con la suscripción. Estamos gestionando la licencia.`) : null)}
      />
      <ScrollView ref={scrollRef} contentContainerStyle={[styles.readerBody, rStyles.scrollContent]}>
        <Text style={styles.chapterTitle}>{b.name} {chapter}</Text>
        {verses.map((v, i) => {
          const n = i + 1;
          const active = target === n || selected === n || tapped === n;
          return (
            <Pressable
              key={n}
              ref={(ref) => { if (ref) verseRefs.current[n] = ref; }}
              onPress={() => setTapped((prev) => (prev === n ? null : n))}
              onLongPress={() => setSelected(n)}
              delayLongPress={280}
              style={[styles.verseRow, active && styles.verseHighlight]}
            >
              <Text style={styles.verse}>
                <Text style={styles.verseNum}>{n} </Text>
                {v}
              </Text>
            </Pressable>
          );
        })}
        <Text style={styles.readerHint}>Mantén presionado un versículo para conectarlo a un sermón. Desliza a los lados para cambiar de capítulo.</Text>
        <View style={{ height: 20 }} />
      </ScrollView>

      <VerseActions
        verse={selVerse}
        sermons={sermons}
        styles={styles}
        onConnect={(id) => { if (selVerse) onConnectVerse(id, selVerse); setSelected(null); }}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

/* ---------- Menú de acciones del versículo (mantener presionado) ---------- */
function VerseActions({
  verse,
  sermons,
  styles,
  onConnect,
  onClose,
}: {
  verse: { ref: string; text: string } | null;
  sermons: Sermon[];
  styles: any;
  onConnect: (sermonId: string) => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'menu' | 'pick'>('menu');
  const [done, setDone] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);

  const close = () => { setMode('menu'); setDone(null); onClose(); };
  const copy = async () => {
    if (verse) await Clipboard.setStringAsync(`${verse.text} (${verse.ref})`);
    close();
  };
  const toggleFav = async () => {
    setIsFav(!isFav);
    // La sincronización con BD ocurre en background (sin bloquear UI)
  };
  const connect = (id: string, title: string) => {
    onConnect(id);
    setDone(title);
    setTimeout(close, 1100);
  };

  return (
    <Modal visible={!!verse} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.sheetBackdrop} onPress={close}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {!!verse && (
            <>
              <Text style={styles.sheetRef}>{verse.ref}</Text>
              <Text style={styles.sheetText} numberOfLines={4}>{verse.text}</Text>

              {done ? (
                <Text style={styles.sheetDone}>✓ Conectado a “{done}”</Text>
              ) : mode === 'menu' ? (
                <View style={styles.sheetActions}>
                  <Pressable style={styles.sheetBtnPrimary} onPress={() => (sermons.length ? setMode('pick') : null)}>
                    <Text style={styles.sheetBtnPrimaryText}>🔗  Conectar a un sermón</Text>
                  </Pressable>
                  <Pressable style={styles.sheetBtn} onPress={toggleFav}>
                    <Text style={styles.sheetBtnText}>{isFav ? '⭐ ' : '☆ '}Marcar favorito</Text>
                  </Pressable>
                  <Pressable style={styles.sheetBtn} onPress={copy}>
                    <Text style={styles.sheetBtnText}>📋 Copiar versículo</Text>
                  </Pressable>
                  <Pressable style={styles.sheetBtn} onPress={close}>
                    <Text style={styles.sheetBtnMuted}>Cancelar</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.sheetActions}>
                  <Text style={styles.sheetPickLabel}>Conectar a:</Text>
                  {sermons.map((s) => (
                    <Pressable key={s.id} style={styles.sheetBtn} onPress={() => connect(s.id, s.title)}>
                      <Text style={styles.sheetBtnText}>{s.number ? `#${s.number} · ` : ''}{s.title}</Text>
                    </Pressable>
                  ))}
                  <Pressable style={styles.sheetBtn} onPress={() => setMode('menu')}>
                    <Text style={styles.sheetBtnMuted}>‹ Volver</Text>
                  </Pressable>
                </View>
              )}
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* ---------- Selector de Versículos ---------- */
function VerseSelector({
  book,
  chapter,
  styles,
  onBack,
  onSelectVerse,
  onViewAll,
}: {
  book: number;
  chapter: number;
  styles: any;
  onBack: () => void;
  onSelectVerse: (verse: number) => void;
  onViewAll: () => void;
}) {
  const b = BOOKS[book];
  const [verses, setVerses] = React.useState<string[]>([]);

  React.useEffect(() => {
    chapterOf(book, chapter).then(setVerses);
  }, [book, chapter]);

  return (
    <View style={styles.container}>
      <View style={styles.subHead}>
        <Pressable onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ {b.name} {chapter}</Text>
        </Pressable>
      </View>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={[styles.chapterTitle, { marginBottom: 20 }]}>Selecciona un versículo</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {verses.map((_, i) => (
            <Pressable
              key={i + 1}
              style={[styles.suggestChip, { paddingVertical: 10, minWidth: 50 }]}
              onPress={() => onSelectVerse(i + 1)}
            >
              <Text style={styles.suggestText}>{i + 1}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={[styles.refJump, { marginTop: 20 }]}
          onPress={onViewAll}
        >
          <Text style={styles.refJumpText}>📖 Ver todo el capítulo</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* ---------- Búsqueda ---------- */
function Search({
  onBack,
  onOpen,
  styles,
}: {
  onBack: () => void;
  onOpen: (book: number, chapter: number, verse?: number) => void;
  styles: any;
}) {
  const themeColors = useTheme();
  const responsive = useResponsive();
  const rStyles = responsiveStyles(responsive);
  const settings = useSettings();
  const lang = settings.language as 'es' | 'en';
  const [q, setQ] = useState('');
  const ref = parseRef(q);
  const hasDigit = /\d/.test(q);
  // Autocompletar libros solo mientras se escribe el nombre (sin números aún).
  const books = useMemo(() => (q.trim() && !hasDigit ? suggestBooks(q) : []), [q, hasDigit]);
  // Vista previa del versículo referenciado.
  const preview = ref && ref.verse ? getVerseText(ref.book, ref.chapter, ref.verse) : null;
  const [hits, setHits] = useState<VerseHit[]>([]);
  const dictionaryResults = useMemo(() => (q.trim().length >= 3 ? searchDictionary(q, lang) : []), [q, lang]);
  const [expandedWord, setExpandedWord] = useState<string | null>(null);

  useEffect(() => {
    if (q.trim().length < 3) { setHits([]); return; }
    let alive = true;
    searchOf(q).then(r => { if (alive) setHits(r); });
    return () => { alive = false; };
  }, [q]);

  return (
    <View style={styles.container}>
      <View style={styles.subHead}>
        <Pressable onPress={onBack} hitSlop={12}><Text style={styles.back}>‹ Biblia</Text></Pressable>
        <Text style={styles.subTitle}>Buscar</Text>
        <View style={{ width: 60 }} />
      </View>
      <View style={[rStyles.scrollContent, { paddingBottom: 8 }]}>
        <TextInput
          style={styles.searchInput}
          value={q}
          onChangeText={setQ}
          autoFocus
          placeholder="Palabra o referencia (ej. gracia, Juan 3:16)"
          placeholderTextColor={theme.textMuted}
        />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[rStyles.scrollContent, { paddingBottom: 24 }]}>
        {/* Autocompletar libros: toca para completar la referencia */}
        {books.length > 0 && (
          <View style={styles.suggestRow}>
            {books.map((b) => (
              <Pressable key={b.i} style={styles.suggestChip} onPress={() => setQ(`${b.name} `)}>
                <Text style={styles.suggestText}>{b.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Referencia resuelta + vista previa predictiva del versículo */}
        {ref && (
          <Pressable style={styles.refJump} onPress={() => onOpen(ref.book, ref.chapter, ref.verse)}>
            <Text style={styles.refJumpText}>
              Ir a {BOOKS[ref.book].name} {ref.chapter}{ref.verse ? `:${ref.verse}` : ''} ›
            </Text>
            {!!preview && <Text style={styles.refPreview} numberOfLines={3}>{preview}</Text>}
          </Pressable>
        )}

        {/* Resultados del diccionario */}
        {dictionaryResults.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Ionicons name="book-outline" size={14} color={themeColors.textMuted} />
              <Text style={[styles.sectionHeader, { paddingLeft: 0, marginBottom: 0 }]}>
                {lang === 'es' ? 'Palabras Bíblicas' : 'Biblical Words'}
              </Text>
            </View>
            {dictionaryResults.map((entry, k) => {
              const isExpanded = expandedWord === entry.word;
              return (
                <Pressable
                  key={k}
                  style={[styles.hit, { marginBottom: 12 }]}
                  onPress={() => setExpandedWord(isExpanded ? null : entry.word)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.hitRef}>{entry.word}</Text>
                    {!!entry.origin && (
                      <View style={{ backgroundColor: themeColors.bgElevated, borderWidth: 1, borderColor: themeColors.cardBorder, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ color: themeColors.accent, fontSize: 10, fontWeight: '800' }}>{entry.origin[lang]}</Text>
                      </View>
                    )}
                    {!!entry.breakdown && (
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={themeColors.textMuted}
                        style={{ marginLeft: 'auto' }}
                      />
                    )}
                  </View>
                  <Text style={styles.hitText}>{entry.definition[lang]}</Text>
                  {isExpanded && !!entry.breakdown && (
                    <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: themeColors.cardBorder }}>
                      <Text style={{ color: themeColors.accent, fontSize: 11, fontWeight: '800', marginBottom: 4 }}>
                        {lang === 'es' ? 'PALABRA COMPUESTA' : 'COMPOUND WORD'}
                      </Text>
                      <Text style={[styles.hitText, { fontStyle: 'italic' }]}>{entry.breakdown[lang]}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Resultados de versículos */}
        {hits.map((h, k) => (
          <Pressable key={k} style={styles.hit} onPress={() => onOpen(h.book, h.chapter, h.verse)}>
            <Text style={styles.hitRef}>{h.abbr} {h.chapter}:{h.verse}</Text>
            <Text style={styles.hitText} numberOfLines={2}>{h.text}</Text>
          </Pressable>
        ))}

        {q.trim().length >= 3 && hits.length === 0 && dictionaryResults.length === 0 && !ref && books.length === 0 && (
          <Text style={styles.noResults}>Sin resultados para “{q}”.</Text>
        )}
      </ScrollView>
    </View>
  );
}

