import { get, set } from 'idb-keyval';
import { CalendarEvent, ToDoItem, UserSettings } from '@/types/calendar';
import { DEFAULT_SETTINGS, generateSeptember2026Data } from './mockData';

const SETTINGS_KEY = 'heracles_settings_v1';
const EVENTS_KEY = 'heracles_events_v1';
const TODOS_KEY = 'heracles_todos_v1';

export async function loadUserSettings(): Promise<UserSettings> {
  try {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const stored = await get<UserSettings>(SETTINGS_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...stored };
  } catch (err) {
    console.warn('Could not read settings from IndexedDB, using defaults', err);
  }
  return DEFAULT_SETTINGS;
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      await set(SETTINGS_KEY, settings);
    }
  } catch (err) {
    console.error('Failed to save settings to IndexedDB', err);
  }
}

export async function loadEvents(): Promise<CalendarEvent[]> {
  try {
    if (typeof window === 'undefined') return [];
    const stored = await get<CalendarEvent[]>(EVENTS_KEY);
    if (stored && stored.length > 0) return stored;
  } catch (err) {
    console.warn('Could not read events from IndexedDB', err);
  }
  // Initialize with realistic mock data
  const { events } = generateSeptember2026Data();
  await saveEvents(events);
  return events;
}

export async function saveEvents(events: CalendarEvent[]): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      await set(EVENTS_KEY, events);
    }
  } catch (err) {
    console.error('Failed to save events to IndexedDB', err);
  }
}

export async function loadTodos(): Promise<ToDoItem[]> {
  try {
    if (typeof window === 'undefined') return [];
    const stored = await get<ToDoItem[]>(TODOS_KEY);
    if (stored && stored.length > 0) return stored;
  } catch (err) {
    console.warn('Could not read todos from IndexedDB', err);
  }
  // Initialize with realistic mock data
  const { todos } = generateSeptember2026Data();
  await saveTodos(todos);
  return todos;
}

export async function saveTodos(todos: ToDoItem[]): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      await set(TODOS_KEY, todos);
    }
  } catch (err) {
    console.error('Failed to save todos to IndexedDB', err);
  }
}
