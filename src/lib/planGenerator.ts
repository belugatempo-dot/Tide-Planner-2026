import type { AppState } from './types';
import { DIMENSIONS, WORDS } from './types';

export function generateMarkdown(state: AppState): string {
  const { scores2025, scores2026, keyword2025, keyword2026, reflectionHigh, reflectionLow, actions, joy2025, joy2026, lang } = state;
  const word2025 = WORDS.find(w => w.key === keyword2025);
  const word2026 = WORDS.find(w => w.key === keyword2026);

  // Calculate average from 9 DIMENSIONS + Joy = 10 items
  const avg2025 = ((DIMENSIONS.reduce((sum, dim) => sum + (scores2025[dim.key] || 0), 0) + joy2025) / 10).toFixed(1);
  const avg2026 = ((DIMENSIONS.reduce((sum, dim) => sum + (scores2026[dim.key] || 0), 0) + joy2026) / 10).toFixed(1);

  // Find highest and lowest scoring dimensions
  let highKey = '', highScore = -1, lowKey = '', lowScore = 11;
  Object.entries(scores2025).forEach(([key, score]) => {
    if (score > highScore) { highScore = score; highKey = key; }
    if (score < lowScore) { lowScore = score; lowKey = key; }
  });
  const highDim = DIMENSIONS.find(d => d.key === highKey);
  const lowDim = DIMENSIONS.find(d => d.key === lowKey);

  if (lang === 'zh') {
    return `# 🌊 Tide Planner 2026

## 年度关键词
- **2025:** ${word2025?.emoji || '❓'} ${word2025?.zh || '未选择'}
- **2026:** ${word2026?.emoji || '❓'} ${word2026?.zh || '未选择'}

## 2025 回顾

### 评分
| 维度 | 2025 | 2026 | 差距 |
|------|------|------|------|
${DIMENSIONS.map(d => `| ${d.emoji} ${d.zh} | ${scores2025[d.key]} | ${scores2026[d.key]} | ${scores2026[d.key] - scores2025[d.key] > 0 ? '+' : ''}${scores2026[d.key] - scores2025[d.key]} |`).join('\n')}

**平均分：** ${avg2025} → ${avg2026}

### 反思
${highDim ? `**🏆 最高分 - ${highDim.emoji} ${highDim.zh} (${highScore}/10)**` : ''}
${reflectionHigh ? `> ${reflectionHigh}` : ''}

${lowDim ? `**💪 最低分 - ${lowDim.emoji} ${lowDim.zh} (${lowScore}/10)**` : ''}
${reflectionLow ? `> ${reflectionLow}` : ''}

## 2026 重点领域 & 行动
${DIMENSIONS
  .map(d => ({ d, gap: scores2026[d.key] - scores2025[d.key] }))
  .filter(item => item.gap > 0)
  .sort((a, b) => b.gap - a.gap)
  .slice(0, 3)
  .map((item, i) => {
    const dimActions = actions[item.d.key] || [];
    const actionStr = dimActions.length > 0 ? `\n   - 行动: ${dimActions.join(', ')}` : '';
    return `${i + 1}. ${item.d.emoji} ${item.d.zh} (${scores2025[item.d.key]} → ${scores2026[item.d.key]}, +${item.gap})${actionStr}`;
  })
  .join('\n')}

---
*Tide Planner | 人生平衡轮方法*`;
  }

  return `# 🌊 Tide Planner 2026

## Keywords
- **2025:** ${word2025?.emoji || '❓'} ${word2025?.en || 'Not selected'}
- **2026:** ${word2026?.emoji || '❓'} ${word2026?.en || 'Not selected'}

## 2025 Review

### Scores
| Dimension | 2025 | 2026 | Gap |
|-----------|------|------|-----|
${DIMENSIONS.map(d => `| ${d.emoji} ${d.en} | ${scores2025[d.key]} | ${scores2026[d.key]} | ${scores2026[d.key] - scores2025[d.key] > 0 ? '+' : ''}${scores2026[d.key] - scores2025[d.key]} |`).join('\n')}

**Average:** ${avg2025} → ${avg2026}

### Reflections
${highDim ? `**🏆 Highest - ${highDim.emoji} ${highDim.en} (${highScore}/10)**` : ''}
${reflectionHigh ? `> ${reflectionHigh}` : ''}

${lowDim ? `**💪 Lowest - ${lowDim.emoji} ${lowDim.en} (${lowScore}/10)**` : ''}
${reflectionLow ? `> ${reflectionLow}` : ''}

## 2026 Focus Areas & Actions
${DIMENSIONS
  .map(d => ({ d, gap: scores2026[d.key] - scores2025[d.key] }))
  .filter(item => item.gap > 0)
  .sort((a, b) => b.gap - a.gap)
  .slice(0, 3)
  .map((item, i) => {
    const dimActions = actions[item.d.key] || [];
    const actionStr = dimActions.length > 0 ? `\n   - Actions: ${dimActions.join(', ')}` : '';
    return `${i + 1}. ${item.d.emoji} ${item.d.en} (${scores2025[item.d.key]} → ${scores2026[item.d.key]}, +${item.gap})${actionStr}`;
  })
  .join('\n')}

---
*Tide Planner | Life Wheel Method*`;
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

export function generateCalendarICS(lang: 'en' | 'zh'): string {
  const uid = () => Math.random().toString(36).substr(2, 9);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const quarters: [number, number, string][] = [
    [3, 31, 'Q1'],
    [6, 30, 'Q2'],
    [9, 30, 'Q3'],
    [12, 31, 'Q4'],
  ];

  let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TidePlanner//EN\n';

  quarters.forEach(([m, d, q]) => {
    const date = new Date(2026, m - 1, d, 10, 0);
    const endDate = new Date(date.getTime() + 3600000);
    const title = lang === 'en' ? `${q} Life Wheel Review` : `${q} 人生平衡轮复盘`;
    ics += `BEGIN:VEVENT\nUID:${uid()}@tide\nDTSTART:${fmt(date)}\nDTEND:${fmt(endDate)}\nSUMMARY:${title}\nEND:VEVENT\n`;
  });

  ics += 'END:VCALENDAR';
  return ics;
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
