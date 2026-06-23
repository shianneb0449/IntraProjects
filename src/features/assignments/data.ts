export interface Assignment {
  id: string;
  personName: string;
  personInitials: string;
  personRole: string;
  entityType: "Task" | "Subtask";
  entityNumber: string;
  entitySummary: string;
  charterNumber: string;
  charterTitle: string;
  resourceRole: "Primary" | "Secondary";
  load: number;
  urgency: "Low" | "Medium" | "High" | "Critical";
  status: string;
  dueDate: string;
}

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id:"A-001", personName:"S. Burnett",   personInitials:"SB", personRole:"Project Owner",       entityType:"Task",    entityNumber:"TSK-0188", entitySummary:"Configure SSO integration with Active Directory",      charterNumber:"CHR-0041", charterTitle:"ERP System Migration — Phase 3",  resourceRole:"Primary",   load:75,  urgency:"High",     status:"In Progress",  dueDate:"2026-07-10" },
  { id:"A-002", personName:"S. Burnett",   personInitials:"SB", personRole:"Project Owner",       entityType:"Subtask", entityNumber:"SUB-0441", entitySummary:"Set up LDAP connection and test with dev environment", charterNumber:"CHR-0041", charterTitle:"ERP System Migration — Phase 3",  resourceRole:"Primary",   load:50,  urgency:"High",     status:"In Progress",  dueDate:"2026-07-08" },
  { id:"A-003", personName:"R. Huang",     personInitials:"RH", personRole:"Compliance Lead",     entityType:"Task",    entityNumber:"TSK-0187", entitySummary:"Complete risk assessment documentation for all systems",charterNumber:"CHR-0033", charterTitle:"ISO 27001 Certification Program", resourceRole:"Primary",   load:100, urgency:"Critical", status:"Under review", dueDate:"2026-06-28" },
  { id:"A-004", personName:"R. Huang",     personInitials:"RH", personRole:"Compliance Lead",     entityType:"Subtask", entityNumber:"SUB-0440", entitySummary:"Document data classification policy for all servers",  charterNumber:"CHR-0033", charterTitle:"ISO 27001 Certification Program", resourceRole:"Primary",   load:75,  urgency:"Critical", status:"Open",         dueDate:"2026-06-27" },
  { id:"A-005", personName:"R. Huang",     personInitials:"RH", personRole:"Compliance Lead",     entityType:"Subtask", entityNumber:"SUB-0437", entitySummary:"Review third-party vendor access controls",            charterNumber:"CHR-0033", charterTitle:"ISO 27001 Certification Program", resourceRole:"Primary",   load:50,  urgency:"High",     status:"Under review", dueDate:"2026-06-30" },
  { id:"A-006", personName:"M. Delacroix", personInitials:"MD", personRole:"Procurement Analyst", entityType:"Task",    entityNumber:"TSK-0186", entitySummary:"Build API connector for vendor portal",                 charterNumber:"CHR-0039", charterTitle:"Vendor Onboarding Automation",    resourceRole:"Primary",   load:75,  urgency:"Medium",   status:"Open",         dueDate:"2026-08-01" },
  { id:"A-007", personName:"M. Delacroix", personInitials:"MD", personRole:"Procurement Analyst", entityType:"Subtask", entityNumber:"SUB-0438", entitySummary:"Write OAuth2 auth middleware for vendor API",          charterNumber:"CHR-0039", charterTitle:"Vendor Onboarding Automation",    resourceRole:"Primary",   load:50,  urgency:"Medium",   status:"Open",         dueDate:"2026-07-30" },
  { id:"A-008", personName:"T. Okafor",    personInitials:"TO", personRole:"HR Manager",          entityType:"Task",    entityNumber:"TSK-0185", entitySummary:"Draft updated remote work policy",                     charterNumber:"CHR-0037", charterTitle:"HR Policy Framework Refresh",     resourceRole:"Primary",   load:50,  urgency:"Low",      status:"Stalled",      dueDate:"2026-09-15" },
  { id:"A-009", personName:"A. Patel",     personInitials:"AP", personRole:"IT Infrastructure",   entityType:"Task",    entityNumber:"TSK-0184", entitySummary:"Data migration dry run for Finance module",             charterNumber:"CHR-0041", charterTitle:"ERP System Migration — Phase 3",  resourceRole:"Primary",   load:100, urgency:"High",     status:"Open",         dueDate:"2026-07-20" },
  { id:"A-010", personName:"A. Patel",     personInitials:"AP", personRole:"IT Infrastructure",   entityType:"Subtask", entityNumber:"SUB-0439", entitySummary:"Export legacy GL data and validate row counts",         charterNumber:"CHR-0041", charterTitle:"ERP System Migration — Phase 3",  resourceRole:"Primary",   load:75,  urgency:"High",     status:"Stalled",      dueDate:"2026-07-18" },
  { id:"A-011", personName:"A. Patel",     personInitials:"AP", personRole:"IT Infrastructure",   entityType:"Task",    entityNumber:"TSK-0188", entitySummary:"Configure SSO integration with Active Directory",      charterNumber:"CHR-0041", charterTitle:"ERP System Migration — Phase 3",  resourceRole:"Secondary", load:25,  urgency:"High",     status:"In Progress",  dueDate:"2026-07-10" },
  { id:"A-012", personName:"L. Fontaine",  personInitials:"LF", personRole:"Digital Lead",        entityType:"Task",    entityNumber:"TSK-0186", entitySummary:"Build API connector for vendor portal",                 charterNumber:"CHR-0039", charterTitle:"Vendor Onboarding Automation",    resourceRole:"Secondary", load:25,  urgency:"Medium",   status:"Open",         dueDate:"2026-08-01" },
];
