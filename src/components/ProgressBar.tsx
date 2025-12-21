import { TOTAL_STEPS } from '../lib/types';

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  // Don't show progress bar on result page
  if (currentStep >= TOTAL_STEPS) {
    return null;
  }

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 no-print">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-tide-700">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-sm text-slate-500">
            {Math.round(progress)}% complete
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-tide-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
