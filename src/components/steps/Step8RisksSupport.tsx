import { useWizard } from '../../context/WizardContext';
import { StepContainer, FieldGroup } from '../StepContainer';
import { Navigation } from '../Navigation';

export function Step8RisksSupport() {
  const { state, updateField } = useWizard();
  const { data } = state;

  return (
    <div>
      <StepContainer
        title="Risks and Support"
        subtitle="Anticipate obstacles and identify what you need to succeed."
      >
        <FieldGroup
          label="Potential Risks and Obstacles"
          hint="What could get in your way? What challenges might arise?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Burnout if I don't set boundaries, unexpected life events, losing motivation mid-year..."
            value={data.risks}
            onChange={(e) => updateField('risks', e.target.value)}
            maxLength={1000}
          />
        </FieldGroup>

        <FieldGroup
          label="Contingency Plans"
          hint="How will you handle setbacks? What's your plan B?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., If I fall behind on reading, switch to audiobooks. If burnout hits, take a week off proactively..."
            value={data.contingencyPlans}
            onChange={(e) => updateField('contingencyPlans', e.target.value)}
            maxLength={1000}
          />
        </FieldGroup>

        <FieldGroup
          label="Support and Resources Needed"
          hint="What help, tools, or resources will you need? Who can support you?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., A coach or mentor, accountability partner, specific courses or tools, support from family..."
            value={data.supportNeeded}
            onChange={(e) => updateField('supportNeeded', e.target.value)}
            maxLength={1000}
          />
        </FieldGroup>
      </StepContainer>

      <Navigation />
    </div>
  );
}
