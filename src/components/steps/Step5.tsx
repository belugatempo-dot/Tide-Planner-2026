import { useState } from 'react';
import { useApp } from '../../context/WizardContext';
import { ACTION_PRESETS } from '../../lib/types';

export function Step5() {
  const { state, setStep, setAction, getTopGapDims } = useApp();
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const topGaps = getTopGapDims(3);

  const t = {
    title: state.lang === 'en' ? 'Action Plan' : '行动规划',
    subtitle: state.lang === 'en'
      ? 'Choose up to 3 actions for each focus area'
      : '为每个重点领域选择最多3个行动',
    question: state.lang === 'en'
      ? 'What are your key actions for 2026?'
      : '2026年你的关键行动是什么？',
    customPlaceholder: state.lang === 'en' ? 'Add custom action...' : '添加自定义行动...',
    selected: state.lang === 'en' ? 'selected' : '已选',
    maxReached: state.lang === 'en' ? '(max 3)' : '(最多3个)',
    back: state.lang === 'en' ? 'Back' : '返回',
    next: state.lang === 'en' ? 'Next' : '下一步',
  };

  const handlePresetClick = (dimKey: string, action: string) => {
    const currentActions = state.actions[dimKey] || [];
    const isSelected = currentActions.includes(action);
    setAction(dimKey, action, isSelected); // Toggle: remove if selected, add if not
  };

  const handleCustomSubmit = (dimKey: string) => {
    if (customInputs[dimKey]?.trim()) {
      setAction(dimKey, customInputs[dimKey].trim());
      setCustomInputs({ ...customInputs, [dimKey]: '' });
    }
  };

  const allActionsSet = topGaps.every(({ dim }) => (state.actions[dim.key]?.length || 0) > 0);

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ color: 'var(--text-title)' }}>
          🎯 {t.title}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t.subtitle}</p>
      </div>

      <div className="w-full space-y-6">
        {topGaps.map(({ dim, gap, score2025, score2026 }) => {
          const presets = ACTION_PRESETS[dim.key]?.[state.lang] || [];

          return (
            <div key={dim.key} className="p-4 rounded-xl bg-white border border-[var(--border)]">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{dim.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium" style={{ color: 'var(--text-title)' }}>
                    {dim[state.lang]}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>{score2025}</span>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <span className="font-bold" style={{ color: 'var(--accent)' }}>{score2026}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      +{gap}
                    </span>
                  </div>
                </div>
              </div>

              {/* Question */}
              <p className="text-sm mb-3" style={{ color: 'var(--text-body)' }}>
                {dim.emoji} {dim[state.lang]} {state.lang === 'en' ? 'going from' : '从'} {score2025} → {score2026}
                {state.lang === 'en' ? ', ' : '，'}{t.question}
              </p>

              {/* Preset options */}
              <div className="flex flex-wrap gap-2 mb-3">
                {presets.map((preset) => {
                  const currentActions = state.actions[dim.key] || [];
                  const isSelected = currentActions.includes(preset);
                  const atLimit = currentActions.length >= 3;

                  return (
                    <button
                      key={preset}
                      onClick={() => handlePresetClick(dim.key, preset)}
                      disabled={!isSelected && atLimit}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        isSelected
                          ? 'bg-[var(--accent)] text-white'
                          : atLimit
                          ? 'bg-gray-100 border border-[var(--border)] opacity-50 cursor-not-allowed'
                          : 'bg-gray-50 border border-[var(--border)] hover:border-[var(--accent)]'
                      }`}
                      style={{ color: isSelected ? 'white' : 'var(--text-body)' }}
                    >
                      {isSelected && '✓ '}{preset}
                    </button>
                  );
                })}
              </div>

              {/* Custom input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInputs[dim.key] || ''}
                  onChange={(e) => setCustomInputs({ ...customInputs, [dim.key]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit(dim.key)}
                  placeholder={t.customPlaceholder}
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]"
                  style={{ color: 'var(--text-body)' }}
                />
                <button
                  onClick={() => handleCustomSubmit(dim.key)}
                  disabled={!customInputs[dim.key]?.trim()}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all disabled:opacity-50"
                >
                  OK
                </button>
              </div>

              {/* Selected actions */}
              {(state.actions[dim.key]?.length || 0) > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {state.lang === 'en' ? 'Your actions:' : '你的行动：'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      {state.actions[dim.key].length}/3
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {state.actions[dim.key].map((action, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                      >
                        <span>✓ {action}</span>
                        <button
                          onClick={() => setAction(dim.key, action, true)}
                          className="ml-1 hover:opacity-70 transition-opacity"
                          title={state.lang === 'en' ? 'Remove' : '移除'}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {topGaps.length === 0 && (
        <div className="text-center py-8">
          <p style={{ color: 'var(--text-muted)' }}>
            {state.lang === 'en'
              ? 'No improvement areas detected. Go back to set higher 2026 goals!'
              : '未检测到需要提升的领域。返回设定更高的2026目标！'}
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <button onClick={() => setStep(4)} className="btn btn-secondary">
          ← {t.back}
        </button>
        <button
          onClick={() => setStep(6)}
          disabled={topGaps.length > 0 && !allActionsSet}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t.next} →
        </button>
      </div>
    </div>
  );
}
