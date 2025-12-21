import { useState } from 'react';
import { useWizard } from '../context/WizardContext';
import { generateMarkdownPlan, copyToClipboard, downloadAsMarkdown } from '../lib/planGenerator';
import { clearState } from '../lib/storage';

export function ResultPage() {
  const { state, reset, goToStep } = useWizard();
  const [copied, setCopied] = useState(false);

  const markdown = generateMarkdownPlan(state.data);

  const handleCopy = async () => {
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadAsMarkdown(markdown);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleStartOver = () => {
    if (window.confirm('Are you sure you want to start over? This will clear all your data.')) {
      clearState();
      reset();
    }
  };

  const handleEdit = () => {
    goToStep(0);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-tide-600 to-tide-800 text-white py-12 px-4 no-print">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Your 2026 Annual Plan
          </h1>
          <p className="text-tide-100 text-lg">
            You've done the reflection. Now own the year ahead.
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="sticky top-0 bg-white border-b border-slate-200 py-4 px-4 z-10 no-print">
        <div className="max-w-2xl mx-auto flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleCopy}
            className="btn-primary flex items-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Markdown
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .md
          </button>

          <button
            onClick={handlePrint}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Plan content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="prose prose-slate max-w-none">
          <pre className="bg-slate-50 p-6 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap font-mono border border-slate-200">
            {markdown}
          </pre>
        </div>

        {/* Secondary actions */}
        <div className="mt-8 pt-8 border-t border-slate-200 flex flex-wrap gap-4 justify-center no-print">
          <button
            onClick={handleEdit}
            className="text-tide-600 hover:text-tide-800 font-medium transition-colors"
          >
            Edit Responses
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={handleStartOver}
            className="text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-slate-500 text-sm no-print">
        <p>Close 2025. Set the tide for 2026.</p>
        <p className="mt-2">Made with Tide Planner</p>
      </div>
    </div>
  );
}
