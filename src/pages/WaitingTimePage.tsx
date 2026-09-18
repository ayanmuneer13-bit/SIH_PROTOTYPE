import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Clock, Activity, Users, ArrowLeft, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { QueueEstimatorCard } from '../components/queue/QueueEstimatorCard';

export const WaitingTimePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get('token');
  const deptParam = searchParams.get('dept');

  const initialToken = tokenParam ? parseInt(tokenParam, 10) : 42;
  const initialDept = deptParam || 'General Medicine';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between">
          <Link
            to="/kiosk"
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to MediKiosk Intake</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live OPD Queue Prediction Active</span>
          </div>
        </div>

        {/* KNN Queue Estimator Component */}
        <QueueEstimatorCard initialToken={initialToken} initialDept={initialDept} />

        {/* Educational / Explanatory Section for SIH Jury */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-health-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              How the KNN OPD Waiting-Time Estimator Operates
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-600">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="block text-slate-900 mb-1">1. Multi-Dimensional Feature Vector</strong>
              Inputs token number, patients ahead, active queue load, day-of-week rush multipliers, time slots,
              and historical specialty consultation rates.
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="block text-slate-900 mb-1">2. Weighted Euclidean KNN Search</strong>
              Finds the top $k=6$ closest historical consultations from a 500+ record dataset, applying
              inverse-distance weighting ($w_i = 1 / [d_i + \epsilon]$).
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <strong className="block text-slate-900 mb-1">3. Realistic Uncertainty Range</strong>
              Computes neighbor variance to output a transparent interval (e.g. ~45–60 mins) and confidence
              rating, acknowledging emergency interruptions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
