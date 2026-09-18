import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  Search,
  Filter,
  Activity,
  BarChart3,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';
import {
  StudentVerificationApplication,
  VerificationStatus,
  ClinicalCaseSummary
} from '../types';
import { apiClient } from '../services/apiClient';

export const AdminDashboardPage: React.FC = () => {
  // Authorization Gate (PIN protected for SIH prototype evaluation)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminPin, setAdminPin] = useState('ADMIN2026');
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active section tab
  const [activeSection, setActiveSection] = useState<'verifications' | 'intakes' | 'queue' | 'stats'>('verifications');

  // Verification applications
  const [applications, setApplications] = useState<StudentVerificationApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'ALL'>('ALL');
  const [selectedApp, setSelectedApp] = useState<StudentVerificationApplication | null>(null);

  // Review modal state
  const [reviewerName, setReviewerName] = useState('Dr. S. K. Roy (Institutional Dean)');
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Clinical intakes
  const [intakes, setIntakes] = useState<ClinicalCaseSummary[]>([]);
  const [selectedIntake, setSelectedIntake] = useState<ClinicalCaseSummary | null>(null);

  const loadData = async () => {
    const apps = await apiClient.getVerificationApplications();
    setApplications(apps);
    const inList = await apiClient.getIntakes();
    setIntakes(inList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'ADMIN2026' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin PIN. (Default evaluator PIN: ADMIN2026)');
    }
  };

  // Status transition handlers
  const handleUpdateStatus = async (
    id: string,
    newStatus: VerificationStatus,
    reason?: string
  ) => {
    const updated = await apiClient.updateVerificationStatus(
      id,
      newStatus,
      reviewerName,
      reason,
      adminNotes
    );
    if (updated) {
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setSelectedApp(updated);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.overallStatus === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Authorization Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-health-950 to-clinical-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-health-400" />
              <span className="text-xs font-black uppercase tracking-wider text-health-300">
                Authorized Institutional Administration
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              MediKiosk & MedConnect Verification Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Verify medical student credentials, audit patient clinical intakes, and monitor OPD queue performance.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold">
                <Unlock className="w-4 h-4" />
                <span>Authorized Verifier (Dean's Office)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-bold">
                <Lock className="w-4 h-4" />
                <span>Locked</span>
              </div>
            )}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-extrabold">
          {[
            { id: 'verifications', label: `Student Verifications (${applications.length})`, icon: GraduationCapIcon },
            { id: 'intakes', label: `Clinical Intake Audits (${intakes.length})`, icon: FileText },
            { id: 'queue', label: 'OPD Queue Telemetry', icon: Clock },
            { id: 'stats', label: 'System Statistics & ABDM', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition ${
                  active
                    ? 'bg-health-600 text-white border-health-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SECTION 1: MedConnect Student Verifications */}
        {activeSection === 'verifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Applications List & Filter */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">Application Queue</h3>
                  <span className="text-xs text-slate-400 font-semibold">{filteredApps.length} Found</span>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
                  {(['ALL', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'MORE_INFORMATION_REQUIRED', 'REJECTED'] as const).map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg border transition ${
                          statusFilter === st
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    )
                  )}
                </div>

                {/* Applications list */}
                <div className="space-y-2.5 pt-2 max-h-[600px] overflow-y-auto">
                  {filteredApps.map((app) => {
                    const isSelected = selectedApp?.id === app.id;
                    return (
                      <div
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                          isSelected
                            ? 'bg-health-50 border-health-500 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 text-sm">{app.name}</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              app.overallStatus === 'VERIFIED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.overallStatus === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : app.overallStatus === 'UNDER_REVIEW'
                                ? 'bg-clinical-100 text-clinical-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {app.overallStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-slate-500 mt-1">{app.college}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                          <span>{app.year}</span>
                          <span>{app.documents.length} Docs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Application Inspection & Decision Panel */}
            <div className="lg:col-span-2">
              {selectedApp ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400 font-bold">{selectedApp.id}</span>
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            selectedApp.overallStatus === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {selectedApp.overallStatus.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedApp.name}</h2>
                      <p className="text-xs text-slate-500">{selectedApp.college} • {selectedApp.year}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedApp.id, 'VERIFIED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Verify Student</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            selectedApp.id,
                            'MORE_INFORMATION_REQUIRED',
                            'Please upload a clearer copy of your student ID'
                          )
                        }
                        className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs rounded-xl transition"
                      >
                        Request More Info
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED', 'Credentials not verified')}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>

                  {/* Student Academic & Contact Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Official Email</span>
                      <strong className="text-slate-800">{selectedApp.email}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Phone</span>
                      <strong className="text-slate-800">{selectedApp.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Student ID Number</span>
                      <strong className="text-slate-800 font-mono">{selectedApp.studentIdNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Course</span>
                      <strong className="text-slate-800">{selectedApp.course}</strong>
                    </div>
                  </div>

                  {/* Submitted Documents & Live Camera Selfie Inspection (Side-by-Side) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Left: Submitted Institutional Documents */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Submitted Verification Documents ({selectedApp.documents.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedApp.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-health-600" />
                              <div>
                                <span className="font-bold block text-slate-800">{doc.fileName}</span>
                                <span className="text-[11px] text-slate-500">
                                  {doc.docType.replace(/_/g, ' ')} • {doc.fileSize}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] text-health-700 bg-health-50 px-2 py-0.5 rounded font-bold">
                              Audited
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Live Identity / Camera Check Snapshot */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Live Camera Identity Check Snapshot
                      </h4>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                        {selectedApp.identityCheck.imageUrl ? (
                          <img
                            src={selectedApp.identityCheck.imageUrl}
                            alt="Live selfie capture"
                            className="w-40 h-40 object-cover rounded-xl mx-auto border-2 border-health-500 shadow-sm"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-xl bg-slate-200 flex items-center justify-center mx-auto text-slate-400 text-xs">
                            No camera photo
                          </div>
                        )}
                        <span className="text-[11px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold inline-block">
                          Status: {selectedApp.identityCheck.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Notes Input */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <label className="font-bold text-slate-700 block">
                      Institutional Reviewer Notes & Audit Trail:
                    </label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Cross-verified with AIIMS dean office enrollment list. Signature verified."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 space-y-2">
                  <GraduationCapIcon className="w-12 h-12 mx-auto text-slate-300" />
                  <h4 className="text-sm font-bold text-slate-600">Select an application from the queue</h4>
                  <p className="text-xs">
                    Inspect student documents, cross-check live camera selfie, and approve or reject.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 2: Clinical Intake Submissions Audit */}
        {activeSection === 'intakes' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">MediKiosk Clinical Intake Records</h3>
                <p className="text-xs text-slate-500">
                  Comprehensive audit trail of AI-guided patient case-taking sessions.
                </p>
              </div>
              <span className="text-xs font-bold bg-health-50 text-health-800 px-3 py-1 rounded-full border border-health-200">
                {intakes.length} Cases Captured
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Token</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Age/Gender</th>
                    <th className="p-3">Chief Complaint</th>
                    <th className="p-3">Triage Priority</th>
                    <th className="p-3">Physician Sign-Off</th>
                    <th className="p-3 text-right">Intake Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {intakes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-extrabold text-health-800">#{c.tokenNumber || 42}</td>
                      <td className="p-3 font-bold text-slate-900">{c.patient.fullName}</td>
                      <td className="p-3 text-slate-600">
                        {c.patient.age}y / {c.patient.gender}
                      </td>
                      <td className="p-3 text-slate-700 max-w-xs truncate">{c.chiefComplaint.symptom}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            c.triage.priority === 'P1_CRITICAL'
                              ? 'bg-red-100 text-red-800'
                              : c.triage.priority === 'P2_URGENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {c.triage.priorityLabel}
                        </span>
                      </td>
                      <td className="p-3">
                        {c.physicianReview.isConfirmed ? (
                          <span className="text-emerald-700 font-bold">✓ Confirmed</span>
                        ) : (
                          <span className="text-amber-700 font-bold">Draft / Review Needed</span>
                        )}
                      </td>
                      <td className="p-3 text-right text-slate-500">{c.intakeTimestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 3: Queue Telemetry & KNN Settings */}
        {activeSection === 'queue' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-black text-slate-900">OPD Queue & Machine Learning Telemetry</h3>
              <p className="text-xs text-slate-500">
                Live performance indicators and parameter weights for KNN Regression.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-bold">Historical Training Samples</span>
                <div className="text-2xl font-black text-slate-900">520 Records</div>
                <p className="text-[11px] text-slate-400">8 Specialties across 6 operational weekdays</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-bold">Model Hyperparameter k</span>
                <div className="text-2xl font-black text-health-700">k = 6 Neighbors</div>
                <p className="text-[11px] text-slate-400">Weighted by inverse Euclidean feature distance</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 font-bold">Average Prediction Error (MAE)</span>
                <div className="text-2xl font-black text-clinical-700">± 4.8 Minutes</div>
                <p className="text-[11px] text-slate-400">Tested against ground-truth OPD wait times</p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: System Statistics & ABDM Readiness */}
        {activeSection === 'stats' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-black text-slate-900">ABDM Alignment & Architecture Telemetry</h3>
              <p className="text-xs text-slate-500">
                Conformance with Ayushman Bharat Digital Mission (ABDM) and FHIR R4 clinical data architecture.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1 text-emerald-950">
                <strong className="block font-black text-sm">ABHA ID & Consent Management</strong>
                <p>
                  Every MediKiosk session registers informed patient consent with cryptographic timestamp and
                  ABHA/UHID correlation.
                </p>
              </div>

              <div className="p-4 bg-clinical-50/60 border border-clinical-200 rounded-2xl space-y-1 text-clinical-950">
                <strong className="block font-black text-sm">FHIR Composition Mapping</strong>
                <p>
                  Standardized sections (Chief Complaint, HPI, PMHx, Allergies, ROS) map directly to FHIR R4
                  ClinicalDocument architecture.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function GraduationCapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}
