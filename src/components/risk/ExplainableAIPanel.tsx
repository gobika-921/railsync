import React from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { generateAIExplanation } from '../../utils/scoring';
import { Sparkles, CheckCircle2, ShieldAlert, FileText, ArrowRight, Gauge } from 'lucide-react';

export const ExplainableAIPanel: React.FC = () => {
  const { assets, selectedAssetId, setSelectedAssetId, openOverrideModal, acceptAIRecommendation } = useRailSyncStore();

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];
  const explanation = generateAIExplanation(selectedAsset, { start: '10:30', end: '12:00' });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.02)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading m-0">
              Explainable AI (XAI) Decision Rationale
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 m-0 font-sans">
            Algorithmic audit explanation for asset{' '}
            <strong className="text-slate-900 font-mono-data">{selectedAsset.code}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedAsset.id}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="text-xs bg-slate-50/80 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-mono-data cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.code} ({a.compositeRiskScore} pts)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Driver Banner */}
      <div className="p-4 bg-blue-50/70 border border-blue-200/60 rounded-2xl space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider font-mono-data text-blue-900 block">
          Primary Algorithmic Driver
        </span>
        <div className="text-xs font-extrabold text-blue-950">
          {explanation.primaryDriver}
        </div>
        <p className="text-xs text-blue-900/90 leading-relaxed font-sans m-0">
          {explanation.summary}
        </p>
      </div>

      {/* Factor Breakdown Bars */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 font-heading mb-3 uppercase tracking-wider">
          Component Factor Breakdown
        </h4>
        <div className="space-y-3.5">
          {explanation.factorContributions.map((fc) => (
            <div key={fc.factor} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">{fc.factor}</span>
                <span className="font-mono-data font-bold text-slate-900">
                  {fc.points} / {fc.max} pts ({fc.percentage}%)
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                <div
                  style={{ width: `${fc.percentage}%` }}
                  className={`h-full rounded-full transition-all ${
                    fc.percentage > 75
                      ? 'bg-rose-600'
                      : fc.percentage > 50
                      ? 'bg-blue-600'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Recommendation */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 font-heading">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Operational Recommendation & Headway Optimization</span>
        </div>
        <p className="text-xs text-emerald-950 mt-1.5 m-0 leading-relaxed font-sans">
          {explanation.operationalRecommendation}
        </p>
      </div>

      {/* Decision Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-mono-data">
          Model: MILP Constraint Engine + Bayesian Risk Prioritizer
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => acceptAIRecommendation(selectedAsset.id)}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            Accept AI Block Plan
          </button>
          <button
            type="button"
            onClick={() => openOverrideModal({ assetCode: selectedAsset.code })}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
          >
            Controller Override
          </button>
        </div>
      </div>
    </div>
  );
};
