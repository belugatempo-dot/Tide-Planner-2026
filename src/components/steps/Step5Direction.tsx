import { useWizard } from '../../context/WizardContext';
import { StepContainer, FieldGroup } from '../StepContainer';
import { Navigation } from '../Navigation';

export function Step5Direction() {
  const { state, updateField, updateTheme } = useWizard();
  const { data } = state;

  return (
    <div>
      <StepContainer
        title="2026 Direction"
        subtitle="Set your compass. What themes will guide your year?"
      >
        <FieldGroup
          label="Key Themes for 2026"
          hint="Choose 3 themes or priorities that will guide your decisions. Think of these as your 'north star' for the year."
        >
          <div className="space-y-3">
            {data.themes.map((theme, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-tide-100 text-tide-700 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <input
                  type="text"
                  className="input-field"
                  placeholder={`Theme ${index + 1}, e.g., "Health first", "Creative expression", "Financial freedom"...`}
                  value={theme}
                  onChange={(e) => updateTheme(index, e.target.value)}
                  maxLength={100}
                />
              </div>
            ))}
          </div>
        </FieldGroup>

        <FieldGroup
          label="Not Doing List"
          hint="Equally important: what will you NOT do in 2026? What will you say no to?"
        >
          <textarea
            className="textarea-field"
            rows={4}
            placeholder="e.g., No more late-night work, no commitments out of guilt, no projects without clear purpose..."
            value={data.notDoingList}
            onChange={(e) => updateField('notDoingList', e.target.value)}
            maxLength={1000}
          />
        </FieldGroup>
      </StepContainer>

      <Navigation />
    </div>
  );
}
