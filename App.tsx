import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { initBibleDb } from './src/bible/db';
import { Sermon } from './src/types';
import { theme } from './src/theme';
import { loadSermons, saveSermons } from './src/storage';
import { newId } from './src/split';
import { SettingsProvider } from './src/SettingsContext';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';
import PreachScreen from './src/screens/PreachScreen';
import EditScreen from './src/screens/EditScreen';
import BibleModule from './src/screens/BibleModule';
import DevocionalScreen from './src/screens/DevocionalScreen';
import MinisterManualScreen from './src/screens/MinisterManualScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Screen =
  | { name: 'list' }
  | { name: 'detail'; id: string }
  | { name: 'preach'; id: string }
  | { name: 'edit'; id: string };

type Tab = 'biblia' | 'devocional' | 'sermones' | 'manual' | 'ajustes';

function emptySermon(): Sermon {
  const now = Date.now();
  return { id: newId('s'), title: '', date: '', intro: '', points: [], createdAt: now, updatedAt: now };
}

export default function App() {
  const [tab, setTab] = useState<Tab>('biblia');
  const [sermons, setSermons] = useState<Sermon[] | null>(null);
  const [screen, setScreen] = useState<Screen>({ name: 'list' });
  const [draft, setDraft] = useState<Sermon | null>(null); // borrador nuevo aún no persistido

  useEffect(() => { initBibleDb(); }, []);
  useEffect(() => {
    loadSermons().then(setSermons);
  }, []);

  const persist = (next: Sermon[]) => {
    setSermons(next);
    saveSermons(next);
  };

  const byId = (id: string) => sermons?.find((s) => s.id === id);

  const openNew = () => {
    const d = emptySermon();
    setDraft(d);
    setScreen({ name: 'edit', id: d.id });
  };

  const handleSave = (s: Sermon) => {
    const list = sermons || [];
    const exists = list.some((x) => x.id === s.id);
    persist(exists ? list.map((x) => (x.id === s.id ? s : x)) : [s, ...list]);
    setDraft(null);
    setScreen({ name: 'detail', id: s.id });
  };

  const handleDelete = (id: string) => {
    persist((sermons || []).filter((s) => s.id !== id));
    setDraft(null);
    setScreen({ name: 'list' });
  };

  // Conectar un versículo (desde la Biblia) a un sermón: se añade como un punto.
  const connectVerse = (sermonId: string, v: { ref: string; text: string }) => {
    const list = sermons || [];
    persist(
      list.map((s) =>
        s.id === sermonId
          ? { ...s, points: [...s.points, { id: newId(), heading: v.ref, bodyMd: v.text }], updatedAt: Date.now() }
          : s
      )
    );
  };

  const renderSermones = () => {
    if (!sermons) return null;
    switch (screen.name) {
      case 'list':
        return <ListScreen sermons={sermons} onOpen={(id) => setScreen({ name: 'detail', id })} onNew={openNew} />;
      case 'detail': {
        const s = byId(screen.id);
        if (!s) return <ListScreen sermons={sermons} onOpen={(id) => setScreen({ name: 'detail', id })} onNew={openNew} />;
        return (
          <DetailScreen
            sermon={s}
            onBack={() => setScreen({ name: 'list' })}
            onPreach={() => setScreen({ name: 'preach', id: s.id })}
            onEdit={() => { setDraft(null); setScreen({ name: 'edit', id: s.id }); }}
          />
        );
      }
      case 'preach': {
        const s = byId(screen.id);
        if (!s) return null;
        return <PreachScreen sermon={s} onExit={() => setScreen({ name: 'detail', id: s.id })} />;
      }
      case 'edit': {
        const isNew = !!draft && draft.id === screen.id;
        const s = isNew ? draft! : byId(screen.id);
        if (!s) return null;
        return (
          <EditScreen
            sermon={s}
            onSave={handleSave}
            onCancel={() => setScreen(isNew ? { name: 'list' } : { name: 'detail', id: s.id })}
            onDelete={isNew ? undefined : handleDelete}
          />
        );
      }
      default:
        return null;
    }
  };

  const openBibleVersions = () => {
    setTab('biblia');
  };

  const isFullscreen = tab === 'sermones' && screen.name === 'preach';

  return (
    <SettingsProvider>
      <View style={styles.root}>
        <StatusBar style="light" />
        <View style={{ flex: 1 }}>
          {!sermons ? (
            <View style={[styles.center, { flex: 1 }]}>
              <ActivityIndicator color={theme.accent} />
            </View>
          ) : tab === 'sermones' ? (
            renderSermones()
          ) : tab === 'devocional' ? (
            <DevocionalScreen />
          ) : tab === 'manual' ? (
            <MinisterManualScreen />
          ) : tab === 'ajustes' ? (
            <SettingsScreen />
          ) : (
            <BibleModule sermons={sermons || []} onConnectVerse={connectVerse} onSettings={() => setTab('ajustes')} />
          )}
        </View>

        {!isFullscreen && (
          <View style={styles.tabBar}>
            <TabButton label="Devocional" icon="sparkles" active={tab === 'devocional'} onPress={() => setTab('devocional')} />
            <TabButton
              label="Sermones"
              icon="albums"
              active={tab === 'sermones'}
              onPress={() => { setTab('sermones'); setScreen({ name: 'list' }); }}
            />
            <TabButton label="Biblia" icon="book" active={tab === 'biblia'} onPress={() => setTab('biblia')} />
          </View>
        )}
      </View>
    </SettingsProvider>
  );
}

function TabButton({ label, icon, active, onPress }: { label: string; icon: string; active: boolean; onPress: () => void }) {
  const name = (active ? icon : `${icon}-outline`) as keyof typeof Ionicons.glyphMap;
  return (
    <Pressable style={styles.tab} onPress={onPress}>
      <Ionicons name={name} size={23} color={active ? theme.accent : theme.textMuted} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function BibliaPlaceholder() {
  return (
    <View style={[styles.center, { flex: 1, padding: 30 }]}>
      <Text style={{ fontSize: 44, marginBottom: 12 }}>📖</Text>
      <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', marginBottom: 8 }}>Biblia</Text>
      <Text style={{ color: theme.textMuted, fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
        Próximo módulo: lectura offline (RV1909), navegación Libro › Capítulo › Versículo, búsqueda,
        resaltados y notas — con “Insertar versículo” hacia tus sermones.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.header,
    borderTopWidth: 1,
    borderTopColor: theme.cardBorder,
    paddingBottom: 22,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  tabLabel: { color: theme.textMuted, fontSize: 11, fontWeight: '600' },
  tabLabelActive: { color: theme.accent },
});
