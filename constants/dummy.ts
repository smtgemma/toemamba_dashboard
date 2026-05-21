export const USER_ROLES = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  SUPERVISOR: "SUPERVISOR",
  MAINTENANCE: "MAINTENANCE",
  OPERATOR: "OPERATOR",
} as const;

export const CATEGORIES = ["Maintenance", "Safety", "Production", "Quality"];

export const PRIORITIES = ["P1", "P2", "P3"] as const;

export const STATUSES = ["Open", "Monitoring", "In Progress", "Resolved"];

export const DUMMY_ISSUES = [
  {
    id: "1",
    priority: "P1",
    content: "Electrical panel showing intermittent fault codes. Risk of unexpected shutdown on Line A.",
    category: "Maintenance",
    line: "Line 2",
    date: "2026-05-21",
    status: "Open",
    carryoverAging: "Open across 2 shifts",
    isRecurring: true,
    recurrenceText: "Electrical panel fault reported 4 times this week",
    isEscalating: true,
    isTemporaryFix: false,
    timeline: [
      { date: "2026-05-20 14:30", type: "report", user: "John Martinez", note: "Reported intermittent fault codes on Electrical Panel E-03." },
      { date: "2026-05-20 22:15", type: "handoff", user: "Kathryn Murphy", note: "Noted by 3rd shift. Panel still flashing warning, but line kept running." },
      { date: "2026-05-21 06:45", type: "escalation", user: "Cody Fisher", note: "Critical: Fault frequency increased. Line A shut down for 10 min." }
    ]
  },
  {
    id: "2",
    priority: "P1",
    content: "Safety guard missing on conveyor belt. High risk of injury during operation.",
    category: "Safety",
    line: "Line 3",
    date: "2026-05-21",
    status: "Open",
    carryoverAging: "Open across 1 shift",
    isRecurring: false,
    isEscalating: false,
    isTemporaryFix: false,
    timeline: [
      { date: "2026-05-21 08:00", type: "report", user: "Ralph Edwards", note: "Safety guard was removed for belt cleaning and not re-installed." }
    ]
  },
  {
    id: "3",
    priority: "P2",
    content: "Slight vibration detected in the main motor housing. Monitoring required.",
    category: "Production",
    line: "Line 1",
    date: "2026-05-20",
    status: "Monitoring",
    carryoverAging: "Monitoring for 3 shifts",
    isRecurring: true,
    recurrenceText: "Motor vibration recurring across multiple shifts",
    isEscalating: false,
    isTemporaryFix: true,
    timeline: [
      { date: "2026-05-19 10:15", type: "report", user: "Ralph Edwards", note: "Operator reported slight hum and structural vibration." },
      { date: "2026-05-19 14:00", type: "temp_fix", user: "Cody Fisher", note: "Adjusted motor mounts. Vibration reduced but housing is still warm. Setting to Monitoring." }
    ]
  },
  {
    id: "4",
    priority: "P3",
    content: "Oil leak near the hydraulic unit. Needs cleaning and seal replacement.",
    category: "Maintenance",
    line: "Line 4",
    date: "2026-05-19",
    status: "Resolved",
    carryoverAging: "Resolved on Shift 2",
    isRecurring: false,
    isEscalating: false,
    isTemporaryFix: false,
    timeline: [
      { date: "2026-05-19 07:00", type: "report", user: "Guy Hawkins", note: "Small pool of oil observed under line 4 hydraulic pump." },
      { date: "2026-05-19 11:30", type: "resolution", user: "Cody Fisher", note: "Replaced seals, topped up hydraulic fluid, and cleaned the area. Verified leak stopped." }
    ]
  },
  {
    id: "5",
    priority: "P1",
    content: "Critical pressure drop in the steam line. Investigating root cause.",
    category: "Safety",
    line: "Line 2",
    date: "2026-05-21",
    status: "In Progress",
    carryoverAging: "Open across 3 shifts",
    isRecurring: true,
    recurrenceText: "Line 2 steam line drop occurred twice during the week",
    isEscalating: true,
    isTemporaryFix: false,
    timeline: [
      { date: "2026-05-20 23:00", type: "report", user: "John Martinez", note: "Steam pressure dropped to 4.2 bar. Normal is 6 bar." },
      { date: "2026-05-21 07:30", type: "handoff", user: "Kathryn Murphy", note: "Handoff to morning shift. Main steam valve checked, problem appears upstream." },
      { date: "2026-05-21 10:00", type: "escalation", user: "Cody Fisher", note: "Maintenance crew investigating main boiler house feed. High risk of line stop." }
    ]
  },
  {
    id: "6",
    priority: "P2",
    content: "Wait time on Line B has increased by 15%. Optimization needed.",
    category: "Production",
    line: "Line B",
    date: "2026-05-21",
    status: "Open",
    carryoverAging: "Open across 1 shift",
    isRecurring: false,
    isEscalating: false,
    isTemporaryFix: false,
    timeline: [
      { date: "2026-05-21 11:00", type: "report", user: "Ralph Edwards", note: "Sensors report line speed delays between feeding and assembly." }
    ]
  },
  {
    id: "7",
    priority: "P1",
    content: "Conveyor 2 jam reported 8 times this week. Urgent engineering review needed.",
    category: "Maintenance",
    line: "Line 2",
    date: "2026-05-21",
    status: "Monitoring",
    carryoverAging: "Escalating after 8 repeated mentions",
    isRecurring: true,
    recurrenceText: "Conveyor 2 jam reported 8 times this week",
    isEscalating: true,
    isTemporaryFix: true,
    timeline: [
      { date: "2026-05-18 09:00", type: "report", user: "Ralph Edwards", note: "Conveyor jam at transition guide." },
      { date: "2026-05-19 14:00", type: "temp_fix", user: "Cody Fisher", note: "Cleared jam and reset guide rail." },
      { date: "2026-05-20 18:30", type: "report", user: "Ralph Edwards", note: "Guide rail misaligned again, jammed." },
      { date: "2026-05-21 09:30", type: "escalation", user: "Kathryn Murphy", note: "Repeated mechanical failure. Temporary fix no longer reliable. Watch condition set." }
    ]
  }
];

