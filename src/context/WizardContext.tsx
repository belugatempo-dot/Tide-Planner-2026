import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import type { AppState, Dimension } from '../lib/types';
import { initialState, DIMENSIONS } from '../lib/types';
import { saveState, loadState, downloadState, uploadState } from '../lib/storage';

type Action =
  | { type: 'SET_STEP'; step: AppState['step'] }
  | { type: 'SET_SCORE'; year: '2025' | '2026'; key: string; value: number }
  | { type: 'SET_JOY'; year: '2025' | '2026'; value: number }
  | { type: 'SET_LANG'; lang: 'en' | 'zh' }
  | { type: 'SET_REFLECTION'; field: 'high' | 'low'; value: string }
  | { type: 'SET_KEYWORD_2025'; keyword: string }
  | { type: 'SET_ACTION'; dimKey: string; action: string; remove?: boolean }
  | { type: 'SET_KEYWORD_2026'; keyword: string }
  | { type: 'RESET' }
  | { type: 'LOAD'; state: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STEP':
      // When entering step 4, copy 2025 scores to 2026 as starting point
      if (action.step === 4) {
        return {
          ...state,
          step: action.step,
          scores2026: { ...state.scores2025 },
          joy2026: state.joy2025,
        };
      }
      return { ...state, step: action.step };

    case 'SET_SCORE':
      if (action.year === '2025') {
        return { ...state, scores2025: { ...state.scores2025, [action.key]: action.value } };
      }
      return { ...state, scores2026: { ...state.scores2026, [action.key]: action.value } };

    case 'SET_JOY':
      if (action.year === '2025') {
        return { ...state, joy2025: action.value };
      }
      return { ...state, joy2026: action.value };

    case 'SET_LANG':
      return { ...state, lang: action.lang };

    case 'SET_REFLECTION':
      if (action.field === 'high') {
        return { ...state, reflectionHigh: action.value };
      }
      return { ...state, reflectionLow: action.value };

    case 'SET_KEYWORD_2025':
      return { ...state, keyword2025: action.keyword };

    case 'SET_ACTION': {
      const currentActions = state.actions[action.dimKey] || [];
      let newActions: string[];
      if (action.remove) {
        // Remove the action
        newActions = currentActions.filter(a => a !== action.action);
      } else {
        // Add the action if not already present and under limit of 3
        if (currentActions.includes(action.action)) {
          newActions = currentActions;
        } else if (currentActions.length >= 3) {
          newActions = currentActions;
        } else {
          newActions = [...currentActions, action.action];
        }
      }
      return { ...state, actions: { ...state.actions, [action.dimKey]: newActions } };
    }

    case 'SET_KEYWORD_2026':
      return { ...state, keyword2026: action.keyword };

    case 'RESET':
      return {
        ...initialState,
        lang: state.lang,
      };

    case 'LOAD':
      return action.state;

    default:
      return state;
  }
}

interface ContextType {
  state: AppState;
  setStep: (step: AppState['step']) => void;
  setScore: (year: '2025' | '2026', key: string, value: number) => void;
  setJoy: (year: '2025' | '2026', value: number) => void;
  setLang: (lang: 'en' | 'zh') => void;
  setReflection: (field: 'high' | 'low', value: string) => void;
  setKeyword2025: (keyword: string) => void;
  setAction: (dimKey: string, action: string, remove?: boolean) => void;
  setKeyword2026: (keyword: string) => void;
  reset: () => void;
  getHighestDim: () => { key: string; score: number; dim: Dimension };
  getLowestDim: () => { key: string; score: number; dim: Dimension };
  getTopGapDims: (count: number) => { dim: Dimension; gap: number; score2025: number; score2026: number }[];
  download: () => void;
  upload: (file: File) => Promise<void>;
}

const AppContext = createContext<ContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      dispatch({ type: 'LOAD', state: loadState() });
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (initialized.current) {
      const timer = setTimeout(() => saveState(state), 200);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const setStep = useCallback((step: AppState['step']) => {
    dispatch({ type: 'SET_STEP', step });
  }, []);

  const setScore = useCallback((year: '2025' | '2026', key: string, value: number) => {
    dispatch({ type: 'SET_SCORE', year, key, value });
  }, []);

  const setJoy = useCallback((year: '2025' | '2026', value: number) => {
    dispatch({ type: 'SET_JOY', year, value });
  }, []);

  const setLang = useCallback((lang: 'en' | 'zh') => {
    dispatch({ type: 'SET_LANG', lang });
  }, []);

  const setReflection = useCallback((field: 'high' | 'low', value: string) => {
    dispatch({ type: 'SET_REFLECTION', field, value });
  }, []);

  const setKeyword2025 = useCallback((keyword: string) => {
    dispatch({ type: 'SET_KEYWORD_2025', keyword });
  }, []);

  const setAction = useCallback((dimKey: string, action: string, remove?: boolean) => {
    dispatch({ type: 'SET_ACTION', dimKey, action, remove });
  }, []);

  const setKeyword2026 = useCallback((keyword: string) => {
    dispatch({ type: 'SET_KEYWORD_2026', keyword });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const getHighestDim = useCallback(() => {
    let maxKey = '';
    let maxScore = -1;
    Object.entries(state.scores2025).forEach(([key, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxKey = key;
      }
    });
    return { key: maxKey, score: maxScore, dim: DIMENSIONS.find((d: Dimension) => d.key === maxKey)! };
  }, [state.scores2025]);

  const getLowestDim = useCallback(() => {
    let minKey = '';
    let minScore = 11;
    Object.entries(state.scores2025).forEach(([key, score]) => {
      if (score < minScore) {
        minScore = score;
        minKey = key;
      }
    });
    return { key: minKey, score: minScore, dim: DIMENSIONS.find((d: Dimension) => d.key === minKey)! };
  }, [state.scores2025]);

  const getTopGapDims = useCallback((count: number) => {
    return DIMENSIONS
      .map(dim => ({
        dim,
        gap: (state.scores2026[dim.key] || 0) - (state.scores2025[dim.key] || 0),
        score2025: state.scores2025[dim.key] || 0,
        score2026: state.scores2026[dim.key] || 0,
      }))
      .filter(item => item.gap > 0)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, count);
  }, [state.scores2025, state.scores2026]);

  const download = useCallback(() => {
    downloadState(state);
  }, [state]);

  const upload = useCallback(async (file: File) => {
    const newState = await uploadState(file);
    dispatch({ type: 'LOAD', state: newState });
  }, []);

  return (
    <AppContext.Provider value={{
      state,
      setStep,
      setScore,
      setJoy,
      setLang,
      setReflection,
      setKeyword2025,
      setAction,
      setKeyword2026,
      reset,
      getHighestDim,
      getLowestDim,
      getTopGapDims,
      download,
      upload,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
