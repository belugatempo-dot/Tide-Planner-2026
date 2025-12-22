import { useApp } from '../../context/WizardContext';
import { SingleWheel } from '../SingleWheel';
import { DIMENSIONS } from '../../lib/types';

export function Step1() {
  const { state, setStep } = useApp();

  const t = {
    title: state.lang === 'en' ? 'Rate Your 2025' : '评估你的 2025',
    titleHint: state.lang === 'en'
      ? 'How satisfied are you with each area?'
      : '你对各个方面满意度如何？',
    instruction: state.lang === 'en'
      ? 'Click or drag on each slice to rate (1-10)'
      : '点击或拖动扇形评分（1-10）',
    next: state.lang === 'en' ? 'Next' : '下一步',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: 'var(--text-title)' }}>
          📍 {t.title} <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>({t.titleHint})</span>
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.instruction}</p>
      </div>

      <SingleWheel year="2025" />

      {/* Score list - 3x3 grid */}
      <div className="grid grid-cols-3 gap-2 mt-6 w-full max-w-md">
        {DIMENSIONS.map((dim) => (
          <div
            key={dim.key}
            className="flex items-center gap-1.5 px-2 py-2 rounded-lg bg-white border border-[var(--border)] cursor-help transition-all hover:border-[var(--accent)] hover:shadow-sm"
            title={state.lang === 'en' ? dim.descEn : dim.descZh}
          >
            <span className="text-sm">{dim.emoji}</span>
            <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-body)' }}>
              {dim[state.lang]}
            </span>
            <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>
              {state.scores2025[dim.key]}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setStep(2)}
        className="btn btn-primary mt-8"
      >
        {t.next} →
      </button>
    </div>
  );
}
