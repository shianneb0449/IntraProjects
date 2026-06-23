// Dashboard page — wires up to features/dashboard components
// Currently renders App.tsx prototype; will be replaced with real data in v1.0
export function DashboardPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold font-display">Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Active tracking across all project charters
        </p>
      </div>
      <p className="text-muted-foreground text-sm">
        Dashboard content — connect to API in v1.0.0
      </p>
    </div>
  );
}
