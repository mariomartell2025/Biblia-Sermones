import React from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { VERSIONS, BibleVersionMeta } from './versions';

type Props = {
  visible: boolean;
  currentId: string;                 // versión activa (solo las 'available' se pueden elegir)
  onClose: () => void;
  onPick: (v: BibleVersionMeta) => void;
  onLocked: (v: BibleVersionMeta) => void; // versión premium/sin datos aún
};

// Selector de versión: deja la app LISTA para free/premium. Las 'available' se eligen;
// las premium (RV60/NVI…) se muestran bloqueadas hasta tener licencia + datos.
export default function VersionPicker({ visible, currentId, onClose, onPick, onLocked }: Props) {
  const free = VERSIONS.filter((v) => v.tier === 'free');
  const premium = VERSIONS.filter((v) => v.tier === 'premium');

  const Row = ({ v }: { v: BibleVersionMeta }) => {
    const active = v.id === currentId;
    const locked = !v.available;
    return (
      <Pressable
        style={[styles.row, active && styles.rowActive]}
        onPress={() => (locked ? onLocked(v) : onPick(v))}
      >
        <View style={styles.abbrBox}><Text style={styles.abbr}>{v.abbr}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{v.name}</Text>
          <Text style={styles.meta}>
            {v.tier === 'free' ? 'Gratis' : 'Suscripción'}
            {locked ? ' · próximamente' : ''}
          </Text>
        </View>
        {active ? <Text style={styles.check}>✓</Text> : locked ? <Text style={styles.lock}>🔒</Text> : null}
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
  check: { color: theme.accent, fontWeight: '800', fontSize: 18 },
  lock: { fontSize: 15 },
  closeBtn: { marginTop: 10, alignItems: 'center', paddingVertical: 12 },
  closeText: { color: theme.accent, fontWeight: '700', fontSize: 15 },
});
