# 🌊 Tide Planner 2026

> Close 2025, set the tide for 2026.

A guided wizard to help you reflect on the past year and create a structured annual plan for 2026. Visualize your life balance with an interactive Life Wheel, track your progress, and export your personalized plan.

## ✨ Features

### Core Functionality
- **7-Step Guided Wizard** - Systematic annual planning process
- **Interactive Life Wheel** - Visual 9-dimension life balance assessment
  - 💪 Body - Physical health & fitness
  - 🧠 Mind - Mental wellness
  - ✨ Soul - Inner peace & purpose
  - 💕 Romance - Love & intimacy
  - 👨‍👩‍👧 Family - Family bonds
  - 👥 Friends - Social life
  - 💼 Career - Work & purpose
  - 💰 Money - Financial health
  - 📈 Growth - Learning & skills
- **Overall Joy Metric** - Track life satisfaction (1-10 scale)
- **Bilingual Support** - Chinese (中文) and English
  - URL-based language switching (`?lang=en` or `?lang=zh`)
  - Shareable language-specific links
- **Auto-save** - Never lose your progress (localStorage)
- **Privacy-First** - All data stored locally, no server required

### Export & Sharing
- 📋 Copy to clipboard (Markdown format)
- 📥 Download as .md file
- 🖼️ Generate shareable image
- 📅 Export to calendar (.ics file)
- 🖨️ Print-friendly format
- 💾 Data import/export (.json backup)

### Analytics & Insights
- 📊 Vercel Analytics integration
- ⚡ Performance monitoring (Web Vitals)
- 📈 Track year-over-year improvements
- 🎯 Identify top 3 focus areas for growth

### Quality Assurance
- ✅ Comprehensive test coverage
  - Unit tests (Vitest)
  - Component tests (React Testing Library)
  - E2E tests (Playwright)
- 🤖 CI/CD automation (GitHub Actions)
- 🌐 Cross-browser compatibility

## 🚀 Live Demo

**Production:** https://tide-planner.vercel.app

**Language-specific links:**
- 🇨🇳 Chinese: https://tide-planner.vercel.app?lang=zh
- 🇬🇧 English: https://tide-planner.vercel.app?lang=en

## 📖 How It Works

### 7-Step Planning Journey

1. **📍 Rate Your 2025** - Evaluate your life across 9 dimensions + overall joy
2. **💭 Reflect on 2025** - Identify highlights and areas for improvement
3. **🏷️ 2025 Keyword** - Summarize your year in one word
4. **🎯 Envision Your 2026** - Set target scores for each life dimension
5. **⚡ Focus & Actions** - Define specific actions for top 3 growth areas
6. **🏷️ 2026 Keyword** - Choose your guiding word for the new year
7. **📊 Review & Export** - View your complete plan and share it

## 💻 Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev              # http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Unit & component tests
npm test                 # Run all tests
npm run test:ui          # Interactive test UI
npm run test:coverage    # Generate coverage report

# E2E tests
npm run test:e2e         # Run Playwright tests
npm run test:e2e:ui      # Playwright UI mode

# Run all tests
npm run test:all         # Unit + E2E
```

### Linting

```bash
npm run lint             # ESLint check
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling

### Libraries
- **html2canvas** - Image generation
- **@vercel/analytics** - Usage tracking
- **@vercel/speed-insights** - Performance monitoring

### Testing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **happy-dom** - DOM environment for tests

### Deployment
- **Vercel** - Hosting & CI/CD
- **GitHub Actions** - Automated testing

## 📂 Project Structure

```
tide-planner-2026/
├── src/
│   ├── components/
│   │   ├── steps/           # Step 1-7 wizard components
│   │   ├── SingleWheel.tsx  # Interactive life wheel
│   │   └── ShareCard.tsx    # Image export component
│   ├── context/
│   │   └── WizardContext.tsx # Global state management
│   ├── lib/
│   │   ├── types.ts         # TypeScript types & constants
│   │   ├── storage.ts       # localStorage operations
│   │   ├── analytics.ts     # Event tracking
│   │   └── planGenerator.ts # Markdown/ICS generation
│   ├── test/
│   │   └── setup.ts         # Test configuration
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── e2e/
│   ├── language-switching.spec.ts # URL language tests
│   └── wizard-flow.spec.ts        # User journey tests
├── .github/
│   └── workflows/
│       └── test.yml         # CI/CD pipeline
└── public/                  # Static assets
```

## 🔒 Privacy & Data

**All data stays on your device:**
- ✅ No server, no database
- ✅ No personal data collected
- ✅ localStorage for auto-save
- ✅ Manual export/import (.json)
- ✅ Optional analytics (page views only, no personal data)

**What we track (anonymously via Vercel Analytics):**
- Page visits and navigation
- Language preference (Chinese vs English)
- Feature usage (exports, downloads)
- Performance metrics (Web Vitals)

**We do NOT track:**
- Your personal data, reflections, or goals
- Individual responses or plan content
- User identity or IP addresses

## 🌍 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 🤝 Contributing

Contributions welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Built with ❤️ by Beluga Tempo
- Powered by Claude Code
- Deployed on Vercel

---

**Start planning your best year yet! 🎯**

[Launch Tide Planner →](https://tide-planner.vercel.app)
