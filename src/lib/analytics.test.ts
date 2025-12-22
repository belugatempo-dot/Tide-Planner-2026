import { describe, it, expect, vi } from 'vitest';

// Mock @vercel/analytics before importing analytics
vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}));

import { analytics } from './analytics';
import { track } from '@vercel/analytics';

describe('Analytics', () => {
  it('should track step completion with correct parameters', () => {
    vi.clearAllMocks();
    analytics.stepCompleted(3);
    expect(track).toHaveBeenCalledWith('step_completed', { step: 3 });
  });

  it('should track language usage', () => {
    vi.clearAllMocks();
    analytics.languageUsed('zh', 'url');
    expect(track).toHaveBeenCalledWith('language_used', { language: 'zh', source: 'url' });
  });

  it('should track plan copied event', () => {
    vi.clearAllMocks();
    analytics.planCopied();
    expect(track).toHaveBeenCalledWith('plan_copied');
  });
});
