import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

export const OverrideModal: React.FC = () => {
  const { isOverrideModalOpen, closeOverrideModal, overrideTarget, submitOverride, assets } = useRailSyncStore();

  const [actor, setActor] = useState('K. S. Narayanan (IRTS)');
  const [role, setRole] = useState('Chief Controller (Operating)');
  const [assetCode, setAssetCode] = useState(overrideTarget?.assetCode || 'TRK-CHN-041');
  const [action, setAction] = useState('Reschedule Block Slot');
  const [reasonCode, setReasonCode] = useState('OPERATIONAL_PUNCTUALITY_PRIORITY');
  const [justification, setJustification] = useState('');
  const [safetyCleared, setSafetyCleared] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (overrideTarget?.assetCode) {
      setAssetCode(overrideTarget.assetCode);
    }
  }, [overrideTarget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim() || justification.trim().length < 12) {
      setError('Justification is mandatory for audit trail and must be at least 12 characters.');
      return;
    }
    if (!safetyCleared) {
      setError('Safety clearance verification checkbox is mandatory prior to manual override.');
      return;
    }

    submitOverride({
      actor,
      role,
      assetCode,
      action,
      reasonCode,
      justification,
      safetyCleared,
    });

    // Reset form
    setJustification('');
    setError(null);
    setSafetyCleared(false);
  };

  return (
    <Modal
      id="controller-override-modal"
      isOpen={isOverrideModalOpen}
      onClose={closeOverrideModal}
      title="Controller Human-in-the-Loop Override"
      subtitle="Authorized supervisory override of AI block recommendations under Section 21 of IR Operating Manual"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Authorized Controller
            </label>
            <input
              type="text"
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              required
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Operational Role / Authority
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans cursor-pointer"
            >
              <option value="Chief Controller (Operating)">Chief Controller (Operating)</option>
              <option value="Sr. DEN (Co-ord) / Civil">Sr. DEN (Co-ord) / Civil</option>
              <option value="Sr. DSTE / Signal Ops">Sr. DSTE / Signal Ops</option>
              <option value="Sr. DEE / Traction">Sr. DEE / Traction</option>
              <option value="Divisional Railway Manager">Divisional Railway Manager</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Target Asset / Requisition
            </label>
            <select
              value={assetCode}
              onChange={(e) => setAssetCode(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono-data cursor-pointer"
            >
              {assets.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} — {a.name}
                </option>
              ))}
              <option value="CORRIDOR-WIDE-OVERRIDE">Corridor-wide General Schedule</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Override Action
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans cursor-pointer"
            >
              <option value="Reschedule Block Slot">Reschedule Block Slot to Alternate Gap</option>
              <option value="Grant Emergency Block">Grant Immediate Emergency Shadow Block</option>
              <option value="Defer Maintenance Block">Defer Maintenance to Scheduled Twilight Window</option>
              <option value="Revoke Corridor Grant">Revoke Corridor Grant Due to Traffic Surge</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Reason Code
          </label>
          <select
            value={reasonCode}
            onChange={(e) => setReasonCode(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-mono-data cursor-pointer"
          >
            <option value="OPERATIONAL_PUNCTUALITY_PRIORITY">OPERATIONAL_PUNCTUALITY_PRIORITY</option>
            <option value="VIP_PARLIAMENT_MOVEMENT">VIP_PARLIAMENT_MOVEMENT</option>
            <option value="WEATHER_SURGE_RESTRICTION">WEATHER_SURGE_RESTRICTION</option>
            <option value="EQUIPMENT_CREW_UNAVAILABLE">EQUIPMENT_CREW_UNAVAILABLE</option>
            <option value="ACCELERATED_CORRIDOR_DEFECT">ACCELERATED_CORRIDOR_DEFECT</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Operational Justification <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Document operational circumstances, alternate train routing, and section speed arrangements..."
            rows={3}
            required
            className="w-full text-xs p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans leading-relaxed"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            This statement is permanently stamped in the immutably logged system audit record.
          </span>
        </div>

        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
          <input
            id="safety-clearance-check"
            type="checkbox"
            checked={safetyCleared}
            onChange={(e) => setSafetyCleared(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
          />
          <label
            htmlFor="safety-clearance-check"
            className="text-xs text-amber-900 font-medium leading-relaxed cursor-pointer"
          >
            I certify that sectional caution orders, line occupancy rules, and safety clearances comply with Indian Railways General & Subsidiary Rules (G&SR).
          </label>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={closeOverrideModal}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs"
          >
            Cancel
          </button>
          <button
            id="submit-override-btn"
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Commit Override & Log
          </button>
        </div>
      </form>
    </Modal>
  );
};
