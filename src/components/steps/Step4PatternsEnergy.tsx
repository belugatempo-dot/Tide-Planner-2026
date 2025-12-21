import { useWizard } from '../../context/WizardContext';
import { StepContainer, FieldGroup } from '../StepContainer';
import { Navigation } from '../Navigation';

export function Step4PatternsEnergy() {
  const { state, updateField } = useWizard();
  const { data } = state;

  return (
    <div>
      <StepContainer
        title="Energy Patterns"
        subtitle="Your energy is precious. Know what fills you up and what drains you."
      >
        <FieldGroup
          label="Energy Sources"
          hint="What activities, people, or environments give you energy? When do you feel most alive?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Deep work in quiet mornings, time with close friends, creative projects, nature walks..."
            value={data.energySources}
            onChange={(e) => updateField('energySources', e.target.value)}
            maxLength={2000}
          />
        </FieldGroup>

        <FieldGroup
          label="Energy Drains"
          hint="What depletes you? Which situations or commitments leave you exhausted?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Back-to-back meetings, social obligations I don't enjoy, unclear expectations..."
            value={data.energyDrains}
            onChange={(e) => updateField('energyDrains', e.target.value)}
            maxLength={2000}
          />
        </FieldGroup>
      </StepContainer>

      <Navigation />
    </div>
  );
}
