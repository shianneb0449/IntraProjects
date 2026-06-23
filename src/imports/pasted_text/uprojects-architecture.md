Building an enterprise internal application called **uProjects** in the GitHub repository.

This application is a **Project Management System** designed to manage structured project execution using Project Charters, Project Tasks, and Subtasks with full audit tracking and reporting support.

This system must be designed as a **long-term system of record**, not a simple CRUD demo.

I want architecture-first guidance followed by implementation planning and backlog creation.

---

# Tech stack (required)

Design everything using:

**Frontend:**
* React (with TypeScript)
* Tailwind CSS for styling
* shadcn/ui for component library (built on Radix primitives)
* React Router for navigation
* React Query / TanStack Query for server-state and caching
* Zustand for client/UI state
* React Hook Form + Zod for form handling and validation

**Backend:**
* ASP.NET Core Web API

**Database:**
* SQL Server

**Database tools:**
* SSMS

**Authentication:**
* Active Directory (Windows Authentication or Azure AD-compatible architecture)

---

# Core system hierarchy

The system must support this enforced relationship structure:

Project Charter
→ Project Tasks
→ Subtasks

Rules:

* A Project Charter is the root entity
* A Project Task must belong to a Project Charter
* A Subtask must belong to a Project Task
* Subtasks inherit Project Charter context through their parent task
* No orphan records allowed
* Referential integrity must be enforced at database level

---

# Core business entities

Design domain models for:

Project Charter
Project Task
Subtask
User (from Active Directory)
Assignment
Status History
Audit History
Attachments (future-ready)
Comments (future-ready)

---

# Active Directory requirements

The system must integrate with Active Directory.

Support:

Authentication via AD identity
Role mapping via AD groups
Task assignment to AD users
Project ownership tracking
Audit logging of AD users performing actions

Design the system so AD integration is part of the architecture foundation, not added later.

---

# Reporting requirements

This application must function as a **reportable system of record**.

Design database structure to support:

historical reporting
status tracking over time
assignment tracking over time
change history visibility
trend analysis
lifecycle tracking
project performance reporting

Data must never be destructively overwritten in ways that break reporting integrity.

Prefer:

append-only history tables
temporal tracking strategies
status history tables
audit event tables

---

# Audit requirements

The system must capture full audit history.

Audit tracking must include:

record created
record updated
record status changed
assignment changed
field-level value changes (when appropriate)
user performing change
timestamp of change
old value
new value

Audit history must be queryable from SQL Server for reporting.

---

# Data lifecycle expectations

Support:

CreatedDate
CreatedBy
ModifiedDate
ModifiedBy
Status history tracking
Assignment history tracking
Soft delete OR archive strategy

Design archive strategy suitable for long-term reporting environments.

---

# Security model expectations

Design role-aware access using:

Active Directory groups
role-based permissions
project ownership rules
task-level permissions (future-ready)

Example roles:

Project Owner
Project Contributor
Reviewer
Administrator
Read-only user

---

# Architecture expectations

Use clean architecture principles:

Domain layer
Application layer
Infrastructure layer
API layer
Frontend UI layer

Separate:

data models
business logic
persistence
API contracts
UI logic

Avoid tightly coupling UI to persistence logic.

---

# Database expectations

Design SQL Server schema including:

primary entity tables
status lookup tables
assignment tables
audit history tables
status history tables
soft delete/archive strategy
foreign key constraints
indexes for reporting

Include reporting-friendly structure from the start.

Prefer:

normalized relational design
history tables instead of overwrites
surrogate keys (INT identity or GUID strategy recommendation)

---

# API expectations

Design REST API endpoints for:

Project Charters
Project Tasks
Subtasks
Assignments
Status updates
Audit history retrieval
Reporting queries (future-ready endpoints)

Use scalable controller/service/repository structure.

---

# Frontend expectations

Design React UI architecture supporting:

Project Charter dashboard
Task hierarchy navigation
Subtask drill-down views
assignment display
status visualization
history viewing UI
audit timeline UI (future-ready)

Structure the React app for scalability and maintainability, including:

* component organization (presentational vs. container/feature components)
* shadcn/ui component setup (CLI-installed, locally owned components, customized via Tailwind config)
* Tailwind config strategy (design tokens, theme extension, dark mode support)
* shared/reusable UI component library built on top of shadcn primitives
* API service layer (typed API client, e.g. generated from OpenAPI)
* routing structure for hierarchical navigation (charter → task → subtask)
* state management boundaries (server cache via React Query vs. UI state via Zustand)
* form handling/validation strategy (React Hook Form + Zod)

---

# Versioning expectations

Plan development in incremental releases:

v1.0.0 → Project Charter management
v1.1.0 → Task hierarchy
v1.2.0 → Subtasks
v1.3.0 → Assignment tracking
v1.4.0 → Audit tracking
v1.5.0 → Reporting readiness

Recommend improved version roadmap if appropriate.

---

# GitHub workflow expectations

Structure repo for:

feature branches
clean commits
incremental milestones
documentation alongside development

Recommend:

solution structure
folder structure
branch naming conventions
commit strategy
issue backlog

---

# Audit-friendly architecture requirement

Design system so:

no destructive updates remove reporting context
history survives edits
assignment changes remain traceable
status transitions remain traceable
project lifecycle remains reconstructable

---

# Output I want from you

Respond in the following phases.

---

# Phase 1 — System architecture

Provide:

recommended architecture diagram description
layer structure
backend architecture
frontend architecture (React)
database architecture
entity relationship overview
Active Directory integration approach
audit strategy
reporting strategy
soft delete vs archive recommendation

---

# Phase 2 — Database design

Provide:

core tables
history tables
audit tables
lookup tables
relationships
primary keys
foreign keys
index strategy

Include reporting-ready schema recommendations.

---

# Phase 3 — Solution structure

Provide:

ASP.NET solution structure
React frontend structure (folders for components, features, hooks, services, routes, types)
shared contracts structure (e.g. shared TypeScript types/OpenAPI-generated client)
infrastructure layer structure
repository/service pattern plan

---

# Phase 4 — MVP scope

Define:

Version 1.0.0 deliverables
minimum database schema
minimum API endpoints
minimum UI screens (React)
minimum AD integration

---

# Phase 5 — GitHub starter backlog

Generate:

initial Issues
Milestones
feature order
development sequence

Organize backlog logically for incremental delivery.

---

# Phase 6 — Step-by-step build order

Provide:

database-first steps
backend-first steps
frontend-first steps (React)
integration steps
deployment-ready baseline steps

Guide development in practical implementation order.

---

# Development goal

Produce a scalable enterprise-ready internal project tracking platform with:

hierarchical project structure
Active Directory authentication
full audit trail
reporting-ready database
clean architecture
React-based frontend (TypeScript, Tailwind, shadcn/ui)
incremental version roadmap

Guide me step-by-step so I can begin implementation immediately inside:

**`shiannb0449/uProjects`**
