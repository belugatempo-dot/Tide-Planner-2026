import { describe, it, expect, vi } from 'vitest';

// Mock @vercel/analytics
const mockTrack = vi.fn();
vi.mock('@vercel/analytics', () => ({
  track: mockTrack,
}));

import { analytics } from './analytics';

describe('Analytics', () => {
  it('should track step completion with correct parameters', () => {
    analytics.stepCompleted(3);
    expect(mockTrack).toHaveBeenCalledWith('step_completed', { step: 3 });
  });

  it('should track language usage', () => {
    analytics.languageUsed('zh', 'url');
    expect(mockTrack).toHaveBeenCalledWith('language_used', { language: 'zh', source: 'url' });
  });

  it('should track plan copied event', () => {
    analytics.planCopied();
    expect(mockTrack).toHaveBeenCalledWith('plan_copied');
  });
});
