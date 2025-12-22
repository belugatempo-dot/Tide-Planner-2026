import { useMemo, useState } from 'react';
import { useApp } from '../../context/WizardContext';
import { WORDS, DIMENSIONS } from '../../lib/types';

export function Step3() {
  const { state, setStep, setKeyword2025 } = useApp();
  const [customInput, setCustomInput] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Generate 4 recommended keywords based on scores
  const recommendedWords = useMemo(() => {
    const scores = state.scores2025;
    const avg = DIMENSIONS.reduce((sum, dim) => sum + (scores[dim.key] || 0), 0) / 9;

    const recommendations: string[] = [];

    // Based on dimension scores
    if ((scores.body || 0) < avg || (scores.mind || 0) < avg) recommendations.push('balance', 'healing');
    if ((scores.soul || 0) < avg) recommendations.push('peace', 'gratitude');
    if ((scores.career || 0) >= avg) recommendations.push('impact', 'success');
    if ((scores.growth || 0) >= avg) recommendations.push('growth', 'breakthrough');
    if ((scores.romance || 0) < avg || (scores.family || 0) < avg) recommendations.push('love', 'connection');
    if ((scores.friends || 0) < avg) recommendations.push('connection');
    if ((scores.money || 0) < avg) recommendations.push('abundance', 'focus');

    // Add some variety
    recommendations.push('courage', 'freedom', 'joy', 'transformation');

    // Return first 4 unique words
    const unique = [...new Set(recommendations)].slice(0, 4);
    return unique.map(key => WORDS.find(w => w.key === key)!).filter(Boolean);
  }, [state.scores2025]);

  const t = {
    title: state.lang === 'en' ? 'Your 2025 Keyword' : '你的 2025 关键词',
    subtitle: state.lang === 'en'
      ? 'What word best describes your 2025?'
      : '哪个词最能概括你的 2025 年？',
    recommended: state.lang === 'en' ? 'Recommended for you' : '为你推荐',
    showAll: state.lang === 'en' ? 'Show all options' : '显示全部选项',
    hideAll: state.lang === 'en' ? 'Hide options' : '收起选项',
    customLabel: state.lang === 'en' ? 'Or enter your own word:' : '或输入自定义词语：',
    customPlaceholder: state.lang === 'en' ? 'Type your keyword...' : '输入你的关键词...',
    back: state.lang === 'en' ? 'Back' : '返回',
    next: state.lang === 'en' ? 'Next' : '下一步',
  };

  const otherWords = WORDS.filter(w => !recommendedWords.find(r => r.key === w.key));

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      setKeyword2025(`custom:${customInput.trim()}`);
    }
  };

  const getDisplayKeyword = () => {
    if (!state.keyword2025) return null;
    if (state.keyword2025.startsWith('custom:')) {
      return { emoji: '✏️', text: state.keyword2025.replace('custom:', '') };
    }
    const word = WORDS.find(w => w.key === state.keyword2025);
    return word ? { emoji: word.emoji, text: word[state.lang] } : null;
  };

  const displayKeyword = getDisplayKeyword();

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: 'var(--text-title)' }}>
          🏷️ {t.title}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.subtitle}</p>
      </div>

      {/* Selected keyword display */}
      {displayKeyword && (
        <div className="mb-6 px-6 py-3 rounded-2xl bg-[var(--accent)] text-white text-xl font-semibold shadow-lg">
          {displayKeyword.emoji} {displayKeyword.text}
        </div>
      )}

      {/* Recommended keywords */}
      <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{t.recommended}</p>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {recommendedWords.map((word) => (
          <button
            key={word.key}
            onClick={() => setKeyword2025(word.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              state.keyword2025 === word.key
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-white border-2 border-[var(--border)] hover:border-[var(--accent)] hover:shadow-sm'
            }`}
            style={{ color: state.keyword2025 === word.key ? 'white' : 'var(--text-body)' }}
          >
            {word.emoji} {word[state.lang]}
          </button>
        ))}
      </div>

      {/* Toggle to show all */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="text-xs mb-4 underline"
        style={{ color: 'var(--accent)' }}
      >
        {showAll ? t.hideAll : t.showAll} ({otherWords.length})
      </button>

      {/* All other keywords */}
      {showAll && (
        <div className="flex flex-wrap justify-center gap-2 mb-6 max-h-48 overflow-y-auto p-2">
          {otherWords.map((word) => (
            <button
              key={word.key}
              onClick={() => setKeyword2025(word.key)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                state.keyword2025 === word.key
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-white border border-[var(--border)] hover:border-[var(--accent)]'
              }`}
              style={{ color: state.keyword2025 === word.key ? 'white' : 'var(--text-muted)' }}
            >
              {word.emoji} {word[state.lang]}
            </button>
          ))}
        </div>
      )}

      {/* Custom input */}
      <div className="w-full max-w-sm mb-8">
        <p className="text-xs mb-2 text-center" style={{ color: 'var(--text-muted)' }}>{t.customLabel}</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
            placeholder={t.customPlaceholder}
            className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]"
            style={{ color: 'var(--text-body)' }}
          />
          <button
            onClick={handleCustomSubmit}
            disabled={!customInput.trim()}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all disabled:opacity-50"
          >
            OK
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(2)} className="btn btn-secondary">
          ← {t.back}
        </button>
        <button
          onClick={() => setStep(4)}
          disabled={!state.keyword2025}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.next} →
        </button>
      </div>
    </div>
  );
}
