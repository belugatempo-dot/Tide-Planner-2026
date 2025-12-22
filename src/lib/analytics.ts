import { track } from '@vercel/analytics';

/**
 * Analytics tracking utilities for Tide Planner
 * Tracks user behavior and conversion events
 */

export const analytics = {
  // Step completion tracking
  stepCompleted: (stepNumber: number) => {
    track('step_completed', { step: stepNumber });
  },

  // Language switch
  languageSwitched: (language: 'en' | 'zh') => {
    track('language_switched', { language });
  },

  // Life wheel interactions
  wheelScoreChanged: (year: '2025' | '2026', dimension: string, score: number) => {
    track('wheel_score_changed', { year, dimension, score });
  },

  joyScoreChanged: (year: '2025' | '2026', joy: number) => {
    track('joy_score_changed', { year, joy });
  },

  // Reflection and planning
  reflectionAdded: (type: 'high' | 'low') => {
    track('reflection_added', { type });
  },

  keywordSelected: (year: '2025' | '2026', keyword: string) => {
    track('keyword_selected', { year, keyword });
  },

  actionCommitted: (dimension: string, action: string) => {
    track('action_committed', { dimension, action });
  },

  // Final outputs - conversion events
  planGenerated: () => {
    track('plan_generated');
  },

  planCopied: () => {
    track('plan_copied');
  },

  planDownloaded: () => {
    track('plan_downloaded');
  },

  planPrinted: () => {
    track('plan_printed');
  },

  calendarExported: () => {
    track('calendar_exported');
  },

  imageShared: () => {
    track('image_shared');
  },

  // Data management
  dataDownloaded: () => {
    track('data_downloaded');
  },

  dataUploaded: () => {
    track('data_uploaded');
  },

  // Journey restart
  journeyRestarted: () => {
    track('journey_restarted');
  },

  // Completion funnel
  wizardCompleted: () => {
    track('wizard_completed');
  },
};
