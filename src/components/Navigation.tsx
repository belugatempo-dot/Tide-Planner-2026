import { useWizard } from '../context/WizardContext';
import { TOTAL_STEPS } from '../lib/types';

interface NavigationProps {
  onComplete?: () => void;
}

export function Navigation({ onComplete }: NavigationProps) {
  const { state, nextStep, prevStep, complete } = useWizard();
  const { currentStep } = state;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  const handleNext = () => {
    if (isLastStep) {
      complete();
      onComplete?.();
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex justify-between items-center pt-8 border-t border-slate-200 mt-8">
      <button
        type="button"
        onClick={prevStep}
        disabled={isFirstStep}
        className="btn-secondary flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="btn-primary flex items-center gap-2"
      >
        {isLastStep ? 'Generate Plan' : 'Next'}
        {!isLastStep && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
