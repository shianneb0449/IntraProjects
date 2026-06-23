import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_CHARTERS, MOCK_AUDIT, type MockCharter } from "../features/charters/data";

// ── Mock tasks keyed by charter ───────────────────────────────────────────────
export interface MockTask {
  id: string; charterNumber: string; summary: string; requestor: string;
  urgency: "Low" | "Medium" | "High" | "Critical"; status: string; dueDate: string;
  primaryResource: string; load: string;
}

export const MOCK_TASKS_ALL: MockTask[] = [
  { id:"TSK-0188", charterNumber:"CHR-0041", summary:"Configure SSO integration with Active Directory", requestor:"S. Burnett", urgency:"High", status:"In Progress", dueDate:"2026-07-10", primaryResource:"S. Burnett", load:"75%" },
  { id:"TSK-0184", charterNumber:"CHR-0041", summary:"Data migration dry run for Finance module", requestor:"A. Patel", urgency:"High", status:"Open", dueDate:"2026-07-20", primaryResource:"A. Patel", load:"100%" },
  { id:"TSK-0183", charterNumber:"CHR-0041", summary:"Configure ERP user roles and permissions", requestor:"S. Burnett", urgency:"Medium", status:"Open", dueDate:"2026-07-25", primaryResource:"S. Burnett", load:"50%" },
  { id:"TSK-0187", charterNumber:"CHR-0033", summary:"Complete risk assessment documentation", requestor:"R. Huang", urgency:"Critical", status:"Under review", dueDate:"2026-06-28", primaryResource:"R. Huang", load:"100%" },
  { id:"TSK-0186", charterNumber:"CHR-0039", summary:"Build API connector for vendor portal", requestor:"M. Delacroix", urgency:"Medium", status:"Open", dueDate:"2026-08-01", primaryResource:"M. Delacroix", load:"75%" },
  { id:"TSK-0185", charterNumber:"CHR-0037", summary:"Draft updated remote work policy", requestor:"T. Okafor", urgency:"Low", status:"Stalled", dueDate:"2026-09-15", primaryResource:"T. Okafor", load:"50%" },
];

export interface MockMilestone {
  charterNumber: string; no: number; description: string; dueDate: string;
  status: "Complete" | "Overdue" | "At risk" | "Upcoming";
}

export const MOCK_MILESTONES_ALL: MockMilestone[] = [
  { charterNumber:"CHR-0041", no:1, description:"AD / SSO integration signed off", dueDate:"2026-07-15", status:"Upcoming" },
  { charterNumber:"CHR-0041", no:2, description:"Finance module data migration", dueDate:"2026-07-31", status:"Upcoming" },
  { charterNumber:"CHR-0041", no:3, description:"UAT sign-off", dueDate:"2026-08-15", status:"Upcoming" },
  { charterNumber:"CHR-0033", no:1, description:"Risk assessment complete", dueDate:"2026-06-25", status:"Overdue" },
  { charterNumber:"CHR-0033", no:2, description:"Internal audit complete", dueDate:"2026-07-10", status:"Upcoming" },
  { charterNumber:"CHR-0033", no:3, description:"External certification audit", dueDate:"2026-07-30", status:"Upcoming" },
  { charterNumber:"CHR-0039", no:1, description:"API connector complete", dueDate:"2026-08-01", status:"Upcoming" },
  { charterNumber:"CHR-0039", no:2, description:"Vendor portal go-live", dueDate:"2026-09-15", status:"Upcoming" },
  { charterNumber:"CHR-0037", no:1, description:"Policy drafts reviewed", dueDate:"2026-08-01", status:"At risk" },
  { charterNumber:"CHR-0037", no:2, description:"Leadership sign-off", dueDate:"2026-10-01", status:"Upcoming" },
];

// ── Persistence helpers ───────────────────────────────────────────────────────
const KEY = "ip_data_v1";

function load(): { charters: MockCharter[] } | null {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function save(data: { charters: MockCharter[] }) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

// ── Context ───────────────────────────────────────────────────────────────────
interface DataCtx {
  charters: MockCharter[];
  tasks: MockTask[];
  milestones: MockMilestone[];
  audit: typeof MOCK_AUDIT;
  addCharter: (c: Omit<MockCharter, "id">) => void;
  updateCharter: (id: string, updates: Partial<MockCharter>) => void;
  getCharter: (id: string) => MockCharter | undefined;
  getCharterTasks: (id: string) => MockTask[];
  getCharterMilestones: (id: string) => MockMilestone[];
}

const Ctx = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [charters, setCharters] = useState<MockCharter[]>(() => load()?.charters ?? MOCK_CHARTERS);

  useEffect(() => { save({ charters }); }, [charters]);

  function addCharter(data: Omit<MockCharter, "id">) {
    const id = `CHR-${String(charters.length + 42).padStart(4, "0")}`;
    setCharters(p => [...p, { ...data, id }]);
  }
  function updateCharter(id: string, u: Partial<MockCharter>) {
    setCharters(p => p.map(c => c.id === id ? { ...c, ...u } : c));
  }
  function getCharter(id: string) { return charters.find(c => c.id === id); }
  function getCharterTasks(id: string) { return MOCK_TASKS_ALL.filter(t => t.charterNumber === id); }
  function getCharterMilestones(id: string) { return MOCK_MILESTONES_ALL.filter(m => m.charterNumber === id); }

  return (
    <Ctx.Provider value={{ charters, tasks: MOCK_TASKS_ALL, milestones: MOCK_MILESTONES_ALL, audit: MOCK_AUDIT, addCharter, updateCharter, getCharter, getCharterTasks, getCharterMilestones }}>
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
