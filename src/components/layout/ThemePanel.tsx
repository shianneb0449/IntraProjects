import { useState, useEffect } from "react";
import { X, Sun, Moon } from "lucide-react";

interface ThemeVars {
  "--background": string;
  "--foreground": string;
  "--card": string;
  "--card-foreground": string;
  "--popover": string;
  "--popover-foreground": string;
  "--secondary": string;
  "--secondary-foreground": string;
  "--muted": string;
  "--muted-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
  "--border": string;
  "--input": string;
  "--input-background": string;
  "--sidebar": string;
  "--sidebar-foreground": string;
  "--sidebar-border": string;
  "--sidebar-accent": string;
}

const PRESETS: Record<string, { dark: ThemeVars; light: ThemeVars; label: string }> = {
  navy: {
    label: "Navy",
    dark: {
      "--background": "#0d1b2a",        "--foreground": "#dce8f5",
      "--card": "#132237",              "--card-foreground": "#dce8f5",
      "--popover": "#132237",           "--popover-foreground": "#dce8f5",
      "--secondary": "#1e3252",         "--secondary-foreground": "#afc8e8",
      "--muted": "#1a2d46",             "--muted-foreground": "#6b8caf",
      "--accent": "#1e3a5f",            "--accent-foreground": "#93c5fd",
      "--border": "rgba(147,197,253,0.1)",
      "--input": "#1a2d46",             "--input-background": "#1a2d46",
      "--sidebar": "#091422",           "--sidebar-foreground": "#dce8f5",
      "--sidebar-border": "rgba(147,197,253,0.08)",
      "--sidebar-accent": "#132237",
    },
    light: {
      "--background": "#f0f4f8",        "--foreground": "#0f172a",
      "--card": "#ffffff",              "--card-foreground": "#0f172a",
      "--popover": "#ffffff",           "--popover-foreground": "#0f172a",
      "--secondary": "#e2e8f0",         "--secondary-foreground": "#1e293b",
      "--muted": "#e8eef5",             "--muted-foreground": "#64748b",
      "--accent": "#dbeafe",            "--accent-foreground": "#1d4ed8",
      "--border": "rgba(0,0,0,0.09)",
      "--input": "#e8eef5",             "--input-background": "#e8eef5",
      "--sidebar": "#dce8f5",           "--sidebar-foreground": "#0f172a",
      "--sidebar-border": "rgba(0,0,0,0.08)",
      "--sidebar-accent": "#c8d9ed",
    },
  },
  slate: {
    label: "Slate",
    dark: {
      "--background": "#0f172a",        "--foreground": "#e2e8f0",
      "--card": "#1e293b",              "--card-foreground": "#e2e8f0",
      "--popover": "#1e293b",           "--popover-foreground": "#e2e8f0",
      "--secondary": "#334155",         "--secondary-foreground": "#cbd5e1",
      "--muted": "#1e293b",             "--muted-foreground": "#64748b",
      "--accent": "#1e3a5f",            "--accent-foreground": "#93c5fd",
      "--border": "rgba(148,163,184,0.13)",
      "--input": "#1e293b",             "--input-background": "#1e293b",
      "--sidebar": "#0a0f1e",           "--sidebar-foreground": "#e2e8f0",
      "--sidebar-border": "rgba(148,163,184,0.08)",
      "--sidebar-accent": "#1e293b",
    },
    light: {
      "--background": "#f8fafc",        "--foreground": "#0f172a",
      "--card": "#ffffff",              "--card-foreground": "#0f172a",
      "--popover": "#ffffff",           "--popover-foreground": "#0f172a",
      "--secondary": "#f1f5f9",         "--secondary-foreground": "#1e293b",
      "--muted": "#f1f5f9",             "--muted-foreground": "#64748b",
      "--accent": "#f0f9ff",            "--accent-foreground": "#0369a1",
      "--border": "rgba(0,0,0,0.09)",
      "--input": "#f1f5f9",             "--input-background": "#f1f5f9",
      "--sidebar": "#e2e8f0",           "--sidebar-foreground": "#0f172a",
      "--sidebar-border": "rgba(0,0,0,0.08)",
      "--sidebar-accent": "#cbd5e1",
    },
  },
  zinc: {
    label: "Zinc",
    dark: {
      "--background": "#18181b",        "--foreground": "#fafafa",
      "--card": "#27272a",              "--card-foreground": "#fafafa",
      "--popover": "#27272a",           "--popover-foreground": "#fafafa",
      "--secondary": "#3f3f46",         "--secondary-foreground": "#d4d4d8",
      "--muted": "#3f3f46",             "--muted-foreground": "#71717a",
      "--accent": "#3f3f46",            "--accent-foreground": "#fafafa",
      "--border": "rgba(255,255,255,0.1)",
      "--input": "#27272a",             "--input-background": "#27272a",
      "--sidebar": "#09090b",           "--sidebar-foreground": "#fafafa",
      "--sidebar-border": "rgba(255,255,255,0.06)",
      "--sidebar-accent": "#27272a",
    },
    light: {
      "--background": "#fafafa",        "--foreground": "#09090b",
      "--card": "#ffffff",              "--card-foreground": "#09090b",
      "--popover": "#ffffff",           "--popover-foreground": "#09090b",
      "--secondary": "#f4f4f5",         "--secondary-foreground": "#18181b",
      "--muted": "#f4f4f5",             "--muted-foreground": "#71717a",
      "--accent": "#f4f4f5",            "--accent-foreground": "#18181b",
      "--border": "rgba(0,0,0,0.09)",
      "--input": "#f4f4f5",             "--input-background": "#f4f4f5",
      "--sidebar": "#e4e4e7",           "--sidebar-foreground": "#09090b",
      "--sidebar-border": "rgba(0,0,0,0.08)",
      "--sidebar-accent": "#d4d4d8",
    },
  },
};

