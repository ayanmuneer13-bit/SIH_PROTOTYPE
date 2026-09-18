import React, { useState, useMemo } from 'react';
import { Users, GraduationCap, ShieldCheck } from 'lucide-react';
import { MEDICAL_STUDENTS } from '../data/medConnectData';
import { MedicalStudent } from '../types';
import { StudentCard } from '../components/medconnect/StudentCard';
import { FilterBar } from '../components/medconnect/FilterBar';
import { RequestModal } from '../components/medconnect/RequestModal';
import { useLanguage } from '../data/LanguageContext';

import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';

export const MedConnectPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<MedicalStudent | null>(null);

  // Load students including verified submissions
  const allStudentsList = useMemo(() => {
    return storageService.getVerifiedStudents();
  }, []);

  // Extract unique filters
  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    allStudentsList.forEach((s) => s.languages.forEach((l) => set.add(l)));
    return Array.from(set);
  }, [allStudentsList]);

  const allColleges = useMemo(() => {
    const set = new Set<string>();
    allStudentsList.forEach((s) => set.add(s.college));
    return Array.from(set);
  }, [allStudentsList]);

  const allYears = useMemo(() => {
    const set = new Set<string>();
    allStudentsList.forEach((s) => set.add(s.year));
    return Array.from(set);
  }, [allStudentsList]);

  const allAreas = useMemo(() => {
    const set = new Set<string>();
    allStudentsList.forEach((s) => s.areasOfInterest.forEach((a) => set.add(a)));
    return Array.from(set);
  }, [allStudentsList]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return allStudentsList.filter((s) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(term) ||
        s.college.toLowerCase().includes(term) ||
        s.city.toLowerCase().includes(term) ||
        s.areasOfInterest.some((a) => a.toLowerCase().includes(term));

      const matchLang = selectedLanguage === 'all' || s.languages.includes(selectedLanguage);
      const matchCollege = selectedCollege === 'all' || s.college === selectedCollege;
      const matchYear = selectedYear === 'all' || s.year === selectedYear;
      const matchArea = selectedArea === 'all' || s.areasOfInterest.includes(selectedArea);

      return matchSearch && matchLang && matchCollege && matchYear && matchArea;
    });
  }, [allStudentsList, searchTerm, selectedLanguage, selectedCollege, selectedYear, selectedArea]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSelectedCollege('all');
    setSelectedYear('all');
    setSelectedArea('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-health-800 via-clinical-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-health-200 text-xs font-semibold backdrop-blur-xs border border-white/20">
              <GraduationCap className="w-4 h-4 text-health-300" />
              <span>MedConnect Community Network</span>
            </div>

            <Link
              to="/medconnect/verify"
              className="self-start sm:self-auto px-4 py-2 bg-health-500 hover:bg-health-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>Are you a medical student? Join & Get Verified</span>
            </Link>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {t.medConnectTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {t.medConnectSubtitle}
            </p>
          </div>

          {/* Metrics ribbon */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">8+</div>
              <div className="text-slate-300">Verified Institutions</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">450+</div>
              <div className="text-slate-300">Awareness Hours</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">4.9 / 5.0</div>
              <div className="text-slate-300">Community Rating</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">100% Free</div>
              <div className="text-slate-300">Public Service</div>
            </div>
          </div>
        </div>

        {/* Clear Non-Diagnostic Disclaimer Banner - Mandatory Safety/Product Rule */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-extrabold block">IMPORTANT SAFETY & PRODUCT RULE:</span>
            MedConnect connects patients with verified medical students for educational guidance and support.
            It does not replace consultation with a licensed medical professional. Medical students must NOT
            be represented as doctors and do NOT independently diagnose patients or prescribe medication.
          </div>
        </div>

        {/* Filters */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          selectedCollege={selectedCollege}
          onCollegeChange={setSelectedCollege}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
          onReset={handleResetFilters}
          languages={allLanguages}
          colleges={allColleges}
          years={allYears}
          areas={allAreas}
        />

        {/* Students Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Showing {filteredStudents.length} verified MBBS students</span>
            <span>All students vetted via institutional identity</span>
          </div>

          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onRequest={(s) => setSelectedStudent(s)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No medical students match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing some of your filters or search keywords to view available students.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-health-600 text-white font-bold text-xs hover:bg-health-700 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <RequestModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  );
};
