import { create } from 'zustand';
import {
  Asset,
  Defect,
  BlockScheduleItem,
  BlockRequest,
  CorridorNode,
  CorridorSegment,
  PredictiveItem,
  AuditEntry,
  AlertItem,
  AlertRule,
  SystemIntegration,
  SimulationParameters,
  SimulationResult,
} from '../types';
import {
  INITIAL_ASSETS,
  INITIAL_DEFECTS,
  INITIAL_BLOCKS,
  INITIAL_REQUESTS,
  CORRIDOR_NODES,
  CORRIDOR_SEGMENTS,
  INITIAL_PREDICTIVE,
  INITIAL_AUDIT_LOG,
  INITIAL_ALERTS,
  INITIAL_ALERT_RULES,
  INITIAL_INTEGRATIONS,
} from '../data/mockData';

interface RailSyncState {
  // Core data collections
  assets: Asset[];
  defects: Defect[];
  blocks: BlockScheduleItem[];
  requests: BlockRequest[];
  nodes: CorridorNode[];
  segments: CorridorSegment[];
  predictive: PredictiveItem[];
  auditLog: AuditEntry[];
  alerts: AlertItem[];
  alertRules: AlertRule[];
  integrations: SystemIntegration[];

  // Selection & UI State
  selectedAssetId: string | null;
  selectedBlockId: string | null;
  selectedNodeId: string | null;
  activeFilterDepartment: string;
  isOverrideModalOpen: boolean;
  overrideTarget: { assetCode?: string; blockId?: string; requestNo?: string } | null;

  // Simulation State
  simulationParams: SimulationParameters;
  simulationResult: SimulationResult;

  // Actions
  setSelectedAssetId: (id: string | null) => void;
  setSelectedBlockId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  setActiveFilterDepartment: (dept: string) => void;

  // Request & Negotiation Workflow
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string, reason: string) => void;
  negotiateRequest: (requestId: string, window: { start: string; end: string }) => void;

  // Block Schedule manipulation
  moveBlock: (blockId: string, newStartHour: number) => void;
  acceptAIRecommendation: (blockId: string) => void;

  // Override & Audit
  openOverrideModal: (target?: { assetCode?: string; blockId?: string; requestNo?: string }) => void;
  closeOverrideModal: () => void;
  submitOverride: (data: {
    actor: string;
    role: string;
    assetCode: string;
    reasonCode: string;
    justification: string;
    action: string;
    safetyCleared: boolean;
  }) => void;

  // Alerts
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  toggleAlertRule: (ruleId: string) => void;

  // What-If Simulation
  setSimulationParam: (key: keyof SimulationParameters, value: number) => void;
  resetSimulation: () => void;
  applySimulationScenario: () => void;

  // Real-time ticking for integrations & simulated heartbeats
  tickLiveIntegrations: () => void;
}

