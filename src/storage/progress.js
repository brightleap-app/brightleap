// Storage abstraction layer
// Detects whether user is logged in:
//   - Logged in → sync to Supabase (with localStorage as cache)
//   - Guest → localStorage only

import { supabase } from '../lib/supabase.js';

const STORAGE_KEY = 'brightleap_progress';

const DEFAULT_PROGRESS = {
  xp: 0,
  streak: 0,
  bestStreak: 0,
  unlockedAnimals: [],
  habitatProgress: {},
  wordHistory: {},
  settings: {
    fontFamily: 'system',
    fontSize: 'normal',
    lineSpacing: 'normal',
    letterSpacing: 'normal',
    bgColor: '#ffffff',
  },
  sessionWordsToday: 0,
  lastSessionDate: null,
};

// --- Helpers ---

function getLocalProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const saved = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...saved };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function setLocalProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

async function getCurrentUserId() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch {
    return null;
  }
}

// --- Public API ---

export function loadProgress() {
  // Synchronous load from localStorage (always fast)
  return getLocalProgress();
}

export async function loadProgressAsync() {
  const userId = await getCurrentUserId();
  if (!userId) return getLocalProgress();

  // Try Supabase first
  try {
    const { data, error } = await supabase
      .from('progress')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (data?.data) {
      const merged = { ...DEFAULT_PROGRESS, ...data.data };
      setLocalProgress(merged); // Cache locally
      return merged;
    }
  } catch {
    // Fall back to local
  }

  return getLocalProgress();
}

export function saveProgress(data) {
  setLocalProgress(data);
  // Fire-and-forget Supabase sync
  syncToSupabase(data);
}

export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
  // Also clear Supabase if logged in
  resetSupabaseProgress();
}

export function updateProgress(updates) {
  const current = getLocalProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
}

export function getWordHistory(word) {
  const progress = getLocalProgress();
  return progress.wordHistory[word] || {
    attempts: 0,
    correct: 0,
    lastSeen: null,
    nextReview: 0,
    interval: 0,
  };
}

export function saveWordResult(word, wasCorrect, wasFirstAttempt) {
  const progress = getLocalProgress();
  const history = progress.wordHistory[word] || {
    attempts: 0,
    correct: 0,
    lastSeen: null,
    nextReview: 0,
    interval: 0,
  };

  history.attempts += 1;
  history.lastSeen = Date.now();

  if (wasCorrect) {
    history.correct += 1;
    if (wasFirstAttempt) {
      history.interval = history.interval === 0 ? 1 : history.interval * 2;
    }
  } else {
    history.interval = 0;
  }

  history.nextReview = history.lastSeen + history.interval * 24 * 60 * 60 * 1000;

  progress.wordHistory[word] = history;
  saveProgress(progress);
  return progress;
}

export function getHabitatProgress(habitatId) {
  const progress = getLocalProgress();
  return progress.habitatProgress[habitatId] || { correctWords: [], attempts: 0 };
}

export function saveHabitatProgress(habitatId, wordCorrect) {
  const progress = getLocalProgress();
  const hp = progress.habitatProgress[habitatId] || { correctWords: [], attempts: 0 };

  hp.attempts += 1;
  if (wordCorrect && !hp.correctWords.includes(wordCorrect)) {
    hp.correctWords.push(wordCorrect);
  }

  progress.habitatProgress[habitatId] = hp;
  saveProgress(progress);
  return progress;
}

// --- Supabase sync (fire-and-forget) ---

async function syncToSupabase(data) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase
      .from('progress')
      .upsert(
        { user_id: userId, data },
        { onConflict: 'user_id' }
      );
  } catch {
    // Sync failed — local data is safe, will retry next save
  }
}

async function resetSupabaseProgress() {
  const userId = await getCurrentUserId();
  if (!userId) return;

  try {
    await supabase
      .from('progress')
      .delete()
      .eq('user_id', userId);
  } catch {
    // Fail silently
  }
}

// Merge guest localStorage progress into a newly logged-in account
export async function migrateGuestProgress() {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const local = getLocalProgress();
  // Only migrate if guest had actual progress
  if (local.xp === 0 && Object.keys(local.wordHistory).length === 0) return;

  try {
    const { data: existing } = await supabase
      .from('progress')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (existing?.data && existing.data.xp > 0) {
      // Account already has progress — don't overwrite
      // Load the server version instead
      const merged = { ...DEFAULT_PROGRESS, ...existing.data };
      setLocalProgress(merged);
    } else {
      // No server progress — push local data up
      await syncToSupabase(local);
    }
  } catch {
    // First time — push local up
    await syncToSupabase(local);
  }
}
