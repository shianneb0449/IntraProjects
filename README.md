# IntraProjects

Enterprise internal project management system for tracking Project Charters, Tasks, and Subtasks with full audit history and Active Directory integration.

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** ASP.NET Core (planned — Phase 6)
- **Database:** SQL Server (planned — Phase 6)
- **Auth:** Active Directory with JWT bridge (planned — Phase 6)

## Getting Started

### Prerequisites
- Node.js (LTS) — [nodejs.org](https://nodejs.org)
- VS Code — [code.visualstudio.com](https://code.visualstudio.com)

### Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Project Files

| File | Description |
|---|---|
| `src/` | React frontend source code |
| `IntraProjects-Preview.html` | Standalone UI prototype (open directly in browser) |
| `docs/IntraProjects-Architecture.md` | Full 6-phase architecture document |

## Version Roadmap

| Version | Scope |
|---|---|
| v0.1.0 | DB schema + EF migrations |
| v0.2.0 | AD auth + JWT |
| v1.0.0 | Charter management (MVP) |
| v1.1.0 | Task hierarchy |
| v1.2.0 | Subtasks |
| v1.3.0 | Assignment tracking |
| v1.4.0 | Audit log UI |
| v1.5.0 | Reporting |

## Repository

`github.com/shiannb0449/IntraProjects`
