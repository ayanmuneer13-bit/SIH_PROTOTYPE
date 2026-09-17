import React from 'react';
import { MessageSquare, ShieldAlert, Database, FileCheck2, UserCheck, ArrowRight, Ambulance } from 'lucide-react';
import { useLanguage } from '../../data/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: MessageSquare,
      title: 'User Health Inquiry',
      desc: 'User describes symptoms or asks disease prevention queries via voice or text in English, Hindi, or Marathi.'
    },
    {
      num: '02',
      icon: ShieldAlert,
      title: 'Intent & Safety Triage',
      desc: 'Our real-time safety layer instantly scans for red-flag emergencies (chest pain, breathing distress, stroke symptoms).'
    },
    {
      num: '03',
      icon: Database,
      title: 'Verified RAG Retrieval',
      desc: 'Non-emergency queries retrieve clinical facts from curated WHO, MoHFW, CDC, and ICMR disease protocols.'
    },
    {
      num: '04',
      icon: FileCheck2,
      title: 'Grounded Evidence Answer',
      desc: 'Delivers structured, non-diagnostic answers with explicit prevention tips and when to visit a certified clinic.'
    },
    {
      num: '05',
      icon: UserCheck,
      title: 'MedConnect or Care',
      desc: 'Users can connect with verified MBBS students for health literacy or receive direct emergency 112/108 escalation.'
    }
  ];

  return (
    <section className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.howItWorks}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.howItWorksSubtitle}
          </p>
        </div>

        {/* Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 border border-slate-200/90 rounded-2xl p-5 hover:border-health-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-health-700 px-2 py-0.5 rounded bg-health-100">
                      Step {step.num}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-health-700 shadow-xs group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Emergency Escalation Callout */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-red-600 text-white rounded-xl shadow-xs">
              <Ambulance className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-red-950">Immediate Clinical Escalation Path</h4>
              <p className="text-xs text-red-800">
                Whenever life-threatening indicators are detected, MedAware halts general advice and prioritizes 112/108 emergency escalation.
              </p>
            </div>
          </div>
          <a
            href="tel:112"
            className="shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
          >
            Emergency 112
          </a>
        </div>
      </div>
    </section>
  );
};
