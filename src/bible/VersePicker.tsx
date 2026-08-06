import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { theme } from '../theme';
import { BOOKS, VerseHit, searchText, parseRef, suggestBooks, getVerseText, formatRef } from './data';

export type PickedVerse = {
  book: number;
  chapter: number;
  verse: number;
  ref: string;
  text: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (v: PickedVerse) => void;
};

// Selector de versículo: mismo buscador predictivo que la Biblia (referencia o palabras).
export default function VersePicker({ visible, onClose, onPick }: Props) {
  const [q, setQ] = useState('');
  const hasDigit = /\d/.test(q);
  const books = useMemo(() => (q.trim() && !hasDigit ? suggestBooks(q) : []), [q, hasDigit]);
  const ref = parseRef(q);
  const refText = ref && ref.verse ? getVerseText(ref.book, ref.chapter, ref.verse) : null;
  const hits: VerseHit[] = useMemo(() => (q.trim().length >= 3 ? searchText(q) : []), [q]);

  const pick = (book: number, chapter: number, verse: number, text: string) => {
    onPick({ book, chapter, verse, ref: formatRef(book, chapter, verse), text });
    setQ('');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={false}>
      <View style={styles.container}>
        <View style={styles.head}>
          <Pressable onPress={() => { setQ(''); onClose(); }} hitSlop={12}>
            <Text style={styles.cancel}>Cancelar</Text>
          </Pressable>
          <Text style={styles.title}>Elegir versículo</Text>
          <View style={{ width: 64 }} />
        </View>

        <View style={{ padding: 16, paddingBottom: 8 }}>
          <TextInput
            style={styles.input}
            value={q}
            onChangeText={setQ}
            autoFocus
            placeholder="Referencia (Juan 3:16) o palabras del versículo"
            placeholderTextColor={theme.textMuted}
          />
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
          {books.length > 0 && (
            <View style={styles.suggestRow}>
              {books.map((b) => (
                <Pressable key={b.i} style={styles.chip} onPress={() => setQ(`${b.name} `)}>
                  <Text style={styles.chipText}>{b.name}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {ref && ref.verse && refText && (
            <Pressable style={styles.refCard} onPress={() => pick(ref.book, ref.chapter, ref.verse!, refText)}>
              <Text style={styles.refLabel}>{BOOKS[ref.book].name} {ref.chapter}:{ref.verse}  ·  Usar este ›</Text>
              <Text style={styles.refText}>{refText}</Text>
            </Pressable>
          )}

          {hits.map((h, k) => (
            <Pressable key={k} style={styles.hit} onPress={() => pick(h.book, h.chapter, h.verse, h.text)}>
              <Text style={styles.hitRef}>{h.abbr} {h.chapter}:{h.verse}</Text>
              <Text style={styles.hitText} numberOfLines={2}>{h.text}</Text>
            </Pressable>
          ))}

          {q.trim().length >= 3 && !hits.length && !ref && books.length === 0 && (
            <Text style={styles.empty}>Sin resultados para “{q}”.</Text>
          )}
          {q.trim().length < 3 && books.length === 0 && (
            <Text style={styles.hint}>Escribe una referencia (ej. 2Co 12:9) o unas palabras que recuerdes del versículo.</Text>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  head: {
    backgroundColor: theme.header, paddingTop: 52, paddingBottom: 14, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  cancel: { color: theme.accent, fontSize: 16 },
  title: { color: theme.text, fontSize: 16, fontWeight: '700' },
  input: {
    backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, color: theme.text, fontSize: 16,
  },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  chipText: { color: theme.text, fontWeight: '600', fontSize: 14 },
  refCard: { backgroundColor: '#1a2740', borderWidth: 1, borderColor: theme.accent, borderRadius: 12, padding: 14, marginBottom: 12 },
  refLabel: { color: theme.accent, fontWeight: '800', fontSize: 14 },
  refText: { color: theme.text, fontSize: 15, lineHeight: 21, marginTop: 8 },
  hit: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 12, padding: 14, marginBottom: 10 },
  hitRef: { color: theme.accent, fontWeight: '800', fontSize: 13 },
  hitText: { color: theme.text, fontSize: 14, lineHeight: 20, opacity: 0.9, marginTop: 4 },
  empty: { color: theme.textMuted, textAlign: 'center', marginTop: 24 },
  hint: { color: theme.textMuted, fontSize: 14, lineHeight: 20, marginTop: 16, textAlign: 'center' },
});
