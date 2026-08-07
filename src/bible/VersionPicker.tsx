import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { VERSIONS, BibleVersionMeta } from './versions';
import { isVersionSeeded, downloadAndSeedVersion } from './db';

type Props = {
  visible: boolean;
  currentId: string;                 // versión activa (solo las 'available' se pueden elegir)
  onClose: () => void;
  onPick: (v: BibleVersionMeta) => void;
  onLocked: (v: BibleVersionMeta) => void; // versión premium/sin datos aún
};

// Selector de versión: deja la app LISTA para free/premium. Las bundled/downloadable
// ya sembradas se eligen directo; las downloadable sin sembrar se descargan al tocarlas
// (una sola vez, luego quedan offline); las premium (RV60/NVI…) se muestran bloqueadas.
export default function VersionPicker({ visible, currentId, onClose, onPick, onLocked }: Props) {
  const free = VERSIONS.filter((v) => v.tier === 'free');
  const premium = VERSIONS.filter((v) => v.tier === 'premium');

  const [seeded, setSeeded] = useState<Set<string>>(new Set());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    let alive = true;
    (async () => {
      const entries = await Promise.all(
        free
          .filter((v) => v.source === 'bundled' || v.source === 'downloadable')
          .map(async (v) => [v.id, v.source === 'bundled' || (await isVersionSeeded(v.id))] as const)
      );
      if (alive) setSeeded(new Set(entries.filter(([, ok]) => ok).map(([id]) => id)));
    })();
    return () => { alive = false; };
  }, [visible]);

  const download = async (v: BibleVersionMeta) => {
    if (!v.downloadUrl || downloadingId) return;
    setErrorId(null);
    setDownloadingId(v.id);
    try {
      await downloadAndSeedVersion(v.id, v.downloadUrl);
      setSeeded((prev) => new Set(prev).add(v.id));
      onPick(v);
    } catch (e) {
      setErrorId(v.id);
    } finally {
      setDownloadingId(null);
    }
  };

  const Row = ({ v }: { v: BibleVersionMeta }) => {
    const active = v.id === currentId;
    const isDownloadable = v.source === 'downloadable';
    const ready = v.source === 'bundled' || seeded.has(v.id);
    const locked = !v.available;
    const downloading = downloadingId === v.id;

    const onPress = () => {
      if (locked) return onLocked(v);
      if (isDownloadable && !ready) return download(v);
      onPick(v);
    };

    return (
      <Pressable style={[styles.row, active && styles.rowActive]} onPress={onPress} disabled={downloading}>
        <View style={styles.abbrBox}><Text style={styles.abbr}>{v.abbr}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{v.name}</Text>
          <Text style={styles.meta}>
            {locked ? 'Suscripción · próximamente' : isDownloadable && !ready ? 'Gratis · toca para descargar' : 'Gratis'}
            {errorId === v.id ? ' · sin conexión, intenta de nuevo' : ''}
          </Text>
        </View>
        {downloading ? (
          <ActivityIndicator color={theme.accent} />
        ) : active ? (
          <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
        ) : locked ? (
          <Ionicons name="lock-closed" size={16} color={theme.textMuted} />
        ) : isDownloadable && !ready ? (
          <Ionicons name="cloud-download-outline" size={20} color={theme.accent} />
        ) : null}
      </Pressable>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>Elegir versión</Text>
          <ScrollView style={{ maxHeight: 420 }}>
            <Text style={styles.section}>Gratis</Text>
            {free.map((v) => <Row key={v.id} v={v} />)}
            <Text style={styles.section}>Con suscripción</Text>
            {premium.map((v) => <Row key={v.id} v={v} />)}
          </ScrollView>
          <Pressable style={styles.closeBtn} onPress={onClose}><Text style={styles.closeText}>Cerrar</Text></Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: theme.bgElevated, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 30, borderTopWidth: 1, borderColor: theme.cardBorder },
  title: { color: theme.text, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  section: { color: theme.textMuted, fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 12, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.card, borderWidth: 1, borderColor: theme.cardBorder, borderRadius: 12, padding: 12, marginBottom: 8 },
  rowActive: { borderColor: theme.accent },
  abbrBox: { width: 52, height: 40, borderRadius: 8, backgroundColor: '#22304d', alignItems: 'center', justifyContent: 'center' },
  abbr: { color: theme.accent, fontWeight: '800', fontSize: 13 },
  name: { color: theme.text, fontWeight: '700', fontSize: 15 },
  meta: { color: theme.textMuted, fontSize: 12, marginTop: 2 },
  closeBtn: { marginTop: 10, alignItems: 'center', paddingVertical: 12 },
  closeText: { color: theme.accent, fontWeight: '700', fontSize: 15 },
});
