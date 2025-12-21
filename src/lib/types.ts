export interface PlannerData {
  // Step 1: 2025 Review - Events & Achievements
  significantEvents: string;
  achievements: string;

  // Step 2: 2025 Review - Challenges & Lessons
  challenges: string;
  lessonsLearned: string;

  // Step 3: 2025 Patterns - What Worked
  whatWorked: string;
  whatDidntWork: string;

  // Step 4: 2025 Patterns - Energy
  energySources: string;
  energyDrains: string;

  // Step 5: 2026 Direction
  themes: string[];
  notDoingList: string;

  // Step 6: 2026 Goals
  goals: Goal[];

  // Step 7: 2026 Quarterly Plan
  q1Milestones: string;
  q2Milestones: string;
  q3Milestones: string;
  q4Milestones: string;
  habits: string;

  // Step 8: Risks & Support
  risks: string;
  contingencyPlans: string;
  supportNeeded: string;
}

export interface Goal {
  id: string;
  description: string;
  metric: string;
  successDefinition: string;
}

export interface WizardState {
  currentStep: number;
  data: PlannerData;
  isComplete: boolean;
}

export const TOTAL_STEPS = 8;

export const initialPlannerData: PlannerData = {
  significantEvents: '',
  achievements: '',
  challenges: '',
  lessonsLearned: '',
  whatWorked: '',
  whatDidntWork: '',
  energySources: '',
  energyDrains: '',
  themes: ['', '', ''],
  notDoingList: '',
  goals: [
    { id: '1', description: '', metric: '', successDefinition: '' },
    { id: '2', description: '', metric: '', successDefinition: '' },
    { id: '3', description: '', metric: '', successDefinition: '' },
  ],
  q1Milestones: '',
  q2Milestones: '',
  q3Milestones: '',
  q4Milestones: '',
  habits: '',
  risks: '',
  contingencyPlans: '',
  supportNeeded: '',
};

export const initialWizardState: WizardState = {
  currentStep: 0,
  data: initialPlannerData,
  isComplete: false,
};
