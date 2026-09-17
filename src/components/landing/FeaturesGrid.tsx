import React from 'react';
import { Languages, BookCheck, ShieldAlert, Mic, UserPlus2, Lock } from 'lucide-react';
import { useLanguage } from '../../data/LanguageContext';

export const FeaturesGrid: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Languages,
      title: 'Multilingual Health Access',
      desc: 'Seamlessly interact in English, Hindi (हिन्दी), and Marathi (मराठी). Bridges linguistic barriers in national public health literacy.',
      badge: 'EN • HI • MR'
    },
    {
      icon: BookCheck,
      title: 'Evidence-Based Grounding',
      desc: 'Answers are strictly synthesized from vetted datasets: WHO, MoHFW India, CDC, and ICMR. Zero unchecked internet hallucinations.',
      badge: 'WHO / MoHFW'
    },
    {
      icon: ShieldAlert,
      title: 'Red-Flag Symptom Detection',
      desc: 'Automated intent filters flag acute cardiac, respiratory, neurological, and bleeding emergencies with instant 112/108 guidance.',
      badge: 'Instant Triage'
    },
    {
      icon: Mic,
      title: 'Voice + Text Accessibility',
      desc: 'Browser-native Web Speech API enables spoken inquiries and read-aloud responses, assisting semi-literate and visually impaired citizens.',
      badge: 'STT & TTS'
    },
    {
      icon: UserPlus2,
      title: 'MedConnect Peer Support',
      desc: 'Connect with verified MBBS students across premier Indian colleges (AIIMS, CMC, JJ Hospital) for empathetic awareness guidance.',
      badge: 'Verified MBBS'
    },
    {
      icon: Lock,
      title: 'Privacy-First Architecture',
      desc: 'No personal identification, phone tracking, or medical profiling required. Queries are processed anonymously for user dignity.',
      badge: 'Zero Tracking'
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.featuresTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-health-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-health-50 text-health-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
