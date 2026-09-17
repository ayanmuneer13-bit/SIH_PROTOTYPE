import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, ExternalLink, Award } from 'lucide-react';
import { useLanguage } from '../../data/LanguageContext';
import { SafetyDisclaimer } from '../common/SafetyDisclaimer';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Top Disclaimer Band */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <SafetyDisclaimer full />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-health-500 flex items-center justify-center text-white font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{t.appName}</span>
              <span className="text-xs bg-slate-800 text-health-400 px-2 py-0.5 rounded border border-slate-700">
                SIH25049
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t.shortDescription}
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Smart India Hackathon 2025 Working Prototype</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/chat" className="hover:text-health-400 transition-colors">
                  AI Health Chat
                </Link>
              </li>
              <li>
                <Link to="/medconnect" className="hover:text-health-400 transition-colors">
                  MedConnect Student Network
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-health-400 transition-colors">
                  SIH Judges Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Indian Health Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Verified Sources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://mohfw.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-health-400 inline-flex items-center gap-1"
                >
                  MoHFW India <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-health-400 inline-flex items-center gap-1"
                >
                  World Health Organization <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://main.icmr.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-health-400 inline-flex items-center gap-1"
                >
                  ICMR India <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://112.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-health-400 inline-flex items-center gap-1"
                >
                  National Emergency 112 <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2025 MedAware Project. Built for Smart India Hackathon 2025.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Privacy-First Architecture
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Non-Diagnostic Awareness
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
