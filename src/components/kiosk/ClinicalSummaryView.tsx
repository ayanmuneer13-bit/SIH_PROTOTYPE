import React, { useState } from 'react';
import {
  FileCheck,
  Edit3,
  CheckCircle,
  ShieldCheck,
  AlertTriangle,
  Printer,
  Sparkles,
  ArrowRight,
  HeartPulse,
  User,
  Clock,
  Award
} from 'lucide-react';
import { ClinicalCaseSummary } from '../../types';
import { apiClient } from '../../services/apiClient';

interface ClinicalSummaryViewProps {
  summary: ClinicalCaseSummary;
  onProceedToQueue: (tokenNumber: number) => void;
  onUpdateSummary: (updated: ClinicalCaseSummary) => void;
}

export const ClinicalSummaryView: React.FC<ClinicalSummaryViewProps> = ({
  summary,
  onProceedToQueue,
  onUpdateSummary
}) => {
  const [isPhysicianMode, setIsPhysicianMode] = useState(false);
  const [physicianName, setPhysicianName] = useState(
    summary.physicianReview.physicianName || 'Dr. Alok Verma, MD'
  );
  const [regNumber, setRegNumber] = useState(
    summary.physicianReview.registrationNumber || 'MCI/DMC-67891'
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    summary.physicianReview.clinicalNotes ||
      'Patient case-taking verified. Correlating chest pressure and diaphoresis with previous history of HTN/T2DM. Ordered Stat ECG and bedside Troponin.'
  );
  const [isConfirmed, setIsConfirmed] = useState(summary.physicianReview.isConfirmed);
  const [tokenNumber, setTokenNumber] = useState(summary.tokenNumber || 42);

  const handlePhysicianSignOff = async () => {
    setIsConfirmed(true);
    const updated = await apiClient.confirmPhysicianReview(summary.id, {
      isConfirmed: true,
      physicianName,
      registrationNumber: regNumber,
      clinicalNotes,
      reviewedAt: new Date().toISOString()
    });
    if (updated) {
      onUpdateSummary(updated);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Clinical Notification Banner */}
      <div className="bg-gradient-to-r from-health-800 via-clinical-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/15 text-health-200 text-xs font-bold border border-white/20">
              SIH26047 Structured Clinical Output
            </span>
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                summary.triage.priority === 'P1_CRITICAL'
                  ? 'bg-red-500 text-white'
                  : summary.triage.priority === 'P2_URGENT'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              Triage: {summary.triage.priorityLabel}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">Physician-Ready Clinical Summary</h2>
          <p className="text-xs text-slate-300 mt-1">
            Standardized Case-Taking record compiled by MediKiosk AI for attending physician review.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold border border-white/20 transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPhysicianMode(!isPhysicianMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isPhysicianMode
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-health-500 hover:bg-health-400 text-slate-950 font-extrabold'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{isPhysicianMode ? 'Exit Physician Edit' : 'Physician Review Mode'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Notice: Non-Autonomous Diagnosis */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold block">MANDATORY CLINICAL SAFETY DISCLAIMER:</span>
          This clinical intake record is generated as draft supporting documentation based on patient-reported history.
          It does NOT constitute an autonomous medical diagnosis or prescription. Final diagnostic assessment and treatment
          decisions must be performed and confirmed by a certified attending physician.
        </div>
      </div>

      {/* Main Clinical Document Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8 print:shadow-none print:border-none">
        {/* Header Metadata Ribbon */}
        <div className="border-b border-slate-200 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Patient Full Name</span>
            <span className="text-slate-900 font-extrabold text-sm">{summary.patient.fullName}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Age / Gender</span>
            <span className="text-slate-900 font-bold">
              {summary.patient.age} yrs • {summary.patient.gender}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">ABHA / UHID</span>
            <span className="text-slate-900 font-mono font-bold">
              {summary.patient.abhaId || summary.patient.uhid}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-semibold">Intake Timestamp</span>
            <span className="text-slate-900 font-medium">{summary.intakeTimestamp}</span>
          </div>
        </div>

        {/* Structured Hierarchy:
            1. Chief Complaint
            ↓
            2. History of Present Illness (HPI)
            ↓
            3. Past Medical & Surgical History
            ↓
            4. Drug & Allergy History
            ↓
            5. Family History
            ↓
            6. Personal History
            ↓
            7. Review of Systems (ROS)
            ↓
            8. Investigation / Document Timeline Summary
        */}

        {/* 1. Chief Complaint */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-health-600" />
            <span>1. Chief Complaint</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <p className="text-sm font-bold text-slate-900">{summary.chiefComplaint.symptom}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
              <span>
                <strong>Duration:</strong> {summary.chiefComplaint.duration}
              </span>
              <span>
                <strong>Severity Score:</strong> {summary.chiefComplaint.severity}/10
              </span>
            </div>
          </div>
        </div>

        {/* 2. History of Present Illness (HPI) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-health-600" />
            <span>2. History of Present Illness (HPI)</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs leading-relaxed">
            <div>
              <strong>Onset:</strong> {summary.hpi.onset} onset • <strong>Character:</strong> {summary.hpi.character}
            </div>
            {summary.hpi.radiation && (
              <div>
                <strong>Radiation:</strong> {summary.hpi.radiation}
              </div>
            )}
            <div>
              <strong>Aggravating Factors:</strong> {summary.hpi.aggravatingFactors.join(', ') || 'None reported'}
            </div>
            <div>
              <strong>Relieving Factors:</strong> {summary.hpi.relievingFactors.join(', ') || 'None reported'}
            </div>
            <div>
              <strong>Progression:</strong> {summary.hpi.progression}
            </div>
          </div>
        </div>

        {/* 3. Past Medical & Surgical History */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-health-600" />
            <span>3. Past Medical & Surgical History</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-bold block text-slate-700 mb-1">Medical Conditions:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {summary.pmhx.conditions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              {summary.pmhx.notes && (
                <p className="mt-2 text-[11px] text-slate-500 italic">Note: {summary.pmhx.notes}</p>
              )}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-bold block text-slate-700 mb-1">Prior Surgical Procedures:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {summary.pshx.procedures.map((s, i) => (
                  <li key={i}>{s.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Drug & Allergy History */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-health-600" />
            <span>4. Drug & Allergy History</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="font-bold block text-slate-700 mb-1">Current Medications:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {summary.drugHistory.currentMedications.map((m, i) => (
                  <li key={i}>
                    {m.name} {m.dosage ? `(${m.dosage})` : ''} - Compliance: {m.compliance}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-200">
              <span className="font-bold block text-red-900 mb-1">Allergies & Reactions:</span>
              <ul className="list-disc list-inside space-y-1 text-red-800">
                {summary.allergyHistory.allergies.map((a, i) => (
                  <li key={i}>
                    {a.substance} ({a.reaction})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Family History */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-health-600" />
            <span>5. Family History</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
            <ul className="list-disc list-inside space-y-1">
              {summary.familyHistory.conditions.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Personal History */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-health-600" />
            <span>6. Personal & Social History</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Diet:</span>{' '}
              <strong className="text-slate-800">{summary.personalHistory.diet}</strong>
            </div>
            <div>
              <span className="text-slate-500">Smoking:</span>{' '}
              <strong className="text-slate-800">{summary.personalHistory.smoking}</strong>
            </div>
            <div>
              <span className="text-slate-500">Alcohol:</span>{' '}
              <strong className="text-slate-800">{summary.personalHistory.alcohol}</strong>
            </div>
            <div>
              <span className="text-slate-500">Sleep:</span>{' '}
              <strong className="text-slate-800">{summary.personalHistory.sleepHours} hrs/night</strong>
            </div>
          </div>
        </div>

        {/* 7. Review of Systems (ROS) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-health-600" />
            <span>7. Review of Systems (ROS)</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
            {Object.entries(summary.ros).map(([sys, list]) => {
              if (!Array.isArray(list) || list.length === 0) return null;
              return (
                <div key={sys}>
                  <strong className="capitalize text-slate-800">{sys}:</strong>{' '}
                  <span className="text-slate-600">{list.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AYUSH Integration (If enabled) */}
        {summary.ayushHistory.enabled && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-teal-800 uppercase tracking-wider border-b border-teal-100 pb-1">
              <HeartPulse className="w-3.5 h-3.5 text-teal-600" />
              <span>Integrated AYUSH Record</span>
            </div>
            <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200 text-xs space-y-1.5 text-teal-900">
              <div>
                <strong>Prakriti Constitution:</strong>{' '}
                {summary.ayushHistory.prakritiAssessment || 'Pitta-Kapha'}
              </div>
              {summary.ayushHistory.homeRemedies && summary.ayushHistory.homeRemedies.length > 0 && (
                <div>
                  <strong>Herbal Decoctions / Home Remedies:</strong>{' '}
                  {summary.ayushHistory.homeRemedies.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. Investigation & Medical Document Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-health-600" />
            <span>8. Investigation / Document Timeline Summary</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            {summary.documents.length === 0 ? (
              <p className="text-slate-500 italic">No prior medical documents attached.</p>
            ) : (
              summary.documents.map((doc, dIdx) => (
                <div key={dIdx} className="border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      [{doc.documentDate}] {doc.title}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                      {doc.documentType}
                    </span>
                  </div>
                  {doc.extractedLabValues && (
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                      {doc.extractedLabValues.map((lab, lIdx) => (
                        <span
                          key={lIdx}
                          className={`px-2 py-0.5 rounded ${
                            lab.status !== 'Normal'
                              ? 'bg-red-100 text-red-800 font-bold'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {lab.testName}: {lab.value} {lab.unit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Physician Review & Sign-Off Section */}
        <div className="pt-6 border-t-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-health-600" />
              <h4 className="text-base font-black text-slate-900">Physician Review & Clinical Sign-Off</h4>
            </div>
            {isConfirmed ? (
              <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full shadow-xs">
                <CheckCircle className="w-4 h-4" /> Physician Confirmed & Signed
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                Pending Physician Sign-Off
              </span>
            )}
          </div>

          {/* Physician Edit Controls */}
          {isPhysicianMode ? (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Attending Physician Name
                  </label>
                  <input
                    type="text"
                    value={physicianName}
                    onChange={(e) => setPhysicianName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Medical Council Registration Number
                  </label>
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Physician Diagnostic Impressions & Notes
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <button
                type="button"
                onClick={handlePhysicianSignOff}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm & Sign-Off Intake Record</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>
                  <strong>Reviewing Doctor:</strong> {physicianName} ({regNumber})
                </span>
                <span>
                  <strong>Status:</strong> {isConfirmed ? 'Verified' : 'Draft Under Review'}
                </span>
              </div>
              <p className="text-slate-700 italic">"{clinicalNotes}"</p>
            </div>
          )}
        </div>
      </div>

      {/* OPD Token & Next Step Banner */}
      <div className="bg-gradient-to-r from-health-700 to-clinical-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-health-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-health-100">
              Assigned OPD Consultation Token
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              #{tokenNumber}
            </span>
            <span className="text-xs text-slate-200 font-medium">General Medicine / Cardiology OPD</span>
          </div>
          <p className="text-xs text-slate-200 max-w-md">
            Your clinical summary has been routed to the doctor's workstation. Check your estimated waiting time
            using our KNN-based queue prediction engine.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onProceedToQueue(tokenNumber)}
          className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 group shrink-0"
        >
          <span>Launch AI OPD Waiting-Time Estimator</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
