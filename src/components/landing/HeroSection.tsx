import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, ShieldCheck, Sparkles, ArrowRight, HeartPulse, CheckCircle2, Activity } from 'lucide-react';
import { useLanguage } from '../../data/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-health-50/50 via-white to-slate-50">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-health-200/50 blur-3xl" />
        <div className="absolute top-20 -right-40 w-96 h-96 rounded-full bg-clinical-200/50 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-health-100 text-health-800 text-xs font-semibold shadow-xs border border-health-200/80">
            <Sparkles className="w-4 h-4 text-health-600" />
            <span>Smart India Hackathon • Problem Statement SIH26047 — Patient Case-Taking Software</span>
          </div>

          {/* Title & Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            MediKiosk Clinical Case-Taking &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-health-600 via-clinical-600 to-teal-700">
              MedConnect Ecosystem
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            AI-powered patient clinical history-taking with voice & touch intake, dynamic follow-ups, real-time red-flag triage,
            medical document OCR timeline extraction, KNN-based OPD queue wait-time estimation, and verified medical student guidance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/kiosk"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-health-600 to-clinical-600 hover:from-health-500 hover:to-clinical-500 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all group"
            >
              <Activity className="w-4 h-4" />
              <span>Launch MediKiosk Case-Taking</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/queue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs hover:border-health-400 transition-all"
            >
              <span>OPD Wait Estimator (KNN)</span>
            </Link>

            <Link
              to="/medconnect"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs hover:border-health-400 transition-all"
            >
              <Users className="w-4 h-4 text-health-600" />
              <span>MedConnect Students</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ABDM & Ayushman Bharat Aligned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Multilingual Voice & Touch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AYUSH History Integration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>KNN Waiting Time Prediction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>WHO & MoHFW Evidence Grounded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Never Diagnoses or Prescribes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant Red-Flag Safety Triage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-clinical-600" />
              <span>100% Privacy-First Architecture</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
