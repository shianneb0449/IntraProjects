# IntraProjects — Enterprise Architecture & Implementation Guide

> **Repository:** `shiannb0449/IntraProjects`
> **Application Name:** IntraProjects
> **Stack:** React 18 · TypeScript · Tailwind CSS v4 · shadcn/ui · ASP.NET Core · SQL Server · Active Directory
> **Document Version:** 1.0 · June 2026

---

## Table of Contents

1. [Phase 1 — System Architecture](#phase-1--system-architecture)
2. [Phase 2 — Database Design](#phase-2--database-design)
3. [Phase 3 — Solution Structure](#phase-3--solution-structure)
4. [Phase 4 — MVP Scope (v1.0.0)](#phase-4--mvp-scope-v100)
5. [Phase 5 — GitHub Starter Backlog](#phase-5--github-starter-backlog)
6. [Phase 6 — Step-by-Step Build Order](#phase-6--step-by-step-build-order)

---

# Phase 1 — System Architecture

## Layer Structure

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                    │
│      UI Layer · Component Layer · API Service Layer     │
├─────────────────────────────────────────────────────────┤
│                  ASP.NET Core Web API                   │
│               API Layer (Controllers)                   │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                     │
│         Use Cases · DTOs · Validators · Mappers         │
├─────────────────────────────────────────────────────────┤
│                     Domain Layer                        │
│       Entities · Aggregates · Domain Services           │
├─────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                    │
│    EF Core · Repositories · AD Auth · Audit Writers     │
├─────────────────────────────────────────────────────────┤
│                SQL Server (via SSMS)                    │
│   Primary Tables · History Tables · Audit Tables        │
└─────────────────────────────────────────────────────────┘
```

---

## Backend Architecture (ASP.NET Core)

### Clean Architecture layers

**Domain Layer** (`IntraProjects.Domain`)
- Entity classes: `ProjectCharter`, `ProjectTask`, `Subtask`, `AppUser`, `Assignment`
- Value objects: `StatusTransition`, `AuditChange`
- Domain interfaces: `IRepository<T>`, `IAuditService`
- No dependencies on any other layer

**Application Layer** (`IntraProjects.Application`)
- Feature-organized use cases (MediatR Commands/Queries pattern recommended)
- DTOs and response/request models
- Mapping profiles (AutoMapper or manual mappers)
- Validation (FluentValidation)
- Interfaces for infrastructure: `IUnitOfWork`, `ICurrentUserService`, `IAuditWriter`

**Infrastructure Layer** (`IntraProjects.Infrastructure`)
- EF Core `DbContext` and repository implementations
- Active Directory authentication middleware / JWT bridge
- Audit writing implementation
- SQL Server migrations

**API Layer** (`IntraProjects.API`)
- ASP.NET Core controllers
- Middleware (auth, error handling, logging)
- OpenAPI / Swagger configuration
- Dependency injection composition root

---

## Frontend Architecture (React)

### State management boundaries

| Concern | Tool | Rationale |
|---|---|---|
| Server data (charters, tasks, users) | TanStack Query | Caching, invalidation, background refetch |
| UI state (sidebar open, filters, modals) | Zustand | Lightweight, scoped client state |
| Form state | React Hook Form + Zod | Isolated form lifecycle, schema validation |
| Navigation | React Router v7 | Already in package.json |

### Component organization

```
Presentational components   → src/components/ui/        (shadcn primitives, no logic)
Shared feature components   → src/components/shared/    (StatusBadge, PriorityBadge, etc.)
Feature containers          → src/features/<domain>/    (data-fetching, business logic)
Page-level components       → src/pages/                (route targets, layout composition)
```

### Routing structure

```
/                          → redirect to /dashboard
/dashboard                 → Overview dashboard
/charters                  → Charter list
/charters/:charterId       → Charter detail + task list
/charters/:charterId/tasks/:taskId          → Task detail + subtask list
/charters/:charterId/tasks/:taskId/subtasks/:subtaskId  → Subtask detail
/assignments               → Assignment board
/audit                     → Audit log viewer
/reporting                 → Reporting (v1.5+)
```

---

## Entity Relationship Overview

```
AppUser (from AD)
    │
    ├─── owns ──────────────────► ProjectCharter
    │                                 │
    │                                 ├─── has many ──► ProjectTask
    │                                 │                     │
    │                                 │                     └─── has many ──► Subtask
    │                                 │
    │                                 ├─── has many ──► CharterStatusHistory
    │                                 └─── has many ──► Assignment (Charter-level)
    │
    ├─── assigned to ───────────► Assignment (Task/Subtask-level)
    └─── performs ──────────────► AuditEvent
```

---

## Active Directory Integration Approach

### Recommended strategy: Negotiate + JWT bridge

1. **Windows Authentication** (`Negotiate` scheme) handles the AD handshake at the API boundary
2. The API reads `WindowsPrincipal.Identity` to extract `sAMAccountName`, display name, email, and AD group memberships
3. These are mapped to an `AppUser` record (synced on first login, refreshed on each auth)
4. A short-lived JWT is issued to the React frontend for stateless API calls
5. AD group names map to application roles via a `GroupRoleMapping` configuration table

```
Browser → [Negotiate/NTLM] → API → reads AD groups → issues JWT → React stores in memory
```

### Role mapping example

| AD Group Name | IntraProjects Role |
|---|---|
| `IP-Administrators` | Administrator |
| `IP-ProjectOwners` | Project Owner |
| `IP-Contributors` | Project Contributor |
| `IP-Reviewers` | Reviewer |
| `IP-ReadOnly` | Read-Only |

### `ICurrentUserService` interface

```csharp
public interface ICurrentUserService
{
    string UserId { get; }         // AD ObjectGuid or sAMAccountName
    string DisplayName { get; }
    string Email { get; }
    IReadOnlyList<string> Roles { get; }
    bool IsInRole(string role);
}
```

---

## Audit Strategy

### Two-tier approach

**Tier 1 — Structured audit events** (`AuditEvent` table)
- Written by the application layer on every mutation
- Captures: entity type, entity ID, action type, old value, new value, user, timestamp
- Queryable for UI display and reporting

**Tier 2 — Status history tables** (`CharterStatusHistory`, `TaskStatusHistory`, `SubtaskStatusHistory`)
- Append-only, written on every status transition
- Enables timeline reconstruction and duration calculations

### When audit records are written

Every command (Create, Update, StatusChange, Assign) in the Application layer dispatches an `AuditWriter` call **after** the primary transaction commits. This keeps audit writing outside the main business transaction to avoid rollback losses. For critical changes, audit and primary write can be wrapped in the same transaction.

---

## Reporting Strategy

- All history tables are append-only — no record is ever overwritten
- Soft delete uses `IsArchived + ArchivedDate` instead of physical deletion
- Status history tables allow point-in-time reconstruction (`WHERE StatusChangedAt <= @ReportDate`)
- Assignment history allows "who owned this task at date X" queries
- All date columns stored as `DATETIMEOFFSET` for timezone accuracy
- Indexes on (`EntityId`, `ChangedAt`) for efficient range queries

---

## Soft Delete vs. Archive Recommendation

**Use soft-archive (not soft-delete)** for this system:

```sql
IsArchived      BIT           NOT NULL DEFAULT 0
ArchivedDate    DATETIMEOFFSET NULL
ArchivedByUserId INT           NULL FK → AppUser
ArchiveReason   NVARCHAR(500)  NULL
```

**Why not soft-delete:** In a reporting system, "deleted" is ambiguous. Archive makes intent explicit. A charter can be archived (closed, cancelled, migrated) while all its history, tasks, and audit events remain fully queryable. Physical delete is prohibited by design — only administrators can archive, never destroy.

---

# Phase 2 — Database Design

## Primary Key Strategy

Use **INT IDENTITY** for all primary keys. Reserve GUIDs for external-facing identifiers (the `CharterNumber`, `TaskNumber` display IDs like `CHR-0041`, `TSK-0188`).

Rationale: INT clustering is dramatically more efficient for the join-heavy reporting queries this system requires. GUIDs as display-safe identifiers give you the human-readable tracking numbers without the index fragmentation cost.

---

## Core Tables

### `AppUser`

```sql
CREATE TABLE AppUser (
    UserId          INT IDENTITY(1,1) PRIMARY KEY,
    AdObjectId      NVARCHAR(36)    NOT NULL UNIQUE,   -- AD ObjectGUID
    SamAccountName  NVARCHAR(50)    NOT NULL UNIQUE,
    DisplayName     NVARCHAR(150)   NOT NULL,
    Email           NVARCHAR(200)   NOT NULL,
    Department      NVARCHAR(100)   NULL,
    IsActive        BIT             NOT NULL DEFAULT 1,
    LastSyncedAt    DATETIMEOFFSET  NOT NULL,
    CreatedAt       DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE INDEX IX_AppUser_SamAccountName ON AppUser (SamAccountName);
CREATE INDEX IX_AppUser_AdObjectId     ON AppUser (AdObjectId);
```

---

### `ProjectCharter`

```sql
CREATE TABLE ProjectCharter (
    CharterId       INT IDENTITY(1,1) PRIMARY KEY,
    CharterNumber   NVARCHAR(20)    NOT NULL UNIQUE,  -- CHR-0041
    Title           NVARCHAR(300)   NOT NULL,
    Description     NVARCHAR(MAX)   NULL,
    Department      NVARCHAR(100)   NULL,
    OwnerUserId     INT             NOT NULL REFERENCES AppUser(UserId),
    StatusId        INT             NOT NULL REFERENCES CharterStatus(StatusId),
    PriorityId      INT             NOT NULL REFERENCES Priority(PriorityId),
    StartDate       DATE            NULL,
    TargetDate      DATE            NULL,
    ActualCloseDate DATE            NULL,
    IsArchived      BIT             NOT NULL DEFAULT 0,
    ArchivedDate    DATETIMEOFFSET  NULL,
    ArchivedByUserId INT            NULL REFERENCES AppUser(UserId),
    ArchiveReason   NVARCHAR(500)   NULL,
    CreatedByUserId INT             NOT NULL REFERENCES AppUser(UserId),
    CreatedAt       DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    ModifiedByUserId INT            NOT NULL REFERENCES AppUser(UserId),
    ModifiedAt      DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE INDEX IX_Charter_StatusId      ON ProjectCharter (StatusId);
CREATE INDEX IX_Charter_OwnerUserId   ON ProjectCharter (OwnerUserId);
CREATE INDEX IX_Charter_IsArchived    ON ProjectCharter (IsArchived);
CREATE INDEX IX_Charter_TargetDate    ON ProjectCharter (TargetDate);
```

---

### `ProjectTask`

```sql
CREATE TABLE ProjectTask (
    TaskId          INT IDENTITY(1,1) PRIMARY KEY,
    TaskNumber      NVARCHAR(20)    NOT NULL UNIQUE,  -- TSK-0188
    CharterId       INT             NOT NULL REFERENCES ProjectCharter(CharterId),
    Title           NVARCHAR(300)   NOT NULL,
    Description     NVARCHAR(MAX)   NULL,
    StatusId        INT             NOT NULL REFERENCES TaskStatus(StatusId),
    PriorityId      INT             NOT NULL REFERENCES Priority(PriorityId),
    AssignedToUserId INT            NULL REFERENCES AppUser(UserId),
    StartDate       DATE            NULL,
    DueDate         DATE            NULL,
    CompletedDate   DATE            NULL,
    EstimatedHours  DECIMAL(8,2)    NULL,
    ActualHours     DECIMAL(8,2)    NULL,
    SortOrder       INT             NOT NULL DEFAULT 0,
    IsArchived      BIT             NOT NULL DEFAULT 0,
    ArchivedDate    DATETIMEOFFSET  NULL,
    ArchivedByUserId INT            NULL REFERENCES AppUser(UserId),
    CreatedByUserId INT             NOT NULL REFERENCES AppUser(UserId),
    CreatedAt       DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    ModifiedByUserId INT            NOT NULL REFERENCES AppUser(UserId),
    ModifiedAt      DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE INDEX IX_Task_CharterId        ON ProjectTask (CharterId);
CREATE INDEX IX_Task_StatusId         ON ProjectTask (StatusId);
CREATE INDEX IX_Task_AssignedTo       ON ProjectTask (AssignedToUserId);
CREATE INDEX IX_Task_DueDate          ON ProjectTask (DueDate);
CREATE INDEX IX_Task_IsArchived       ON ProjectTask (IsArchived);
```

---

### `Subtask`

```sql
CREATE TABLE Subtask (
    SubtaskId       INT IDENTITY(1,1) PRIMARY KEY,
    SubtaskNumber   NVARCHAR(20)    NOT NULL UNIQUE,  -- SUB-0441
    TaskId          INT             NOT NULL REFERENCES ProjectTask(TaskId),
    -- Denormalized for reporting convenience (avoids join through task)
    CharterId       INT             NOT NULL REFERENCES ProjectCharter(CharterId),
    Title           NVARCHAR(300)   NOT NULL,
    Description     NVARCHAR(MAX)   NULL,
    StatusId        INT             NOT NULL REFERENCES SubtaskStatus(StatusId),
    PriorityId      INT             NOT NULL REFERENCES Priority(PriorityId),
    AssignedToUserId INT            NULL REFERENCES AppUser(UserId),
    DueDate         DATE            NULL,
    CompletedDate   DATE            NULL,
    SortOrder       INT             NOT NULL DEFAULT 0,
    IsArchived      BIT             NOT NULL DEFAULT 0,
    ArchivedDate    DATETIMEOFFSET  NULL,
    ArchivedByUserId INT            NULL REFERENCES AppUser(UserId),
    CreatedByUserId INT             NOT NULL REFERENCES AppUser(UserId),
    CreatedAt       DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    ModifiedByUserId INT            NOT NULL REFERENCES AppUser(UserId),
    ModifiedAt      DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
CREATE INDEX IX_Subtask_TaskId        ON Subtask (TaskId);
CREATE INDEX IX_Subtask_CharterId     ON Subtask (CharterId);
CREATE INDEX IX_Subtask_StatusId      ON Subtask (StatusId);
CREATE INDEX IX_Subtask_AssignedTo    ON Subtask (AssignedToUserId);
```

> **Note on `CharterId` denormalization in Subtask:** This intentional denormalization lets reporting queries filter subtasks by charter without joining through `ProjectTask`. The application layer is responsible for keeping this consistent with the parent task.

---

## Lookup Tables

### `CharterStatus` / `TaskStatus` / `SubtaskStatus`

Using three separate status tables gives each entity type independent status lifecycles.

```sql
CREATE TABLE CharterStatus (
    StatusId    INT IDENTITY(1,1) PRIMARY KEY,
    StatusCode  NVARCHAR(30)  NOT NULL UNIQUE,  -- 'Active', 'On Hold', etc.
    DisplayName NVARCHAR(50)  NOT NULL,
    SortOrder   INT           NOT NULL DEFAULT 0,
    IsTerminal  BIT           NOT NULL DEFAULT 0,  -- marks Completed, Cancelled
    IsActive    BIT           NOT NULL DEFAULT 1
);

-- Seed data
INSERT INTO CharterStatus (StatusCode, DisplayName, SortOrder, IsTerminal) VALUES
('Planning',   'Planning',   1, 0),
('Active',     'Active',     2, 0),
('OnHold',     'On Hold',    3, 0),
('Completed',  'Completed',  4, 1),
('Cancelled',  'Cancelled',  5, 1);
```

Repeat the same pattern for `TaskStatus` and `SubtaskStatus` (may have different valid values, e.g. `Not Started`, `In Progress`, `Blocked`, `Done`).

### `Priority`

```sql
CREATE TABLE Priority (
    PriorityId   INT IDENTITY(1,1) PRIMARY KEY,
    PriorityCode NVARCHAR(20)  NOT NULL UNIQUE,
    DisplayName  NVARCHAR(30)  NOT NULL,
    SortOrder    INT           NOT NULL,
    ColorHex     NVARCHAR(7)   NULL   -- for UI hints, e.g. '#ef4444'
);

INSERT INTO Priority (PriorityCode, DisplayName, SortOrder, ColorHex) VALUES
('Critical', 'Critical', 1, '#ef4444'),
('High',     'High',     2, '#f97316'),
('Medium',   'Medium',   3, '#eab308'),
('Low',      'Low',      4, '#64748b');
```

### `AppRole`

```sql
CREATE TABLE AppRole (
    RoleId      INT IDENTITY(1,1) PRIMARY KEY,
    RoleCode    NVARCHAR(50)  NOT NULL UNIQUE,
    DisplayName NVARCHAR(100) NOT NULL
);

INSERT INTO AppRole (RoleCode, DisplayName) VALUES
('Administrator',   'Administrator'),
('ProjectOwner',    'Project Owner'),
('Contributor',     'Project Contributor'),
('Reviewer',        'Reviewer'),
('ReadOnly',        'Read-Only');
```

### `AdGroupRoleMapping`

```sql
CREATE TABLE AdGroupRoleMapping (
    MappingId   INT IDENTITY(1,1) PRIMARY KEY,
    AdGroupName NVARCHAR(200) NOT NULL UNIQUE,
    RoleId      INT           NOT NULL REFERENCES AppRole(RoleId),
    IsActive    BIT           NOT NULL DEFAULT 1,
    CreatedAt   DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
```

---

## History Tables

### `CharterStatusHistory`

```sql
CREATE TABLE CharterStatusHistory (
    HistoryId       INT IDENTITY(1,1) PRIMARY KEY,
    CharterId       INT             NOT NULL REFERENCES ProjectCharter(CharterId),
    FromStatusId    INT             NULL REFERENCES CharterStatus(StatusId),
    ToStatusId      INT             NOT NULL REFERENCES CharterStatus(StatusId),
    ChangedByUserId INT             NOT NULL REFERENCES AppUser(UserId),
    ChangedAt       DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    Notes           NVARCHAR(500)   NULL
);
CREATE INDEX IX_CharterStatusHist_CharterId  ON CharterStatusHistory (CharterId, ChangedAt);
```

Repeat pattern for `TaskStatusHistory` and `SubtaskStatusHistory`.

### `AssignmentHistory`

```sql
CREATE TABLE AssignmentHistory (
    AssignmentHistoryId INT IDENTITY(1,1) PRIMARY KEY,
    EntityType          NVARCHAR(20)    NOT NULL,  -- 'Task', 'Subtask', 'Charter'
    EntityId            INT             NOT NULL,
    FromUserId          INT             NULL REFERENCES AppUser(UserId),
    ToUserId            INT             NULL REFERENCES AppUser(UserId),
    AssignedByUserId    INT             NOT NULL REFERENCES AppUser(UserId),
    AssignedAt          DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    Notes               NVARCHAR(500)   NULL
);
CREATE INDEX IX_AssignHist_Entity ON AssignmentHistory (EntityType, EntityId, AssignedAt);
```

---

## Audit Table

### `AuditEvent`

```sql
CREATE TABLE AuditEvent (
    AuditEventId    INT IDENTITY(1,1) PRIMARY KEY,
    EventId         UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),  -- external-safe ref
    EntityType      NVARCHAR(50)    NOT NULL,   -- 'Charter', 'Task', 'Subtask'
    EntityId        INT             NOT NULL,
    EntityDisplayId NVARCHAR(20)    NULL,        -- CHR-0041, TSK-0188
    ActionType      NVARCHAR(30)    NOT NULL,   -- 'Created','Updated','StatusChanged','Assigned','Archived'
    FieldName       NVARCHAR(100)   NULL,        -- null for whole-record events
    OldValue        NVARCHAR(MAX)   NULL,
    NewValue        NVARCHAR(MAX)   NULL,
    ChangedByUserId INT             NOT NULL REFERENCES AppUser(UserId),
    ChangedAt       DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    CorrelationId   UNIQUEIDENTIFIER NULL,       -- group related events from one operation
    IpAddress       NVARCHAR(45)    NULL,
    UserAgent       NVARCHAR(500)   NULL
);
CREATE INDEX IX_Audit_Entity     ON AuditEvent (EntityType, EntityId, ChangedAt);
CREATE INDEX IX_Audit_User       ON AuditEvent (ChangedByUserId, ChangedAt);
CREATE INDEX IX_Audit_ActionType ON AuditEvent (ActionType, ChangedAt);
CREATE INDEX IX_Audit_ChangedAt  ON AuditEvent (ChangedAt);
```

---

## Future-Ready Tables

```sql
-- Attachments (future v1.6+)
CREATE TABLE Attachment (
    AttachmentId    INT IDENTITY(1,1) PRIMARY KEY,
    EntityType      NVARCHAR(20)    NOT NULL,
    EntityId        INT             NOT NULL,
    FileName        NVARCHAR(255)   NOT NULL,
    StoragePath     NVARCHAR(1000)  NOT NULL,
    ContentType     NVARCHAR(100)   NULL,
    FileSizeBytes   BIGINT          NULL,
    UploadedByUserId INT            NOT NULL REFERENCES AppUser(UserId),
    UploadedAt      DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    IsArchived      BIT             NOT NULL DEFAULT 0
);

-- Comments (future v1.6+)
CREATE TABLE Comment (
    CommentId       INT IDENTITY(1,1) PRIMARY KEY,
    EntityType      NVARCHAR(20)    NOT NULL,
    EntityId        INT             NOT NULL,
    CommentText     NVARCHAR(MAX)   NOT NULL,
    AuthorUserId    INT             NOT NULL REFERENCES AppUser(UserId),
    CreatedAt       DATETIMEOFFSET  NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    ModifiedAt      DATETIMEOFFSET  NULL,
    IsDeleted       BIT             NOT NULL DEFAULT 0
);
```

---

## Reporting Views (create after core tables)

```sql
-- Flattened view for reporting queries
CREATE VIEW vw_ProjectHierarchy AS
SELECT
    c.CharterId,
    c.CharterNumber,
    c.Title                AS CharterTitle,
    cs.DisplayName         AS CharterStatus,
    cp.DisplayName         AS CharterPriority,
    cu.DisplayName         AS CharterOwner,
    t.TaskId,
    t.TaskNumber,
    t.Title                AS TaskTitle,
    ts.DisplayName         AS TaskStatus,
    tp.DisplayName         AS TaskPriority,
    tu.DisplayName         AS TaskAssignee,
    s.SubtaskId,
    s.SubtaskNumber,
    s.Title                AS SubtaskTitle,
    ss.DisplayName         AS SubtaskStatus,
    su.DisplayName         AS SubtaskAssignee,
    c.StartDate            AS CharterStartDate,
    c.TargetDate           AS CharterTargetDate,
    t.DueDate              AS TaskDueDate,
    s.DueDate              AS SubtaskDueDate
FROM ProjectCharter c
JOIN CharterStatus cs  ON c.StatusId      = cs.StatusId
JOIN Priority cp       ON c.PriorityId    = cp.PriorityId
JOIN AppUser cu        ON c.OwnerUserId   = cu.UserId
LEFT JOIN ProjectTask t ON t.CharterId   = c.CharterId AND t.IsArchived = 0
LEFT JOIN TaskStatus ts   ON t.StatusId  = ts.StatusId
LEFT JOIN Priority tp     ON t.PriorityId = tp.PriorityId
LEFT JOIN AppUser tu      ON t.AssignedToUserId = tu.UserId
LEFT JOIN Subtask s       ON s.TaskId    = t.TaskId AND s.IsArchived = 0
LEFT JOIN SubtaskStatus ss ON s.StatusId = ss.StatusId
LEFT JOIN AppUser su       ON s.AssignedToUserId = su.UserId
WHERE c.IsArchived = 0;
```

---

# Phase 3 — Solution Structure

## ASP.NET Core Solution

```
IntraProjects.sln
│
├── src/
│   ├── IntraProjects.Domain/
│   │   ├── Entities/
│   │   │   ├── ProjectCharter.cs
│   │   │   ├── ProjectTask.cs
│   │   │   ├── Subtask.cs
│   │   │   ├── AppUser.cs
│   │   │   └── AuditEvent.cs
│   │   ├── Enums/
│   │   │   └── ActionType.cs
│   │   ├── Interfaces/
│   │   │   ├── IRepository.cs
│   │   │   ├── IUnitOfWork.cs
│   │   │   └── IAuditWriter.cs
│   │   └── IntraProjects.Domain.csproj
│   │
│   ├── IntraProjects.Application/
│   │   ├── Features/
│   │   │   ├── Charters/
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── CreateCharterCommand.cs
│   │   │   │   │   ├── UpdateCharterCommand.cs
│   │   │   │   │   ├── ChangeCharterStatusCommand.cs
│   │   │   │   │   └── ArchiveCharterCommand.cs
│   │   │   │   └── Queries/
│   │   │   │       ├── GetChartersQuery.cs
│   │   │   │       ├── GetCharterByIdQuery.cs
│   │   │   │       └── GetCharterAuditHistoryQuery.cs
│   │   │   ├── Tasks/
│   │   │   │   ├── Commands/
│   │   │   │   └── Queries/
│   │   │   ├── Subtasks/
│   │   │   │   ├── Commands/
│   │   │   │   └── Queries/
│   │   │   ├── Assignments/
│   │   │   └── Users/
│   │   ├── DTOs/
│   │   │   ├── CharterDto.cs
│   │   │   ├── TaskDto.cs
│   │   │   ├── SubtaskDto.cs
│   │   │   └── AuditEventDto.cs
│   │   ├── Validators/
│   │   ├── Mappings/
│   │   ├── Interfaces/
│   │   │   ├── ICurrentUserService.cs
│   │   │   └── ISequenceGenerator.cs
│   │   └── IntraProjects.Application.csproj
│   │
│   ├── IntraProjects.Infrastructure/
│   │   ├── Persistence/
│   │   │   ├── IntraProjectsDbContext.cs
│   │   │   ├── Configurations/          ← EF fluent config per entity
│   │   │   ├── Migrations/
│   │   │   └── Repositories/
│   │   │       ├── CharterRepository.cs
│   │   │       ├── TaskRepository.cs
│   │   │       └── SubtaskRepository.cs
│   │   ├── Identity/
│   │   │   ├── AdAuthenticationService.cs
│   │   │   ├── CurrentUserService.cs
│   │   │   └── JwtTokenService.cs
│   │   ├── Audit/
│   │   │   └── SqlAuditWriter.cs
│   │   ├── Sequences/
│   │   │   └── CharterNumberGenerator.cs  ← CHR-XXXX generation
│   │   └── IntraProjects.Infrastructure.csproj
│   │
│   └── IntraProjects.API/
│       ├── Controllers/
│       │   ├── ChaptersController.cs
│       │   ├── TasksController.cs
│       │   ├── SubtasksController.cs
│       │   ├── AssignmentsController.cs
│       │   ├── AuditController.cs
│       │   └── UsersController.cs
│       ├── Middleware/
│       │   ├── ErrorHandlingMiddleware.cs
│       │   └── RequestLoggingMiddleware.cs
│       ├── Extensions/
│       │   └── ServiceCollectionExtensions.cs
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Program.cs
│       └── IntraProjects.API.csproj
│
└── tests/
    ├── IntraProjects.Domain.Tests/
    ├── IntraProjects.Application.Tests/
    └── IntraProjects.API.Tests/
```

---

## React Frontend Structure

```
src/
│
├── app/
│   ├── App.tsx                      ← Root router + providers
│   ├── providers.tsx                ← QueryClient, Zustand, Toaster
│   └── routes.tsx                   ← React Router route definitions
│
├── components/
│   ├── ui/                          ← shadcn/ui (CLI-generated, locally owned)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (all existing shadcn components)
│   ├── shared/                      ← App-level shared components
│   │   ├── StatusBadge.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── AuditEventRow.tsx
│   │   ├── UserAvatar.tsx
│   │   ├── EntityNumber.tsx         ← Renders CHR-0041 with mono font
│   │   └── ConfirmDialog.tsx
│   └── layout/
│       ├── AppShell.tsx             ← Sidebar + header wrapper
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       └── Breadcrumb.tsx
│
├── features/
│   ├── charters/
│   │   ├── components/
│   │   │   ├── CharterTable.tsx
│   │   │   ├── CharterCard.tsx
│   │   │   ├── CharterForm.tsx
│   │   │   ├── CharterStatusChange.tsx
│   │   │   └── CharterExpandedRow.tsx
│   │   ├── hooks/
│   │   │   ├── useCharters.ts
│   │   │   ├── useCharterById.ts
│   │   │   └── useCharterMutations.ts
│   │   └── types.ts
│   ├── tasks/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── subtasks/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── assignments/
│   ├── audit/
│   │   ├── components/
│   │   │   ├── AuditLogTable.tsx
│   │   │   └── AuditTimeline.tsx
│   │   └── hooks/
│   │       └── useAuditEvents.ts
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── StatCard.tsx
│   │   │   ├── StatusDistribution.tsx
│   │   │   └── RecentAuditFeed.tsx
│   │   └── hooks/
│   └── users/
│
├── pages/
│   ├── DashboardPage.tsx
│   ├── ChartersPage.tsx
│   ├── CharterDetailPage.tsx
│   ├── TaskDetailPage.tsx
│   ├── SubtaskDetailPage.tsx
│   ├── AssignmentsPage.tsx
│   ├── AuditPage.tsx
│   └── ReportingPage.tsx            ← v1.5+
│
├── services/
│   ├── api/
│   │   ├── client.ts                ← Axios instance + auth interceptor
│   │   ├── charters.ts              ← Charter API calls
│   │   ├── tasks.ts
│   │   ├── subtasks.ts
│   │   ├── assignments.ts
│   │   ├── audit.ts
│   │   └── users.ts
│   └── auth/
│       └── authService.ts           ← JWT storage + refresh
│
├── store/
│   ├── uiStore.ts                   ← Zustand: sidebar, modals, filters
│   └── authStore.ts                 ← Zustand: current user, role
│
├── types/
│   ├── charter.ts
│   ├── task.ts
│   ├── subtask.ts
│   ├── user.ts
│   ├── audit.ts
│   └── common.ts                    ← Status, Priority, PagedResult<T>
│
├── utils/
│   ├── date.ts
│   ├── format.ts                    ← formatEntityNumber, formatStatus
│   └── cn.ts                        ← clsx + tailwind-merge
│
├── styles/
│   ├── theme.css                    ← CSS custom properties (existing)
│   ├── fonts.css
│   ├── tailwind.css
│   └── index.css
│
└── main.tsx
```

---

## API Service Layer Pattern

```typescript
// src/services/api/client.ts
import axios from 'axios';
import { authStore } from '../../store/authStore';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

```typescript
// src/services/api/charters.ts
import { apiClient } from './client';
import type { CharterDto, CreateCharterRequest, PagedResult } from '../../types';

export const chartersApi = {
  getAll: (params?: CharterQueryParams) =>
    apiClient.get<PagedResult<CharterDto>>('/api/charters', { params }).then(r => r.data),

  getById: (id: number) =>
    apiClient.get<CharterDto>(`/api/charters/${id}`).then(r => r.data),

  create: (data: CreateCharterRequest) =>
    apiClient.post<CharterDto>('/api/charters', data).then(r => r.data),

  updateStatus: (id: number, statusCode: string, notes?: string) =>
    apiClient.patch(`/api/charters/${id}/status`, { statusCode, notes }).then(r => r.data),
};
```

---

## Shared Type Contracts

```typescript
// src/types/common.ts
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface AuditMeta {
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

// src/types/charter.ts
export type CharterStatus = 'Planning' | 'Active' | 'OnHold' | 'Completed' | 'Cancelled';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface CharterDto {
  charterId: number;
  charterNumber: string;        // CHR-0041
  title: string;
  description: string | null;
  department: string | null;
  ownerUserId: number;
  ownerDisplayName: string;
  status: CharterStatus;
  priority: Priority;
  startDate: string | null;
  targetDate: string | null;
  taskCount: number;
  completedTaskCount: number;
  progressPercent: number;
  isArchived: boolean;
  audit: AuditMeta;
}
```

---

# Phase 4 — MVP Scope (v1.0.0)

## Version Roadmap (revised)

| Version | Scope | Milestone |
|---|---|---|
| **v0.1.0** | DB schema + seed data + EF migrations | Foundation |
| **v0.2.0** | AD auth flow + JWT issuance + user sync | Auth working |
| **v1.0.0** | Charter CRUD + status changes + audit log | Charter management |
| **v1.1.0** | Project Tasks (full CRUD + status + assignment) | Task hierarchy |
| **v1.2.0** | Subtasks | Full hierarchy |
| **v1.3.0** | Assignment tracking + history | Assignment system |
| **v1.4.0** | Audit log UI + status history timeline | Audit visibility |
| **v1.5.0** | Reporting views + export + dashboard charts | Reporting |
| **v1.6.0** | Attachments + Comments | Collaboration |

---

## v1.0.0 Deliverables

### Minimum database schema for v1.0.0

- `AppUser`
- `ProjectCharter`
- `CharterStatus` (lookup + seed)
- `Priority` (lookup + seed)
- `AppRole`
- `AdGroupRoleMapping`
- `CharterStatusHistory`
- `AuditEvent`

### Minimum API endpoints for v1.0.0

```
GET    /api/charters                    List with pagination + filters
POST   /api/charters                    Create charter
GET    /api/charters/{id}               Get by ID
PUT    /api/charters/{id}               Update charter
PATCH  /api/charters/{id}/status        Change status
DELETE /api/charters/{id}               Archive (soft)

GET    /api/charters/{id}/audit         Charter audit history
GET    /api/audit                        Global audit log (paged)

GET    /api/users                        AD user search (for assignment pickers)
GET    /api/users/me                     Current user info + roles

GET    /api/lookups/charter-statuses
GET    /api/lookups/priorities
```

### Minimum UI screens for v1.0.0

1. **Dashboard** — stat cards + charter table + status distribution + recent audit feed (already prototyped in `App.tsx`)
2. **Charters list** — filterable, sortable table with status filter tabs
3. **Charter detail** — field display, status history timeline, action buttons
4. **Charter form** (modal or page) — Create/Edit with React Hook Form + Zod validation
5. **Audit log** — paged table with filters by user/entity/action type

### Minimum AD integration for v1.0.0

- Windows Authentication negotiation on API
- `AppUser` sync on login (create or update from AD identity)
- Role resolution from `AdGroupRoleMapping`
- JWT issued to React frontend
- Protected routes in React (redirect to login if no token)
- `ICurrentUserService` injected into all commands/queries

---

# Phase 5 — GitHub Starter Backlog

## Milestones

```
Milestone: v0.1 — Foundation
Milestone: v0.2 — Auth
Milestone: v1.0 — Charter Management
Milestone: v1.1 — Task Hierarchy
Milestone: v1.2 — Subtasks
Milestone: v1.3 — Assignments
Milestone: v1.4 — Audit Visibility
Milestone: v1.5 — Reporting
```

---

## Initial Issues

### Epic: Foundation (v0.1)

```
[INFRA-001] Initialize ASP.NET Core solution with clean architecture projects
[INFRA-002] Configure SQL Server connection string and EF Core DbContext
[INFRA-003] Create core lookup table migrations (CharterStatus, Priority, AppRole)
[INFRA-004] Create AppUser migration and seed AD group role mappings
[INFRA-005] Create ProjectCharter table migration + indexes
[INFRA-006] Create CharterStatusHistory migration
[INFRA-007] Create AuditEvent table migration + indexes
[INFRA-008] Create IRepository<T> and IUnitOfWork interfaces
[INFRA-009] Create CharterRepository implementation
[INFRA-010] Configure Swagger/OpenAPI
[INFRA-011] Initialize React project from existing zip (initial React project setup)
[INFRA-012] Configure Vite environment variables (VITE_API_BASE_URL)
[INFRA-013] Set up TanStack Query client + Zustand store structure
[INFRA-014] Set up Axios client with JWT interceptor
```

### Epic: Auth (v0.2)

```
[AUTH-001] Implement Windows Authentication negotiation on API
[AUTH-002] Implement AD group claim reading and role mapping
[AUTH-003] Implement AppUser sync-on-login (create or update)
[AUTH-004] Implement JWT generation and issuance endpoint
[AUTH-005] Implement ICurrentUserService
[AUTH-006] Implement React auth store (Zustand)
[AUTH-007] Implement React protected route component
[AUTH-008] Add auth interceptor to Axios client
[AUTH-009] Implement /api/users/me endpoint
[AUTH-010] Test full auth flow (negotiate → JWT → protected endpoint)
```

### Epic: Charter Management (v1.0)

```
[CHR-001]  Implement CreateCharterCommand + validator
[CHR-002]  Implement UpdateCharterCommand + validator
[CHR-003]  Implement ChangeCharterStatusCommand (writes status history + audit event)
[CHR-004]  Implement ArchiveCharterCommand
[CHR-005]  Implement GetChartersQuery (paged, filterable)
[CHR-006]  Implement GetCharterByIdQuery
[CHR-007]  Implement GetCharterAuditHistoryQuery
[CHR-008]  Implement CharterNumber sequence generator (CHR-XXXX)
[CHR-009]  Implement ChaptersController with all endpoints
[CHR-010]  Implement SqlAuditWriter for charter events
[CHR-011]  React: Charter list page with filter tabs
[CHR-012]  React: Charter detail page
[CHR-013]  React: Create charter modal/form (React Hook Form + Zod)
[CHR-014]  React: Edit charter form
[CHR-015]  React: Status change dialog (confirm + notes)
[CHR-016]  React: Archive charter confirmation dialog
[CHR-017]  React: Dashboard page (port from App.tsx prototype)
[CHR-018]  React: Audit log page
[CHR-019]  React: useCharters + useCharterById hooks (TanStack Query)
[CHR-020]  React: useCharterMutations hook (create/update/statusChange)
```

### Epic: Task Hierarchy (v1.1)

```
[TSK-001]  Create ProjectTask + TaskStatus migrations
[TSK-002]  Create TaskStatusHistory migration
[TSK-003]  Implement Task CRUD commands + queries
[TSK-004]  Implement TasksController
[TSK-005]  React: Task list within charter detail
[TSK-006]  React: Task form modal
[TSK-007]  React: Task detail page
[TSK-008]  React: Task status change
```

---

## Branch Naming Convention

```
main                    → always production-ready
develop                 → integration branch
feature/CHR-001-create-charter-command
feature/AUTH-003-user-sync-on-login
bugfix/CHR-015-status-dialog-not-closing
release/v1.0.0
hotfix/v1.0.1-audit-timestamp-fix
```

## Commit Message Convention

```
feat(charters): add CreateCharterCommand with FluentValidation
feat(auth): implement AD group to role mapping
fix(audit): correct timestamp offset handling in SqlAuditWriter
chore(db): add IX_Audit_ChangedAt index to migration
docs(arch): update Phase 2 database schema
refactor(charters): extract CharterNumber generator to ISequenceGenerator
test(charters): add unit tests for ChangeCharterStatusCommand
```

---

# Phase 6 — Step-by-Step Build Order

## Step 1 — Solution initialization

```bash
# Backend
dotnet new sln -n IntraProjects
dotnet new classlib -n IntraProjects.Domain       -o src/IntraProjects.Domain
dotnet new classlib -n IntraProjects.Application  -o src/IntraProjects.Application
dotnet new classlib -n IntraProjects.Infrastructure -o src/IntraProjects.Infrastructure
dotnet new webapi   -n IntraProjects.API          -o src/IntraProjects.API

dotnet sln add src/**/*.csproj

# Add project references
dotnet add src/IntraProjects.Application/IntraProjects.Application.csproj   reference src/IntraProjects.Domain/IntraProjects.Domain.csproj
dotnet add src/IntraProjects.Infrastructure/IntraProjects.Infrastructure.csproj reference src/IntraProjects.Application/IntraProjects.Application.csproj
dotnet add src/IntraProjects.API/IntraProjects.API.csproj reference src/IntraProjects.Infrastructure/IntraProjects.Infrastructure.csproj

# Key NuGet packages
dotnet add src/IntraProjects.Infrastructure package Microsoft.EntityFrameworkCore.SqlServer
dotnet add src/IntraProjects.Infrastructure package Microsoft.EntityFrameworkCore.Tools
dotnet add src/IntraProjects.Application package FluentValidation.DependencyInjectionExtensions
dotnet add src/IntraProjects.Application package AutoMapper
dotnet add src/IntraProjects.API package Microsoft.AspNetCore.Authentication.Negotiate
dotnet add src/IntraProjects.API package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add src/IntraProjects.API package Swashbuckle.AspNetCore
```

## Step 2 — Frontend initialization

```bash
# From the unzipped IntraProjects repo root:
# 1. App.tsx already uses IntraProjects branding
# 2. Update README.md title
# 3. Add dependencies not yet in package.json:
pnpm add @tanstack/react-query zustand zod react-hook-form @hookform/resolvers axios
pnpm add -D typescript @types/react @types/react-dom

# 4. Create .env.development
echo "VITE_API_BASE_URL=https://localhost:7001" > .env.development
```

## Step 3 — Database (run in order in SSMS)

```
1. Create database: CREATE DATABASE IntraProjects
2. Run lookup table migrations (CharterStatus, Priority, AppRole)
3. Run AppUser migration
4. Run AdGroupRoleMapping migration + seed your AD groups
5. Run ProjectCharter migration
6. Run CharterStatusHistory migration
7. Run AuditEvent migration
8. Run reporting view (vw_ProjectHierarchy)
9. Verify all foreign keys and indexes with sp_help
```

## Step 4 — Auth flow (verify before building features)

```
1. Configure IIS/Kestrel for Windows Authentication
2. Add Negotiate + JWT to Program.cs services
3. Implement /api/auth/login endpoint (reads WindowsPrincipal → issues JWT)
4. Implement /api/users/me (reads from AppUser via JWT claim)
5. Test with Postman using Windows auth: confirm JWT returned
6. Test /api/users/me with JWT: confirm user info returned
7. Wire React: call /api/auth/login on app load, store JWT in Zustand authStore
```

## Step 5 — Charter feature (backend first, then frontend)

```
Backend:
1. Implement Domain entity: ProjectCharter.cs
2. Implement ICharterRepository + CharterRepository
3. Implement CreateCharterCommand → handler → writes AuditEvent
4. Implement GetChartersQuery (paged)
5. Implement GetCharterByIdQuery
6. Implement ChangeCharterStatusCommand → writes CharterStatusHistory + AuditEvent
7. Implement ChaptersController
8. Verify all endpoints in Swagger

Frontend:
9. Create src/types/charter.ts
10. Create src/services/api/charters.ts
11. Create useCharters + useCharterById (TanStack Query)
12. Create useCharterMutations (useMutation wrappers)
13. Build CharterTable component (port from App.tsx prototype)
14. Build CharterForm (React Hook Form + Zod schema)
15. Build CharterDetailPage
16. Wire routing: /charters and /charters/:charterId
17. Connect Dashboard stat cards to real API data
```

## Step 6 — Audit log (part of v1.0.0)

```
Backend:
1. Implement SqlAuditWriter
2. Inject IAuditWriter into all command handlers
3. Implement AuditController with paged query endpoint

Frontend:
4. Create src/services/api/audit.ts
5. Create useAuditEvents hook
6. Build AuditLogTable component
7. Build AuditPage at /audit route
8. Add "Recent Audit Events" feed to Dashboard (already in prototype)
```

## Step 7 — Task hierarchy (v1.1.0)

```
1. Run ProjectTask + TaskStatus migrations
2. Implement Task domain entity
3. Implement Task commands + queries (mirror charter pattern)
4. Implement TasksController
5. React: Add task list to CharterDetailPage
6. React: TaskForm modal
7. React: TaskDetailPage at /charters/:charterId/tasks/:taskId
8. React: Task status change (reuse StatusChange component pattern)
```

## Step 8 — Subtasks (v1.2.0)

```
Mirror task implementation:
1. Subtask migration (include denormalized CharterId)
2. Subtask commands + queries
3. SubtasksController
4. React: Subtask list in TaskDetailPage
5. React: SubtaskDetailPage
6. React: Breadcrumb shows full hierarchy (Charter → Task → Subtask)
```

## Step 9 — Assignments (v1.3.0)

```
1. AssignmentHistory migration
2. Implement AssignUserToTaskCommand (writes AssignmentHistory + AuditEvent)
3. Implement AssignmentsController
4. React: User search/picker component (calls /api/users with search param)
5. React: Assignee display on task/subtask cards
6. React: AssignmentsPage with grouped view by user
```

## Step 10 — Audit visibility (v1.4.0)

```
1. Enhance audit log with field-level change display
2. React: AuditTimeline component (vertical timeline view per entity)
3. React: Status history tab on Charter/Task detail pages
4. React: Full-screen audit log with advanced filters (date range, user, entity type)
```

## Step 11 — Reporting (v1.5.0)

```
1. Create vw_ProjectHierarchy view in SQL Server
2. Implement reporting query endpoints (by department, by owner, by date range)
3. React: ReportingPage with recharts (already in package.json)
4. Add status duration reports (days in each status per charter)
5. Add assignment load reports (subtasks per user)
6. Consider CSV export endpoint for SSMS-alternative reporting
```

---

## Deployment-Ready Baseline Checklist

Before v1.0.0 tag:

- [ ] `appsettings.Production.json` with no hardcoded secrets (use environment variables or Azure Key Vault)
- [ ] Connection string via environment variable `ConnectionStrings__IntraProjects`
- [ ] JWT signing key via environment variable (not in appsettings)
- [ ] All migrations applied to production database
- [ ] AD group names configured in `AdGroupRoleMapping` table for production groups
- [ ] React `.env.production` with correct `VITE_API_BASE_URL`
- [ ] React `vite build` output hosted (IIS static files or Azure Static Web Apps)
- [ ] HTTPS enforced on API
- [ ] CORS configured for frontend origin only
- [ ] Swagger disabled in Production environment
- [ ] Global error handling middleware in place
- [ ] Request logging middleware in place
- [ ] All database indexes verified via SSMS execution plans

---

## Design Tokens Reference (from existing theme.css)

Your existing theme is already wired and production-quality. Key values for component development:

| Token | Value | Use |
|---|---|---|
| `--background` | `#0d1b2a` | Page background |
| `--card` | `#132237` | Card/panel background |
| `--sidebar` | `#091422` | Sidebar background |
| `--primary` | `#3b82f6` | Blue — buttons, active states |
| `--muted` | `#1a2d46` | Input backgrounds, muted zones |
| `--muted-foreground` | `#6b8caf` | Secondary text |
| `--border` | `rgba(147,197,253,0.1)` | Subtle borders |
| `--destructive` | `#ef4444` | Errors, dangerous actions |

Typography conventions from prototype:
- Display/headings: `'Outfit', sans-serif`
- Body: `'Inter', sans-serif`
- Monospace (IDs, timestamps, badges): `'Geist Mono', monospace`

---

*IntraProjects Architecture Guide — v1.0 · Generated June 2026*
*Repository: `shiannb0449/IntraProjects` · Application: IntraProjects*
