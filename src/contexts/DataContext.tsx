import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { chartersApi, type CharterListItem, type CharterDetail, type CreateCharterDto } from "../services/api/charters";
import { lookupsApi, type StatusOption, type PriorityOption } from "../services/api/lookups";

// ── Types ─────────────────────────────────────────────────────────────────────

export type { CharterListItem, CharterDetail };

export interface MockTask {
  id: string; charterNumber: string; summary: string; requestor: string;
  urgency: "Low" | "Medium" | "High" | "Critical"; status: string;
  dueDate: string; primaryResource: string; load: string;
}

export interface MockMilestone {
  charterNumber: string; no: number; description: string; dueDate: string;
  status: "Complete" | "Overdue" | "At risk" | "Upcoming";
}

// Keep mock tasks/milestones until Tasks API is wired
export const MOCK_TASKS_ALL: MockTask[] = [
  { id:"TSK-0188", charterNumber:"CHR-0001", summary:"Configure SSO integration with Active Directory", requestor:"S. Burnett", urgency:"High", status:"In Progress", dueDate:"2026-07-10", primaryResource:"S. Burnett", load:"75%" },
];

export const MOCK_MILESTONES_ALL: MockMilestone[] = [
  { charterNumber:"CHR-0001", no:1, description:"Requirements sign-off", dueDate:"2026-07-15", status:"Upcoming" },
  { charterNumber:"CHR-0001", no:2, description:"UAT sign-off", dueDate:"2026-08-15", status:"Upcoming" },
];

export const MOCK_AUDIT = [
  { id:"AUD-001", user:"S. Burnett", initials:"SB", action:"Created charter", entityId:"CHR-0001", changeType:"created" as const, timestamp:"Today" },
];

// ── Context ───────────────────────────────────────────────────────────────────

interface DataCtx {
  // Charters
  charters: CharterListItem[];
  chartersLoading: boolean;
  chartersError: string | null;
  refreshCharters: () => void;
  addCharter: (data: CreateCharterDto) => Promise<void>;
  getCharter: (id: string) => CharterListItem | undefined;
  getCharterDetail: (charterId: number) => Promise<CharterDetail>;
  getCharterTasks: (id: string) => MockTask[];
  getCharterMilestones: (id: string) => MockMilestone[];

  // Lookups
  charterStatuses: StatusOption[];
  priorities: PriorityOption[];

  // Audit (mock for now)
  audit: typeof MOCK_AUDIT;
}

const Ctx = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [charters, setCharters]         = useState<CharterListItem[]>([]);
  const [chartersLoading, setLoading]   = useState(true);
  const [chartersError, setError]       = useState<string | null>(null);
  const [charterStatuses, setStatuses]  = useState<StatusOption[]>([]);
  const [priorities, setPriorities]     = useState<PriorityOption[]>([]);

  const loadCharters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await chartersApi.getAll({ pageSize: 100 });
      setCharters(result.items);
    } catch (e) {
      setError("Could not load charters — is the API running?");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLookups = useCallback(async () => {
    try {
      const [statuses, pris] = await Promise.all([
        lookupsApi.charterStatuses(),
        lookupsApi.priorities(),
      ]);
      setStatuses(statuses);
      setPriorities(pris);
    } catch (e) {
      console.error("Could not load lookups", e);
    }
  }, []);

  useEffect(() => {
    loadCharters();
    loadLookups();
  }, [loadCharters, loadLookups]);

  async function addCharter(data: CreateCharterDto) {
    await chartersApi.create(data);
    await loadCharters();
  }

  function getCharter(id: string) {
    return charters.find(c => c.charterNumber === id || String(c.charterId) === id);
  }

  async function getCharterDetail(charterId: number): Promise<CharterDetail> {
    return chartersApi.getById(charterId);
  }

  function getCharterTasks(id: string) {
    return MOCK_TASKS_ALL.filter(t => t.charterNumber === id);
  }

  function getCharterMilestones(id: string) {
    return MOCK_MILESTONES_ALL.filter(m => m.charterNumber === id);
  }

  return (
    <Ctx.Provider value={{
      charters, chartersLoading, chartersError,
      refreshCharters: loadCharters,
      addCharter, getCharter, getCharterDetail,
      getCharterTasks, getCharterMilestones,
      charterStatuses, priorities,
      audit: MOCK_AUDIT,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
