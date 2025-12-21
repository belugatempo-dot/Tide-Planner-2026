import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type { WizardState, PlannerData, Goal } from '../lib/types';
import { initialWizardState, TOTAL_STEPS } from '../lib/types';
import { saveState, loadState } from '../lib/storage';

type WizardAction =
  | { type: 'SET_STEP'; step: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; field: keyof PlannerData; value: string | string[] | Goal[] }
  | { type: 'UPDATE_THEME'; index: number; value: string }
  | { type: 'UPDATE_GOAL'; goalId: string; field: keyof Goal; value: string }
  | { type: 'ADD_GOAL' }
  | { type: 'REMOVE_GOAL'; goalId: string }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE'; state: WizardState };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.step };

    case 'NEXT_STEP':
      if (state.currentStep < TOTAL_STEPS) {
        return { ...state, currentStep: state.currentStep + 1 };
      }
      return state;

    case 'PREV_STEP':
      if (state.currentStep > 0) {
        return { ...state, currentStep: state.currentStep - 1 };
      }
      return state;

    case 'UPDATE_FIELD':
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
      };

    case 'UPDATE_THEME':
      const newThemes = [...state.data.themes];
      newThemes[action.index] = action.value;
      return {
        ...state,
        data: { ...state.data, themes: newThemes },
      };

    case 'UPDATE_GOAL':
      return {
        ...state,
        data: {
          ...state.data,
          goals: state.data.goals.map(g =>
            g.id === action.goalId ? { ...g, [action.field]: action.value } : g
          ),
        },
      };

    case 'ADD_GOAL':
      if (state.data.goals.length >= 5) return state;
      const newGoal: Goal = {
        id: Date.now().toString(),
        description: '',
        metric: '',
        successDefinition: '',
      };
      return {
        ...state,
        data: { ...state.data, goals: [...state.data.goals, newGoal] },
      };

    case 'REMOVE_GOAL':
      if (state.data.goals.length <= 1) return state;
      return {
        ...state,
        data: {
          ...state.data,
          goals: state.data.goals.filter(g => g.id !== action.goalId),
        },
      };

    case 'COMPLETE':
      return { ...state, isComplete: true, currentStep: TOTAL_STEPS };

    case 'RESET':
      return initialWizardState;

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

interface WizardContextType {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  updateField: (field: keyof PlannerData, value: string | string[] | Goal[]) => void;
  updateTheme: (index: number, value: string) => void;
  updateGoal: (goalId: string, field: keyof Goal, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  complete: () => void;
  reset: () => void;
}

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);
  const isInitialized = useRef(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (!isInitialized.current) {
      const savedState = loadState();
      dispatch({ type: 'LOAD_STATE', state: savedState });
      isInitialized.current = true;
    }
  }, []);

  // Save state to localStorage on changes (debounced)
  useEffect(() => {
    if (isInitialized.current) {
      const timeoutId = setTimeout(() => {
        saveState(state);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [state]);

  const updateField = useCallback((field: keyof PlannerData, value: string | string[] | Goal[]) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, []);

  const updateTheme = useCallback((index: number, value: string) => {
    dispatch({ type: 'UPDATE_THEME', index, value });
  }, []);

  const updateGoal = useCallback((goalId: string, field: keyof Goal, value: string) => {
    dispatch({ type: 'UPDATE_GOAL', goalId, field, value });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', step });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const complete = useCallback(() => {
    dispatch({ type: 'COMPLETE' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <WizardContext.Provider
      value={{
        state,
        dispatch,
        updateField,
        updateTheme,
        updateGoal,
        nextStep,
        prevStep,
        goToStep,
        complete,
        reset,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
