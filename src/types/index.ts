export type Department = 
  | 'Engineering' 
  | 'Signal & Telecom' 
  | 'Traction Distribution' 
  | 'Operating' 
  | 'Mechanical';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type BlockStatus = 
  | 'Approved' 
  | 'Proposed' 
  | 'Negotiating' 
  | 'Active' 
  | 'Completed' 
  | 'Rejected' 
  | 'Overridden';

export interface Asset {
  id: string;
  code: string;
  name: string;
  department: Department;
  corridor: string;
  locationKm: string;
  status: 'Normal' | 'Monitor' | 'Warning' | 'Critical';
  defectScore: number; // 0 - 35
  trafficDensityScore: number; // 0 - 30
  assetAgeScore: number; // 0 - 20
  weatherVulnerabilityScore: number; // 0 - 15
  compositeRiskScore: number; // 0 - 100
  installationYear: number;
  lastInspectionDate: string;
  trafficGrossMillionTonnes: number;
  defectsPending: number;
}

export interface Defect {
  id: string;
  assetId: string;
  assetCode: string;
  department: Department;
  defectType: string;
  severityScore: number; // 1 - 100
  detectedAt: string;
  detectedBy: string;
  recommendedAction: string;
  maxPermissibleDelayHours: number;
  status: 'Open' | 'Mitigated' | 'Resolved';
}

export interface BlockScheduleItem {
  id: string;
  code: string;
  title: string;
  department: Department;
  corridor: string;
  track: string;
  startHour: number; // e.g. 9.5 for 09:30
  durationHours: number; // e.g. 2.0
  priority: PriorityLevel;
  status: BlockStatus;
  riskScore: number;
  trafficImpactDelayMins: number;
  safetyCertified: boolean;
  requiredEquipments: string[];
  conflictWithIds?: string[];
  humanOverride?: {
    overriddenBy: string;
    reason: string;
    timestamp: string;
  };
}

export interface BlockRequest {
  id: string;
  requestNo: string;
  department: Department;
  requestedBy: string;
  assetCode: string;
  corridor: string;
  track: string;
  requestedStart: string;
  requestedEnd: string;
  requestedDurationMinutes: number;
  urgency: 'Emergency' | 'Safety Critical' | 'Urgent' | 'Routine';
  riskScore: number;
  conflictStatus: 'None' | 'Partial' | 'Direct Conflict';
  aiRecommendedWindow: {
    start: string;
    end: string;
    rationale: string;
  };
  status: 'Pending Review' | 'AI Optimized' | 'Negotiating' | 'Approved' | 'Rejected';
}

export interface CorridorNode {
  id: string;
  name: string;
  code: string;
  x: number; // percentage in SVG coordinate space (0-1000)
  y: number; // percentage in SVG coordinate space (0-600)
  riskLevel: 'Normal' | 'High' | 'Critical';
  activeBlocks: number;
  speedRestrictionKmph?: number;
  dailyTrainPairs: number;
  connections: string[]; // target node IDs
  corridorName: string;
  keyAssets: string[];
}

export interface CorridorSegment {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  corridorName: string;
  doubleTrack: boolean;
  electrified: boolean;
  status: 'Normal' | 'Speed Restricted' | 'Active Maintenance Block';
  riskScore: number;
  dailySectionCapacity: number; // percentage (e.g. 88%)
}

export interface PredictiveItem {
  id: string;
  assetCode: string;
  assetName: string;
  department: Department;
  corridor: string;
  componentName: string;
  predictedFailure: string;
  horizonDays: string;
  confidencePct: number;
  currentDegradationPct: number;
  recommendedBlockWindow: string;
  estimatedDelayRiskMins: number;
  trend: 'Accelerating' | 'Steady' | 'Mild';
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  assetCode: string;
  reasonCode: string;
  justification: string;
  safetyCleared: boolean;
  result: 'AUTO_RESOLVED' | 'CONTROLLER_OVERRIDE' | 'REJECTED' | 'MANUAL_APPROVAL';
}

export interface AlertItem {
  id: string;
  timestamp: string;
  level: 'Critical' | 'Warning' | 'Resolved' | 'Info';
  title: string;
  description: string;
  corridor: string;
  assetCode?: string;
  ruleTriggered: string;
  acknowledged: boolean;
}

export interface AlertRule {
  id: string;
  ruleCode: string;
  name: string;
  condition: string;
  triggerAction: string;
  severity: 'Critical' | 'Warning' | 'Info';
  enabled: boolean;
  evaluationsCount: number;
}

export interface SystemIntegration {
  id: string;
  code: string;
  name: string;
  subsystem: string;
  protocol: string;
  syncLatencySec: number;
  recordsSyncedToday: number;
  status: 'Healthy' | 'Degraded' | 'Syncing' | 'Offline';
  lastSyncTimestamp: string;
  endpoint: string;
  dataTypes: string;
}

export interface SimulationParameters {
  trafficDemandPct: number; // 60 to 140%
  criticalDefectWeightPct: number; // 30 to 100%
  corridorCapacityPct: number; // 50 to 100%
  passengerTrainPriority: number; // 1.0 to 2.0
  weatherRiskMultiplier: number; // 0.8 to 1.5
}

export interface SimulationResult {
  simulatedConflicts: number;
  simulatedAvailability: number;
  blocksMovedCount: number;
  avgPunctualityImpactMinutes: number;
  safetyIntegrityPct: number;
  feasibilityScore: number;
  diffBreakdown: {
    label: string;
    baseline: string;
    simulated: string;
    change: string;
    improved: boolean;
  }[];
}
