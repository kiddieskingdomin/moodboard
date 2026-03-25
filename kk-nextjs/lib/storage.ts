import type { MoodboardState } from '@/types/moodboard'

const KEY = 'kk_moodboard_v1'

export function saveMoodboard(state: MoodboardState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Could not save moodboard:', e)
  }
}

export function loadMoodboard(): MoodboardState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as MoodboardState
  } catch {
    return null
  }
}

export function clearMoodboard(): void {
  localStorage.removeItem(KEY)
}

// Auto-save every 30 seconds
export function startAutoSave(getState: () => MoodboardState): () => void {
  const interval = setInterval(() => {
    const state = getState()
    if (state) saveMoodboard(state)
  }, 30_000)
  return () => clearInterval(interval)
}
