import React, { useState } from 'react';
import { ShieldCheck, User, Phone, Calendar, HeartPulse, Check, AlertCircle, Sparkles, FileText } from 'lucide-react';
import { PatientIdentification, SupportedLanguage } from '../../types';

interface DemographicsModalProps {
  initialPatient?: Partial<PatientIdentification>;
  onComplete: (patient: PatientIdentification) => void;
  onCancel?: () => void;
}

export const DemographicsModal: React.FC<DemographicsModalProps> = ({
  initialPatient,
  onComplete
}) => {
  const [fullName, setFullName] = useState(initialPatient?.fullName || 'Rameshwar Prasad Gupta');
  const [age, setAge] = useState(initialPatient?.age?.toString() || '58');
  const [gender, setGender] = useState<PatientIdentification['gender']>(initialPatient?.gender || 'Male');
  const [phone, setPhone] = useState(initialPatient?.phone || '+91 98230 45671');
  const [abhaId, setAbhaId] = useState(initialPatient?.abhaId || '91-4829-1029-4820');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>(
    initialPatient?.preferredLanguage || 'en'
  );
  const [ayushMode, setAyushMode] = useState(initialPatient?.ayushMode ?? true);
  const [consentGiven, setConsentGiven] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter patient full name.');
      return;
    }
    if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
      setError('Please enter a valid age (1-120).');
      return;
    }
    if (!consentGiven) {
      setError('Patient consent is required to begin digital clinical intake.');
      return;
    }

    setError('');
    const patient: PatientIdentification = {
      id: initialPatient?.id || `pat-${Date.now()}`,
      abhaId: abhaId.trim() || undefined,
      uhid: `UHID-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      phone: phone.trim(),
      preferredLanguage,
      ayushMode,
      consentGiven: true,
      consentTimestamp: new Date().toISOString()
    };
    onComplete(patient);
  };

  const handleQuickDemoFill = (type: 'cardiac' | 'fever' | 'elderly') => {
    if (type === 'cardiac') {
      setFullName('Rameshwar Prasad Gupta');
      setAge('58');
      setGender('Male');
      setPhone('+91 98230 45671');
      setAbhaId('91-4829-1029-4820');
      setAyushMode(true);
      setPreferredLanguage('hi');
    } else if (type === 'fever') {
      setFullName('Sunita Rajesh Patil');
      setAge('34');
      setGender('Female');
      setPhone('+91 97654 22331');
      setAbhaId('14-8821-4451-9012');
      setAyushMode(true);
      setPreferredLanguage('mr');
    } else {
      setFullName('Anand Rao Deshmukh');
      setAge('72');
      setGender('Male');
      setPhone('+91 94221 00192');
      setAbhaId('32-1190-7762-3341');
      setAyushMode(false);
      setPreferredLanguage('en');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-2xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-health-700 via-clinical-800 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-health-200 text-xs font-semibold backdrop-blur-xs border border-white/20">
            <ShieldCheck className="w-4 h-4 text-health-300" />
            <span>SIH26047 Patient Identification & Consent</span>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
            ABDM Aligned
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black mt-3">MediKiosk Patient Check-in</h2>
        <p className="text-xs sm:text-sm text-slate-200 mt-1">
          Begin your AI-guided clinical history intake. Your information is securely handed to your attending physician.
        </p>

        {/* Demo fill presets */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-300 font-medium">Quick Demo Preset:</span>
          <button
            type="button"
            onClick={() => handleQuickDemoFill('cardiac')}
            className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-white font-medium transition"
          >
            Cardiac / HTN Case (Hindi)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoFill('fever')}
            className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-white font-medium transition"
          >
            Dengue / Fever (Marathi)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoFill('elderly')}
            className="px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-white font-medium transition"
          >
            Geriatric Check (English)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Patient Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name of Patient <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rameshwar Prasad Gupta"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-health-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Age (Years) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-health-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Male', 'Female', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 text-xs font-bold rounded-xl border transition ${
                    gender === g
                      ? 'bg-health-50 border-health-500 text-health-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98230 45671"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-health-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ABHA ID / Ayushman Bharat Number
            </label>
            <input
              type="text"
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="e.g. 91-4829-1029-4820"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-health-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Language & AYUSH Option */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800">Preferred Interaction Language</label>
              <p className="text-[11px] text-slate-500">Audio prompts and clinical questions will adapt</p>
            </div>
            <div className="flex gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'mr', label: 'मराठी' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setPreferredLanguage(lang.code as SupportedLanguage)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                    preferredLanguage === lang.code
                      ? 'bg-health-600 text-white border-health-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* AYUSH Mode Switch */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-teal-600" />
              <div>
                <span className="text-xs font-bold text-slate-800">Include AYUSH History Mode</span>
                <p className="text-[11px] text-slate-500">
                  Screens for Prakriti, traditional formulations (Ayurveda, Siddha, Unani, Homeopathy)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAyushMode(!ayushMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                ayushMode ? 'bg-health-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition" />
            </button>
          </div>
        </div>

        {/* Digital Consent Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              id="patient-consent"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mt-0.5 rounded border-amber-300 text-health-600 focus:ring-health-500 w-4 h-4"
            />
            <label htmlFor="patient-consent" className="text-xs text-amber-900 leading-relaxed cursor-pointer">
              <span className="font-bold">Informed Digital Consent:</span> I agree to share my clinical history
              and previous health records through MediKiosk. I understand that this AI assistant collects draft
              case information solely to assist my attending physician and does NOT provide an autonomous diagnosis.
            </label>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-health-600 to-clinical-600 hover:from-health-500 hover:to-clinical-500 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 group"
          >
            <span>Start AI Clinical Case-Taking</span>
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};
