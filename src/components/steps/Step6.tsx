import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/WizardContext';
import { WORDS, DIMENSIONS } from '../../lib/types';

export function Step6() {
  const { state, setStep, setKeyword2026 } = useApp();
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayWord, setDisplayWord] = useState<{ emoji: string; en: string; zh: string } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const t = {
    title: state.lang === 'en' ? 'Your 2026 Keyword' : '你的 2026 关键词',
    subtitle: state.lang === 'en'
      ? 'Let fate choose a word to guide your year...'
      : '让命运为你选择一个指引全年的词...',
    spinning: state.lang === 'en' ? 'Generating...' : '正在生成...',
    reveal: state.lang === 'en' ? 'Reveal My Word' : '揭晓我的关键词',
    yourWord: state.lang === 'en' ? 'Your word is' : '你的关键词是',
    notSatisfied: state.lang === 'en' ? 'Not satisfied? Try again!' : '不满意？再抽一次！',
    chooseOwn: state.lang === 'en' ? 'Or choose your own' : '或自己选择',
    customPlaceholder: state.lang === 'en' ? 'Type your keyword...' : '输入你的关键词...',
    back: state.lang === 'en' ? 'Back' : '返回',
    finish: state.lang === 'en' ? 'See My Plan' : '查看我的计划',
  };

  const spin = useCallback(() => {
    setIsSpinning(true);
    setRevealed(false);
    setShowPicker(false);

    let count = 0;
    const maxCount = 20;

    const interval = setInterval(() => {
      const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      setDisplayWord(randomWord);
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        // Final selection based on scores
        const scores = state.scores2026;
        const avg = DIMENSIONS.reduce((sum, dim) => sum + (scores[dim.key] || 0), 0) / 9;

        // Smart selection based on highest goal areas
        let selectedKey = 'growth';
        if ((scores.career || 0) >= avg && (scores.money || 0) >= avg) selectedKey = 'success';
        else if ((scores.career || 0) >= avg) selectedKey = 'impact';
        else if ((scores.body || 0) >= avg || (scores.mind || 0) >= avg) selectedKey = 'balance';
        else if ((scores.romance || 0) >= avg || (scores.family || 0) >= avg) selectedKey = 'love';
        else if ((scores.growth || 0) >= avg) selectedKey = 'breakthrough';
        else if ((scores.soul || 0) >= avg) selectedKey = 'peace';
        else if ((scores.friends || 0) >= avg) selectedKey = 'connection';
        else selectedKey = WORDS[Math.floor(Math.random() * WORDS.length)].key;

        const finalWord = WORDS.find(w => w.key === selectedKey)!;
        setDisplayWord(finalWord);
        setKeyword2026(finalWord.key);
        setIsSpinning(false);
        setRevealed(true);
      }
    }, 100);
  }, [state.scores2026, setKeyword2026]);

  const handleSelectWord = (word: typeof WORDS[0]) => {
    setDisplayWord(word);
    setKeyword2026(word.key);
    setRevealed(true);
    setShowPicker(false);
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      const custom = { emoji: '✏️', en: customInput.trim(), zh: customInput.trim() };
      setDisplayWord(custom);
      setKeyword2026(`custom:${customInput.trim()}`);
      setRevealed(true);
      setShowPicker(false);
    }
  };

  // Auto-start if no keyword yet
  useEffect(() => {
    if (!state.keyword2026 && !isSpinning && !revealed) {
      const timer = setTimeout(() => spin(), 500);
      return () => clearTimeout(timer);
    } else if (state.keyword2026 && !revealed) {
      if (state.keyword2026.startsWith('custom:')) {
        const text = state.keyword2026.replace('custom:', '');
        setDisplayWord({ emoji: '✏️', en: text, zh: text });
      } else {
        setDisplayWord(WORDS.find(w => w.key === state.keyword2026) || null);
      }
      setRevealed(true);
    }
  }, [state.keyword2026, isSpinning, revealed, spin]);

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: 'var(--text-title)' }}>
          🎰 {t.title}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.subtitle}</p>
      </div>

      {/* Blind Box */}
      <div className="relative w-48 h-48 mb-8">
        <div
          className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
            isSpinning
              ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] animate-pulse'
              : revealed
              ? 'bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] shadow-xl'
              : 'bg-white border-2 border-dashed border-[var(--border)]'
          }`}
        >
          {isSpinning && displayWord && (
            <div className="text-center animate-bounce">
              <div className="text-5xl mb-2">{displayWord.emoji}</div>
              <div className="text-white text-sm font-medium">{t.spinning}</div>
            </div>
          )}

          {revealed && displayWord && (
            <div className="text-center">
              <div className="text-6xl mb-3 animate-bounce">{displayWord.emoji}</div>
              <div className="text-white text-xl font-bold">{displayWord[state.lang]}</div>
            </div>
          )}

          {!isSpinning && !revealed && (
            <div className="text-center">
              <div className="text-5xl mb-2">🎁</div>
              <button
                onClick={spin}
                className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors"
              >
                {t.reveal}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Revealed state */}
      {revealed && displayWord && (
        <div className="text-center mb-6">
          <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{t.yourWord}</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            {displayWord.emoji} {displayWord[state.lang]}
          </p>
        </div>
      )}

      {/* Try again or choose own */}
      {revealed && (
        <div className="flex flex-col items-center gap-2 mb-6">
          <button
            onClick={spin}
            className="text-sm underline hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            🔄 {t.notSatisfied}
          </button>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="text-sm underline hover:opacity-70 transition-opacity"
            style={{ color: 'var(--accent)' }}
          >
            ✏️ {t.chooseOwn}
          </button>
        </div>
      )}

      {/* Keyword picker */}
      {showPicker && (
        <div className="w-full max-w-md mb-6 p-4 rounded-xl bg-white border border-[var(--border)]">
          <div className="flex flex-wrap justify-center gap-2 mb-4 max-h-40 overflow-y-auto">
            {WORDS.map((word) => (
              <button
                key={word.key}
                onClick={() => handleSelectWord(word)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all bg-gray-50 border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)]"
                style={{ color: 'var(--text-body)' }}
              >
                {word.emoji} {word[state.lang]}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
              placeholder={t.customPlaceholder}
              className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]"
              style={{ color: 'var(--text-body)' }}
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customInput.trim()}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setStep(5)} className="btn btn-secondary">
          ← {t.back}
        </button>
        <button
          onClick={() => setStep(7)}
          disabled={!state.keyword2026}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.finish} →
        </button>
      </div>
    </div>
  );
}
