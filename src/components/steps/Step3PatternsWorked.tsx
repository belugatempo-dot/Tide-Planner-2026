import { useWizard } from '../../context/WizardContext';
import { StepContainer, FieldGroup } from '../StepContainer';
import { Navigation } from '../Navigation';

export function Step3PatternsWorked() {
  const { state, updateField } = useWizard();
  const { data } = state;

  return (
    <div>
      <StepContainer
        title="What Worked, What Didn't"
        subtitle="Understanding your patterns is key to designing a better year."
      >
        <FieldGroup
          label="What Worked Well"
          hint="Which habits, routines, or approaches served you? What do you want to keep doing?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Morning exercise routine, weekly planning sessions, regular check-ins with mentors..."
            value={data.whatWorked}
            onChange={(e) => updateField('whatWorked', e.target.value)}
            maxLength={2000}
          />
        </FieldGroup>

        <FieldGroup
          label="What Didn't Work"
          hint="Which habits, approaches, or commitments drained you or didn't deliver? What will you let go of?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Taking on too many projects, skipping lunch, saying yes to everything..."
            value={data.whatDidntWork}
            onChange={(e) => updateField('whatDidntWork', e.target.value)}
            maxLength={2000}
          />
        </FieldGroup>
      </StepContainer>

      <Navigation />
    </div>
  );
}
