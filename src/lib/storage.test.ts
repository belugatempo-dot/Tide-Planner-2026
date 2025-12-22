import { describe, it, expect, beforeEach } from 'vitest';
import { saveState, loadState, downloadState, uploadState } from './storage';
import { initialState } from './types';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveState', () => {
    it('should save state to localStorage', () => {
      const testState = {
        ...initialState,
        step: 3 as const,
        keyword2025: 'growth',
      };

      saveState(testState);

      const saved = localStorage.getItem('tide-planner-2026-v4');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.step).toBe(3);
      expect(parsed.keyword2025).toBe('growth');
    });
  });

  describe('loadState', () => {
    it('should load state from localStorage', () => {
      const testState = {
        ...initialState,
        step: 5 as const,
        keyword2026: 'focus',
      };

      localStorage.setItem('tide-planner-2026-v4', JSON.stringify(testState));

      const loaded = loadState();
      expect(loaded.step).toBe(5);
      expect(loaded.keyword2026).toBe('focus');
    });

    it('should return initialState if no data in localStorage', () => {
      const loaded = loadState();
      expect(loaded).toEqual(initialState);
    });

    it('should return initialState if localStorage data is invalid', () => {
      localStorage.setItem('tide-planner-2026-v4', 'invalid json');

      const loaded = loadState();
      expect(loaded).toEqual(initialState);
    });

    it('should sanitize scores to ensure all dimensions exist', () => {
      const partialState = {
        ...initialState,
        scores2025: { body: 7 }, // Missing other dimensions
      };

      localStorage.setItem('tide-planner-2026-v4', JSON.stringify(partialState));

      const loaded = loadState();

      // Should have all 9 dimensions
      expect(Object.keys(loaded.scores2025).length).toBe(9);
      expect(loaded.scores2025.body).toBe(7);
      expect(loaded.scores2025.mind).toBe(5); // Default value
    });

    it('should reset invalid step to 1', () => {
      const invalidState = {
        ...initialState,
        step: 99, // Invalid step
      };

      localStorage.setItem('tide-planner-2026-v4', JSON.stringify(invalidState));

      const loaded = loadState();
      expect(loaded.step).toBe(1);
    });
  });

  describe('downloadState', () => {
    it('should create a download link with correct data', () => {
      const testState = {
        ...initialState,
        step: 4 as const,
        keyword2025: 'balance',
      };

      // Mock document.createElement and click
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      downloadState(testState);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });
  });

  describe('uploadState', () => {
    it('should parse valid JSON file', async () => {
      const testState = {
        ...initialState,
        step: 6 as const,
        keyword2026: 'courage',
      };

      const blob = new Blob([JSON.stringify(testState)], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });

      const uploaded = await uploadState(file);
      expect(uploaded.step).toBe(6);
      expect(uploaded.keyword2026).toBe('courage');
    });

    it('should reject invalid JSON', async () => {
      const blob = new Blob(['invalid json'], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });

      await expect(uploadState(file)).rejects.toThrow('Invalid file format');
    });

    it('should sanitize uploaded scores', async () => {
      const partialState = {
        ...initialState,
        scores2025: { body: 9 }, // Only one dimension
      };

      const blob = new Blob([JSON.stringify(partialState)], { type: 'application/json' });
      const file = new File([blob], 'test.json', { type: 'application/json' });

      const uploaded = await uploadState(file);

      // Should have all dimensions filled
      expect(Object.keys(uploaded.scores2025).length).toBe(9);
      expect(uploaded.scores2025.body).toBe(9);
      expect(uploaded.scores2025.mind).toBeDefined();
    });
  });
});
