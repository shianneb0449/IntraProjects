import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChevronLeft, X, Plus, Check } from "lucide-react";
import type { TaskFormValues, TaskUrgency, TaskStatus, ApprovalStatus, ResourceLoad, FinalStatus } from "../../../types/task";

const inp = "w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors";
const lbl = "block text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-1.5";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className={lbl}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

const STEPS = ["Request", "Approval", "Implementation", "Done Review"];

const STALLED_STATUSES: TaskStatus[] = ["Stalled", "Waiting on response"];

interface Props {
  onClose: () => void;
  onSubmit?: (data: TaskFormValues) => void;
}

export function TaskForm({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<TaskFormValues>({
    defaultValues: {
      urgency: "High",
      primaryResourceLoad: "75%",
      secondaryResourceLoad: "50%",
      approvalStatus: "Pending review",
      status: "Open",
      finalStatus: "Complete",
    },
  });

  const status = watch("status");
  const isStalled = STALLED_STATUSES.includes(status as TaskStatus);

  function nextStep() {
    setCompleted(c => c.map((v, i) => i === step ? true : v));
    setStep(s => Math.min(3, s + 1));
  }
  function prevStep() { setStep(s => Math.max(0, s - 1)); }

  function handleSave(values: TaskFormValues) {
    onSubmit?.(values);
    onClose();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>New Project Task</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Links to a Project Charter (optional)</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
      </div>

      {/* Step indicators */}
      <div className="flex px-6 py-4 border-b border-border flex-shrink-0 gap-0" style={{ background: "var(--card)" }}>
        {STEPS.map((s, i) => {
          const isDone = completed[i];
          const isActive = step === i;
          return (
            <div key={s} className="flex items-center flex-1">
              <button onClick={() => setStep(i)} className="flex items-center gap-2 group">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold font-mono transition-all flex-shrink-0 ${
                  isDone ? "bg-emerald-400 text-emerald-900" :
                  isActive ? "bg-primary text-white" :
                  "bg-muted text-muted-foreground border border-border"
                }`}>
                  {isDone ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap transition-colors ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{s}</span>
              </button>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border mx-3 min-w-[12px]" />}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* ── Step 1: Request ── */}
        {step === 0 && (
          <div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Project name" required>
                <input {...register("projectName", { required: true })} className={inp} placeholder="Link to charter or enter name" />
                {errors.projectName && <p className="text-xs text-red-400 mt-1">Required</p>}
              </Field>
              <Field label="Department">
                <input {...register("department")} className={inp} placeholder="e.g. IT Infrastructure" />
              </Field>
            </div>
            <Field label="Summary" required>
              <textarea {...register("summary", { required: true })} className={inp} rows={2} placeholder="Brief description of what this task involves…" />
              {errors.summary && <p className="text-xs text-red-400 mt-1">Required</p>}
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Requestor" required>
                <input {...register("requestor", { required: true })} className={inp} placeholder="Full name" />
                {errors.requestor && <p className="text-xs text-red-400 mt-1">Required</p>}
              </Field>
              <Field label="Requestor email">
                <input {...register("requestorEmail")} type="email" className={inp} placeholder="email@org.com" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Team">
                <input {...register("team")} className={inp} placeholder="e.g. IT Operations" />
              </Field>
              <Field label="Urgency">
                <select {...register("urgency")} className={inp + " cursor-pointer"}>
                  {(["Low", "Medium", "High", "Critical"] as TaskUrgency[]).map(u => <option key={u}>{u}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Primary resource">
                <input {...register("primaryResource")} className={inp} placeholder="Search AD users…" />
              </Field>
              <Field label="Resource load">
                <select {...register("primaryResourceLoad")} className={inp + " cursor-pointer"}>
                  {(["25%", "50%", "75%", "100%"] as ResourceLoad[]).map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Created date">
                <input {...register("createdDate")} type="date" className={inp} />
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Secondary resource">
                <input {...register("secondaryResource")} className={inp} placeholder="Search AD users…" />
              </Field>
              <Field label="Resource load">
                <select {...register("secondaryResourceLoad")} className={inp + " cursor-pointer"}>
                  {(["25%", "50%", "75%", "100%"] as ResourceLoad[]).map(l => <option key={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Due date">
                <input {...register("dueDate")} type="date" className={inp} />
              </Field>
            </div>
            <Field label="Project folder directory">
              <input {...register("projectFolderDirectory")} className={inp} placeholder="\\server\projects\folder-name" />
            </Field>
            <Field label="Project objective / goal">
              <textarea {...register("projectObjectiveGoal")} className={inp} rows={2} placeholder="What is the desired outcome of this task?" />
            </Field>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register("travelNeeded")} type="checkbox" className="w-4 h-4 accent-primary" />
                <span className="text-sm text-foreground">Travel needed</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register("scopeCreep")} type="checkbox" className="w-4 h-4 accent-primary" />
                <span className="text-sm text-foreground">Scope creep identified</span>
              </label>
            </div>
          </div>
        )}

        {/* ── Step 2: Approval ── */}
        {step === 1 && (
          <div>
            <Field label="Approver" required>
              <input {...register("approver")} className={inp} placeholder="Search AD users…" />
            </Field>
            <Field label="Approval status">
              <select {...register("approvalStatus")} className={inp + " cursor-pointer"}>
                {(["Pending review", "Approved", "Approved with conditions", "Rejected", "On hold — awaiting info"] as ApprovalStatus[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Approval comments">
              <textarea {...register("approvalComments")} className={inp} rows={4} placeholder="Notes from the approver, conditions, or reasons for rejection…" />
            </Field>
            <div className="flex items-start gap-3 px-4 py-3 bg-primary/5 border border-primary/10 rounded-lg text-xs text-muted-foreground">
              <span className="text-primary mt-0.5">ℹ</span>
              The requestor will be notified when approval status changes.
            </div>
          </div>
        )}

        {/* ── Step 3: Implementation ── */}
        {step === 2 && (
          <div>
            <div className="flex gap-3 mb-5 flex-wrap">
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                <Plus size={13} /> Create subtask
              </button>
              <button type="button" className="flex items-center gap-2 px-4 py-2 bg-violet-400/10 border border-violet-400/20 rounded-lg text-violet-400 text-xs font-medium hover:bg-violet-400/20 transition-colors">
                <Plus size={13} /> Create change request
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Status" required>
                <select {...register("status")} className={inp + " cursor-pointer"}>
                  {(["Open","In Progress","Stalled","Waiting on response","Under review","Complete","Cancelled"] as TaskStatus[]).map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Reminder date">
                <input {...register("reminderDate")} type="date" className={inp} />
              </Field>
            </div>
            <Field label="Next step summary">
              <textarea {...register("nextStepSummary")} className={inp} rows={2} placeholder="What needs to happen next to move this forward?" />
            </Field>

            {/* Stalled fields — conditional */}
            {isStalled && (
              <div>
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-400/5 border border-amber-400/20 rounded-lg text-amber-400 text-xs mb-4">
                  ⏸ Task is stalled — please complete the fields below.
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Stalled by">
                    <input {...register("stalledBy")} className={inp} placeholder="Person or team causing the stall" />
                  </Field>
                  <Field label="Currently waiting on">
                    <input {...register("currentlyWaitingOn")} className={inp} placeholder="What are you waiting for?" />
                  </Field>
                </div>
                <Field label="Stall reason">
                  <textarea {...register("stalledReason")} className={inp} rows={2} placeholder="Explain why the task is stalled…" />
                </Field>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input {...register("reviewNeeded")} type="checkbox" className="w-4 h-4 accent-primary" />
              <span className="text-sm text-foreground">Review needed before proceeding</span>
            </label>
          </div>
        )}

        {/* ── Step 4: Definition of Done ── */}
        {step === 3 && (
          <div>
            <p className="text-[10px] font-medium text-muted-foreground font-mono uppercase tracking-wider pb-2 border-b border-border mb-3">
              Definition of done — review checklist
            </p>
            {[
              { name: "dodRequirementsMet" as const,         label: "All requirements met and verified",         sub: "Confirmed against original objective / goal from Step 1" },
              { name: "dodTestingComplete" as const,         label: "Testing or validation completed",           sub: "UAT, QA, or stakeholder sign-off received" },
              { name: "dodDocumentationUpdated" as const,    label: "Documentation updated",                    sub: "SOPs, runbooks, or project files updated in folder directory" },
              { name: "dodSubtasksClosed" as const,          label: "All subtasks closed or carried forward",   sub: "No open subtasks unless explicitly deferred" },
              { name: "dodStakeholdersNotified" as const,    label: "Stakeholders notified of completion",      sub: "Requestor and approver informed of outcome" },
            ].map(({ name, label, sub }) => (
              <label key={name} className="flex items-start gap-3 p-3 bg-background border border-border rounded-lg mb-2 cursor-pointer hover:border-white/20 transition-colors">
                <input {...register(name)} type="checkbox" className="w-4 h-4 accent-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
                </div>
              </label>
            ))}
            <Field label="Completion notes" children={
              <textarea {...register("completionNotes")} className={inp} rows={3} placeholder="Final notes, lessons learned, or anything to carry forward…" />
            } />
            <Field label="Final status">
              <select {...register("finalStatus")} className={inp + " cursor-pointer"}>
                {(["Complete", "Partially complete — remainder deferred", "Cancelled"] as FinalStatus[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0" style={{ background: "var(--card)" }}>
        <button onClick={prevStep} disabled={step === 0} className={`px-4 py-2 border border-border rounded-lg text-sm transition-colors ${step === 0 ? "opacity-30 cursor-default text-muted-foreground" : "text-muted-foreground hover:text-foreground hover:border-white/20"}`}>
          ← Back
        </button>
        <span className="text-xs text-muted-foreground font-mono">Step {step + 1} of 4</span>
        {step < 3 ? (
          <button onClick={nextStep} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit(handleSave)} className="px-5 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-500/90 transition-colors flex items-center gap-2">
            <Check size={14} /> Complete task
          </button>
        )}
      </div>
    </div>
  );
}