export const DUMMY_STATS = [
  {
    label: "P1 CRITICAL",
    value: "4",
    priority: "P1",
  },
  {
    label: "P2 HIGH",
    value: "2",
    priority: "P2",
  },
  {
    label: "P3 MEDIUM",
    value: "1",
    priority: "P3",
  },
  {
    label: "Resolved",
    value: "1",
    status: "Resolved",
  },
];

export const DUMMY_USERS = [
  {
    id: "u1",
    name: "John Martinez",
    email: "alma.lawson@example.com",
    role: "Admin",
    line: "All Areas",
    status: "Active",
  },
  {
    id: "u2",
    name: "Kathryn Murphy",
    email: "jessica.hanson@example.com",
    role: "Supervisor",
    line: "Line 2",
    status: "Active",
  },
  {
    id: "u3",
    name: "Cody Fisher",
    email: "michelle.rivera@example.com",
    role: "Staff",
    staffRole: "Maintenance",
    line: "Line 3",
    status: "Active",
  },
  {
    id: "u4",
    name: "Guy Hawkins",
    email: "bill.sanders@example.com",
    role: "Supervisor",
    line: "Line 4",
    status: "In Active",
  },
  {
    id: "u5",
    name: "Ralph Edwards",
    email: "tanya.hill@example.com",
    role: "Operator",
    line: "Line 4",
    status: "In Active",
  },
  {
    id: "u6",
    name: "Ralph Edwards",
    email: "bill.sanders@example.com",
    role: "Operator",
    line: "Line 4",
    status: "In Active",
  },
];
