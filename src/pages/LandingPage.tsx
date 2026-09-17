import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { OutbreakTicker } from '../components/landing/OutbreakTicker';
import { HowItWorks } from '../components/landing/HowItWorks';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../data/LanguageContext';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <OutbreakTicker />
      <HeroSection />
      <HowItWorks />
      <FeaturesGrid />

      {/* Interactive FAQ / Hackathon Callout */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-health-900 to-clinical-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-health-500/20 text-health-300 border border-health-500/30">
                Ready to Experience MedAware?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Try the Live Health Chat or Explore MedConnect
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Test standard disease queries, prompt red-flag symptoms to inspect real-time safety triage, or switch to Hindi / Marathi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
              <Link
                to="/chat"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-health-500 hover:bg-health-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Launch Health Chat</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/medconnect"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition"
              >
                <Users className="w-4 h-4" />
                <span>Talk to Future Doctors</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
