import { useWizard } from '../../context/WizardContext';
import { StepContainer, FieldGroup } from '../StepContainer';
import { Navigation } from '../Navigation';

export function Step2ReviewChallenges() {
  const { state, updateField } = useWizard();
  const { data } = state;

  return (
    <div>
      <StepContainer
        title="Challenges and Lessons"
        subtitle="Growth often comes from difficulty. What did 2025 teach you?"
      >
        <FieldGroup
          label="Challenges Faced"
          hint="What obstacles did you encounter? What was hard? Being honest here helps you prepare for the future."
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Struggled with work-life balance, faced health issues, dealt with uncertainty..."
            value={data.challenges}
            onChange={(e) => updateField('challenges', e.target.value)}
            maxLength={2000}
          />
        </FieldGroup>

        <FieldGroup
          label="Lessons Learned"
          hint="What wisdom did you gain? What would you tell your past self?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Learned to say no, discovered that consistency beats intensity, realized the importance of rest..."
            value={data.lessonsLearned}
            onChange={(e) => updateField('lessonsLearned', e.target.value)}
            maxLength={2000}
          />
        </FieldGroup>
      </StepContainer>

      <Navigation />
    </div>
  );
}
