import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, FolderKanban, CheckSquare, ListTodo,
  Users, BarChart3, ClipboardList, Bell, Shield,
  ChevronRight, Palette,
} from "lucide-react";
import { ThemePanel } from "../components/layout/ThemePanel";
import { SearchDropdown } from "../components/layout/SearchDropdown";
import { DataProvider } from "../contexts/DataContext";

const navSections = [
  { heading: "Workspace", items: [
    { icon: LayoutDashboard, label: "Dashboard",        path: "/dashboard"   },
    { icon: FolderKanban,    label: "Project Charters", path: "/charters"    },
  ]},
  { heading: "Work Items", items: [
    { icon: CheckSquare, label: "Project Tasks", path: "/tasks"       },
    { icon: ListTodo,    label: "Subtasks",      path: "/subtasks"    },
    { icon: Users,       label: "Assignments",   path: "/assignments" },
  ]},
  { heading: "Insights", items: [
    { icon: BarChart3,    label: "Reporting", path: "/reporting" },
    { icon: ClipboardList,label: "Audit Log", path: "/audit"     },
  ]},
];

const pageTitles: Record<string, string> = {
  "/dashboard":   "Dashboard",
  "/charters":    "Project Charters",
  "/tasks":       "Project Tasks",
  "/subtasks":    "Subtasks",
  "/assignments": "Assignments",
  "/reporting":   "Reporting",
  "/audit":       "Audit Log",
};

function AppShell() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [themeOpen, setThemeOpen] = useState(false);

  // Derive page title — handle detail routes
  const pageTitle = location.pathname.startsWith("/charters/")
    ? location.pathname.split("/")[2] ?? "Charter"
    : pageTitles[location.pathname] ?? "IntraProjects";

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside className="flex flex-col w-56 border-r flex-shrink-0" style={{ background: "var(--sidebar)", borderColor: "var(--sidebar-border)" }}>
        <div className="h-14 flex items-center px-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: "var(--sidebar-foreground)" }}>
            Intra<span style={{ color: "var(--primary)" }}>Projects</span>
          </span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded font-medium font-mono" style={{ background: "rgba(59,130,246,0.15)", color: "var(--primary)" }}>
            v1.0
          </span>
        </div>
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {navSections.map(({ heading, items }) => (
            <div key={heading} className="mb-1">
              <div className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider font-mono" style={{ color: "var(--sidebar-foreground)", opacity: 0.45 }}>
                {heading}
              </div>
              {items.map(({ icon: Icon, label, path }) => {
                const active = location.pathname === path || (path === "/charters" && location.pathname.startsWith("/charters/"));
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5"
                    style={{ background: active ? "rgba(59,130,246,0.15)" : "transparent", color: active ? "var(--primary)" : "var(--sidebar-foreground)", opacity: active ? 1 : 0.6, fontWeight: active ? 500 : 400 }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.opacity = "0.6"; }}
                  >
                    <Icon size={15} />{label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full flex items-center justify-center text-xs font-semibold font-mono flex-shrink-0" style={{ background: "rgba(59,130,246,0.2)", color: "var(--primary)" }}>SP</div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: "var(--sidebar-foreground)" }}>Shianne Pope</div>
              <div className="text-[10px] truncate" style={{ color: "var(--sidebar-foreground)", opacity: 0.5 }}>Project Owner</div>
            </div>
            <Shield size={13} className="ml-auto flex-shrink-0" style={{ color: "var(--sidebar-foreground)", opacity: 0.4 }} />
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="h-14 flex items-center px-6 border-b border-border gap-4 flex-shrink-0 bg-background">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>IntraProjects</span>
            <ChevronRight size={13} />
            <span className="text-foreground font-medium">{pageTitle}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <SearchDropdown />
            <button className="relative p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
            </button>
            <button
              onClick={() => setThemeOpen(o => !o)}
              className={`p-2 rounded-lg transition-colors ${themeOpen ? "bg-primary/15 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              <Palette size={15} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto"><Outlet /></main>
      </div>
      <ThemePanel open={themeOpen} onClose={() => setThemeOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppShell />
    </DataProvider>
  );
}
