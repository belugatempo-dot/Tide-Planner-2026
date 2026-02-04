import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider, useApp } from './WizardContext';

// Mock analytics
vi.mock('../lib/analytics', () => ({
  analytics: {
    languageUsed: vi.fn(),
    languageSwitched: vi.fn(),
    stepCompleted: vi.fn(),
    wizardCompleted: vi.fn(),
    keywordSelected: vi.fn(),
    actionCommitted: vi.fn(),
    journeyRestarted: vi.fn(),
    dataDownloaded: vi.fn(),
    dataUploaded: vi.fn(),
    wheelScoreChanged: vi.fn(),
    joyScoreChanged: vi.fn(),
  },
}));

// Mock storage
vi.mock('../lib/storage', () => ({
  saveState: vi.fn(),
  loadState: vi.fn(() => ({
    step: 1,
    scores2025: { body: 5, mind: 5, soul: 5, romance: 5, family: 5, friends: 5, career: 5, money: 5, growth: 5 },
    scores2026: { body: 7, mind: 7, soul: 7, romance: 7, family: 7, friends: 7, career: 7, money: 7, growth: 7 },
    joy2025: 5,
    joy2026: 7,
    reflectionHigh: '',
    reflectionLow: '',
    keyword2025: '',
    actions: {},
    keyword2026: '',
    lang: 'zh',
  })),
  downloadState: vi.fn(),
  uploadState: vi.fn(),
}));

// Test component that exposes context methods
function TestConsumer({ onMount }: { onMount?: (ctx: ReturnType<typeof useApp>) => void }) {
  const ctx = useApp();

  // Call onMount callback if provided
  if (onMount) {
    onMount(ctx);
  }

  return (
    <div>
      <span data-testid="step">{ctx.state.step}</span>
      <span data-testid="lang">{ctx.state.lang}</span>
      <span data-testid="joy2025">{ctx.state.joy2025}</span>
      <span data-testid="joy2026">{ctx.state.joy2026}</span>
      <span data-testid="keyword2025">{ctx.state.keyword2025}</span>
      <span data-testid="keyword2026">{ctx.state.keyword2026}</span>
      <span data-testid="reflectionHigh">{ctx.state.reflectionHigh}</span>
      <span data-testid="body2025">{ctx.state.scores2025.body}</span>
      <span data-testid="body2026">{ctx.state.scores2026.body}</span>
      <span data-testid="actions-career">{JSON.stringify(ctx.state.actions.career || [])}</span>
      <button onClick={() => ctx.setStep(2)}>Go to Step 2</button>
      <button onClick={() => ctx.setStep(4)}>Go to Step 4</button>
      <button onClick={() => ctx.setStep(7)}>Go to Step 7</button>
      <button onClick={() => ctx.setLang('en')}>Switch to EN</button>
      <button onClick={() => ctx.setScore('2025', 'body', 8)}>Set Body 2025</button>
      <button onClick={() => ctx.setScore('2026', 'body', 9)}>Set Body 2026</button>
      <button onClick={() => ctx.setJoy('2025', 7)}>Set Joy 2025</button>
      <button onClick={() => ctx.setJoy('2026', 9)}>Set Joy 2026</button>
      <button onClick={() => ctx.setReflection('high', 'Great year!')}>Set High Reflection</button>
      <button onClick={() => ctx.setKeyword2025('growth')}>Set Keyword 2025</button>
      <button onClick={() => ctx.setKeyword2026('balance')}>Set Keyword 2026</button>
      <button onClick={() => ctx.setAction('career', 'Change jobs')}>Add Career Action</button>
      <button onClick={() => ctx.setAction('career', 'Get promoted')}>Add Second Action</button>
      <button onClick={() => ctx.setAction('career', 'Change jobs', true)}>Remove Career Action</button>
      <button onClick={() => ctx.reset()}>Reset</button>
    </div>
  );
}