const SWATCHES = [
  { hex: "#3b82f6", name: "Blue"    }, { hex: "#8b5cf6", name: "Violet" },
  { hex: "#06b6d4", name: "Cyan"    }, { hex: "#10b981", name: "Emerald"},
  { hex: "#f59e0b", name: "Amber"   }, { hex: "#ef4444", name: "Red"    },
  { hex: "#ec4899", name: "Pink"    }, { hex: "#f97316", name: "Orange" },
  { hex: "#14b8a6", name: "Teal"    }, { hex: "#6366f1", name: "Indigo" },
  { hex: "#84cc16", name: "Lime"    }, { hex: "#a855f7", name: "Purple" },
];

function applyVars(vars: ThemeVars, primary: string) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.style.setProperty("--primary", primary);
  root.style.setProperty("--ring", primary);
  root.style.setProperty("--sidebar-primary", primary);
  root.style.setProperty("--chart-1", primary);
  root.style.setProperty("--primary-foreground", "#ffffff");
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ThemePanel({ open, onClose }: Props) {
  const [mode, setMode]     = useState<"dark" | "light">(() =>
    (localStorage.getItem("ip-mode") as "dark" | "light") ?? "dark"
  );
  const [preset, setPreset] = useState<string>(() => localStorage.getItem("ip-preset") ?? "navy");
  const [primary, setPrimary] = useState<string>(() => localStorage.getItem("ip-primary") ?? "#3b82f6");
  const [hexInput, setHexInput] = useState(primary);
  const [selSwatch, setSelSwatch] = useState(() =>
    SWATCHES.findIndex(s => s.hex === (localStorage.getItem("ip-primary") ?? "#3b82f6"))
  );

  useEffect(() => {
    const p = PRESETS[preset] ?? PRESETS.navy;
    applyVars(p[mode], primary);
    localStorage.setItem("ip-mode", mode);
    localStorage.setItem("ip-preset", preset);
    localStorage.setItem("ip-primary", primary);
  }, [mode, preset, primary]);

  function handleSwatch(hex: string, idx: number) {
    setPrimary(hex);
    setHexInput(hex);
    setSelSwatch(idx);
  }

  function handleHexApply() {
    const v = hexInput.startsWith("#") ? hexInput : "#" + hexInput;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      setPrimary(v);
      setSelSwatch(-1);
    }
  }

  const lbl = "block text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2";

  return (
    <>
      {open && <div className="fixed inset-0 z-40" onClick={onClose} />}

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-60 bg-card border-l border-border flex flex-col transition-transform duration-250 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: open ? "-8px 0 32px rgba(0,0,0,0.25)" : "none" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <span className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Theme
          </span>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Mode */}
          <div className="px-4 py-4 border-b border-border">
            <p className={lbl}>Mode</p>
            <div className="flex gap-2">
              {(["dark", "light"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-all ${
                    mode === m
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-transparent border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {m === "dark" ? <Moon size={13} /> : <Sun size={13} />}
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Accent colour */}
          <div className="px-4 py-4 border-b border-border">
            <p className={lbl}>Accent colour</p>
            <div className="grid grid-cols-6 gap-1.5 mb-3">
              {SWATCHES.map((s, i) => (
                <button
                  key={s.hex}
                  onClick={() => handleSwatch(s.hex, i)}
                  title={s.name}
                  className="aspect-square rounded-md transition-all hover:scale-110"
                  style={{
                    background: s.hex,
                    outline: selSwatch === i ? `2px solid ${s.hex}` : "none",
                    outlineOffset: "2px",
                    transform: selSwatch === i ? "scale(1.1)" : undefined,
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-7 h-7 rounded-md flex-shrink-0 border border-border" style={{ background: primary }} />
              <input
                className="flex-1 bg-muted border border-border rounded-md px-2 py-1.5 text-xs text-foreground font-mono outline-none focus:border-primary/50"
                value={hexInput}
                onChange={e => setHexInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleHexApply()}
                maxLength={7}
                placeholder="#000000"
              />
              <button
                onClick={handleHexApply}
                className="px-2.5 py-1.5 bg-primary text-white text-xs rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground font-mono text-center mt-1.5">
              {SWATCHES.find(s => s.hex === primary)?.name ?? primary}
            </p>
          </div>

          {/* Base preset */}
          <div className="px-4 py-4">
            <p className={lbl}>Base preset</p>
            <div className="flex flex-col gap-2">
              {Object.entries(PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setPreset(key)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-xs text-left transition-all ${
                    preset === key
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex gap-1">
                    {(["--sidebar","--card","--background"] as const).map(k => (
                      <div
                        key={k}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          background: mode === "dark" ? p.dark[k] : p.light[k],
                          border: "1px solid rgba(128,128,128,0.3)",
                        }}
                      />
                    ))}
                  </div>
                  {p.label}
                  {preset === key && (
                    <span className="ml-auto text-primary text-[10px] font-mono">active</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
