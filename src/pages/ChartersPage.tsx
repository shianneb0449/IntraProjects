// Charter list page — v1.0.0
export function ChartersPage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold font-display">Project Charters</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All charters across the organisation
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          + New Charter
        </button>
      </div>
      <p className="text-muted-foreground text-sm">
        Charter list — connect to API in v1.0.0
      </p>
    </div>
  );
}
