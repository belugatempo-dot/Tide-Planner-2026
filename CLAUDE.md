# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev      # Start development server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build

# Testing
npm test              # Run unit tests (Vitest)
npm run test:ui       # Interactive test UI
npm run test:coverage # Generate coverage report
npm run test:e2e      # Run E2E tests (Playwright)
npm run test:e2e:ui   # Playwright UI mode
npm run test:all      # Run all tests (unit + E2E)
```

## Architecture

Tide Planner is a single-page wizard app for annual planning. No backend, all data in localStorage.

### State Management
- `WizardContext` (src/context/WizardContext.tsx) manages all state via useReducer
- State auto-saves to localStorage with 200ms debounce
- State restores on page load (step position + form data)
- URL language parameter support (`?lang=en` or `?lang=zh`)

### Data Flow
```
AppProvider (useReducer)
  └── MainContent
        ├── LanguageSwitcher (download/upload/language buttons)
        ├── ProgressIndicator (step navigation)
        └── StepContent
              └── Step1-7 components (each uses useApp() hook)
```

### Key Types (src/lib/types.ts)
- `AppState`: Full application state (step, scores, keywords, reflections, actions, lang)
- `Dimension`: 9 life dimensions with emoji, color, category, and bilingual labels
- `Word`: Keyword options for summarizing years
- `Scores`: Record of dimension scores (1-10)
- `Actions`: Record of action items per dimension (max 3 each)

### Utilities (src/lib/)
- `storage.ts`: localStorage read/write with sanitization and migration
- `planGenerator.ts`: Generates Markdown output, calendar ICS, and handles clipboard
- `analytics.ts`: Vercel Analytics event tracking (22 tracking functions)

### Styling
- Tailwind CSS with CSS variables for theming (`--accent`, `--text-*`, `--border`)
- Reusable button classes: `.btn`, `.btn-primary`, `.btn-secondary`
- Print styles: `.no-print` hides elements when printing

## Wizard Steps
1. **Rate Your 2025** - Life Wheel assessment (9 dimensions + joy score)
2. **Reflect on 2025** - Highs and lows reflection (textarea inputs)
3. **2025 Keyword** - Select/enter word summarizing the year
4. **Design Your 2026** - Set target scores for each dimension
5. **Action Plan** - Choose up to 3 actions per focus area
6. **2026 Keyword** - Auto-spin or choose guiding word
7. **Summary** - View results, export (copy/image/calendar/print)

## Testing

### Test Files
- `src/lib/storage.test.ts` - localStorage operations (10 tests)
- `src/lib/analytics.test.ts` - Analytics tracking (3 tests)
- `src/lib/planGenerator.test.ts` - Markdown/ICS generation (18 tests)
- `src/context/WizardContext.test.tsx` - State management (22 tests)
- `src/App.test.tsx` - Language switching, persistence (5 tests)
- `e2e/wizard-flow.spec.ts` - Full user journey, navigation, mobile
- `e2e/language-switching.spec.ts` - Language switching via UI and URL

### Test Setup
- Vitest with happy-dom environment
- React Testing Library + jest-dom matchers
- localStorage mock in `src/test/setup.ts`
- Playwright for E2E with auto-starting dev server

## Known Issues
- URL language parameter (`?lang=en`) may have race condition - loads localStorage first, then applies URL override in useEffect. Consider synchronous URL param reading during initial state creation.
