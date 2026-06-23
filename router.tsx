import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import { DashboardPage }   from "../pages/DashboardPage";
import { ChartersPage }    from "../pages/ChartersPage";
import { TasksPage }       from "../pages/TasksPage";
import { SubtasksPage }    from "../pages/SubtasksPage";
import { AssignmentsPage } from "../pages/AssignmentsPage";
import { ReportingPage }   from "../pages/ReportingPage";
import { AuditPage }       from "../pages/AuditPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true,         element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard",   element: <DashboardPage />   },
      { path: "charters",    element: <ChartersPage />    },
      { path: "tasks",       element: <TasksPage />       },
      { path: "subtasks",    element: <SubtasksPage />    },
      { path: "assignments", element: <AssignmentsPage /> },
      { path: "reporting",   element: <ReportingPage />   },
      { path: "audit",       element: <AuditPage />       },
    ],
  },
]);
