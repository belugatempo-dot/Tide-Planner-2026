import { useWizard } from '../../context/WizardContext';
import { StepContainer, FieldGroup } from '../StepContainer';
import { Navigation } from '../Navigation';

export function Step1ReviewEvents() {
  const { state, updateField } = useWizard();
  const { data } = state;

  return (
    <div>
      <StepContainer
        title="Looking Back at 2025"
        subtitle="Take a moment to reflect on the year that was. What stands out?"
      >
        <FieldGroup
          label="Significant Events"
          hint="What were the major events in 2025? These could be personal milestones, career changes, travels, or moments that shaped your year."
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Started a new role, moved to a new city, launched a project..."
            value={data.significantEvents}
            onChange={(e) => updateField('significantEvents', e.target.value)}
            maxLength={2000}
          />
        </FieldGroup>

        <FieldGroup
          label="Achievements"
          hint="What are you proud of? List the accomplishments, big or small, that made 2025 meaningful."
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Completed a marathon, learned a new skill, improved a relationship..."
            value={data.achievements}
            onChange={(e) => updateField('achievements', e.target.value)}
            maxLength={2000}
          />
        </FieldGroup>
      </StepContainer>

      <Navigation />
    </div>
  );
}
