import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, MessageSquare, Users, BarChart3, AlertCircle, Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../../data/LanguageContext';
import { SupportedLanguage } from '../../types';
import { EmergencyModal } from './EmergencyModal';
import { PrivacyBadge } from '../common/PrivacyBadge';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t.navHome, icon: Activity },
    { path: '/kiosk', label: 'MediKiosk Intake', icon: Activity, badge: 'SIH26047' },
    { path: '/queue', label: 'OPD Wait Estimator', icon: BarChart3 },
    { path: '/medconnect', label: t.navMedConnect, icon: Users },
    { path: '/chat', label: t.navChat, icon: MessageSquare },
    { path: '/admin', label: 'Institutional Admin', icon: AlertCircle }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-health-600 to-clinical-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-health-700 transition">
                  {t.appName}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-health-100 text-health-800 tracking-wider">
                  SIH'25
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Public Health AI Awareness</p>
            </div>
          </Link>

          {/* Navigation Links Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-health-50 text-health-800 shadow-xs border border-health-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-health-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-health-600 text-white shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Privacy Badge */}
            <div className="hidden xl:block">
              <PrivacyBadge compact />
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="pl-7 pr-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-health-500 cursor-pointer transition"
                aria-label="Select Language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="mr">मराठी (MR)</option>
              </select>
            </div>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setIsEmergencyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition hover:shadow-md animate-pulse-subtle"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.navEmergency}</span>
              <span className="sm:hidden">112 SOS</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'bg-health-50 text-health-800 border border-health-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-health-600" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100">
              <PrivacyBadge />
            </div>
          </div>
        )}
      </header>

      {/* Emergency Modal */}
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </>
  );
};
