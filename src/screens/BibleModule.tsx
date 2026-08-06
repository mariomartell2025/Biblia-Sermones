import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../theme';
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

type ConnectFn = (sermonId: string, v: { ref: string; text: string }) => void;

type View =
  | { name: 'books' }
  | { name: 'chapters'; book: number }
  | { name: 'reader'; book: number; chapter: number; target?: number }
  | { name: 'search' };

const LAST_KEY = 'bible:last';
const DEFAULT_POS = { book: 42, chapter: 1 }; // Juan 1 la primera vez

export default function BibleModule({ sermons, onConnectVerse }: { sermons: Sermon[]; onConnectVerse: ConnectFn }) {
  // Arranca en el lector, en la última posición leída (o Juan 1 la 1a vez).
  const [view, setView] = useState<View | null>(null);
  const [pos, setPos] = useState(DEFAULT_POS); // última posición del lector

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
          onBack={() => setView({ name: 'books' })}
          onPick={(chapter) => openReader(view.book, chapter)}
        />
      );
    case 'reader':
      return (
        <Reader
          book={view.book}
          chapter={view.chapter}
          target={view.target}
          sermons={sermons}
          onConnectVerse={onConnectVerse}
          onBooks={() => setView({ name: 'books' })}
          onChapters={() => setView({ name: 'chapters', book: view.book })}
          onSearch={() => setView({ name: 'search' })}
          onChange={(book, chapter) => openReader(book, chapter)}
        />
      );
    case 'search':
      return (
        <Search
          onBack={() => setView({ name: 'reader', book: pos.book, chapter: pos.chapter })}
          onOpen={(book, chapter, verse) => openReader(book, chapter, verse)}
        />
      );
    default:
      return (
        <Books
          onSearch={() => setView({ name: 'search' })}
          onPick={(book) => setView({ name: 'chapters', book })}
        />
      );
  }
}

