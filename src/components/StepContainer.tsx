import React from 'react';

interface StepContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function StepContainer({ title, subtitle, children }: StepContainerProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2">
          {title}
        </h2>
        <p className="text-slate-600 text-lg">
          {subtitle}
        </p>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

interface FieldGroupProps {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldGroup({ label, hint, required, children }: FieldGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && (
        <p className="text-sm text-slate-500">{hint}</p>
      )}
      {children}
    </div>
  );
}