describe('WizardContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    window.history.replaceState({}, '', '/');
  });

  describe('Provider initialization', () => {
    it('should provide initial state', () => {
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      expect(screen.getByTestId('step')).toHaveTextContent('1');
      expect(screen.getByTestId('lang')).toHaveTextContent('zh');
    });

    it('should throw error when useApp is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TestConsumer />)).toThrow('useApp must be used within AppProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Step navigation', () => {
    it('should update step when setStep is called', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Go to Step 2'));

      expect(screen.getByTestId('step')).toHaveTextContent('2');
    });

    it('should copy 2025 scores to 2026 when entering step 4', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      // First set a 2025 score
      await user.click(screen.getByText('Set Body 2025'));
      expect(screen.getByTestId('body2025')).toHaveTextContent('8');

      // Now go to step 4
      await user.click(screen.getByText('Go to Step 4'));

      // 2026 should now have the 2025 values
      expect(screen.getByTestId('body2026')).toHaveTextContent('8');
    });

    it('should track wizard completion when reaching step 7', async () => {
      const { analytics } = await import('../lib/analytics');
      const user = userEvent.setup();

      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Go to Step 7'));

      expect(analytics.wizardCompleted).toHaveBeenCalled();
    });
  });

  describe('Score management', () => {
    it('should update 2025 scores', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Set Body 2025'));

      expect(screen.getByTestId('body2025')).toHaveTextContent('8');
    });

    it('should update 2026 scores', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Set Body 2026'));

      expect(screen.getByTestId('body2026')).toHaveTextContent('9');
    });
  });

  describe('Joy score management', () => {
    it('should update 2025 joy score', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Set Joy 2025'));

      expect(screen.getByTestId('joy2025')).toHaveTextContent('7');
    });

    it('should update 2026 joy score', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Set Joy 2026'));

      expect(screen.getByTestId('joy2026')).toHaveTextContent('9');
    });
  });

  describe('Language switching', () => {
    it('should update language', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Switch to EN'));

      expect(screen.getByTestId('lang')).toHaveTextContent('en');
    });

    it('should update URL when switching language', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Switch to EN'));

      await waitFor(() => {
        expect(window.location.search).toContain('lang=en');
      });
    });
  });

  describe('Reflection management', () => {
    it('should update high reflection', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Set High Reflection'));

      expect(screen.getByTestId('reflectionHigh')).toHaveTextContent('Great year!');
    });
  });

  describe('Keyword management', () => {
    it('should update 2025 keyword', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Set Keyword 2025'));

      expect(screen.getByTestId('keyword2025')).toHaveTextContent('growth');
    });

    it('should update 2026 keyword', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Set Keyword 2026'));

      expect(screen.getByTestId('keyword2026')).toHaveTextContent('balance');
    });
  });

  describe('Action management', () => {
    it('should add action to dimension', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Add Career Action'));

      expect(screen.getByTestId('actions-career')).toHaveTextContent('["Change jobs"]');
    });

    it('should not add duplicate actions', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Add Career Action'));
      await user.click(screen.getByText('Add Career Action'));

      expect(screen.getByTestId('actions-career')).toHaveTextContent('["Change jobs"]');
    });

    it('should allow up to 3 actions per dimension', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Add Career Action'));
      await user.click(screen.getByText('Add Second Action'));

      const actions = JSON.parse(screen.getByTestId('actions-career').textContent || '[]');
      expect(actions).toHaveLength(2);
      expect(actions).toContain('Change jobs');
      expect(actions).toContain('Get promoted');
    });

    it('should remove action when remove flag is true', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      await user.click(screen.getByText('Add Career Action'));
      expect(screen.getByTestId('actions-career')).toHaveTextContent('["Change jobs"]');

      await user.click(screen.getByText('Remove Career Action'));
      expect(screen.getByTestId('actions-career')).toHaveTextContent('[]');
    });
  });

  describe('Reset functionality', () => {
    it('should reset state but preserve language', async () => {
      const user = userEvent.setup();
      render(
        <AppProvider>
          <TestConsumer />
        </AppProvider>
      );

      // Make some changes
      await user.click(screen.getByText('Switch to EN'));
      await user.click(screen.getByText('Go to Step 2'));
      await user.click(screen.getByText('Set Keyword 2025'));

      // Reset
      await user.click(screen.getByText('Reset'));

      // Step and keyword should be reset
      expect(screen.getByTestId('step')).toHaveTextContent('1');
      expect(screen.getByTestId('keyword2025')).toHaveTextContent('');

      // Language should be preserved
      expect(screen.getByTestId('lang')).toHaveTextContent('en');
    });
  });

  describe('Helper functions', () => {
    it('should calculate highest scoring dimension', async () => {
      let capturedCtx: ReturnType<typeof useApp> | null = null;

      render(
        <AppProvider>
          <TestConsumer onMount={(ctx) => { capturedCtx = ctx; }} />
        </AppProvider>
      );

      await act(async () => {
        capturedCtx!.setScore('2025', 'body', 10);
      });

      const highest = capturedCtx!.getHighestDim();
      expect(highest.key).toBe('body');
      expect(highest.score).toBe(10);
    });

    it('should calculate lowest scoring dimension', async () => {
      let capturedCtx: ReturnType<typeof useApp> | null = null;

      render(
        <AppProvider>
          <TestConsumer onMount={(ctx) => { capturedCtx = ctx; }} />
        </AppProvider>
      );

      await act(async () => {
        capturedCtx!.setScore('2025', 'career', 1);
      });

      const lowest = capturedCtx!.getLowestDim();
      expect(lowest.key).toBe('career');
      expect(lowest.score).toBe(1);
    });

    it('should return top gap dimensions sorted by gap', async () => {
      let capturedCtx: ReturnType<typeof useApp> | null = null;

      render(
        <AppProvider>
          <TestConsumer onMount={(ctx) => { capturedCtx = ctx; }} />
        </AppProvider>
      );

      await act(async () => {
        capturedCtx!.setScore('2025', 'body', 3);
        capturedCtx!.setScore('2025', 'mind', 4);
        capturedCtx!.setScore('2025', 'career', 2);
        capturedCtx!.setScore('2026', 'body', 8);  // gap: 5
        capturedCtx!.setScore('2026', 'mind', 7);  // gap: 3
        capturedCtx!.setScore('2026', 'career', 9); // gap: 7
      });

      const topGaps = capturedCtx!.getTopGapDims(2);

      expect(topGaps).toHaveLength(2);
      expect(topGaps[0].dim.key).toBe('career'); // Highest gap: 7
      expect(topGaps[0].gap).toBe(7);
      expect(topGaps[1].dim.key).toBe('body');   // Second highest: 5
      expect(topGaps[1].gap).toBe(5);
    });
  });
});