/* ---------- Libros ---------- */
function Books({ onPick, onSearch }: { onPick: (b: number) => void; onSearch: () => void }) {
  const [versionId, setVersionId] = useState('rvr1909'); // versión activa (única disponible por ahora)
  const [pickerOpen, setPickerOpen] = useState(false);
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
        <Text style={styles.h1}>Biblia</Text>
        <Pressable style={styles.versionChip} onPress={() => setPickerOpen(true)}>
          <Text style={styles.versionText}>{VERSION.abbr}  ▾</Text>
        </Pressable>
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
            <View style={styles.bookGrid}>
              {sec.data.map((b) => (
                <Pressable key={b.i} style={styles.bookChip} onPress={() => onPick(b.i)}>
                  <Text style={styles.bookName} numberOfLines={1}>{b.name}</Text>
                  <Text style={styles.bookMeta}>{b.chapters} cap.</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---------- Capítulos ---------- */
function Chapters({ book, onBack, onPick }: { book: number; onBack: () => void; onPick: (c: number) => void }) {
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
  onConnectVerse,
  onBooks,
  onChapters,
  onSearch,
  onChange,
}: {
  book: number;
  chapter: number;
  target?: number;
  sermons: Sermon[];
  onConnectVerse: ConnectFn;
  onBooks: () => void;
  onChapters: () => void;
  onSearch: () => void;
  onChange: (book: number, chapter: number) => void;
}) {
  const b = BOOKS[book];
  const responsive = useResponsive();
  const rStyles = responsiveStyles(responsive);
  const [verses, setVerses] = useState<string[]>([]);
  useEffect(() => {
    let alive = true;
    chapterOf(book, chapter).then(v => { if (alive) setVerses(v); });
    return () => { alive = false; };
  }, [book, chapter]);
  useLogChapterRead(book, chapter);
  const scrollRef = useRef<ScrollView>(null);
  const [selected, setSelected] = useState<number | null>(null); // versículo con menú abierto

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

  return (
    <View style={styles.container}>
      <View style={styles.subHead}>
        <Pressable onPress={onBooks} hitSlop={12}><Text style={styles.back}>☰ Libros</Text></Pressable>
        <Pressable onPress={onChapters} hitSlop={12}><Text style={styles.subTitle}>{b.name} {chapter}  ▾</Text></Pressable>
        <Pressable onPress={onSearch} hitSlop={12}><Text style={styles.searchIconBtn}>🔍</Text></Pressable>
      </View>
      <ScrollView ref={scrollRef} contentContainerStyle={[styles.readerBody, rStyles.scrollContent]}>
        <Text style={styles.chapterTitle}>{b.name} {chapter}</Text>
        {verses.map((v, i) => {
          const n = i + 1;
          const active = target === n || selected === n;
          return (
            <Pressable
              key={n}
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
        <Text style={styles.readerHint}>Mantén presionado un versículo para conectarlo a un sermón.</Text>
        <View style={{ height: 20 }} />
      </ScrollView>
      <View style={styles.readerFooter}>
        <Pressable style={styles.navBtn} onPress={prev}>
          <Text style={styles.navText}>‹ Anterior</Text>
        </Pressable>
        <Text style={styles.footerRef}>{VERSION.abbr}</Text>
        <Pressable style={styles.navBtn} onPress={next}>
          <Text style={styles.navText}>Siguiente ›</Text>
        </Pressable>
      </View>

      <VerseActions
        verse={selVerse}
        sermons={sermons}
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
  onConnect,
  onClose,
}: {
  verse: { ref: string; text: string } | null;
  sermons: Sermon[];
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

/* ---------- Búsqueda ---------- */
function Search({
  onBack,
  onOpen,
}: {
  onBack: () => void;
  onOpen: (book: number, chapter: number, verse?: number) => void;
}) {
  const responsive = useResponsive();
  const rStyles = responsiveStyles(responsive);
  const [q, setQ] = useState('');
  const ref = parseRef(q);
  const hasDigit = /\d/.test(q);
  // Autocompletar libros solo mientras se escribe el nombre (sin números aún).
  const books = useMemo(() => (q.trim() && !hasDigit ? suggestBooks(q) : []), [q, hasDigit]);
  // Vista previa del versículo referenciado.
  const preview = ref && ref.verse ? getVerseText(ref.book, ref.chapter, ref.verse) : null;
  const [hits, setHits] = useState<VerseHit[]>([]);
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

        {hits.map((h, k) => (
          <Pressable key={k} style={styles.hit} onPress={() => onOpen(h.book, h.chapter, h.verse)}>
            <Text style={styles.hitRef}>{h.abbr} {h.chapter}:{h.verse}</Text>
            <Text style={styles.hitText} numberOfLines={2}>{h.text}</Text>
          </Pressable>
        ))}

        {q.trim().length >= 3 && hits.length === 0 && !ref && books.length === 0 && (
          <Text style={styles.noResults}>Sin resultados para “{q}”.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  head: {
    backgroundColor: theme.header,
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  h1: { color: theme.text, fontSize: 28, fontWeight: '800' },
  versionChip: { borderWidth: 1, borderColor: theme.accent, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  versionText: { color: theme.accent, fontWeight: '800', fontSize: 12 },
  subHead: {
    backgroundColor: theme.header,
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { color: theme.accent, fontSize: 16, fontWeight: '600' },
  subTitle: { color: theme.text, fontSize: 17, fontWeight: '700' },
  searchIconBtn: { fontSize: 18 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
  },
  searchIcon: { fontSize: 14 },
  searchPlaceholder: { color: theme.textMuted, fontSize: 14 },
  sectionHeader: {
    color: theme.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 0.8,
    textTransform: 'uppercase', paddingHorizontal: 20, marginTop: 20, marginBottom: 10,
  },
  bookGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  bookChip: {
    width: '31%', backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder,
    borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10, marginBottom: 2,
  },
  bookName: { color: theme.text, fontWeight: '700', fontSize: 14 },
  bookMeta: { color: theme.textMuted, fontSize: 11, marginTop: 2 },
  chapCell: {
    flex: 1, aspectRatio: 1, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  chapNum: { color: theme.text, fontSize: 17, fontWeight: '700' },
  readerBody: { padding: 20, paddingBottom: 8 },
  chapterTitle: { color: theme.text, fontSize: 24, fontWeight: '800', marginBottom: 14 },
  verseRow: { marginBottom: 6, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 4, marginHorizontal: -6 } as any,
  verse: { color: theme.text, fontSize: 17, lineHeight: 28 },
  verseNum: { color: theme.accent, fontSize: 12, fontWeight: '800' },
  verseHighlight: { backgroundColor: '#22304d' },
  readerHint: { color: theme.textMuted, fontSize: 12, textAlign: 'center', marginTop: 16, opacity: 0.7 },
  readerFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 14, paddingBottom: 22, borderTopWidth: 1, borderTopColor: theme.cardBorder,
    backgroundColor: theme.bgElevated,
  },
  navBtn: { paddingVertical: 6, paddingHorizontal: 8, minWidth: 92 },
  navText: { color: theme.accent, fontWeight: '700', fontSize: 15 },
  footerRef: { color: theme.textMuted, fontSize: 12, fontWeight: '700' },
  searchInput: {
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, color: theme.text, fontSize: 16,
  },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  suggestChip: {
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder,
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8,
  },
  suggestText: { color: theme.text, fontWeight: '600', fontSize: 14 },
  refJump: {
    backgroundColor: '#1a2740', borderWidth: 1, borderColor: theme.accent, borderRadius: 12,
    padding: 14, marginBottom: 12,
  },
  refJumpText: { color: theme.accent, fontWeight: '800', fontSize: 15 },
  refPreview: { color: theme.text, fontSize: 14, lineHeight: 20, marginTop: 8, opacity: 0.9 },
  hit: {
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 12,
    padding: 14, marginBottom: 10, gap: 4,
  },
  hitRef: { color: theme.accent, fontWeight: '800', fontSize: 13 },
  hitText: { color: theme.text, fontSize: 14, lineHeight: 20, opacity: 0.9 },
  noResults: { color: theme.textMuted, textAlign: 'center', marginTop: 30 },

  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: theme.bgElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 34, borderTopWidth: 1, borderColor: theme.cardBorder,
  },
  sheetRef: { color: theme.accent, fontWeight: '800', fontSize: 15, marginBottom: 6 },
  sheetText: { color: theme.text, fontSize: 15, lineHeight: 22, marginBottom: 16 },
  sheetActions: { gap: 10 },
  sheetBtnPrimary: { backgroundColor: theme.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  sheetBtnPrimaryText: { color: theme.accentText, fontWeight: '800', fontSize: 15 },
  sheetBtn: {
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 12,
    paddingVertical: 13, alignItems: 'center',
  },
  sheetBtnText: { color: theme.text, fontWeight: '600', fontSize: 15 },
  sheetBtnMuted: { color: theme.textMuted, fontWeight: '600', fontSize: 15 },
  sheetPickLabel: { color: theme.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  sheetDone: { color: '#5fd39a', fontWeight: '800', fontSize: 16, textAlign: 'center', paddingVertical: 18 },
});
