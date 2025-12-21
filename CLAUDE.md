# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Architecture

Tide Planner is a single-page wizard app for annual planning. No backend, all data in localStorage.

### State Management
- `WizardContext` (src/context/WizardContext.tsx) manages all state via useReducer
- State auto-saves to localStorage with 300ms debounce
- State restores on page load (step position + form data)

### Data Flow
```
WizardProvider
  └── Wizard (routes between steps or ResultPage)
        ├── Step1-8 components (each uses useWizard() hook)
        └── ResultPage (generates Markdown from state)
```

### Key Types (src/lib/types.ts)
- `PlannerData`: All form fields across 8 steps
- `WizardState`: currentStep + data + isComplete
- `Goal`: id, description, metric, successDefinition (3-5 goals allowed)

### Utilities (src/lib/)
- `storage.ts`: localStorage read/write with schema migration
- `planGenerator.ts`: Converts PlannerData to Markdown, handles copy/download

### Styling
- Tailwind CSS with custom `tide-*` color palette (tailwind.config.js)
- Reusable classes: `.btn-primary`, `.btn-secondary`, `.input-field`, `.textarea-field`
- Print styles: `.no-print` hides elements when printing

## Wizard Steps
1. 2025 Review: Events & Achievements
2. 2025 Review: Challenges & Lessons
3. 2025 Patterns: What Worked/Didn't
4. 2025 Patterns: Energy Sources/Drains
5. 2026 Direction: Themes (3) + Not Doing List
6. 2026 Goals: 3-5 measurable goals
7. 2026 Plan: Q1-Q4 milestones + habits
8. Risks & Support