function runOptimizationSimulation(params: SimulationParameters): SimulationResult {
  const { trafficDemandPct, criticalDefectWeightPct, corridorCapacityPct, passengerTrainPriority, weatherRiskMultiplier } = params;

  // Real algorithmic response functions
  const baseConflicts = 3;
  const trafficImpact = (trafficDemandPct - 100) / 12;
  const capacityImpact = (80 - corridorCapacityPct) / 10;
  const weatherImpact = (weatherRiskMultiplier - 1.0) * 2;
  
  const simulatedConflicts = Math.max(1, Math.round(baseConflicts + trafficImpact + capacityImpact + weatherImpact));
  
  const availabilityDelta = (100 - trafficDemandPct) * 0.04 + (corridorCapacityPct - 80) * 0.06 - (criticalDefectWeightPct - 70) * 0.03;
  const simulatedAvailability = Number(Math.min(99.2, Math.max(89.0, 94.8 + availabilityDelta)).toFixed(1));

  const blocksMovedCount = Math.max(1, Math.round(2 + (criticalDefectWeightPct - 70) / 15 + Math.abs(trafficDemandPct - 100) / 20));
  
  const avgPunctualityImpactMinutes = Number(
    Math.max(1.2, 3.4 + (trafficDemandPct - 100) * 0.08 + (passengerTrainPriority - 1.0) * -1.2).toFixed(1)
  );

  const safetyIntegrityPct = Number(Math.min(99.9, 98.4 + (criticalDefectWeightPct - 70) * 0.04).toFixed(1));
  const feasibilityScore = Math.max(65, Math.min(99, Math.round(100 - simulatedConflicts * 4.5 - (trafficDemandPct - 100) * 0.2)));

  const diffBreakdown = [
    {
      label: 'Corridor Resource Conflicts',
      baseline: '3 detected',
      simulated: `${simulatedConflicts} detected`,
      change: `${simulatedConflicts - 3 >= 0 ? '+' : ''}${simulatedConflicts - 3}`,
      improved: simulatedConflicts <= 3,
    },
    {
      label: 'Network Asset Availability',
      baseline: '94.8%',
      simulated: `${simulatedAvailability}%`,
      change: `${(simulatedAvailability - 94.8).toFixed(1)}%`,
      improved: simulatedAvailability >= 94.8,
    },
    {
      label: 'Optimal Rescheduled Blocks',
      baseline: '2 blocks',
      simulated: `${blocksMovedCount} blocks`,
      change: `${blocksMovedCount - 2 >= 0 ? '+' : ''}${blocksMovedCount - 2}`,
      improved: blocksMovedCount <= 2,
    },
    {
      label: 'Average Passenger Delay',
      baseline: '3.4 mins',
      simulated: `${avgPunctualityImpactMinutes} mins`,
      change: `${(avgPunctualityImpactMinutes - 3.4).toFixed(1)}m`,
      improved: avgPunctualityImpactMinutes <= 3.4,
    },
    {
      label: 'Safety Integrity Assurance',
      baseline: '98.4%',
      simulated: `${safetyIntegrityPct}%`,
      change: `${(safetyIntegrityPct - 98.4).toFixed(1)}%`,
      improved: safetyIntegrityPct >= 98.4,
    },
  ];

  return {
    simulatedConflicts,
    simulatedAvailability,
    blocksMovedCount,
    avgPunctualityImpactMinutes,
    safetyIntegrityPct,
    feasibilityScore,
    diffBreakdown,
  };
}

const DEFAULT_SIM_PARAMS: SimulationParameters = {
  trafficDemandPct: 100,
  criticalDefectWeightPct: 70,
  corridorCapacityPct: 80,
  passengerTrainPriority: 1.5,
  weatherRiskMultiplier: 1.0,
};

