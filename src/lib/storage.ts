import type { AppState, Scores } from './types';
import { initialState, DIMENSIONS } from './types';

const STORAGE_KEY = 'tide-planner-2026-v4';

// Clean scores to only include valid DIMENSIONS keys
function cleanScores(scores: Partial<Scores>): Scores {
  const clean: Scores = {};
  DIMENSIONS.forEach(dim => {
    clean[dim.key] = scores[dim.key] ?? 5;
  });
  return clean;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return initialState;

    const parsed = JSON.parse(saved) as Partial<AppState>;
    // Validate step is 1-7
    const step = ([1, 2, 3, 4, 5, 6, 7] as const).includes(parsed.step as 1|2|3|4|5|6|7)
      ? parsed.step as 1|2|3|4|5|6|7
      : 1;
    return {
      ...initialState,
      ...parsed,
      step,
      scores2025: cleanScores(parsed.scores2025 || {}),
      scores2026: cleanScores(parsed.scores2026 || {}),
    };
  } catch {
    return initialState;
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Download state as JSON file
export function downloadState(state: AppState): void {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tide-planner-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Upload state from JSON file
export function uploadState(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as Partial<AppState>;
        const state: AppState = {
          ...initialState,
          ...parsed,
          scores2025: cleanScores(parsed.scores2025 || {}),
          scores2026: cleanScores(parsed.scores2026 || {}),
        };
        resolve(state);
      } catch {
        reject(new Error('Invalid file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
