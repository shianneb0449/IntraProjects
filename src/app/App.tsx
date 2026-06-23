import { Outlet, useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, FolderKanban, CheckSquare, ListTodo,
  Users, BarChart3, ClipboardList, Bell, Search, Shield,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",       path: "/dashboard"   },
  { icon: FolderKanban,    label: "Project Charters", path: "/charters"    },
  { icon: CheckSquare,     label: "Project Tasks",    path: "/tasks"       },
  { icon: ListTodo,        label: "Subtasks",         path: "/subtasks"    },
  { icon: Users,           label: "Assignments",      path: "/assignments" },
  { icon: BarChart3,       label: "Reporting",        path: "/reporting"   },
  { icon: ClipboardList,   label: "Audit Log",        path: "/audit"       },
];

const navSections = [
  { heading: "Workspace",   items: navItems.slice(0, 2) },
  { heading: "Work Items",  items: navItems.slice(2, 5) },
  { heading: "Insights",    items: navItems.slice(5, 7) },
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

export default function App() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? "IntraProjects";

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="flex flex-col w-56 border-r border-border flex-shrink-0" style={{ background: "var(--sidebar)" }}>

        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-border">
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: "#c8ddef" }}>
            Intra<span className="text-primary">Projects</span>
          </span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-medium font-mono">
            v1.0
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto">
          {navSections.map(({ heading, items }) => (
            <div key={heading} className="mb-1">
              <div className="px-3 py-2 text-[10px] font-medium uppercase tracking-wider font-mono" style={{ color: "#3d5a73" }}>
                {heading}
              </div>
              {items.map(({ icon: Icon, label, path }) => {
                const active = location.pathname === path;
                return (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors mb-0.5 ${
                      active ? "bg-primary/15 text-primary font-medium" : "hover:bg-white/6"
                    }`}
                    style={{ color: active ? undefined : "#5a7c99" }}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary font-mono">
              SB
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: "#c8ddef" }}>S. Burnett</div>
              <div className="text-[10px] truncate" style={{ color: "#5a7c99" }}>Project Owner</div>
            </div>
            <Shield size={13} className="ml-auto flex-shrink-0" style={{ color: "#5a7c99" }} />
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header */}
        <header className="h-14 flex items-center px-6 border-b border-border gap-4 flex-shrink-0 bg-background">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>IntraProjects</span>
            <ChevronRight size={13} />
            <span className="text-foreground font-medium">{pageTitle}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 text-sm border border-border focus-within:border-primary/50 transition-colors">
              <Search size={13} className="text-muted-foreground" />
              <input
                className="bg-transparent outline-none text-sm w-48 placeholder:text-muted-foreground text-foreground"
                placeholder="Search charters, tasks…"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
            </button>
          </div>
        </header>

        {/* Page content via router */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
