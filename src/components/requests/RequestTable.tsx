import React, { useState } from 'react';
import { useRailSyncStore } from '../../store/useRailSyncStore';
import { BlockRequest, Department } from '../../types';
import { DataTable, Column } from '../common/DataTable';
import { StatusBadge } from '../common/StatusBadge';
import { Check, X, ArrowLeftRight, AlertCircle, Sparkles, Filter } from 'lucide-react';

export const RequestTable: React.FC = () => {
  const { requests, approveRequest, rejectRequest, negotiateRequest } = useRailSyncStore();
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [rejectingReqId, setRejectingReqId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const filteredRequests = requests.filter((r) => {
    if (departmentFilter !== 'All' && r.department !== departmentFilter) {
      return false;
    }
    return true;
  });

  const handleConfirmReject = (id: string) => {
    rejectRequest(id, rejectReason || 'Operational headway constraint; requested window conflicts with mail express path.');
    setRejectingReqId(null);
    setRejectReason('');
  };

  const columns: Column<BlockRequest>[] = [
    {
      key: 'requestNo',
      header: 'Requisition ID',
      width: '140px',
      render: (row) => (
        <div>
          <span className="font-mono-data font-bold text-blue-900 text-xs">{row.requestNo}</span>
          <div className="text-[10px] text-slate-500">{row.requestedBy}</div>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department',
      width: '150px',
      render: (row) => (
        <div>
          <span className="font-medium text-slate-900">{row.department}</span>
          <div className="text-[10px] text-slate-500 font-mono-data">{row.assetCode}</div>
        </div>
      ),
    },
    {
      key: 'corridor',
      header: 'Corridor & Track',
      width: '170px',
      render: (row) => (
        <div>
          <div className="font-medium text-slate-800">{row.corridor}</div>
          <div className="text-[10px] text-slate-500 font-mono-data">{row.track}</div>
        </div>
      ),
    },
    {
      key: 'requestedWindow',
      header: 'Requested Slot',
      width: '130px',
      render: (row) => (
        <div className="font-mono-data">
          <span className="font-semibold text-slate-800">
            {row.requestedStart} – {row.requestedEnd}
          </span>
          <div className="text-[10px] text-slate-500">
            {row.requestedDurationMinutes} mins ({row.urgency})
          </div>
        </div>
      ),
    },
    {
      key: 'riskScore',
      header: 'Risk',
      width: '80px',
      align: 'center',
      render: (row) => {
        const isHigh = row.riskScore >= 80;
        return (
          <span
            className={`font-mono-data font-bold px-2 py-0.5 rounded text-xs ${
              isHigh ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-800'
            }`}
          >
            {row.riskScore}
          </span>
        );
      },
    },
    {
      key: 'conflictStatus',
      header: 'Resource Contention',
      width: '140px',
      render: (row) => {
        if (row.conflictStatus === 'Direct Conflict') {
          return <StatusBadge label="Direct Conflict" variant="critical" size="sm" />;
        }
        if (row.conflictStatus === 'Partial') {
          return <StatusBadge label="Partial Overlap" variant="warning" size="sm" />;
        }
        return <StatusBadge label="Clear / Headway OK" variant="approved" size="sm" />;
      },
    },
    {
      key: 'aiRecommendedWindow',
      header: 'AI Negotiation Rationale',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-mono-data font-semibold text-blue-950">
            <Sparkles className="w-3 h-3 text-blue-800 shrink-0" />
            <span>Optimal: {row.aiRecommendedWindow.start} – {row.aiRecommendedWindow.end}</span>
          </div>
          <p className="text-[11px] text-slate-600 line-clamp-2 m-0 leading-relaxed font-sans">
            {row.aiRecommendedWindow.rationale}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Controller Decision',
      width: '190px',
      align: 'right',
      sortable: false,
      render: (row) => {
        if (row.status === 'Approved') {
          return <StatusBadge label="Sanctioned" variant="approved" size="sm" />;
        }
        if (row.status === 'Rejected') {
          return <StatusBadge label="Rejected" variant="rejected" size="sm" />;
        }

        return (
          <div className="flex items-center justify-end gap-2">
            {row.conflictStatus !== 'None' ? (
              <button
                id={`negotiate-btn-${row.id}`}
                onClick={() =>
                  negotiateRequest(row.id, {
                    start: row.aiRecommendedWindow.start,
                    end: row.aiRecommendedWindow.end,
                  })
                }
                title="Adopt AI negotiated window to eliminate conflict"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                Resolve
              </button>
            ) : (
              <button
                id={`approve-btn-${row.id}`}
                onClick={() => approveRequest(row.id)}
                title="Sanction Requisition"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Approve
              </button>
            )}

            <button
              id={`reject-btn-${row.id}`}
              onClick={() => setRejectingReqId(row.id)}
              title="Reject Request"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Quick rejection popover if active */}
      {rejectingReqId && (
        <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex-1">
            <div className="text-xs font-bold text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Document Reason for Rejecting Requisition {rejectingReqId}
            </div>
            <input
              type="text"
              placeholder="e.g., Section traffic saturation; passenger rake priority #12606"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2 w-full text-xs px-3.5 py-2 bg-white border border-rose-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                setRejectingReqId(null);
                setRejectReason('');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleConfirmReject(rejectingReqId)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}

      {/* Requisition Table with Department Filter */}
      <DataTable
        id="requests-datatable"
        data={filteredRequests}
        columns={columns}
        searchPlaceholder="Filter by Requisition #, Department, Asset or Corridor..."
        searchableKey={(r) => `${r.requestNo} ${r.department} ${r.assetCode} ${r.corridor} ${r.track}`}
        pageSize={10}
        actions={
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs bg-slate-50/70 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Civil Engineering</option>
              <option value="Signal & Telecom">Signal & Telecom</option>
              <option value="Traction Distribution">Traction OHE</option>
            </select>
          </div>
        }
      />
    </div>
  );
};
