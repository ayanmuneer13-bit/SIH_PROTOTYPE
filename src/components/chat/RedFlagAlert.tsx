import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, MapPin, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SafetyAssessment } from '../../types';
import { EmergencyModal } from '../layout/EmergencyModal';

interface RedFlagAlertProps {
  safetyAssessment?: SafetyAssessment;
}

export const RedFlagAlert: React.FC<RedFlagAlertProps> = ({ safetyAssessment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (isDismissed) {
    return (
      <div className="p-3 bg-red-50/80 border border-red-200 rounded-xl text-xs text-red-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
          <span><strong>Emergency Alert Acknowledged:</strong> Please seek certified emergency care if symptoms persist.</span>
        </div>
        <button
          onClick={() => setIsDismissed(false)}
          className="text-red-700 underline font-semibold text-xs ml-2 shrink-0"
        >
          View Alert Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-500 rounded-2xl p-5 shadow-lg space-y-4 animate-fadeIn">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-md shrink-0 mt-0.5">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-200 text-red-950 uppercase tracking-wider mb-1">
                ⚠️ Red-Flag Safety Alert
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-red-950">
                Urgent Medical Attention May Be Needed
              </h3>
              <p className="text-xs sm:text-sm text-red-900 mt-1 leading-relaxed">
                Some symptoms you mentioned can be associated with medical emergencies. Please contact appropriate emergency medical services or seek immediate medical care.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-red-200 text-red-700 transition"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {isExpanded && (
          <>
            {safetyAssessment?.guidanceText && (
              <div className="p-3.5 bg-white/90 border border-red-200 rounded-xl text-xs text-red-950 font-medium leading-relaxed">
                <strong>Clinical Safety Guidance: </strong>
                {safetyAssessment.guidanceText}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Emergency Services (112 / 108)</span>
              </button>

              <a
                href="https://www.google.com/maps/search/emergency+hospital+near+me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-red-800 border border-red-300 text-xs font-bold rounded-xl shadow-xs transition"
              >
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Find Emergency Care</span>
              </a>

              <button
                onClick={() => setIsDismissed(true)}
                className="px-3.5 py-2.5 text-xs text-red-800 hover:text-red-950 hover:bg-red-200/50 rounded-xl font-semibold transition ml-auto"
              >
                Continue Reading
              </button>
            </div>
          </>
        )}
      </div>

      <EmergencyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
