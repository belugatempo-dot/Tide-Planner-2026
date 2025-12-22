import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock analytics
vi.mock('./lib/analytics', () => ({
  analytics: {
    languageUsed: vi.fn(),
    languageSwitched: vi.fn(),
    stepCompleted: vi.fn(),
  },
}));

describe('App - Language Switching', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Clear URL parameters
    window.history.pushState({}, '', '/');
  });

  it('should render in Chinese by default', () => {
    render(<App />);

    // Look for Chinese text
    expect(screen.getByText(/2025回顾 & 2026规划/i)).toBeInTheDocument();
    expect(screen.getByText(/在2026年成为最好的自己/i)).toBeInTheDocument();
  });

  it('should switch to English when clicking EN button', async () => {
    render(<App />);

    // Find and click the EN button
    const enButton = screen.getByRole('button', { name: /EN/i });
    fireEvent.click(enButton);

    await waitFor(() => {
      expect(screen.getByText(/2025 Reflection & 2026 Planning/i)).toBeInTheDocument();
      expect(screen.getByText(/Be your best self in 2026/i)).toBeInTheDocument();
    });
  });

  it('should update URL when switching language', async () => {
    render(<App />);

    const enButton = screen.getByRole('button', { name: /EN/i });
    fireEvent.click(enButton);

    await waitFor(() => {
      expect(window.location.search).toContain('lang=en');
    });

    const zhButton = screen.getByRole('button', { name: /中文/i });
    fireEvent.click(zhButton);

    await waitFor(() => {
      expect(window.location.search).toContain('lang=zh');
    });
  });

  it('should respect URL language parameter on load', () => {
    // Set URL parameter before rendering
    window.history.pushState({}, '', '/?lang=en');

    render(<App />);

    expect(screen.getByText(/2025 Reflection & 2026 Planning/i)).toBeInTheDocument();
  });

  it('should track language usage on load', () => {
    const { analytics } = require('./lib/analytics');

    render(<App />);

    expect(analytics.languageUsed).toHaveBeenCalledWith('zh', expect.any(String));
  });

  it('should track language switch event', async () => {
    const { analytics } = require('./lib/analytics');

    render(<App />);

    const enButton = screen.getByRole('button', { name: /EN/i });
    fireEvent.click(enButton);

    await waitFor(() => {
      expect(analytics.languageSwitched).toHaveBeenCalledWith('en');
    });
  });
});

describe('App - Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show step 1 by default', () => {
    render(<App />);

    // Step 1 specific content
    expect(screen.getByText(/身体|Body/i)).toBeInTheDocument();
  });

  it('should show progress indicator with 7 steps', () => {
    render(<App />);

    // Check for step buttons (1-7)
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });
});

describe('App - Data Persistence', () => {
  it('should save state to localStorage on changes', async () => {
    render(<App />);

    // Make a change (switch language)
    const enButton = screen.getByRole('button', { name: /EN/i });
    fireEvent.click(enButton);

    await waitFor(() => {
      const saved = localStorage.getItem('tide-planner-2026-v4');
      expect(saved).toBeTruthy();

      const parsed = JSON.parse(saved!);
      expect(parsed.lang).toBe('en');
    });
  });

  it('should restore state from localStorage on mount', () => {
    const savedState = {
      step: 3,
      lang: 'en',
      keyword2025: 'focus',
      scores2025: {},
      scores2026: {},
      joy2025: 5,
      joy2026: 7,
      reflectionHigh: '',
      reflectionLow: '',
      actions: {},
      keyword2026: '',
    };

    localStorage.setItem('tide-planner-2026-v4', JSON.stringify(savedState));

    render(<App />);

    // Should render in English (from saved state)
    expect(screen.getByText(/2025 Reflection & 2026 Planning/i)).toBeInTheDocument();
  });
});
