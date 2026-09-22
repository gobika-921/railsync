# RailSync — AI-Powered Block Planning Control Tower
**Indian Railways Operational Control Architecture**
**Focus Division:** Southern Railway — Chennai Division (MAS)

---

## Executive Overview

**RailSync** is an enterprise-grade, mission-critical autonomous block planning and corridor negotiation control tower built specifically for Indian Railways. Operating behind the non-invasive "adapter-first" architecture, RailSync digests telemetry from legacy Centre for Railway Information Systems (CRIS) platforms — including TMS (Track Management System), SMMS (Signal Maintenance), TDMS (Traction OHE), COA (Control Office Application), and BDMS (Block Demand Management System) — to solve the daily railway dilemma: **maximizing corridor maintenance throughput while preserving 95%+ train punctuality and zero mainline cancellations**.

---

## Architecture & Tech Stack

RailSync is engineered as a high-density, low-latency, light-mode enterprise web application designed in the visual language of professional control systems (Palantir Gotham/Foundry, Linear, RDSO Indian Railways COA).

- **Frontend Core:** React 18, TypeScript (strict mode, zero runtime `any`)
- **State Management:** Zustand with custom optimistic update reducers, constraint verification, and event logging
- **Styling & Design System:** Tailwind CSS v4 with custom railway tokens (`#1E3A8A` Rail Navy, `#DC2626` Signal Red, `#D97706` Signal Amber, `#16A34A` Clear Green, `#F7F8FA` Off-White Canvas)
- **Typography:** Plus Jakarta Sans (headings/body), JetBrains Mono (operational metrics, timestamps, asset IDs)
- **Charts & Data Visualizations:** Recharts (6-month punctuality trajectory, department allocation efficiency)
- **Topological Mapping:** Pure SVG-based interactive vector rail network map (no heavy GIS canvas or generic mapping widgets)
- **Export Engine:** Native CSV tabular synthesis and browser-integrated print/PDF executive dossier generator

---

## Key Modules & Capabilities

1. **Overview Command Center (`/`):**
   - Live KPI cards derived dynamically from underlying divisional assets (assets monitored, critical defects, today's requisitions, auto-reconciliation rate).
   - Real-time AI command feed driven by USFD testing and corridor traffic events.
   - 5-Step Autonomous Planning Loop visualization (Ingest → Score → Solve → Publish → Review).
   - Top Priority AI Recommendation with 4-factor risk breakdown and direct approval/override controls.

2. **Interactive Block Planner (`/planner`):**
   - Gantt matrix displaying multi-track corridor corridors (MAS-PER, PER-AVD, AVD-TRL, TRL-AJJ, MS-TBM, TBM-CGL).
   - Block status visualization (Sanctioned, AI Optimized, Under Review, Direct Contention).
   - Drag-and-drop / click-to-modify block inspector modal with instant conflict recalculation.

3. **Requisition & Negotiation Center (`/requests`):**
   - Requisitions table with live department filters (Civil Engineering, Signal & Telecom, Traction OHE).
   - AI Negotiation Engine suggesting alternative conflict-free windows based on train timetables.
   - Interactive Approve, Negotiate (adopt AI window), and Reject (with documented rationale) workflows.

4. **Corridor Topology & Risk Map (`/network`):**
   - High-contrast SVG vector schematic representing the Chennai Division railway network.
   - Stations/junctions (MAS, BBQ, PER, AVD, TRL, AJJ, KPD, GDR, MS, TBM, CGL, VM) with keyboard accessibility (`Enter`/`Space`) and selection rings.
   - Detail inspection panel detailing daily train pairs, speed restrictions (PSR/TSR), and pending track defects.

5. **Dynamic Risk & Criticality Engine (`/risk`):**
   - Documented scoring equation:
     $$\text{Risk Score} = \text{Defect Severity (0–35)} + \text{Traffic Exposure (0–30)} + \text{Asset Age (0–20)} + \text{Weather Exposure (0–15)}$$
   - Horizontal stacked bar breakdown per asset.
   - **Explainable AI (XAI) Panel:** Dynamically generated natural-language justifications showing primary driver, factor contributions, and safe train headway justifications.

6. **Predictive Maintenance Queue (`/predictive`):**
   - AI failure anomaly forecasting (7-day horizon) based on acoustic/optical USFD telemetry.
   - Degradation trend tracker (Accelerating, Steady, Mild) with direct "Reserve Block" trigger.

7. **What-If Constraint Simulator (`/simulator`):**
   - 5 parametric sliders: Traffic Demand, Defect Risk Tolerance, Corridor Headroom Capacity, Passenger Train Priority Multiplier, and Monsoon Vulnerability.
   - Real-time recalculation of conflict count, network availability, and rescheduled blocks.
   - Visible differential table comparing simulated outcomes with the baseline.

8. **Decision & Audit Trail (`/audit`):**
   - Immutable, timestamped operational event log tracking every AI automated optimization and human Section Controller override.
   - Filter by actor and export directly to CSV.

9. **Alerts & Rules Engine (`/alerts`):**
   - Live operational alert feed with acknowledge/dismiss states.
   - Active safety rule evaluation table with live toggle switches and evaluation counts.

10. **Executive KPI Dossier (`/reports`):**
    - 6-month historical availability vs. punctuality trend curves.
    - Departmental block sanction efficiency metrics.
    - Single-click CSV dataset export and printable PDF layout.

11. **Unified Data Fabric (`/fabric`):**
    - CRIS legacy integration monitors (TMS, SMMS, TDMS, COA, BDMS).
    - Sub-second simulated latency updates and records ingested counts.

---

## Safety & Governance Principles

- **Human-in-the-Loop:** While RailSync autonomously computes optimal multi-department block windows, Section Controllers retain unilateral override authority.
- **Explainability First:** No black-box decisions; every recommendation provides a transparent factor breakdown and train clearance explanation.
- **Safety Invariant:** Immediate emergency track defects (IMR) are always guaranteed dedicated protected slots without compression.
