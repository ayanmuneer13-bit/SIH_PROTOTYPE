import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  selectedLanguage: string;
  onLanguageChange: (v: string) => void;
  selectedCollege: string;
  onCollegeChange: (v: string) => void;
  selectedYear: string;
  onYearChange: (v: string) => void;
  selectedArea: string;
  onAreaChange: (v: string) => void;
  onReset: () => void;
  languages: string[];
  colleges: string[];
  years: string[];
  areas: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  selectedCollege,
  onCollegeChange,
  selectedYear,
  onYearChange,
  selectedArea,
  onAreaChange,
  onReset,
  languages,
  colleges,
  years,
  areas
}) => {
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedLanguage !== 'all' ||
    selectedCollege !== 'all' ||
    selectedYear !== 'all' ||
    selectedArea !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by student name, medical college, city, or interest..."
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-500 focus:bg-white transition"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Language */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full p-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
          >
            <option value="all">All Languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* College */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Medical College
          </label>
          <select
            value={selectedCollege}
            onChange={(e) => onCollegeChange(e.target.value)}
            className="w-full p-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
          >
            <option value="all">All Medical Colleges</option>
            {colleges.map((c) => (
              <option key={c} value={c}>
                {c.length > 25 ? c.substring(0, 25) + '...' : c}
              </option>
            ))}
          </select>
        </div>

        {/* MBBS Year */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            MBBS Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full p-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
          >
            <option value="all">All MBBS Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Topic Area */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Focus Area
          </label>
          <select
            value={selectedArea}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full p-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-health-500"
          >
            <option value="all">All Focus Areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter status & Reset */}
      {hasActiveFilters && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Filters applied</span>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-health-700 hover:text-health-900 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset all filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
