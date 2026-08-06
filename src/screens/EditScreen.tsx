import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Sermon, SermonPoint, KeyVerse } from '../types';
import { theme } from '../theme';
import { useResponsive } from '../useResponsive';
import { responsiveStyles } from '../responsiveStyles';
import { splitIntoPoints, newId } from '../split';
import { extractText } from '../import';
import VersePicker from '../bible/VersePicker';
import { useSuggestedVerses } from '../bible/useBible';

type Props = {
  sermon: Sermon;
  onSave: (s: Sermon) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
};

export default function EditScreen({ sermon, onSave, onCancel, onDelete }: Props) {
  const responsive = useResponsive();
  const rStyles = responsiveStyles(responsive);
  const [number, setNumber] = useState(sermon.number || '');
  const [title, setTitle] = useState(sermon.title);
  const [date, setDate] = useState(sermon.date);
  const [intro, setIntro] = useState(sermon.intro);
  const [keyVerse, setKeyVerse] = useState<KeyVerse | undefined>(sermon.keyVerse);
  const [points, setPoints] = useState<SermonPoint[]>(sermon.points);
  const [paste, setPaste] = useState('');

  const [importing, setImporting] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const suggestions = useSuggestedVerses(title + ' ' + intro, 6);

  const autoSplit = () => {
    const parsed = splitIntoPoints(paste);
    if (parsed.length) {
      setPoints((prev) => [...prev, ...parsed]);
      setPaste('');
    }
  };

  const notify = (msg: string) =>
    typeof alert === 'function' ? alert(msg) : Alert.alert('Importar', msg);

  const importFile = async () => {
    try {
      setImporting(true);
      const res = await DocumentPicker.getDocumentAsync({
        type: [
          'text/plain',
          'text/markdown',
          'application/rtf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/pdf',
          'application/msword', // .doc
          '*/*',
        ],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;
      const asset = res.assets[0];
      const out = await extractText(asset.uri, asset.name);
      if (!out.ok) {
        notify(out.reason);
        return;
      }
      const text = out.text.trim();
      if (!text) {
        notify('El archivo no tenía texto legible.');
        return;
      }
      // Volcamos el texto en la caja para que puedas revisarlo antes de dividir.
      setPaste((prev) => (prev ? prev + '\n\n' + text : text));
      notify(`Importado (${out.kind}). Revisa el texto y toca “Auto-dividir en puntos”.`);
    } catch (e: any) {
      notify(`No se pudo importar: ${e?.message || e}`);
    } finally {
      setImporting(false);
    }
  };

  const updatePoint = (id: string, patch: Partial<SermonPoint>) =>
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const removePoint = (id: string) => setPoints((prev) => prev.filter((p) => p.id !== id));
  const addPoint = () =>
    setPoints((prev) => [...prev, { id: newId(), heading: '', bodyMd: '' }]);
  const move = (i: number, dir: -1 | 1) =>
    setPoints((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const save = () => {
    onSave({
      ...sermon,
      number: number.trim() || undefined,
      title: title.trim() || 'Sin título',
      date: date.trim(),
      intro: intro.trim(),
      keyVerse,
      points: points.filter((p) => p.heading.trim() || p.bodyMd.trim()),
      updatedAt: Date.now(),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onCancel} hitSlop={12}>
          <Text style={styles.headerBtn}>Cancelar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Editar sermón</Text>
        <Pressable onPress={save} hitSlop={12}>
          <Text style={[styles.headerBtn, styles.save]}>Guardar</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.body, rStyles.scrollContent]}>
        <View style={styles.row}>
          <View style={{ width: 90 }}>
            <Text style={styles.label}>Número</Text>
            <TextInput style={styles.input} value={number} onChangeText={setNumber} placeholder="002" placeholderTextColor={theme.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Título</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Título del sermón" placeholderTextColor={theme.textMuted} />
          </View>
        </View>

        <Text style={styles.label}>Fecha</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="05/08/2026" placeholderTextColor={theme.textMuted} />

        <Text style={styles.label}>Introducción / descripción</Text>
        <TextInput style={[styles.input, styles.multiline]} value={intro} onChangeText={setIntro} multiline placeholder="Resumen del mensaje…" placeholderTextColor={theme.textMuted} />

        <Text style={styles.label}>Versículo base</Text>
        {keyVerse ? (
          <View style={styles.keyVerseCard}>
            <View style={styles.keyVerseTop}>
              <Text style={styles.keyVerseRef}>✝  {keyVerse.ref}</Text>
              <View style={styles.keyVerseActions}>
                <Pressable onPress={() => setPickerVisible(true)} hitSlop={8}><Text style={styles.keyVerseChange}>Cambiar</Text></Pressable>
                <Pressable onPress={() => setKeyVerse(undefined)} hitSlop={8}><Text style={styles.keyVerseRemove}>Quitar</Text></Pressable>
              </View>
            </View>
            <Text style={styles.keyVerseText}>{keyVerse.text}</Text>
          </View>
        ) : (
          <Pressable style={styles.keyVerseAdd} onPress={() => setPickerVisible(true)}>
            <Text style={styles.keyVerseAddText}>✝  Elegir versículo central de la prédica</Text>
          </Pressable>
        )}

        {suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            <Text style={styles.suggestionsLabel}>💡 Versículos sugeridos para este tema</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsList}>
              {suggestions.map((v, i) => (
                <View key={i} style={styles.suggestionChip}>
                  <Text style={styles.suggestionRef}>{v.abbr} {v.chapter}:{v.verse}</Text>
                  <Text style={styles.suggestionText} numberOfLines={2}>{v.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.pasteBox}>
          <Text style={styles.label}>Importar o pegar sermón, y auto-dividir en puntos</Text>
          <Pressable style={styles.importBtn} onPress={importFile} disabled={importing}>
            <Text style={styles.importBtnText}>
              {importing ? 'Importando…' : '📄  Importar archivo (.txt · .md · .docx)'}
            </Text>
          </Pressable>
          <TextInput
            style={[styles.input, styles.multiline, { minHeight: 120 }]}
            value={paste}
            onChangeText={setPaste}
            multiline
            placeholder={'Pega aquí tu bosquejo. Divide por:\n##  título\n1.  punto\n---  separador'}
            placeholderTextColor={theme.textMuted}
          />
          <Pressable style={styles.splitBtn} onPress={autoSplit}>
            <Text style={styles.splitBtnText}>⟐  Auto-dividir en puntos</Text>
          </Pressable>
        </View>

        <View style={styles.pointsHeader}>
          <Text style={styles.sectionTitle}>Puntos ({points.length})</Text>
          <Pressable onPress={addPoint}>
            <Text style={styles.addPoint}>+ Añadir punto</Text>
          </Pressable>
        </View>

        {points.map((p, i) => (
          <View key={p.id} style={styles.pointEditor}>
            <View style={styles.pointTop}>
              <Text style={styles.pointNum}>Punto {i + 1}</Text>
              <View style={styles.pointActions}>
                <Pressable onPress={() => move(i, -1)} hitSlop={8}><Text style={styles.act}>↑</Text></Pressable>
                <Pressable onPress={() => move(i, 1)} hitSlop={8}><Text style={styles.act}>↓</Text></Pressable>
                <Pressable onPress={() => removePoint(p.id)} hitSlop={8}><Text style={[styles.act, styles.del]}>✕</Text></Pressable>
              </View>
            </View>
            <TextInput style={styles.input} value={p.heading} onChangeText={(t) => updatePoint(p.id, { heading: t })} placeholder="Título del punto" placeholderTextColor={theme.textMuted} />
            <TextInput style={[styles.input, styles.multiline]} value={p.bodyMd} onChangeText={(t) => updatePoint(p.id, { bodyMd: t })} multiline placeholder="Notas del punto…" placeholderTextColor={theme.textMuted} />
          </View>
        ))}

        {onDelete && (
          <Pressable style={styles.deleteSermon} onPress={() => onDelete(sermon.id)}>
            <Text style={styles.deleteSermonText}>Eliminar sermón</Text>
          </Pressable>
        )}
      </ScrollView>

      <VersePicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPick={(v) => { setKeyVerse(v); setPickerVisible(false); }}
      />
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
    alignItems: 'center',
  },
  headerTitle: { color: theme.text, fontSize: 16, fontWeight: '700' },
  headerBtn: { color: theme.accent, fontSize: 16 },
  save: { fontWeight: '800' },
  body: { padding: 18, gap: 8, paddingBottom: 60 },
  row: { flexDirection: 'row', gap: 12 },
  label: { color: theme.textMuted, fontSize: 13, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: theme.text,
    fontSize: 16,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top', paddingTop: 12, lineHeight: 22 },
  keyVerseAdd: {
    borderWidth: 1, borderColor: theme.accent, borderStyle: 'dashed', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 2,
  },
  keyVerseAddText: { color: theme.accent, fontWeight: '700', fontSize: 14 },
  keyVerseCard: {
    backgroundColor: '#1a2740', borderWidth: 1, borderColor: theme.accent, borderRadius: 12, padding: 14,
  },
  keyVerseTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  keyVerseRef: { color: theme.accent, fontWeight: '800', fontSize: 15 },
  keyVerseActions: { flexDirection: 'row', gap: 16 },
  keyVerseChange: { color: theme.accent, fontWeight: '600', fontSize: 13 },
  keyVerseRemove: { color: theme.danger, fontWeight: '600', fontSize: 13 },
  keyVerseText: { color: theme.text, fontSize: 15, lineHeight: 22 },
  suggestionsBox: {
    marginTop: 16,
    backgroundColor: theme.bgElevated,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 12,
  },
  suggestionsLabel: { color: theme.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  suggestionsList: { marginHorizontal: -12, paddingHorizontal: 12 },
  suggestionChip: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
    width: 160,
  },
  suggestionRef: { color: theme.accent, fontWeight: '700', fontSize: 12, marginBottom: 4 },
  suggestionText: { color: theme.text, fontSize: 12, lineHeight: 16, opacity: 0.85 },
  pasteBox: {
    marginTop: 18,
    backgroundColor: theme.bgElevated,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 14,
  },
  importBtn: {
    borderWidth: 1,
    borderColor: theme.accent,
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  importBtnText: { color: theme.accent, fontWeight: '700', fontSize: 14 },
  splitBtn: { backgroundColor: theme.accent, borderRadius: 999, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  splitBtnText: { color: theme.accentText, fontWeight: '800', fontSize: 15 },
  pointsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, marginBottom: 6 },
  sectionTitle: { color: theme.text, fontSize: 18, fontWeight: '800' },
  addPoint: { color: theme.accent, fontWeight: '700', fontSize: 15 },
  pointEditor: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    borderWidth: 1,
    borderColor: theme.cardBorder,
    padding: 14,
    marginTop: 12,
    gap: 4,
  },
  pointTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  pointNum: { color: theme.accent, fontWeight: '800', fontSize: 13, letterSpacing: 1 },
  pointActions: { flexDirection: 'row', gap: 18 },
  act: { color: theme.textMuted, fontSize: 18, fontWeight: '700' },
  del: { color: theme.danger },
  deleteSermon: { marginTop: 30, alignItems: 'center', padding: 12 },
  deleteSermonText: { color: theme.danger, fontWeight: '700', fontSize: 15 },
});
