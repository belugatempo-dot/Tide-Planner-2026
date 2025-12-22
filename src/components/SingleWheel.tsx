import { useRef, useCallback, useState } from 'react';
import { useApp } from '../context/WizardContext';
import { DIMENSIONS } from '../lib/types';
import { analytics } from '../lib/analytics';

const CX = 250;
const CY = 250;
const MAX_R = 200; // Big wheel with 10 clear rings
const N = 9; // 9 dimensions
const ANGLE_STEP = (2 * Math.PI) / N;

function polarToCart(angle: number, r: number) {
  return {
    x: CX + r * Math.cos(angle - Math.PI / 2),
    y: CY + r * Math.sin(angle - Math.PI / 2),
  };
}

interface SingleWheelProps {
  year: '2025' | '2026';
}

export function SingleWheel({ year }: SingleWheelProps) {
  const { state, setScore, setJoy } = useApp();
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    dim: (typeof DIMENSIONS)[0];
    score: number;
  } | null>(null);
  const [hoverDim, setHoverDim] = useState<(typeof DIMENSIONS)[0] | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [selectedDim, setSelectedDim] = useState<(typeof DIMENSIONS)[0] | null>(null);

  const scores = year === '2025' ? state.scores2025 : state.scores2026;
  const joy = year === '2025' ? state.joy2025 : state.joy2026;
  // Calculate average from 9 DIMENSIONS + Joy = 10 items
  const avg = (DIMENSIONS.reduce((sum, dim) => sum + (scores[dim.key] || 0), 0) + joy) / 10;

  const handleScoreFromEvent = useCallback(
    (e: MouseEvent | TouchEvent, key: string) => {
      if (!svgRef.current) return;

      const rect = svgRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = ((clientX - rect.left) / rect.width) * 500 - CX;
      const y = ((clientY - rect.top) / rect.height) * 500 - CY;
      const dist = Math.sqrt(x * x + y * y);

      let score = Math.round((dist / MAX_R) * 10);
      score = Math.max(1, Math.min(10, score));

      setScore(year, key, score);

      const dim = DIMENSIONS.find((d) => d.key === key)!;
      setTooltip({
        x: clientX + 15,
        y: clientY + 15,
        dim,
        score,
      });
    },
    [year, setScore]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGPathElement>, key: string) => {
      e.preventDefault();
      handleScoreFromEvent(e.nativeEvent, key);

      const onMove = (ev: MouseEvent) => handleScoreFromEvent(ev, key);
      const onUp = () => {
        setTooltip(null);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        // Track final score
        const finalScore = year === '2025' ? state.scores2025[key] : state.scores2026[key];
        analytics.wheelScoreChanged(year, key, finalScore || 0);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [handleScoreFromEvent, year, state.scores2025, state.scores2026]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<SVGPathElement>, key: string) => {
      e.preventDefault();
      handleScoreFromEvent(e.nativeEvent as unknown as TouchEvent, key);

      const onMove = (ev: TouchEvent) => {
        ev.preventDefault();
        handleScoreFromEvent(ev, key);
      };
      const onEnd = () => {
        setTooltip(null);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        // Track final score
        const finalScore = year === '2025' ? state.scores2025[key] : state.scores2026[key];
        analytics.wheelScoreChanged(year, key, finalScore || 0);
      };

      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    },
    [handleScoreFromEvent, year, state.scores2025, state.scores2026]
  );

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full min-w-[300px] max-w-[500px] sm:max-w-[580px]" style={{ aspectRatio: '1' }}>
        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="w-full h-full cursor-pointer"
          onMouseLeave={() => {
            setTooltip(null);
            setHoverDim(null);
            setHoverPos(null);
          }}
        >
          {/* White background */}
          <circle cx={CX} cy={CY} r={MAX_R} fill="white" stroke="#ddd" strokeWidth={2} />

          {/* 10 concentric circles as grid */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => {
            const r = (level / 10) * MAX_R;
            return (
              <circle
                key={level}
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke="#e5e5e5"
                strokeWidth={1}
              />
            );
          })}

          {/* Divider lines for each dimension */}
          {DIMENSIONS.map((_, i) => {
            const angle = i * ANGLE_STEP;
            const lineEnd = polarToCart(angle, MAX_R);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke="#ddd"
                strokeWidth={1}
              />
            );
          })}

          {/* Score fills */}
          {DIMENSIONS.map((dim, i) => {
            const startAngle = i * ANGLE_STEP;
            const endAngle = (i + 1) * ANGLE_STEP;
            const score = scores[dim.key];
            const r = (score / 10) * MAX_R;

            // Score path - pie slice from center
            const p1 = polarToCart(startAngle, r);
            const p2 = polarToCart(endAngle, r);
            const pathScore = `M ${CX} ${CY} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`;

            // Full interactive area
            const pf1 = polarToCart(startAngle, MAX_R);
            const pf2 = polarToCart(endAngle, MAX_R);
            const pathFull = `M ${CX} ${CY} L ${pf1.x} ${pf1.y} A ${MAX_R} ${MAX_R} 0 0 1 ${pf2.x} ${pf2.y} Z`;

            return (
              <g key={dim.key}>
                {/* Score fill */}
                <path
                  d={pathScore}
                  fill={dim.color}
                  fillOpacity={0.75}
                  stroke={dim.color}
                  strokeWidth={1}
                />

                {/* Interactive area */}
                <path
                  d={pathFull}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseDown={(e) => {
                    handleMouseDown(e, dim.key);
                    setSelectedDim(dim);
                  }}
                  onTouchStart={(e) => {
                    handleTouchStart(e, dim.key);
                    setSelectedDim(dim);
                  }}
                  onMouseEnter={(e) => {
                    setHoverDim(dim);
                    setHoverPos({ x: e.clientX + 15, y: e.clientY + 15 });
                  }}
                  onMouseMove={(e) => {
                    if (hoverDim && !tooltip) {
                      setHoverPos({ x: e.clientX + 15, y: e.clientY + 15 });
                    }
                  }}
                  onMouseLeave={() => {
                    setHoverDim(null);
                    setHoverPos(null);
                  }}
                />
              </g>
            );
          })}

          {/* Center dot */}
          <circle cx={CX} cy={CY} r={4} fill="white" stroke="#ccc" strokeWidth={1} />
        </svg>

        {/* Labels positioned outside the wheel */}
        {DIMENSIONS.map((dim, i) => {
          const midAngle = (i + 0.5) * ANGLE_STEP - Math.PI / 2;
          const labelR = 0.54; // Position labels further outside the wheel
          const x = 50 + labelR * 100 * Math.cos(midAngle);
          const y = 50 + labelR * 100 * Math.sin(midAngle);
          const shortDesc = state.lang === 'en' ? dim.shortEn : dim.shortZh;

          return (
            <div
              key={dim.key}
              className="absolute text-center pointer-events-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="text-xs sm:text-sm font-medium whitespace-nowrap" style={{ color: 'var(--text-body)' }}>
                {dim.emoji} {dim[state.lang]}
              </div>
              <div className="text-[9px] sm:text-[10px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                {shortDesc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Joy Slider */}
      <div className="mt-6 w-full max-w-[360px] px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-body)' }}>
            😊 {state.lang === 'en' ? 'Overall Joy' : '愉悦感'}
          </span>
          <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
            {joy}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={joy}
          onChange={(e) => setJoy(year, parseInt(e.target.value))}
          onMouseUp={(e) => analytics.joyScoreChanged(year, parseInt((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => analytics.joyScoreChanged(year, parseInt((e.target as HTMLInputElement).value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${(joy - 1) * 11.1}%, #E5E7EB ${(joy - 1) * 11.1}%, #E5E7EB 100%)`,
          }}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Average score display */}
      <div className="mt-4 text-center">
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {state.lang === 'en' ? 'Average' : '平均分'}:
        </span>
        <span className="text-xl font-semibold ml-2" style={{ color: 'var(--accent)' }}>
          {avg.toFixed(1)}
        </span>
      </div>

      {/* Selected dimension detail box */}
      {selectedDim && (
        <div
          className="mt-4 w-full max-w-[400px] p-4 rounded-xl border-2 transition-all"
          style={{
            borderColor: selectedDim.color,
            backgroundColor: `${selectedDim.color}10`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedDim.emoji}</span>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text-title)' }}>
                  {selectedDim[state.lang]}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {state.lang === 'en' ? selectedDim.shortEn : selectedDim.shortZh}
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: selectedDim.color }}>
              {scores[selectedDim.key]}
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-body)' }}>
            {state.lang === 'en' ? selectedDim.descEn : selectedDim.descZh}
          </p>
          <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {state.lang === 'en' ? 'Click & drag on wheel to adjust score' : '在轮盘上点击拖动调整分数'}
          </div>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoverDim && hoverPos && !tooltip && (
        <div
          className="fixed px-3 py-2 rounded-lg text-sm pointer-events-none z-50 shadow-lg bg-white border border-[var(--border)]"
          style={{ left: hoverPos.x, top: hoverPos.y }}
        >
          <div className="font-medium mb-1" style={{ color: 'var(--text-title)' }}>
            {hoverDim.emoji} {hoverDim[state.lang]}
          </div>
          <div className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
            {state.lang === 'en' ? hoverDim.descEn : hoverDim.descZh}
          </div>
          <div className="text-xs" style={{ color: 'var(--accent)' }}>
            {state.lang === 'en' ? 'Score' : '分数'}: {scores[hoverDim.key]}
          </div>
          <div className="text-[10px] mt-1.5 pt-1.5 border-t border-[var(--border)]" style={{ color: 'var(--text-muted)' }}>
            {state.lang === 'en' ? 'Click & drag to adjust' : '点击拖动调整分数'}
          </div>
        </div>
      )}

      {/* Active Tooltip */}
      {tooltip && (
        <div
          className="fixed px-3 py-2 rounded-lg text-sm pointer-events-none z-50 shadow-lg bg-white border border-[var(--border)]"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-medium mb-1" style={{ color: 'var(--text-title)' }}>
            {tooltip.dim.emoji} {tooltip.dim[state.lang]}
          </div>
          <div className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
            {tooltip.score}
          </div>
        </div>
      )}
    </div>
  );
}
