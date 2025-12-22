import { useApp } from '../../context/WizardContext';

export function Step2() {
  const { state, setStep, setReflection, getHighestDim, getLowestDim } = useApp();

  const highest = getHighestDim();
  const lowest = getLowestDim();

  const t = {
    title: state.lang === 'en' ? 'Reflect on 2025' : '反思 2025',
    subtitle: state.lang === 'en'
      ? 'Let\'s dig deeper into your highs and lows'
      : '深入回顾你的高光与低谷',
    highLabel: state.lang === 'en'
      ? `Your highest: ${highest.dim[state.lang]} (${highest.score}/10)`
      : `你的最高分: ${highest.dim[state.lang]} (${highest.score}/10)`,
    highQuestion: state.lang === 'en'
      ? 'What did you do right? What made this area shine?'
      : '你做对了什么？是什么让这个领域表现出色？',
    lowLabel: state.lang === 'en'
      ? `Your lowest: ${lowest.dim[state.lang]} (${lowest.score}/10)`
      : `你的最低分: ${lowest.dim[state.lang]} (${lowest.score}/10)`,
    lowQuestion: state.lang === 'en'
      ? 'What was your biggest obstacle? What held you back?'
      : '最大的障碍是什么？是什么阻碍了你？',
    placeholder1: state.lang === 'en'
      ? 'e.g., Stayed consistent with my habits...'
      : '例如：保持了良好的习惯...',
    placeholder2: state.lang === 'en'
      ? 'e.g., Lack of time, too many distractions...'
      : '例如：时间不够，干扰太多...',
    back: state.lang === 'en' ? 'Back' : '返回',
    next: state.lang === 'en' ? 'Next' : '下一步',
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: 'var(--text-title)' }}>
          💭 {t.title}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.subtitle}</p>
      </div>

      {/* Highest score question */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{highest.dim.emoji}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
            🏆 {t.highLabel}
          </span>
        </div>
        <label className="block text-sm mb-2" style={{ color: 'var(--text-body)' }}>
          {t.highQuestion}
        </label>
        <textarea
          value={state.reflectionHigh}
          onChange={(e) => setReflection('high', e.target.value)}
          placeholder={t.placeholder1}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          style={{ color: 'var(--text-body)' }}
        />
      </div>

      {/* Lowest score question */}
      <div className="w-full mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{lowest.dim.emoji}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            💪 {t.lowLabel}
          </span>
        </div>
        <label className="block text-sm mb-2" style={{ color: 'var(--text-body)' }}>
          {t.lowQuestion}
        </label>
        <textarea
          value={state.reflectionLow}
          onChange={(e) => setReflection('low', e.target.value)}
          placeholder={t.placeholder2}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          style={{ color: 'var(--text-body)' }}
        />
      </div>

      <div className="flex gap-3">
        <button onClick={() => setStep(1)} className="btn btn-secondary">
          ← {t.back}
        </button>
        <button onClick={() => setStep(3)} className="btn btn-primary">
          {t.next} →
        </button>
      </div>
    </div>
  );
}
