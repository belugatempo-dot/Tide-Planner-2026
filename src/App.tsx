import { AppProvider, useApp } from './context/WizardContext';
import { Step1 } from './components/steps/Step1';
import { Step2 } from './components/steps/Step2';
import { Step3 } from './components/steps/Step3';
import { Step4 } from './components/steps/Step4';
import { Step5 } from './components/steps/Step5';
import { Step6 } from './components/steps/Step6';
import { Step7 } from './components/steps/Step7';

function LanguageSwitcher() {
  const { state, setLang, download, upload } = useApp();

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await upload(file);
        } catch {
          alert(state.lang === 'en' ? 'Invalid file format' : '文件格式无效');
        }
      }
    };
    input.click();
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
      {/* Download/Upload buttons - we don't store user data */}
      <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border border-[var(--border)]">
        <button
          onClick={download}
          title={state.lang === 'en' ? 'Download your data (we don\'t store it)' : '下载数据（我们不存储您的数据）'}
          className="px-2 py-1.5 rounded-md text-xs hover:bg-gray-100 transition-all text-[var(--text-muted)]"
        >
          ⬇️ {state.lang === 'en' ? 'Download' : '下载'}
        </button>
        <button
          onClick={handleUpload}
          title={state.lang === 'en' ? 'Upload your saved data' : '上传已保存的数据'}
          className="px-2 py-1.5 rounded-md text-xs hover:bg-gray-100 transition-all text-[var(--text-muted)]"
        >
          ⬆️ {state.lang === 'en' ? 'Upload' : '上传'}
        </button>
      </div>
      {/* Language switcher */}
      <div className="flex gap-1 bg-white rounded-full p-1 shadow-sm border border-[var(--border)]">
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            state.lang === 'en'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang('zh')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            state.lang === 'zh'
              ? 'bg-[var(--accent)] text-white'
              : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
          }`}
        >
          中文
        </button>
      </div>
    </div>
  );
}

function ProgressIndicator() {
  const { state, setStep } = useApp();
  const steps = [1, 2, 3, 4, 5, 6, 7] as const;

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8 no-print">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center">
          <button
            onClick={() => step < state.step && setStep(step)}
            disabled={step > state.step}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-medium transition-all ${
              step === state.step
                ? 'bg-[var(--accent)] text-white shadow-md'
                : step < state.step
                ? 'bg-[var(--accent-light)] text-[var(--accent)] cursor-pointer hover:bg-[var(--accent)] hover:text-white'
                : 'bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed'
            }`}
          >
            {step}
          </button>
          {idx < steps.length - 1 && (
            <div
              className={`w-4 sm:w-8 h-0.5 mx-1 ${
                step < state.step ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepContent() {
  const { state } = useApp();

  switch (state.step) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
    case 3:
      return <Step3 />;
    case 4:
      return <Step4 />;
    case 5:
      return <Step5 />;
    case 6:
      return <Step6 />;
    case 7:
      return <Step7 />;
    default:
      return <Step1 />;
  }
}

function MainContent() {
  const { state } = useApp();

  const title =
    state.lang === 'en'
      ? '2025 Reflection & 2026 Planning'
      : '2025回顾 & 2026规划';

  const tagline =
    state.lang === 'en'
      ? 'Be your best self in 2026.'
      : '在2026年成为最好的自己。';

  return (
    <div className="min-h-screen pb-20">
      <LanguageSwitcher />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {/* Header */}
        <header className="text-center mb-6">
          <h1
            className="font-display text-2xl sm:text-3xl font-semibold mb-1"
            style={{ color: 'var(--text-title)' }}
          >
            🌊 {title}
          </h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
            {tagline}
          </p>
        </header>

        {/* Progress */}
        {state.step < 7 && <ProgressIndicator />}

        {/* Step Content */}
        <StepContent />
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
