import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useApp } from '../../context/WizardContext';
import { DIMENSIONS, WORDS } from '../../lib/types';
import { generateMarkdown, copyToClipboard, downloadFile, generateCalendarICS } from '../../lib/planGenerator';
import { ShareCard } from '../ShareCard';

export function Step7() {
  const { state, reset, getHighestDim, getLowestDim, getTopGapDims } = useApp();
  const [activeTab, setActiveTab] = useState<'2025' | '2026'>('2026');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const highest = getHighestDim();
  const lowest = getLowestDim();

  // Handle custom keywords
  const getKeywordDisplay = (keyword: string) => {
    if (!keyword) return null;
    if (keyword.startsWith('custom:')) {
      return { emoji: '✏️', en: keyword.replace('custom:', ''), zh: keyword.replace('custom:', '') };
    }
    return WORDS.find(w => w.key === keyword);
  };
  const keyword2025 = getKeywordDisplay(state.keyword2025);
  const keyword2026 = getKeywordDisplay(state.keyword2026);

  // Calculate average from 9 DIMENSIONS + Joy = 10 items
  const avg2025 = (DIMENSIONS.reduce((sum, dim) => sum + (state.scores2025[dim.key] || 0), 0) + state.joy2025) / 10;
  const avg2026 = (DIMENSIONS.reduce((sum, dim) => sum + (state.scores2026[dim.key] || 0), 0) + state.joy2026) / 10;

  const t = {
    title: state.lang === 'en' ? '2025 Reflection & 2026 Planning' : '2025回顾 & 2026规划',
    subtitle: state.lang === 'en' ? 'Be your best self in 2026.' : '在2026年成为最好的自己。',
    tab2025: state.lang === 'en' ? '2025 Review' : '2025 回顾',
    tab2026: state.lang === 'en' ? '2026 Goals' : '2026 目标',
    keywords: state.lang === 'en' ? 'Your Keywords' : '你的关键词',
    reflections: state.lang === 'en' ? 'Reflections' : '反思',
    highLabel: state.lang === 'en' ? 'What went well' : '做得好的',
    lowLabel: state.lang === 'en' ? 'What to improve' : '需要改进的',
    focusAreas: state.lang === 'en' ? 'Focus Areas & Actions' : '重点领域 & 行动',
    actionLabel: state.lang === 'en' ? 'Action' : '行动',
    copy: state.lang === 'en' ? 'Copy' : '复制',
    copied: state.lang === 'en' ? 'Copied!' : '已复制！',
    share: state.lang === 'en' ? 'Share Image' : '生成图片',
    generating: state.lang === 'en' ? 'Generating...' : '生成中...',
    calendar: state.lang === 'en' ? 'Add to Calendar' : '添加到日历',
    print: state.lang === 'en' ? 'Print' : '打印',
    startOver: state.lang === 'en' ? 'Start Over' : '重新开始',
  };

  // Get top 3 focus areas (biggest gaps) with actions
  const focusAreas = getTopGapDims(3);

  const handleCopy = async () => {
    const md = generateMarkdown(state);
    const success = await copyToClipboard(md);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareImage = async () => {
    if (!shareCardRef.current || generating) return;

    setGenerating(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'tide-planner-2026.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleCalendar = () => {
    const ics = generateCalendarICS(state.lang);
    downloadFile(ics, '2026-life-wheel.ics', 'text/calendar');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    if (confirm(state.lang === 'en' ? 'Start over? This will clear all your data.' : '重新开始？这将清除所有数据。')) {
      reset();
    }
  };

  const renderWheel = (year: '2025' | '2026') => {
    const scores = year === '2025' ? state.scores2025 : state.scores2026;
    const avg = year === '2025' ? avg2025 : avg2026;
    const joy = year === '2025' ? state.joy2025 : state.joy2026;
    const CX = 150, CY = 150, MAX_R = 120;
    const ANGLE_STEP = (2 * Math.PI) / 9;

    const polarToCart = (angle: number, r: number) => ({
      x: CX + r * Math.cos(angle - Math.PI / 2),
      y: CY + r * Math.sin(angle - Math.PI / 2),
    });

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[340px] sm:max-w-[400px]" style={{ aspectRatio: '1' }}>
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Background */}
            <circle cx={CX} cy={CY} r={MAX_R} fill="white" stroke="#ddd" strokeWidth={2} />

            {/* 10 concentric circles as grid */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
              const r = (level / 10) * MAX_R;
              return (
                <circle key={level} cx={CX} cy={CY} r={r} fill="none" stroke="#e5e5e5" strokeWidth={1} />
              );
            })}

            {/* Divider lines for each dimension */}
            {DIMENSIONS.map((_, i) => {
              const angle = i * ANGLE_STEP;
              const lineEnd = polarToCart(angle, MAX_R);
              return (
                <line key={i} x1={CX} y1={CY} x2={lineEnd.x} y2={lineEnd.y} stroke="#ddd" strokeWidth={1} />
              );
            })}

            {/* Score fills */}
            {DIMENSIONS.map((dim, i) => {
              const startAngle = i * ANGLE_STEP;
              const endAngle = (i + 1) * ANGLE_STEP;
              const score = scores[dim.key];
              const r = (score / 10) * MAX_R;
              const p1 = polarToCart(startAngle, r);
              const p2 = polarToCart(endAngle, r);
              const pathScore = `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`;

              return (
                <path key={dim.key} d={pathScore} fill={dim.color} fillOpacity={0.75} stroke={dim.color} strokeWidth={1} />
              );
            })}
            <circle cx={CX} cy={CY} r={4} fill="white" stroke="#ccc" strokeWidth={1} />
          </svg>
          {/* Labels */}
          {DIMENSIONS.map((dim, i) => {
            const midAngle = (i + 0.5) * ANGLE_STEP - Math.PI / 2;
            const labelR = 0.45;
            const x = 50 + labelR * 100 * Math.cos(midAngle);
            const y = 50 + labelR * 100 * Math.sin(midAngle);
            return (
              <div key={dim.key} className="absolute text-[10px] sm:text-xs font-medium whitespace-nowrap" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', color: 'var(--text-body)' }}>
                {dim[state.lang]}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-center flex items-center justify-center gap-4">
          <div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{state.lang === 'en' ? 'Avg' : '均分'}:</span>
            <span className="text-base font-semibold ml-1" style={{ color: 'var(--accent)' }}>{avg.toFixed(1)}</span>
          </div>
          <div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>😊 {state.lang === 'en' ? 'Joy' : '愉悦感'}:</span>
            <span className="text-base font-semibold ml-1" style={{ color: 'var(--accent)' }}>{joy}</span>
          </div>
        </div>
        {/* Score list - 3x3 grid for 9 dimensions */}
        <div className="grid grid-cols-3 gap-1.5 mt-4 w-full text-xs">
          {DIMENSIONS.map((dim) => (
            <div key={dim.key} className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white border border-[var(--border)]">
              <span>{dim.emoji}</span>
              <span className="flex-1" style={{ color: 'var(--text-body)' }}>{dim[state.lang]}</span>
              <span className="font-medium" style={{ color: 'var(--accent)' }}>{scores[dim.key]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      {/* Keywords Banner */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 px-4 py-4 rounded-xl bg-white border border-[var(--border)] w-full max-w-lg">
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>2025</div>
          <div className="text-lg font-semibold" style={{ color: 'var(--text-muted)' }}>
            {keyword2025?.emoji} {keyword2025?.[state.lang]}
          </div>
        </div>
        <div className="text-2xl" style={{ color: 'var(--border)' }}>→</div>
        <div className="text-center">
          <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>2026</div>
          <div className="text-lg font-semibold" style={{ color: 'var(--accent)' }}>
            {keyword2026?.emoji} {keyword2026?.[state.lang]}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-white border border-[var(--border)] no-print">
        <button
          onClick={() => setActiveTab('2025')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === '2025'
              ? 'bg-[var(--text-muted)] text-white'
              : 'text-[var(--text-muted)] hover:bg-gray-100'
          }`}
        >
          📍 {t.tab2025}
        </button>
        <button
          onClick={() => setActiveTab('2026')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === '2026'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-muted)] hover:bg-gray-100'
          }`}
        >
          🎯 {t.tab2026}
        </button>
      </div>

      {/* Wheel Content */}
      <div className="w-full max-w-md mb-8">
        {renderWheel(activeTab)}
      </div>

      {/* Reflections (only show in 2025 tab) */}
      {activeTab === '2025' && (state.reflectionHigh || state.reflectionLow) && (
        <div className="w-full max-w-lg mb-8 space-y-4">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-title)' }}>💭 {t.reflections}</h3>
          {state.reflectionHigh && (
            <div className="p-4 rounded-xl bg-white border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <span>{highest.dim.emoji}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>🏆 {t.highLabel}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-body)' }}>{state.reflectionHigh}</p>
            </div>
          )}
          {state.reflectionLow && (
            <div className="p-4 rounded-xl bg-white border border-[var(--border)]">
              <div className="flex items-center gap-2 mb-2">
                <span>{lowest.dim.emoji}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>💪 {t.lowLabel}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-body)' }}>{state.reflectionLow}</p>
            </div>
          )}
        </div>
      )}

      {/* Focus Areas with Actions (only show in 2026 tab) */}
      {activeTab === '2026' && (
        <div className="w-full max-w-lg mb-8">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-title)' }}>🎯 {t.focusAreas}</h3>
          <div className="space-y-3">
            {focusAreas.map(({ dim, gap, score2025, score2026 }, idx) => (
              <div key={dim.key} className="p-4 rounded-xl bg-white border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>#{idx + 1}</span>
                  <span className="text-xl">{dim.emoji}</span>
                  <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text-body)' }}>{dim[state.lang]}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>{score2025}</span>
                    <span style={{ color: 'var(--text-muted)' }}>→</span>
                    <span className="font-bold" style={{ color: 'var(--accent)' }}>{score2026}</span>
                    {gap > 0 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                        +{gap}
                      </span>
                    )}
                  </div>
                </div>
                {(state.actions[dim.key]?.length || 0) > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--border)]">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.actionLabel}: </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {state.actions[dim.key].map((action, actionIdx) => (
                        <span
                          key={actionIdx}
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                        >
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-center no-print">
        <button
          onClick={handleShareImage}
          disabled={generating}
          className="btn btn-primary text-xs sm:text-sm disabled:opacity-50"
        >
          🖼️ {generating ? t.generating : t.share}
        </button>
        <button onClick={handleCalendar} className="btn btn-secondary text-xs sm:text-sm">
          📅 {t.calendar}
        </button>
        <button onClick={handleCopy} className="btn btn-secondary text-xs sm:text-sm">
          {copied ? '✓' : '📋'} {copied ? t.copied : t.copy}
        </button>
        <button onClick={handlePrint} className="btn btn-secondary text-xs sm:text-sm">
          🖨️ {t.print}
        </button>
        <button onClick={handleReset} className="btn btn-secondary text-xs sm:text-sm">
          🔄 {t.startOver}
        </button>
      </div>

      {/* Hidden ShareCard for image generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <ShareCard ref={shareCardRef} state={state} />
      </div>
    </div>
  );
}
