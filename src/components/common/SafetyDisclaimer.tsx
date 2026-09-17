import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../data/LanguageContext';

export const SafetyDisclaimer: React.FC<{ full?: boolean }> = ({ full = false }) => {
  const { t } = useLanguage();

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 leading-relaxed">
        <p className="font-semibold text-amber-950 mb-0.5">
          {t.disclaimerShort}
        </p>
        {full && (
          <p className="text-amber-800 mt-1">
            {t.disclaimerFull}
          </p>
        )}
      </div>
      <a
        href="https://mohfw.gov.in"
        target="_blank"
        rel="noopener noreferrer"
        className="text-amber-800 hover:text-amber-950 inline-flex items-center gap-1 font-medium shrink-0 ml-1 underline decoration-amber-300"
      >
        MoHFW <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
