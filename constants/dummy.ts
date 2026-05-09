export const USER_ROLES = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  SUPERVISOR: "SUPERVISOR",
  MAINTENANCE: "MAINTENANCE",
  OPERATOR: "OPERATOR",
} as const;

export const CATEGORIES = ["Maintenance", "Safety", "Production", "Quality"];

export const PRIORITIES = ["P1", "P2", "P3"] as const;

export const STATUSES = ["Approved", "In progress", "Resolved"];

export const DUMMY_ISSUES = [
  {
    id: "1",
    priority: "P1",
    content:
      "Electrical panel showing intermittent fault codes. Risk of unexpected shutdown on Line A.",
    category: "Maintenance",
    line: "Line 2",
    date: "02,feb,2025",
    status: "Open",
  },
  {
    id: "2",
    priority: "P1",
    content:
      "Safety guard missing on conveyor belt. High risk of injury during operation.",
    category: "Safety",
    line: "Line 3",
    date: "02,feb,2025",
    status: "Open",
  },
  {
    id: "3",
    priority: "P2",
    content:
      "Slight vibration detected in the main motor housing. Monitoring required.",
    category: "Production",
    line: "Line 1",
    date: "01,feb,2025",
    status: "In progress",
  },
  {
    id: "4",
    priority: "P3",
    content:
      "Oil leak near the hydraulic unit. Needs cleaning and seal replacement.",
    category: "Maintenance",
    line: "Line 4",
    date: "31,jan,2025",
    status: "Resolved",
  },
  {
    id: "5",
    priority: "P1",
    content:
      "Critical pressure drop in the steam line. Investigating root cause.",
    category: "Safety",
    line: "Line 2",
    date: "02,feb,2025",
    status: "Approved",
  },
  {
    id: "6",
    priority: "P2",
    content: "Wait time on Line B has increased by 15%. Optimization needed.",
    category: "Production",
    line: "Line B",
    date: "02,feb,2025",
    status: "Open",
  },
];

export const DUMMY_STATS = [
  {
    label: "P1 CRITICAL",
    value: "10",
    priority: "P1",
  },
  {
    label: "P2 HIGH",
    value: "16",
    priority: "P2",
  },
  {
    label: "P3 MEDIUM",
    value: "8",
    priority: "P3",
  },
  {
    label: "Solved",
    value: "164",
    status: "Resolved",
  },
];
