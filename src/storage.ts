import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sermon } from './types';
import { seedSermons } from './seed';

const KEY = 'biblia-sermones:v1';

export async function loadSermons(): Promise<Sermon[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      const seeded = seedSermons();
      await saveSermons(seeded);
      return seeded;
    }
    return JSON.parse(raw) as Sermon[];
  } catch {
    return seedSermons();
  }
}

export async function saveSermons(sermons: Sermon[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(sermons));
  } catch {
    // best-effort; en web/dev es suficiente
  }
}
