import React from 'react';
import { CheckCircle2, Globe, GraduationCap, MapPin, Star, Clock, Calendar } from 'lucide-react';
import { MedicalStudent } from '../../types';

interface StudentCardProps {
  student: MedicalStudent;
  onRequest: (student: MedicalStudent) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onRequest }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-health-400 hover:shadow-lg transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Header with Avatar and College */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="relative shrink-0">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
            />
            {student.verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full ring-2 ring-white"
                title="Verified MBBS Student"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-bold text-slate-900 text-sm truncate">{student.name}</h3>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{student.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-health-700 font-semibold mt-0.5">
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{student.year}</span>
            </div>

            <p className="text-[11px] text-slate-600 truncate mt-0.5 font-medium">
              {student.college}
            </p>

            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{student.city}, {student.state}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          "{student.bio}"
        </p>

        {/* Languages */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
          <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] text-slate-500 font-medium">Speaks:</span>
          <div className="flex flex-wrap gap-1">
            {student.languages.map((lang, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Areas of Interest */}
        <div className="space-y-1.5 mb-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Focus Areas:</div>
          <div className="flex flex-wrap gap-1">
            {student.areasOfInterest.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-health-50 text-health-800 border border-health-100"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span className="truncate">{student.availability}</span>
        </div>

        <button
          onClick={() => onRequest(student)}
          className="px-3.5 py-1.5 rounded-xl bg-health-600 hover:bg-health-700 text-white font-bold text-xs shadow-xs hover:shadow transition flex items-center gap-1.5 shrink-0"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Request Talk</span>
        </button>
      </div>
    </div>
  );
};
