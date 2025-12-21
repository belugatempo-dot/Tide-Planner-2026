import { WizardProvider } from './context/WizardContext';
import { Wizard } from './components/Wizard';

function App() {
  return (
    <WizardProvider>
      <div className="min-h-screen bg-slate-50">
        <Wizard />
      </div>
    </WizardProvider>
  );
}

export default App;