export const useRailSyncStore = create<RailSyncState>((set, get) => ({
  assets: INITIAL_ASSETS,
  defects: INITIAL_DEFECTS,
  blocks: INITIAL_BLOCKS,
  requests: INITIAL_REQUESTS,
  nodes: CORRIDOR_NODES,
  segments: CORRIDOR_SEGMENTS,
  predictive: INITIAL_PREDICTIVE,
  auditLog: INITIAL_AUDIT_LOG,
  alerts: INITIAL_ALERTS,
  alertRules: INITIAL_ALERT_RULES,
  integrations: INITIAL_INTEGRATIONS,

  selectedAssetId: 'ast-01',
  selectedBlockId: 'blk-01',
  selectedNodeId: 'node-tbm',
  activeFilterDepartment: 'All',
  isOverrideModalOpen: false,
  overrideTarget: null,

  simulationParams: DEFAULT_SIM_PARAMS,
  simulationResult: runOptimizationSimulation(DEFAULT_SIM_PARAMS),

  setSelectedAssetId: (id) => set({ selectedAssetId: id }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setActiveFilterDepartment: (dept) => set({ activeFilterDepartment: dept }),

  approveRequest: (requestId) => {
    const req = get().requests.find((r) => r.id === requestId);
    if (!req) return;

    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, status: 'Approved', conflictStatus: 'None' } : r
      ),
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          actor: 'K. S. Narayanan (IRTS)',
          role: 'Chief Controller (Operating)',
          action: 'Approve Department Block Request',
          assetCode: req.assetCode,
          reasonCode: 'SANCTION_APPROVED',
          justification: `Approved formal block requisition ${req.requestNo} for ${req.department}. Verified corridor protection and safe clear time.`,
          safetyCleared: true,
          result: 'MANUAL_APPROVAL',
        },
        ...state.auditLog,
      ],
      alerts: [
        {
          id: `alt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-GB'),
          level: 'Resolved',
          title: `Block Request ${req.requestNo} Approved`,
          description: `Window sanctioned for ${req.assetCode} on ${req.corridor}. Published to BDMS.`,
          corridor: req.corridor,
          assetCode: req.assetCode,
          ruleTriggered: 'RULE-SANCTION',
          acknowledged: false,
        },
        ...state.alerts,
      ],
    }));
  },

  rejectRequest: (requestId, reason) => {
    const req = get().requests.find((r) => r.id === requestId);
    if (!req) return;

    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId ? { ...r, status: 'Rejected' } : r
      ),
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          actor: 'Chief Controller (Operating)',
          role: 'Block Sanction Authority',
          action: 'Reject Department Request',
          assetCode: req.assetCode,
          reasonCode: 'OPERATIONAL_CONSTRAINT',
          justification: reason || 'Corridor capacity saturated; passenger traffic punctuality protected.',
          safetyCleared: true,
          result: 'REJECTED',
        },
        ...state.auditLog,
      ],
    }));
  },

  negotiateRequest: (requestId, window) => {
    const req = get().requests.find((r) => r.id === requestId);
    if (!req) return;

    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'AI Optimized',
              conflictStatus: 'None',
              aiRecommendedWindow: {
                start: window.start,
                end: window.end,
                rationale: `Negotiated alternative slot ${window.start}–${window.end} accepted by departments.`,
              },
            }
          : r
      ),
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          actor: 'RailSync AI',
          role: 'Multi-Agent Negotiator',
          action: 'Re-negotiate Block Window',
          assetCode: req.assetCode,
          reasonCode: 'SLOT_OPTIMIZATION',
          justification: `Shifted window to ${window.start}–${window.end} based on section headway gaps.`,
          safetyCleared: true,
          result: 'AUTO_RESOLVED',
        },
        ...state.auditLog,
      ],
    }));
  },

  moveBlock: (blockId, newStartHour) => {
    set((state) => {
      const blk = state.blocks.find((b) => b.id === blockId);
      if (!blk) return state;

      const updatedBlocks = state.blocks.map((b) =>
        b.id === blockId ? { ...b, startHour: Number(newStartHour.toFixed(2)) } : b
      );

      return {
        blocks: updatedBlocks,
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            actor: 'K. S. Narayanan (IRTS)',
            role: 'Chief Controller (Operating)',
            action: 'Manual Timeline Adjustment',
            assetCode: blk.title,
            reasonCode: 'SCHEDULE_TWEAK',
            justification: `Timeline shifted to start at ${Math.floor(newStartHour)}:${String(Math.round((newStartHour % 1) * 60)).padStart(2, '0')}.`,
            safetyCleared: true,
            result: 'CONTROLLER_OVERRIDE',
          },
          ...state.auditLog,
        ],
      };
    });
  },

  acceptAIRecommendation: (blockId) => {
    set((state) => {
      const targetBlock = state.blocks.find((b) => b.id === blockId) || state.blocks[0];
      return {
        blocks: state.blocks.map((b) =>
          b.id === targetBlock.id ? { ...b, status: 'Approved' } : b
        ),
        auditLog: [
          {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            actor: 'K. S. Narayanan (IRTS)',
            role: 'Chief Controller (Operating)',
            action: 'Accept AI Recommendation',
            assetCode: targetBlock.title,
            reasonCode: 'AI_PLAN_ACCEPTED',
            justification: `Approved AI optimal slot recommendation for ${targetBlock.title}. Verified 0 conflicts.`,
            safetyCleared: true,
            result: 'MANUAL_APPROVAL',
          },
          ...state.auditLog,
        ],
      };
    });
  },

  openOverrideModal: (target) => {
    set({ isOverrideModalOpen: true, overrideTarget: target || null });
  },

  closeOverrideModal: () => {
    set({ isOverrideModalOpen: false, overrideTarget: null });
  },

  submitOverride: (data) => {
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: data.actor,
      role: data.role,
      action: data.action,
      assetCode: data.assetCode,
      reasonCode: data.reasonCode,
      justification: data.justification,
      safetyCleared: data.safetyCleared,
      result: 'CONTROLLER_OVERRIDE',
    };

    set((state) => ({
      auditLog: [newEntry, ...state.auditLog],
      isOverrideModalOpen: false,
      overrideTarget: null,
      alerts: [
        {
          id: `alt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-GB'),
          level: 'Warning',
          title: `Controller Override Logged (${data.assetCode})`,
          description: `Authorized by ${data.actor} (${data.role}): ${data.justification}`,
          corridor: 'Corridor C-17 / Pilot',
          assetCode: data.assetCode,
          ruleTriggered: 'RULE-OVERRIDE',
          acknowledged: false,
        },
        ...state.alerts,
      ],
    }));
  },

  acknowledgeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, acknowledged: true } : a
      ),
    }));
  },

  dismissAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    }));
  },

  toggleAlertRule: (ruleId) => {
    set((state) => ({
      alertRules: state.alertRules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  },

  setSimulationParam: (key, value) => {
    set((state) => {
      const newParams = { ...state.simulationParams, [key]: value };
      const newResult = runOptimizationSimulation(newParams);
      return {
        simulationParams: newParams,
        simulationResult: newResult,
      };
    });
  },

  resetSimulation: () => {
    set({
      simulationParams: DEFAULT_SIM_PARAMS,
      simulationResult: runOptimizationSimulation(DEFAULT_SIM_PARAMS),
    });
  },

  applySimulationScenario: () => {
    const sim = get().simulationResult;
    set((state) => ({
      auditLog: [
        {
          id: `aud-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          actor: 'RailSync AI',
          role: 'Scenario Staging Engine',
          action: 'Apply Simulated Optimization Scenario',
          assetCode: 'ALL_CORRIDORS',
          reasonCode: 'SCENARIO_PROMOTED',
          justification: `Promoted simulation scenario: feasibility ${sim.feasibilityScore}%, availability ${sim.simulatedAvailability}%, ${sim.blocksMovedCount} blocks optimized.`,
          safetyCleared: true,
          result: 'AUTO_RESOLVED',
        },
        ...state.auditLog,
      ],
      alerts: [
        {
          id: `alt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-GB'),
          level: 'Resolved',
          title: 'Simulation Scenario Applied to Active Draft',
          description: `All corridors synchronized with re-weighted optimization criteria.`,
          corridor: 'Division Wide',
          ruleTriggered: 'RULE-SIM-APPLY',
          acknowledged: false,
        },
        ...state.alerts,
      ],
    }));
  },

  tickLiveIntegrations: () => {
    set((state) => ({
      integrations: state.integrations.map((item) => {
        // slight random variation to simulate live sub-second packet flow
        const jitter = Math.floor(Math.random() * 5) - 2;
        const newLatency = Math.max(4, Math.min(28, item.syncLatencySec + jitter));
        return {
          ...item,
          syncLatencySec: newLatency,
          recordsSyncedToday: item.recordsSyncedToday + Math.floor(Math.random() * 3),
          lastSyncTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        };
      }),
    }));
  },
}));
