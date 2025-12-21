import { useWizard } from '../../context/WizardContext';
import { StepContainer, FieldGroup } from '../StepContainer';
import { Navigation } from '../Navigation';

export function Step6Goals() {
  const { state, updateGoal, dispatch } = useWizard();
  const { data } = state;

  const addGoal = () => {
    dispatch({ type: 'ADD_GOAL' });
  };

  const removeGoal = (goalId: string) => {
    dispatch({ type: 'REMOVE_GOAL', goalId });
  };

  return (
    <div>
      <StepContainer
        title="2026 Goals"
        subtitle="Define 3-5 concrete goals. Make them specific and measurable."
      >
        <div className="space-y-6">
          {data.goals.map((goal, index) => (
            <div
              key={goal.id}
              className="p-4 bg-white border border-slate-200 rounded-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-tide-700">
                  Goal {index + 1}
                </span>
                {data.goals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGoal(goal.id)}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              <FieldGroup label="What is the goal?">
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Run a half marathon, Launch my side project, Read 24 books..."
                  value={goal.description}
                  onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                  maxLength={200}
                />
              </FieldGroup>

              <FieldGroup
                label="How will you measure it?"
                hint="Quantify your goal if possible."
              >
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Complete 21.1km race, Ship v1.0 by June, Finish 2 books/month..."
                  value={goal.metric}
                  onChange={(e) => updateGoal(goal.id, 'metric', e.target.value)}
                  maxLength={200}
                />
              </FieldGroup>

              <FieldGroup
                label="What does success look like?"
                hint="Describe the outcome vividly."
              >
                <textarea
                  className="textarea-field"
                  rows={2}
                  placeholder="e.g., Crossing the finish line feeling strong, seeing real users engage with my product..."
                  value={goal.successDefinition}
                  onChange={(e) => updateGoal(goal.id, 'successDefinition', e.target.value)}
                  maxLength={500}
                />
              </FieldGroup>
            </div>
          ))}

          {data.goals.length < 5 && (
            <button
              type="button"
              onClick={addGoal}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-tide-400 hover:text-tide-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Another Goal
            </button>
          )}
        </div>
      </StepContainer>

      <Navigation />
    </div>
  );
}
