import React, { useState } from 'react';
import { PhoneCall, AlertOctagon, X, Copy, Check, HeartHandshake, ShieldAlert } from 'lucide-react';
import { EMERGENCY_HELPLINES } from '../../services/safetyService';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Emergency Assistance</h2>
              <p className="text-xs text-red-100">National Medical Helplines • India</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p>
              If you or someone nearby is experiencing difficulty breathing, chest pain, active seizures, or loss of consciousness, do not delay. Call emergency response immediately.
            </p>
          </div>

          <div className="space-y-3">
            {EMERGENCY_HELPLINES.map((line) => (
              <div
                key={line.number}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">{line.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                      {line.number}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{line.description}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(line.number)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 transition"
                    title="Copy number"
                  >
                    {copiedNumber === line.number ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={`tel:${line.number}`}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <HeartHandshake className="w-4 h-4 text-teal-600" /> What to tell the dispatcher:
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-slate-600">
              <li>Exact location / landmark</li>
              <li>Chief complaint (e.g., chest pain, breathing difficulty, bleeding)</li>
              <li>Patient age and conscious state</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition"
          >
            Close Emergency Panel
          </button>
        </div>
      </div>
    </div>
  );
};
