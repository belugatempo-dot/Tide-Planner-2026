import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateMarkdown, copyToClipboard, generateCalendarICS, downloadFile } from './planGenerator';
import type { AppState } from './types';
import { createInitialScores } from './types';

// Mock navigator.clipboard
const mockWriteText = vi.fn();
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
  configurable: true,
});

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:test-url');
const mockRevokeObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

describe('planGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMarkdown', () => {
    const baseState: AppState = {
      step: 7,
      scores2025: { ...createInitialScores(5), body: 8, mind: 6, career: 4 },
      scores2026: { ...createInitialScores(7), body: 9, mind: 8, career: 7 },
      joy2025: 6,
      joy2026: 8,
      reflectionHigh: 'I achieved great physical health',
      reflectionLow: 'Career needs more focus',
      keyword2025: 'growth',
      keyword2026: 'balance',
      actions: {
        career: ['Change jobs', 'Get promoted'],
        mind: ['Start meditation'],
      },
      lang: 'en',
    };

    it('should generate English markdown with correct structure', () => {
      const md = generateMarkdown(baseState);

      expect(md).toContain('# 🌊 Tide Planner 2026');
      expect(md).toContain('## Keywords');
      expect(md).toContain('**2025:** 🌱 Growth');
      expect(md).toContain('**2026:** ⚖️ Balance');
      expect(md).toContain('## 2025 Review');
      expect(md).toContain('### Scores');
      expect(md).toContain('| Dimension | 2025 | 2026 | Gap |');
    });

    it('should generate Chinese markdown when lang is zh', () => {
      const zhState = { ...baseState, lang: 'zh' as const };
      const md = generateMarkdown(zhState);

      expect(md).toContain('# 🌊 Tide Planner 2026');
      expect(md).toContain('## 年度关键词');
      expect(md).toContain('## 2025 回顾');
      expect(md).toContain('### 评分');
      expect(md).toContain('| 维度 | 2025 | 2026 | 差距 |');
    });

    it('should include reflections in output', () => {
      const md = generateMarkdown(baseState);

      expect(md).toContain('### Reflections');
      expect(md).toContain('I achieved great physical health');
      expect(md).toContain('Career needs more focus');
    });

    it('should show focus areas with positive gaps', () => {
      const md = generateMarkdown(baseState);

      expect(md).toContain('## 2026 Focus Areas & Actions');
      // Career has +3 gap, mind has +2 gap
      expect(md).toContain('Career');
      expect(md).toContain('Mind');
    });

    it('should include actions for focus areas', () => {
      const md = generateMarkdown(baseState);

      expect(md).toContain('Actions: Change jobs, Get promoted');
      expect(md).toContain('Actions: Start meditation');
    });

    it('should calculate and display average scores', () => {
      const md = generateMarkdown(baseState);

      // Average calculation: (sum of 9 dimension scores + joy) / 10
      expect(md).toContain('**Average:**');
    });

    it('should handle missing keywords gracefully', () => {
      const stateWithoutKeywords = {
        ...baseState,
        keyword2025: '',
        keyword2026: '',
      };
      const md = generateMarkdown(stateWithoutKeywords);

      expect(md).toContain('❓ Not selected');
    });

    it('should show gap direction with + sign for improvements', () => {
      const md = generateMarkdown(baseState);

      // Career goes from 4 to 7, so +3
      expect(md).toMatch(/Career.*\+3/);
    });
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard and return true on success', async () => {
      mockWriteText.mockResolvedValue(undefined);

      const result = await copyToClipboard('test content');

      expect(mockWriteText).toHaveBeenCalledWith('test content');
      expect(result).toBe(true);
    });

    it('should return false on clipboard error', async () => {
      mockWriteText.mockRejectedValue(new Error('Clipboard error'));

      const result = await copyToClipboard('test content');

      expect(result).toBe(false);
    });
  });

  describe('generateCalendarICS', () => {
    it('should generate valid ICS format', () => {
      const ics = generateCalendarICS('en');

      expect(ics).toContain('BEGIN:VCALENDAR');
      expect(ics).toContain('VERSION:2.0');
      expect(ics).toContain('PRODID:-//TidePlanner//EN');
      expect(ics).toContain('END:VCALENDAR');
    });

    it('should include 4 quarterly review events', () => {
      const ics = generateCalendarICS('en');

      const eventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
      expect(eventCount).toBe(4);
    });

    it('should have correct English titles', () => {
      const ics = generateCalendarICS('en');

      expect(ics).toContain('SUMMARY:Q1 Life Wheel Review');
      expect(ics).toContain('SUMMARY:Q2 Life Wheel Review');
      expect(ics).toContain('SUMMARY:Q3 Life Wheel Review');
      expect(ics).toContain('SUMMARY:Q4 Life Wheel Review');
    });

    it('should have correct Chinese titles', () => {
      const ics = generateCalendarICS('zh');

      expect(ics).toContain('SUMMARY:Q1 人生平衡轮复盘');
      expect(ics).toContain('SUMMARY:Q2 人生平衡轮复盘');
      expect(ics).toContain('SUMMARY:Q3 人生平衡轮复盘');
      expect(ics).toContain('SUMMARY:Q4 人生平衡轮复盘');
    });

    it('should set events for end of each quarter in 2026', () => {
      const ics = generateCalendarICS('en');

      // Q1: March 31, Q2: June 30, Q3: Sept 30, Q4: Dec 31
      expect(ics).toContain('DTSTART:20260331');
      expect(ics).toContain('DTSTART:20260630');
      expect(ics).toContain('DTSTART:20260930');
      expect(ics).toContain('DTSTART:20261231');
    });

    it('should include unique UIDs for each event', () => {
      const ics = generateCalendarICS('en');

      const uids = ics.match(/UID:[a-z0-9]+@tide/g) || [];
      expect(uids.length).toBe(4);
      // All UIDs should be unique
      const uniqueUids = new Set(uids);
      expect(uniqueUids.size).toBe(4);
    });
  });

  describe('downloadFile', () => {
    it('should create and trigger download link', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      createElementSpy.mockReturnValue(mockLink as unknown as HTMLAnchorElement);

      downloadFile('test content', 'test.txt', 'text/plain');

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockLink.download).toBe('test.txt');
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();
    });

    it('should create blob with correct content and type', () => {
      const blobSpy = vi.spyOn(global, 'Blob');
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);

      downloadFile('{"test": true}', 'data.json', 'application/json');

      expect(blobSpy).toHaveBeenCalledWith(['{"test": true}'], { type: 'application/json' });
    });
  });
});
