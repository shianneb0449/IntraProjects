import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import type { CharterStatus } from "../../../types/charter";
import type { Priority } from "../../../types/common";

interface FormValues {
  title: string;
  department: string;
  owner: string;
  priority: Priority;
  status: CharterStatus;
  startDate: string;
  targetDate: string;
  description: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => void;
}

export function NewCharterModal({ open, onClose, onSubmit }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { priority: "Medium", status: "Planning" },
  });

  if (!open) return null;

  function handleClose() {
    reset();
    onClose();
  }

  function onValid(values: FormValues) {
    onSubmit(values);
    reset();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-card border border-border rounded-xl w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
              New Project Charter
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Charter ID will be assigned automatically (CHR-XXXX)
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onValid)} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">
              Charter title <span className="text-red-400">*</span>
            </label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
              placeholder="e.g. ERP System Migration — Phase 4"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
          </div>

          {/* Department + Owner */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Department</label>
              <input
                {...register("department")}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
                placeholder="IT Infrastructure"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">
                Owner <span className="text-red-400">*</span>
              </label>
              <input
                {...register("owner", { required: "Owner is required" })}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
                placeholder="Search AD users…"
              />
              {errors.owner && <p className="text-xs text-red-400 mt-1">{errors.owner.message}</p>}
            </div>
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Priority</label>
              <select
                {...register("priority")}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors cursor-pointer"
              >
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Initial status</label>
              <select
                {...register("status")}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors cursor-pointer"
              >
                <option>Planning</option>
                <option>Active</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Start date</label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Target date</label>
              <input
                type="date"
                {...register("targetDate")}
                className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors resize-none"
              placeholder="Describe the scope and objectives of this charter…"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Create Charter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
