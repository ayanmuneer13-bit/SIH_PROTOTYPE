import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../data/LanguageContext';

export const PrivacyBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200" title={t.privacySubtext}>
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>{t.privacyBadge}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 text-xs shadow-sm">
      <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div>
        <span className="font-semibold">{t.privacyBadge}: </span>
        <span className="text-emerald-700">{t.privacySubtext}</span>
      </div>
    </div>
  );
};
