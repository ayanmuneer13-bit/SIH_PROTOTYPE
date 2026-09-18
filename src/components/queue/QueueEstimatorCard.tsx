import React, { useState, useEffect } from 'react';
import {
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { WaitingTimePrediction, OPDQueueInput } from '../../types';
import { apiClient } from '../../services/apiClient';
import { DEPARTMENTS, DAYS_OF_WEEK, TIME_SLOTS } from '../../ml/dataset';

interface QueueEstimatorCardProps {
  initialToken?: number;
  initialDept?: string;
}

export const QueueEstimatorCard: React.FC<QueueEstimatorCardProps> = ({
  initialToken = 42,
  initialDept = 'General Medicine'
}) => {
  const [tokenNumber, setTokenNumber] = useState<number>(initialToken);
  const [department, setDepartment] = useState<string>(initialDept);
  const [dayOfWeek, setDayOfWeek] = useState<string>('Monday');
  const [timeSlot, setTimeSlot] = useState<string>('Morning (08:00 - 11:00)');
  const [patientsAhead, setPatientsAhead] = useState<number>(17);
  const [queueSize, setQueueSize] = useState<number>(28);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<WaitingTimePrediction | null>(null);

  // Run KNN prediction whenever inputs change
  const runPrediction = async () => {
    setIsLoading(true);
    try {
      const input: OPDQueueInput = {
        tokenNumber,
        department,
        patientsAhead,
        queueSize,
        dayOfWeek,
        timeSlot
      };
      const result = await apiClient.predictWaitingTime(input);
      setPrediction(result);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
  }, [tokenNumber, department, patientsAhead, queueSize, dayOfWeek, timeSlot]);

  // Adjust patients ahead when token changes
  const handleTokenChange = (val: number) => {
    setTokenNumber(val);
    const estAhead = Math.max(1, Math.round(val * 0.4));
    setPatientsAhead(estAhead);
    setQueueSize(estAhead + 8);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Estimator Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-gradient-to-r from-health-800 via-clinical-800 to-slate-900 text-white p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-health-200 text-xs font-semibold backdrop-blur-xs border border-white/20">
              <Clock className="w-4 h-4 text-health-300" />
              <span>AI OPD WAITING TIME ESTIMATOR (KNN REGRESSION)</span>
            </div>
            <button
              onClick={runPrediction}
              disabled={isLoading}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
              title="Refresh prediction"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mt-3">OPD Queue & Consultation Wait Time</h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1">
            Genuine K-Nearest Neighbors ML model matching your queue parameters against 500+ historical OPD cases.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Interactive Parameters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Token Number</label>
              <input
                type="number"
                min="1"
                max="200"
                value={tokenNumber}
                onChange={(e) => handleTokenChange(Math.max(1, Number(e.target.value)))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-extrabold text-health-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">OPD Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Patients Ahead</label>
              <input
                type="number"
                min="0"
                max="100"
                value={patientsAhead}
                onChange={(e) => setPatientsAhead(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Day of Week</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Estimate Callout (Adheres strictly to user's requested specification) */}
          {prediction && (
            <div className="bg-gradient-to-br from-slate-900 to-clinical-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
                <Clock className="w-64 h-64 text-white" />
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Token & Queue Size */}
                <div className="space-y-4 border-b md:border-b-0 md:border-r border-white/15 pb-6 md:pb-0 md:pr-6">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">
                      Your Token
                    </span>
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-health-300">
                      #{prediction.tokenNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400 block font-medium">Patients Ahead</span>
                      <strong className="text-white text-base">{prediction.patientsAhead}</strong>
                    </div>
                    <div className="border-l border-white/20 pl-4">
                      <span className="text-slate-400 block font-medium">Active Queue</span>
                      <strong className="text-white text-base">{prediction.queueSize} patients</strong>
                    </div>
                  </div>
                </div>

                {/* Estimated Waiting Time Range */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 uppercase tracking-wider font-bold">
                      Estimated Waiting Time:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-300">Confidence:</span>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full capitalize ${
                          prediction.confidence === 'high'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : prediction.confidence === 'moderate'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                        }`}
                      >
                        {prediction.confidence}
                      </span>
                    </div>
                  </div>

                  <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                    ~ {prediction.lowerBound}–{prediction.upperBound} minutes
                  </div>

                  <p className="text-xs text-slate-300 pt-2 border-t border-white/10">
                    This is an approximate estimate based on historical OPD patterns.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Nearest Historical Cases (KNN Breakdown Table) */}
          {prediction && prediction.nearestNeighbors && prediction.nearestNeighbors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    K-Nearest Neighbors: {prediction.similarCasesFound} Similar Historical Cases
                  </h4>
                  <p className="text-xs text-slate-500">
                    Euclidean distance matching against historical consultation duration and load
                  </p>
                </div>
                <span className="text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg font-bold text-slate-600">
                  k = {prediction.nearestNeighbors.length}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Record ID</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Hist. Token</th>
                      <th className="p-3">Patients Ahead</th>
                      <th className="p-3">Feature Distance</th>
                      <th className="p-3 text-right">Actual Wait Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prediction.nearestNeighbors.map((neighbor, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono text-slate-500">{neighbor.id}</td>
                        <td className="p-3 font-bold text-slate-800">{neighbor.department}</td>
                        <td className="p-3">#{neighbor.tokenNumber}</td>
                        <td className="p-3">{neighbor.patientsAhead}</td>
                        <td className="p-3 font-mono text-slate-600">{neighbor.distance}</td>
                        <td className="p-3 text-right font-black text-health-700">
                          {neighbor.actualWaitMinutes} mins
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transparent Non-Medical Accuracy Disclaimer */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Model Transparency Note: </span>
              This KNN regression estimates waiting times using synthetic historical queue vectors (k=6, Euclidean distance,
              inverse-distance weighting). Consultation times may shift depending on emergency trauma cases, triage priority,
              and patient clinical complexity. Not medically guaranteed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
