import { useApp } from '../../context/WizardContext';
import { SingleWheel } from '../SingleWheel';
import { DIMENSIONS } from '../../lib/types';

export function Step4() {
  const { state, setStep } = useApp();

  const t = {
    title: state.lang === 'en' ? 'Design Your 2026' : '规划你的 2026',
    titleHint: state.lang === 'en'
      ? 'Where do you want to be by the end of next year?'
      : '明年年底你想达到什么状态？',
    subtitle: state.lang === 'en'
      ? 'Set your target score for each area'
      : '设定每个领域的目标分数',
    back: state.lang === 'en' ? 'Back' : '返回',
    next: state.lang === 'en' ? 'Next' : '下一步',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: 'var(--text-title)' }}>
          🎯 {t.title} <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>({t.titleHint})</span>
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.subtitle}</p>
      </div>

      <SingleWheel year="2026" />

      {/* Score list with comparison - 3x3 grid */}
      <div className="grid grid-cols-3 gap-2 mt-6 w-full max-w-md">
        {DIMENSIONS.map((dim) => {
          const score2025 = state.scores2025[dim.key];
          const score2026 = state.scores2026[dim.key];
          const gap = score2026 - score2025;

          return (
            <div
              key={dim.key}
              className="flex flex-col gap-1 px-2 py-2 rounded-lg bg-white border border-[var(--border)] cursor-help transition-all hover:border-[var(--accent)] hover:shadow-sm"
              title={state.lang === 'en' ? dim.descEn : dim.descZh}
            >
              <div className="flex items-center gap-1">
                <span className="text-sm">{dim.emoji}</span>
                <span className="text-xs truncate" style={{ color: 'var(--text-body)' }}>
                  {dim[state.lang]}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span style={{ color: 'var(--text-muted)' }}>{score2025}</span>
                <span style={{ color: 'var(--text-muted)' }}>→</span>
                <span className="font-semibold" style={{ color: 'var(--accent)' }}>{score2026}</span>
                {gap > 0 && (
                  <span className="text-[10px] px-1 rounded" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                    +{gap}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={() => setStep(3)} className="btn btn-secondary">
          ← {t.back}
        </button>
        <button onClick={() => setStep(5)} className="btn btn-primary">
          {t.next} →
        </button>
      </div>
    </div>
  );
}
