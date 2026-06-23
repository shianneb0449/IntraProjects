import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, FolderKanban, CheckSquare, ListTodo, X, ChevronRight } from "lucide-react";
import { useData } from "../../contexts/DataContext";

interface Result {
  type: "charter" | "task" | "subtask";
  id: string;
  title: string;
  sub: string;
  path: string;
}

export function SearchDropdown() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(0);
  const { charters, tasks } = useData();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const q = query.toLowerCase().trim();

  const results: Result[] = q.length < 2 ? [] : [
    ...charters.filter(c =>
      c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) || c.owner.toLowerCase().includes(q)
    ).slice(0, 4).map(c => ({
      type: "charter" as const, id: c.id, title: c.title,
      sub: `${c.department} · ${c.owner}`, path: `/charters/${c.id}`,
    })),
    ...tasks.filter(t =>
      t.summary.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) ||
      t.requestor.toLowerCase().includes(q)
    ).slice(0, 4).map(t => ({
      type: "task" as const, id: t.id, title: t.summary,
      sub: `${t.charterNumber} · ${t.requestor}`, path: `/tasks`,
    })),
  ];

  useEffect(() => { setFocused(0); }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocused(f => Math.min(f + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    if (e.key === "Enter" && results[focused]) { go(results[focused]); }
    if (e.key === "Escape") { setOpen(false); setQuery(""); inputRef.current?.blur(); }
  }

  function go(r: Result) {
    navigate(r.path);
    setQuery(""); setOpen(false);
  }

  const typeIcon = { charter: FolderKanban, task: CheckSquare, subtask: ListTodo };
  const typeColor = { charter: "text-blue-400 bg-blue-400/10", task: "text-emerald-400 bg-emerald-400/10", subtask: "text-violet-400 bg-violet-400/10" };
  const typeLabel = { charter: "Charter", task: "Task", subtask: "Subtask" };

  return (
    <div ref={dropRef} className="relative">
      <div className={`flex items-center gap-2 bg-muted border rounded-lg px-3 py-1.5 transition-colors ${open ? "border-primary/50" : "border-border"}`}>
        <Search size={13} className="text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          className="bg-transparent outline-none text-sm w-48 placeholder:text-muted-foreground text-foreground"
          placeholder="Search charters, tasks…"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={12} />
          </button>
        )}
      </div>

      {open && q.length >= 2 && (
        <div className="absolute top-full mt-1.5 left-0 w-[380px] bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results for "<span className="text-foreground">{query}</span>"
            </div>
          ) : (
            <>
              <div className="px-3 py-2 border-b border-border">
                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </span>
              </div>
              {results.map((r, i) => {
                const Icon = typeIcon[r.type];
                return (
                  <button
                    key={r.id + i}
                    onClick={() => go(r)}
                    onMouseEnter={() => setFocused(i)}
                    className={`w-full flex items-start gap-3 px-3 py-3 text-left transition-colors border-b border-border last:border-0 ${
                      focused === i ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`p-1.5 rounded flex-shrink-0 mt-0.5 ${typeColor[r.type]}`}>
                      <Icon size={11} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground">{r.id}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${typeColor[r.type]}`}>{typeLabel[r.type]}</span>
                      </div>
                      <div className="text-sm text-foreground truncate mt-0.5">{r.title}</div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">{r.sub}</div>
                    </div>
                    <ChevronRight size={13} className="text-muted-foreground flex-shrink-0 mt-1" />
                  </button>
                );
              })}
              <div className="px-3 py-2 bg-muted/30 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono">↑↓ navigate · Enter select · Esc close</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

