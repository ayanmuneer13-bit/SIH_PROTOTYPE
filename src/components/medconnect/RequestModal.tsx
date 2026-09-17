import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Calendar, Video, ShieldCheck } from 'lucide-react';
import { MedicalStudent } from '../../types';

interface RequestModalProps {
  student: MedicalStudent | null;
  onClose: () => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({ student, onClose }) => {
  const [topic, setTopic] = useState('Dengue & Vector-Borne Prevention');
  const [language, setLanguage] = useState(student?.languages[0] || 'English');
  const [slot, setSlot] = useState('Today at 6:00 PM (15 mins)');
  const [contact, setContact] = useState('');
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreedToDisclaimer) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-health-700 to-clinical-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/40"
            />
            <div>
              <h3 className="font-bold text-base">{student.name}</h3>
              <p className="text-xs text-health-100">{student.year} • {student.college}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Confirmed State */}
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">
                Awareness Session Scheduled!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your health awareness guidance request with <strong>{student.name}</strong> has been logged.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-health-600" />
                  <span><strong>Time Slot:</strong> {slot}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Video className="w-4 h-4 text-clinical-600" />
                  <span><strong>Meeting Room:</strong> medaware.in/room/sih-{student.id}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span><strong>Scope:</strong> Disease Education & Prevention Guidance Only</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 text-left">
                <strong>Remember:</strong> Medical students provide community education and guidance. They will not diagnose diseases or write prescriptions.
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-health-600 hover:bg-health-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                Return to MedConnect Directory
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Mandatory Non-Diagnostic Disclaimer Box */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Important Notice:</strong>
                  Medical students provide disease awareness, preventive education, and navigation support only. They do not diagnose conditions or prescribe medications.
                </div>
              </div>

              {/* Discussion Topic */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Health Awareness Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-500"
                >
                  <option value="Dengue & Vector-Borne Prevention">Dengue & Mosquito-Borne Prevention</option>
                  <option value="Seasonal Flu & Respiratory Care">Seasonal Flu & Respiratory Care</option>
                  <option value="Heatwave & Heat Exhaustion Hydration">Heatwave & Heat Exhaustion Hydration</option>
                  <option value="Type 2 Diabetes & Diet Lifestyle">Type 2 Diabetes & Diet Lifestyle</option>
                  <option value="Hypertension & Salt Reduction">Hypertension & Salt Reduction</option>
                  <option value="Tuberculosis Myths & Nikshay Guidance">Tuberculosis Myths & Nikshay Guidance</option>
                  <option value="General Preventive Health Guidance">General Preventive Health Guidance</option>
                </select>
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Conversation Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-500"
                >
                  {student.languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select 15-Minute Awareness Slot
                </label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-500"
                >
                  <option value="Today at 6:00 PM (15 mins)">Today at 6:00 PM (15 mins)</option>
                  <option value="Today at 7:30 PM (15 mins)">Today at 7:30 PM (15 mins)</option>
                  <option value="Tomorrow at 11:00 AM (15 mins)">Tomorrow at 11:00 AM (15 mins)</option>
                  <option value="Tomorrow at 5:00 PM (15 mins)">Tomorrow at 5:00 PM (15 mins)</option>
                </select>
              </div>

              {/* Contact / Phone / Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Phone Number or Email (for room link)
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. 9876543210 or user@example.com"
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-500"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={agreedToDisclaimer}
                    onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-health-600 focus:ring-health-500"
                  />
                  <span>
                    I understand that this is for <strong>educational disease awareness only</strong> and is <strong>not a medical consultation, diagnosis, or prescription</strong>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!agreedToDisclaimer || !contact.trim()}
                className="w-full py-3 bg-health-600 hover:bg-health-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition"
              >
                Confirm Awareness Conversation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
