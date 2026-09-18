import React from 'react';
import { Check, Clock, Lock, ShieldCheck, UserCheck, FileText, Camera, Award } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface VerificationStepperProps {
  currentStep: number; // 1 to 5
  overallStatus: VerificationStatus;
}

export const VerificationStepper: React.FC<VerificationStepperProps> = ({
  currentStep,
  overallStatus
}) => {
  const steps = [
    { number: 1, label: 'Registration', icon: UserCheck, desc: 'Student credentials' },
    { number: 2, label: 'Documents', icon: FileText, desc: 'College ID & Bonafide' },
    { number: 3, label: 'Identity Check', icon: Camera, desc: 'Live camera selfie' },
    { number: 4, label: 'Institutional Verification', icon: Clock, desc: '3–4 working days' },
    { number: 5, label: 'Verified', icon: Award, desc: 'Verified Medical Student' }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-health-700">
            MedConnect Verification Workflow
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
            Student Credential & Identity Verification
          </h3>
        </div>
        <div>
          {overallStatus === 'VERIFIED' ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-black">
              <Check className="w-3.5 h-3.5" /> VERIFIED MEDICAL STUDENT
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-bold">
              Status: {overallStatus.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {steps.map((step) => {
          const isComplete =
            step.number < currentStep || (step.number === 5 && overallStatus === 'VERIFIED');
          const isCurrent = step.number === currentStep && overallStatus !== 'VERIFIED';
          const isLocked = step.number > currentStep && overallStatus !== 'VERIFIED';

          const Icon = step.icon;

          return (
            <div
              key={step.number}
              className={`relative rounded-2xl p-4 border transition ${
                isComplete
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : isCurrent
                  ? 'bg-health-50 border-health-500 text-health-950 ring-2 ring-health-500/20 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold">Step {step.number}</span>
                {isComplete ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full bg-health-600 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                    ●
                  </div>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Icon
                  className={`w-4 h-4 ${
                    isComplete ? 'text-emerald-700' : isCurrent ? 'text-health-700' : 'text-slate-400'
                  }`}
                />
                <h4 className="text-xs font-extrabold">{step.label}</h4>
              </div>

              <p className="text-[10px] opacity-75">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
