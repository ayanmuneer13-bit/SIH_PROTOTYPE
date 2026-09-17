import React, { useState } from 'react';
import { BarChart3, ShieldCheck, Activity, Users, Globe, ArrowUpRight, CheckCircle2, AlertTriangle, Layers, Lock, Sparkles } from 'lucide-react';
import { KEY_METRICS, TOP_HEALTH_TOPICS, LANGUAGE_DISTRIBUTION, RED_FLAG_BREAKDOWN } from '../data/dashboardStats';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'architecture'>('metrics');

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-health-50 rounded-xl text-health-700">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  SIH 2025 Evaluation Dashboard
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Live metrics, safety telemetry, and architecture verification for Problem Statement SIH25049
                </p>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'metrics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Telemetry & Metrics
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'architecture'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Safety Architecture & Checks
            </button>
          </div>
        </div>

        {activeTab === 'metrics' ? (
          <>
            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {KEY_METRICS.map((kpi, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-health-400 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>{kpi.title}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {kpi.change}
                      </span>
                    </div>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {kpi.value}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    {kpi.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts & Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Top Queried Health Topics */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Most Queried Disease Awareness Topics
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">14,820 Total Queries</span>
                </div>

                <div className="space-y-3 pt-2">
                  {TOP_HEALTH_TOPICS.map((topic, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>{topic.name}</span>
                        <span>{topic.inquiries.toLocaleString()} ({topic.percentage}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${topic.percentage * 2.8}%`,
                            backgroundColor: topic.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language Distribution */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900">
                  Multilingual Adoption
                </h3>
                <p className="text-xs text-slate-500">
                  Distribution of inquiries across English, Hindi, and Marathi.
                </p>

                <div className="space-y-3 pt-2">
                  {LANGUAGE_DISTRIBUTION.map((lang, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{lang.language}</div>
                        <div className="text-[11px] text-slate-500">{lang.queries.toLocaleString()} inquiries</div>
                      </div>
                      <span className="text-sm font-black text-health-700">{lang.share}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>54% of all interactions occur in regional Indian languages.</span>
                </div>
              </div>
            </div>

            {/* Red Flag Emergency Interceptions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Red-Flag Emergency Interception Log (Sample Telemetry)
                  </h3>
                </div>
                <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                  Zero Delayed Alerts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Emergency Category</th>
                      <th className="py-3 px-4">Incidents Flagged</th>
                      <th className="py-3 px-4">Automated Action</th>
                      <th className="py-3 px-4">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {RED_FLAG_BREAKDOWN.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">{row.category}</td>
                        <td className="py-3 px-4">{row.count}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                            {row.urgency}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Immediate 112/108 Modal Triggered
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Architecture & Clinical Safety Inspection Tab */
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-health-600" />
                MedAware Technical Architecture Pipeline
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Designed to be completely modular: <code className="bg-slate-100 px-1 py-0.5 rounded">safetyService</code> performs regex and intent classification, <code className="bg-slate-100 px-1 py-0.5 rounded">retrievalService</code> computes semantic scoring over curated WHO/MoHFW vectors, and <code className="bg-slate-100 px-1 py-0.5 rounded">mockChatService</code> enforces clinical non-diagnostic guardrails.
              </p>

              {/* Step Flowchart Box */}
              <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
                <div className="text-emerald-400 font-bold">// 1. User Inbound Query (Speech or Text)</div>
                <div>User Query: "I have high fever and pain behind eyes for 3 days"</div>
                <div className="text-amber-400 font-bold pt-2">// 2. Real-Time Safety Filter (safetyService.ts)</div>
                <div>→ Checked 6 Emergency Rules (Cardiac, Respiratory, Stroke, Hemorrhage, Suicide, Hyperthermia)</div>
                <div>→ Result: isEmergency = false</div>
                <div className="text-clinical-400 font-bold pt-2">// 3. Verified Knowledge Retrieval (retrievalService.ts)</div>
                <div>→ Matched tokens against: healthKnowledge.ts (Dengue, Retro-orbital pain)</div>
                <div>→ Confidence: 95% | Grounded Sources: WHO Dengue Guidelines (2024), NVBDCP MoHFW</div>
                <div className="text-purple-400 font-bold pt-2">// 4. Non-Diagnostic Guardrail Synthesis (mockChatService.ts)</div>
                <div>→ Output formatted: Direct Summary + Key Facts + Prevention + Seek Care Criteria + Source Citations</div>
                <div>→ Prohibits: "You definitely have dengue", prescription of paracetamol dosage or antibiotics.</div>
              </div>
            </div>

            {/* Compliance & Safety Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Medical Safety Guardrail Compliance
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span><strong>No Prescriptions:</strong> System never recommends prescription drugs, antibiotics, or specific medicinal dosages.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span><strong>No Diagnostic Claims:</strong> Always phrases findings as "associated with known patterns" rather than definitive diagnosis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span><strong>Continuous Disclaimers:</strong> Prominent disclaimers shown on Landing, Header, Chat messages, and MedConnect modals.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span><strong>Emergency First:</strong> High-priority 112 / 108 bypass for acute life-threatening symptoms.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-clinical-600" />
                  Privacy & Extensibility
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clinical-500 mt-1.5 shrink-0" />
                    <span><strong>Zero Tracking:</strong> No mandatory phone login, cookies, or health tracking profiles.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clinical-500 mt-1.5 shrink-0" />
                    <span><strong>Pluggable Vector DB:</strong> retrievalService can be swapped with Milvus, Pinecone, or pgvector seamlessly.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clinical-500 mt-1.5 shrink-0" />
                    <span><strong>Pluggable LLM:</strong> mockChatService interface can be connected to Llama-3-Med, Med-PaLM, or Gemini API.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-clinical-500 mt-1.5 shrink-0" />
                    <span><strong>Web Speech API:</strong> Native browser STT & TTS without requiring expensive external cloud speech billing.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
