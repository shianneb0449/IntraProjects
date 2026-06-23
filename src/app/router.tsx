import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import { DashboardPage }  from "../pages/DashboardPage";
import { ChartersPage }   from "../pages/ChartersPage";
import { AuditPage }      from "../pages/AuditPage";

// Placeholder for pages not yet built
function ComingSoon({ title, version }: { title: string; version: string }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h1>
      <div className="bg-card border border-border rounded-lg p-16 text-center mt-6">
        <div className="text-4xl mb-4 opacity-20">🚧</div>
        <div className="text-sm text-muted-foreground">
          Ships in <span className="text-primary font-mono">{version}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-2 opacity-60">
          See the architecture doc for build order
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true,              element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard",        element: <DashboardPage /> },
      { path: "charters",         element: <ChartersPage /> },
      { path: "tasks",            element: <ComingSoon title="Project Tasks"  version="v1.1.0" /> },
      { path: "subtasks",         element: <ComingSoon title="Subtasks"       version="v1.2.0" /> },
      { path: "assignments",      element: <ComingSoon title="Assignments"    version="v1.3.0" /> },
      { path: "reporting",        element: <ComingSoon title="Reporting"      version="v1.5.0" /> },
      { path: "audit",            element: <AuditPage /> },
    ],
  },
]);
