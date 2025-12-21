import { useWizard } from '../../context/WizardContext';
import { StepContainer, FieldGroup } from '../StepContainer';
import { Navigation } from '../Navigation';

export function Step7QuarterlyPlan() {
  const { state, updateField } = useWizard();
  const { data } = state;

  return (
    <div>
      <StepContainer
        title="Quarterly Roadmap"
        subtitle="Break down your year into manageable chunks. What happens each quarter?"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup label="Q1: January - March">
            <textarea
              className="textarea-field"
              rows={3}
              placeholder="Key milestones and focus areas for Q1..."
              value={data.q1Milestones}
              onChange={(e) => updateField('q1Milestones', e.target.value)}
              maxLength={1000}
            />
          </FieldGroup>

          <FieldGroup label="Q2: April - June">
            <textarea
              className="textarea-field"
              rows={3}
              placeholder="Key milestones and focus areas for Q2..."
              value={data.q2Milestones}
              onChange={(e) => updateField('q2Milestones', e.target.value)}
              maxLength={1000}
            />
          </FieldGroup>

          <FieldGroup label="Q3: July - September">
            <textarea
              className="textarea-field"
              rows={3}
              placeholder="Key milestones and focus areas for Q3..."
              value={data.q3Milestones}
              onChange={(e) => updateField('q3Milestones', e.target.value)}
              maxLength={1000}
            />
          </FieldGroup>

          <FieldGroup label="Q4: October - December">
            <textarea
              className="textarea-field"
              rows={3}
              placeholder="Key milestones and focus areas for Q4..."
              value={data.q4Milestones}
              onChange={(e) => updateField('q4Milestones', e.target.value)}
              maxLength={1000}
            />
          </FieldGroup>
        </div>

        <FieldGroup
          label="Habits and Systems"
          hint="What daily or weekly habits will support your goals? What systems will you put in place?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., Morning writing practice, Weekly reviews, Monthly check-ins with accountability partner..."
            value={data.habits}
            onChange={(e) => updateField('habits', e.target.value)}
            maxLength={1000}
          />
        </FieldGroup>
      </StepContainer>

      <Navigation />
    </div>
  );
}
