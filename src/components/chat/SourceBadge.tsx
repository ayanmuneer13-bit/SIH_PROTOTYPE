import React from 'react';
import { ExternalLink, CheckCircle, ShieldCheck } from 'lucide-react';
import { DiseaseSource } from '../../types';

interface SourceBadgeProps {
  source: DiseaseSource;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => {
  const getBadgeColor = (org: string) => {
    switch (org) {
      case 'WHO':
        return 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100';
      case 'MoHFW':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100';
      case 'CDC':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100';
      case 'ICMR':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100';
    }
  };

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all shadow-2xs group ${getBadgeColor(source.organization)}`}
      title={`Last reviewed by clinical team on ${source.lastReviewed}`}
    >
      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
      <span>{source.organization}: {source.name}</span>
      <span className="text-[10px] opacity-70 font-normal ml-0.5">({source.lastReviewed})</span>
      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5" />
    </a>
  );
};
