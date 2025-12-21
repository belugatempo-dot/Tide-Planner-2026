import { useWizard } from '../context/WizardContext';
import { TOTAL_STEPS } from '../lib/types';
import { ProgressBar } from './ProgressBar';
import { ResultPage } from './ResultPage';
import {
  Step1ReviewEvents,
  Step2ReviewChallenges,
  Step3PatternsWorked,
  Step4PatternsEnergy,
  Step5Direction,
  Step6Goals,
  Step7QuarterlyPlan,
  Step8RisksSupport,
} from './steps';

const steps = [
  Step1ReviewEvents,
  Step2ReviewChallenges,
  Step3PatternsWorked,
  Step4PatternsEnergy,
  Step5Direction,
  Step6Goals,
  Step7QuarterlyPlan,
  Step8RisksSupport,
];

export function Wizard() {
  const { state } = useWizard();
  const { currentStep } = state;

  // Show result page after completing all steps
  if (currentStep >= TOTAL_STEPS || state.isComplete) {
    return <ResultPage />;
  }

  const CurrentStep = steps[currentStep];

  return (
    <div className="min-h-screen">
      <ProgressBar currentStep={currentStep} />

      {/* Main content with padding for fixed progress bar */}
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <CurrentStep />
        </div>
      </div>
    </div>
  );
}
