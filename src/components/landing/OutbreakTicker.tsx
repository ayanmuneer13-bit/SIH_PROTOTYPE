import React from 'react';
import { AlertCircle, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export const OutbreakTicker: React.FC = () => {
  const alerts = [
    {
      icon: ShieldAlert,
      tag: 'MONSOON VECTOR ADVISORY',
      text: 'National Dengue & Malaria Alert: Observe weekly Dry Day. Empty stagnant cooler and pot water.',
      color: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    {
      icon: Flame,
      tag: 'SEASONAL FLU',
      text: 'Influenza H3N2 / H1N1 active: Practice hand hygiene and wear masks in crowded clinical settings.',
      color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
      icon: AlertCircle,
      tag: 'TB AWARENESS',
      text: 'Cough lasting >2 weeks? Avail free sputum testing at nearest government Ayushman Arogya Mandir.',
      color: 'text-clinical-700 bg-clinical-50 border-clinical-200'
    }
  ];

  return (
    <div className="bg-slate-100 border-b border-slate-200 overflow-hidden py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 shrink-0">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-health-600" /> Public Health Bulletin
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {alerts.map((a, idx) => {
            const Icon = a.icon;
            return (
              <div
                key={idx}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-medium ${a.color}`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="font-bold">{a.tag}:</span>
                <span className="truncate max-w-xs sm:max-w-md">{a.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
