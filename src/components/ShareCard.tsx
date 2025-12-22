import { forwardRef } from 'react';
import { DIMENSIONS, WORDS } from '../lib/types';
import type { AppState } from '../lib/types';

interface ShareCardProps {
  state: AppState;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ state }, ref) => {
  const CX = 160, CY = 160, MAX_R = 85;
  const ANGLE_STEP = (2 * Math.PI) / 9;

  const polarToCart = (angle: number, r: number) => ({
    x: CX + r * Math.cos(angle - Math.PI / 2),
    y: CY + r * Math.sin(angle - Math.PI / 2),
  });

  // Get keywords
  const getKeywordDisplay = (keyword: string) => {
    if (!keyword) return { emoji: '❓', en: 'Not set', zh: '未设置' };
    if (keyword.startsWith('custom:')) {
      const text = keyword.replace('custom:', '');
      return { emoji: '✏️', en: text, zh: text };
    }
    return WORDS.find(w => w.key === keyword) || { emoji: '❓', en: 'Not set', zh: '未设置' };
  };

  const keyword2025 = getKeywordDisplay(state.keyword2025);
  const keyword2026 = getKeywordDisplay(state.keyword2026);

  // Calculate average
  const avg2026 = ((DIMENSIONS.reduce((sum, dim) => sum + (state.scores2026[dim.key] || 0), 0) + state.joy2026) / 10).toFixed(1);

  // Chinese-friendly font stack
  const fontFamily = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  return (
    <div
      ref={ref}
      style={{
        width: '600px',
        height: '800px',
        background: '#3983ba',
        padding: '40px',
        fontFamily,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '8px', fontFamily }}>
          🌊 {state.lang === 'en' ? '2025 Reflection & 2026 Planning' : '2025回顾 & 2026规划'}
        </div>
        <div style={{ fontSize: '15px', opacity: 0.9, fontFamily }}>
          {state.lang === 'en' ? 'Be your best self in 2026.' : '在2026年成为最好的自己。'}
        </div>
      </div>

      {/* Keywords Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '16px',
          padding: '20px 36px',
          marginBottom: '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>2025</div>
          <div style={{ fontSize: '28px' }}>{keyword2025.emoji}</div>
          <div style={{ fontSize: '16px', fontWeight: '600', fontFamily }}>{keyword2025[state.lang]}</div>
        </div>
        <div style={{ fontSize: '28px', opacity: 0.6 }}>→</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '6px' }}>2026</div>
          <div style={{ fontSize: '36px' }}>{keyword2026.emoji}</div>
          <div style={{ fontSize: '20px', fontWeight: '700', fontFamily }}>{keyword2026[state.lang]}</div>
        </div>
      </div>

      {/* Life Wheel */}
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '20px', fontWeight: '600', color: '#333', fontFamily }}>
            {state.lang === 'en' ? '2026 Life Wheel' : '2026 人生平衡轮'}
          </span>
        </div>

        <div style={{ position: 'relative', width: '400px', height: '400px', margin: '0 auto' }}>
          <svg viewBox="0 0 320 320" width="400" height="400">
            {/* Background */}
            <circle cx={CX} cy={CY} r={MAX_R} fill="white" stroke="#e5e5e5" strokeWidth={2} />

            {/* Grid circles */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
              const r = (level / 10) * MAX_R;
              return <circle key={level} cx={CX} cy={CY} r={r} fill="none" stroke="#f0f0f0" strokeWidth={1} />;
            })}

            {/* Divider lines */}
            {DIMENSIONS.map((_, i) => {
              const angle = i * ANGLE_STEP;
              const lineEnd = polarToCart(angle, MAX_R);
              return <line key={i} x1={CX} y1={CY} x2={lineEnd.x} y2={lineEnd.y} stroke="#e5e5e5" strokeWidth={1} />;
            })}

            {/* Score fills */}
            {DIMENSIONS.map((dim, i) => {
              const startAngle = i * ANGLE_STEP;
              const endAngle = (i + 1) * ANGLE_STEP;
              const score = state.scores2026[dim.key];
              const r = (score / 10) * MAX_R;
              const p1 = polarToCart(startAngle, r);
              const p2 = polarToCart(endAngle, r);
              const pathScore = `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`;
              return <path key={dim.key} d={pathScore} fill={dim.color} fillOpacity={0.75} stroke={dim.color} strokeWidth={1} />;
            })}

            {/* Center */}
            <circle cx={CX} cy={CY} r={3} fill="white" stroke="#ccc" strokeWidth={1} />

            {/* Labels - positioned further out */}
            {DIMENSIONS.map((dim, i) => {
              const midAngle = (i + 0.5) * ANGLE_STEP - Math.PI / 2;
              const labelR = MAX_R + 55;
              const x = CX + labelR * Math.cos(midAngle);
              const y = CY + labelR * Math.sin(midAngle);
              return (
                <text
                  key={dim.key}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontFamily={fontFamily}
                  fill="#444"
                >
                  {dim.emoji} {dim[state.lang]}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '8px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#888', fontFamily }}>{state.lang === 'en' ? 'Average' : '平均分'}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3983ba' }}>{avg2026}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#888', fontFamily }}>{state.lang === 'en' ? '😊 Joy' : '😊 愉悦感'}</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#3983ba' }}>{state.joy2026}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', textAlign: 'center', opacity: 0.7, fontSize: '12px' }}>
        tide-planner.vercel.app
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';
