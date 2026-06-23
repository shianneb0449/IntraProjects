import { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Plus, Trash2, ChevronLeft } from "lucide-react";
import type { CharterFormValues, ProjectTeamMember, CostItem, ProjectMilestone, VendorEvaluation } from "../../../types/charter";

// ── Shared input style ──────────────────────────────────────────────────────
const inp = "w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors";
const lbl = "block text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1.5";
const sec = "text-[10px] font-medium text-muted-foreground font-mono uppercase tracking-wider pb-2 border-b border-border mb-3 mt-1";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className={lbl}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

// ── Tab definitions ─────────────────────────────────────────────────────────
const TABS = ["General Info", "Project Team", "Milestones", "Vendor Summary", "Vendor Evaluation"];

interface Props {
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export function CharterForm({ onClose, onSubmit }: Props) {
  const [tab, setTab] = useState(0);
  const [hasVendor, setHasVendor] = useState(false);

  // Dynamic array states
  const [team, setTeam] = useState<ProjectTeamMember[]>([
    { name: "", role: "", estimatedHours: 0 },
    { name: "", role: "", estimatedHours: 0 },
  ]);
  const [costs, setCosts] = useState<CostItem[]>([
    { description: "", amount: 0 },
    { description: "", amount: 0 },
  ]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([
    { milestoneNumber: 1, description: "", completeByDate: "" },
    { milestoneNumber: 2, description: "", completeByDate: "" },
    { milestoneNumber: 3, description: "", completeByDate: "" },
  ]);
  const [pros, setPros] = useState<string[]>(["", "", ""]);
  const [cons, setCons] = useState<string[]>(["", ""]);
  const [refs, setRefs] = useState<VendorEvaluation["references"]>([{ contact: "", contactInfo: "" }]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CharterFormValues>({
    defaultValues: { hasVendor: false, projectApproach: "" },
  });

  // Live vendor cost calculation
  const ot = parseFloat(watch("oneTimeCosts")) || 0;
  const an = parseFloat(watch("annualPrice")) || 0;
  const yr1 = ot + an;
  const yr3 = ot + an * 3;
  const withTax = yr1 * 1.08;
  const fmt = (v: number) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalCost = costs.reduce((s, c) => s + (Number(c.amount) || 0), 0);

  function handleSave(values: CharterFormValues) {
    onSubmit?.({ ...values, team, costs, milestones, pros, cons, refs });
    onClose();
  }

  const vendorTabStyle = (i: number) =>
    !hasVendor && (i === 3 || i === 4) ? "opacity-40 pointer-events-none" : "";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
              New Project Charter
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">High-level project record — not required for every project</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border flex-shrink-0 px-6 gap-0 overflow-x-auto" style={{ background: "var(--card)" }}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${vendorTabStyle(i)} ${
              tab === i ? "text-primary border-primary" : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* ── Tab 0: General Info ── */}
        {tab === 0 && (
          <div>
            <Field label="Project name" required>
              <input {...register("projectName", { required: true })} className={inp} placeholder="e.g. ERP System Migration — Phase 3" />
              {errors.projectName && <p className="text-xs text-red-400 mt-1">Project name is required</p>}
            </Field>
            <Field label="Problem statement" required>
              <textarea {...register("problemStatement", { required: true })} className={inp} rows={3} placeholder="What problem or opportunity does this project address?" />
              {errors.problemStatement && <p className="text-xs text-red-400 mt-1">Problem statement is required</p>}
            </Field>
            <Field label="Goal statement" required>
              <textarea {...register("goalStatement", { required: true })} className={inp} rows={3} placeholder="What does success look like when this project is complete?" />
              {errors.goalStatement && <p className="text-xs text-red-400 mt-1">Goal statement is required</p>}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Project leader" required>
                <input {...register("projectLeader", { required: true })} className={inp} placeholder="Search AD users…" />
                {errors.projectLeader && <p className="text-xs text-red-400 mt-1">Project leader is required</p>}
              </Field>
              <Field label="Project approach">
                <select {...register("projectApproach")} className={inp + " cursor-pointer"}>
                  <option value="">Select approach…</option>
                  <option>Waterfall</option>
                  <option>Agile / Iterative</option>
                  <option>Phased</option>
                  <option>Pilot then Rollout</option>
                  <option>Other</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start date">
                <input {...register("startDate")} type="date" className={inp} />
              </Field>
              <Field label="Estimated completion date">
                <input {...register("estimatedCompletionDate")} type="date" className={inp} />
              </Field>
            </div>
            <label
              className="flex items-center gap-3 px-4 py-3 bg-muted border border-border rounded-lg cursor-pointer hover:border-white/20 transition-colors mt-2"
              onClick={() => setHasVendor(v => !v)}
            >
              <input
                type="checkbox"
                checked={hasVendor}
                onChange={e => setHasVendor(e.target.checked)}
                onClick={e => e.stopPropagation()}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-foreground">This project involves a vendor or third-party product</span>
            </label>
          </div>
        )}

        {/* ── Tab 1: Project Team ── */}
        {tab === 1 && (
          <div>
            <p className={sec}>Project team members</p>
            {team.map((m, i) => (
              <div key={i} className="grid gap-2 bg-background border border-border rounded-lg p-3 mb-2" style={{ gridTemplateColumns: "1fr 1fr 100px 28px" }}>
                <div><label className={lbl}>Name</label><input value={m.name} onChange={e => setTeam(t => t.map((x,j) => j===i ? {...x, name: e.target.value} : x))} className={inp} placeholder="Full name" /></div>
                <div><label className={lbl}>Role</label><input value={m.role} onChange={e => setTeam(t => t.map((x,j) => j===i ? {...x, role: e.target.value} : x))} className={inp} placeholder="e.g. Business Analyst" /></div>
                <div><label className={lbl}>Est. hours</label><input type="number" value={m.estimatedHours || ""} onChange={e => setTeam(t => t.map((x,j) => j===i ? {...x, estimatedHours: Number(e.target.value)} : x))} className={inp} placeholder="0" /></div>
                <button onClick={() => setTeam(t => t.filter((_,j) => j!==i))} className="self-end w-7 h-7 flex items-center justify-center rounded-md bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 transition-colors flex-shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button onClick={() => setTeam(t => [...t, { name: "", role: "", estimatedHours: 0 }])} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs hover:bg-primary/20 transition-colors">
              <Plus size={13} /> Add team member
            </button>

            <p className={sec} style={{ marginTop: "22px" }}>Cost breakdown</p>
            <table className="w-full mb-2" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-[10px] text-muted-foreground font-mono" style={{ width: "55%" }}>Item / Description</th>
                  <th className="text-left py-2 px-3 text-[10px] text-muted-foreground font-mono">Amount ($)</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {costs.map((c, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-1.5 px-1">
                      <input value={c.description} onChange={e => setCosts(cs => cs.map((x,j) => j===i ? {...x, description: e.target.value} : x))} className={inp + " text-xs"} placeholder="e.g. Software licenses" />
                    </td>
                    <td className="py-1.5 px-1">
                      <input type="number" value={c.amount || ""} onChange={e => setCosts(cs => cs.map((x,j) => j===i ? {...x, amount: Number(e.target.value)} : x))} className={inp + " text-xs font-mono"} placeholder="0" />
                    </td>
                    <td className="py-1.5 px-1 text-center">
                      <button onClick={() => setCosts(cs => cs.filter((_,j) => j!==i))} className="text-red-400 hover:text-red-300 transition-colors text-lg leading-none">×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between">
              <button onClick={() => setCosts(c => [...c, { description: "", amount: 0 }])} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs hover:bg-primary/20 transition-colors">
                <Plus size={13} /> Add line item
              </button>
              <div className="text-xs font-mono text-foreground bg-primary/5 border border-primary/10 rounded px-3 py-1.5">
                Total: {fmt(totalCost)}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Milestones ── */}
        {tab === 2 && (
          <div>
            <p className={sec}>Project milestones</p>
            {milestones.map((m, i) => (
              <div key={i} className="grid gap-2 bg-background border border-border rounded-lg p-3 mb-2" style={{ gridTemplateColumns: "70px 1fr 150px 28px" }}>
                <div>
                  <label className={lbl}>No.</label>
                  <input value={m.milestoneNumber} onChange={e => setMilestones(ms => ms.map((x,j) => j===i ? {...x, milestoneNumber: Number(e.target.value)} : x))} className={inp + " text-center"} />
                </div>
                <div>
                  <label className={lbl}>Description</label>
                  <input value={m.description} onChange={e => setMilestones(ms => ms.map((x,j) => j===i ? {...x, description: e.target.value} : x))} className={inp} placeholder="e.g. Requirements sign-off" />
                </div>
                <div>
                  <label className={lbl}>Complete by</label>
                  <input type="date" value={m.completeByDate} onChange={e => setMilestones(ms => ms.map((x,j) => j===i ? {...x, completeByDate: e.target.value} : x))} className={inp} />
                </div>
                <button onClick={() => setMilestones(ms => ms.filter((_,j) => j!==i))} className="self-end w-7 h-7 flex items-center justify-center rounded-md bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 transition-colors flex-shrink-0">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setMilestones(ms => [...ms, { milestoneNumber: ms.length + 1, description: "", completeByDate: "" }])}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs hover:bg-primary/20 transition-colors"
            >
              <Plus size={13} /> Add milestone
            </button>
          </div>
        )}

        {/* ── Tab 3: Vendor Summary ── */}
        {tab === 3 && (
          <div>
            {!hasVendor && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-400/5 border border-amber-400/20 rounded-lg text-amber-400 text-xs mb-4">
                Enable vendor tracking on the General Info tab first.
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Vendor name"><input {...register("vendorName")} className={inp} placeholder="e.g. Acme Corp" /></Field>
              <Field label="Product name"><input {...register("productName")} className={inp} placeholder="e.g. Acme ERP Suite" /></Field>
            </div>
            <p className={sec}>Pricing breakdown</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="One-time costs ($)"><input {...register("oneTimeCosts")} type="number" className={inp + " font-mono"} placeholder="0" /></Field>
              <Field label="Annual price ($)"><input {...register("annualPrice")} type="number" className={inp + " font-mono"} placeholder="0" /></Field>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-3 py-2 rounded-lg">
                <span className="text-xs text-muted-foreground font-mono">1st year total</span>
                <span className="text-sm text-foreground font-mono">{fmt(yr1)}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-lg">
                <span className="text-xs text-muted-foreground font-mono">3-year forecast</span>
                <span className="text-sm text-foreground font-mono">{fmt(yr3)}</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                <span className="text-xs text-muted-foreground font-mono">Total with tax (est. 8%)</span>
                <span className="text-sm font-semibold text-foreground font-mono">{fmt(withTax)}</span>
              </div>
            </div>
            <Field label="Additional notes" children={<textarea {...register("vendorNotes")} className={inp} rows={2} placeholder="Contract terms, payment schedule, support SLA…" />} />
          </div>
        )}

        {/* ── Tab 4: Vendor Evaluation ── */}
        {tab === 4 && (
          <div>
            {!hasVendor && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-400/5 border border-amber-400/20 rounded-lg text-amber-400 text-xs mb-4">
                Enable vendor tracking on the General Info tab first.
              </div>
            )}
            <p className={sec}>Evaluation summary</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-background border border-border rounded-lg p-3">
                <div className="text-[10px] font-medium text-emerald-400 font-mono uppercase tracking-wider mb-2">Pros</div>
                {pros.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <input value={p} onChange={e => setPros(ps => ps.map((x,j) => j===i ? e.target.value : x))} className="flex-1 bg-transparent border-0 border-b border-border text-sm text-foreground placeholder:text-muted-foreground outline-none pb-0.5" placeholder="Strength or advantage…" />
                  </div>
                ))}
                <button onClick={() => setPros(ps => [...ps, ""])} className="flex items-center gap-1.5 text-xs text-primary mt-1"><Plus size={12} /> Add pro</button>
              </div>
              <div className="bg-background border border-border rounded-lg p-3">
                <div className="text-[10px] font-medium text-red-400 font-mono uppercase tracking-wider mb-2">Cons</div>
                {cons.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <input value={c} onChange={e => setCons(cs => cs.map((x,j) => j===i ? e.target.value : x))} className="flex-1 bg-transparent border-0 border-b border-border text-sm text-foreground placeholder:text-muted-foreground outline-none pb-0.5" placeholder="Risk or weakness…" />
                  </div>
                ))}
                <button onClick={() => setCons(cs => [...cs, ""])} className="flex items-center gap-1.5 text-xs text-primary mt-1"><Plus size={12} /> Add con</button>
              </div>
            </div>
            <p className={sec}>References</p>
            {refs.map((r, i) => (
              <div key={i} className="grid gap-2 bg-background border border-border rounded-lg p-3 mb-2" style={{ gridTemplateColumns: "1fr 1fr 28px" }}>
                <div><label className={lbl}>Contact / Company</label><input value={r.contact} onChange={e => setRefs(rs => rs.map((x,j) => j===i ? {...x, contact: e.target.value} : x))} className={inp} placeholder="Reference name" /></div>
                <div><label className={lbl}>Phone / Email</label><input value={r.contactInfo} onChange={e => setRefs(rs => rs.map((x,j) => j===i ? {...x, contactInfo: e.target.value} : x))} className={inp} placeholder="Contact info" /></div>
                <button onClick={() => setRefs(rs => rs.filter((_,j) => j!==i))} className="self-end w-7 h-7 flex items-center justify-center rounded-md bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 transition-colors flex-shrink-0"><Trash2 size={12} /></button>
              </div>
            ))}
            <button onClick={() => setRefs(rs => [...rs, { contact: "", contactInfo: "" }])} className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs hover:bg-primary/20 transition-colors">
              <Plus size={13} /> Add reference
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0" style={{ background: "var(--card)" }}>
        <div className="flex gap-1">
          {TABS.map((_, i) => (
            <button key={i} onClick={() => setTab(i)} className={`w-1.5 h-1.5 rounded-full transition-colors ${tab===i ? "bg-primary" : "bg-white/10 hover:bg-white/20"}`} />
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors">
            Cancel
          </button>
          {tab < 4 ? (
            <button onClick={() => setTab(t => t + 1)} className="px-5 py-2 bg-primary/15 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/25 transition-colors">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit(handleSave)} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              Save Charter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
