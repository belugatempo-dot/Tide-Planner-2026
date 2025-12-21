import type { WizardState } from './types';
import { initialWizardState } from './types';

const STORAGE_KEY = 'tide-planner-2026';

export function saveState(state: WizardState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function loadState(): WizardState {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return initialWizardState;
    }
    const parsed = JSON.parse(serialized) as WizardState;
    // Ensure we have all required fields (in case of schema changes)
    return {
      ...initialWizardState,
      ...parsed,
      data: {
        ...initialWizardState.data,
        ...parsed.data,
      },
    };
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return initialWizardState;
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear state from localStorage:', error);
  }
}

export function hasExistingData(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}
