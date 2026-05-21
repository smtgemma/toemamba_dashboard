# Backend Developer Handoff & Flow Integration Guide

This document outlines the transition of the application from a generic CMMS/maintenance ticketing system to an **operational memory and shift continuity layer** for the manufacturing plant. The frontend has been refactored around these changes. 

Please use this document to design the backend database schema, API endpoints, and AI integration services.

---

## 1. Product Pivot & Core Terminology

To avoid administrative/ticketing overhead and focus on operational continuity, the following terms have been updated in the UX:
- **Tasks** $\rightarrow$ **Operational Issues** / **Carryover Items** / **Shift Issues**
- **Watch Items** $\rightarrow$ Ongoing monitoring items (temporary fixes, critical parameters)
- **Escalations** $\rightarrow$ Carryover items that are rising in severity or repeating across shifts

---

## 2. Updated Issue Status Flow

The lifecycle of an issue has changed to better support plant operations (e.g., temporary fixes and watch conditions):

$$\text{Open} \xrightarrow{} \text{Monitoring} \xrightarrow{} \text{In Progress} \xrightarrow{} \text{Resolved}$$

- **Open**: Initial state when an operator reports a new issue.
- **Monitoring**: Active watch condition. Used when a temporary fix has been applied (e.g., adjusted mounts, cleared jam) and the line needs observation before full resolution.
- **In Progress**: Maintenance or engineering is actively working on a permanent fix.
- **Resolved**: Verified permanent fix.

---

## 3. Database Schema: `Issue` Model

Your database schema should support the following fields for the `Issue` model:

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | String / UUID | Unique identifier | `"1"` |
| `priority` | Enum | Priority tier (`P1`, `P2`, `P3`) | `"P1"` |
| `content` | String / Text | Detailed description of the operational issue | `"Electrical panel E-03 showing fault codes"` |
| `category` | String | Issue category (`Maintenance`, `Safety`, `Production`, `Quality`) | `"Maintenance"` |
| `line` | String | Plant production line/area | `"Line 2"` |
| `date` | Date/String | Initial report date | `"2026-05-21"` |
| `status` | Enum | Current status (`Open`, `Monitoring`, `In Progress`, `Resolved`) | `"Open"` |
| `carryoverAging` | String | Human-readable string indicating shift/duration aging | `"Open across 2 shifts"` |
| `isRecurring` | Boolean | Whether AI has detected this as a recurring pattern | `true` |
| `recurrenceText` | String / Text | AI-surfaced summary of repeat pattern | `"Panel fault reported 4 times this week"` |
| `isEscalating` | Boolean | Highlighted flag for high-priority/repeating issues | `true` |
| `isTemporaryFix` | Boolean | True if a temporary fix is currently in place | `false` |
| `timeline` | Array (JSON) | Chronological list of handoffs, actions, and status updates | See Timeline Schema below |

### Timeline Event Schema
Each element in the `timeline` JSON array must follow this structure:
```json
{
  "date": "2026-05-21 06:45",
  "type": "report" | "temp_fix" | "handoff" | "escalation" | "resolution",
  "user": "Cody Fisher",
  "note": "Critical: Fault frequency increased. Line A shut down for 10 min."
}
```

---

## 4. API Endpoints Blueprint (Redux RTK Query)

The frontend initiates requests using **RTK Query** injected endpoints under `lib/redux/features/issues/issuesApi.ts`. 

### `baseApi` Configuration
- Base URL is resolved via `process.env.NEXT_PUBLIC_BASE_URL` (usually defined in `.env`).
- Automatic inclusion of `Authorization: Bearer <token>` from the `token` cookie when present.

### Injected Endpoints:

#### 1. Get All Issues
- **Endpoint**: `GET /issues`
- **Query Params**:
  - `status` (optional): Filter by `Open`, `Monitoring`, `In Progress`, `Resolved`
  - `priority` (optional): Filter by `P1`, `P2`, `P3`
- **Response**: Array of `Issue` objects.

#### 2. Get Issue by ID
- **Endpoint**: `GET /issues/:id`
- **Response**: Single `Issue` object containing the `timeline` array.

#### 3. Create Issue (Operator Handoff)
- **Endpoint**: `POST /issues`
- **Request Body**:
  ```json
  {
    "content": "Conveyor belt Line 2 is making a grinding noise...",
    "priority": "P1",
    "category": "Maintenance",
    "line": "Line 2",
    "status": "Open",
    "date": "2026-05-21"
  }
  ```
- **Response**: Created `Issue` object.

#### 4. Update Issue (Maintenance Status & Handoff Notes)
- **Endpoint**: `PATCH /issues/:id`
- **Request Body**:
  ```json
  {
    "status": "Monitoring",
    "isTemporaryFix": true,
    "timelineEvent": {
      "type": "temp_fix",
      "user": "Cody Fisher",
      "note": "Adjusted motor mounts. Motor is warm but line is running. Put on watch."
    }
  }
  ```
- **Response**: Updated `Issue` object.

#### 5. Get AI Next Shift Needs to Know Summary
- **Endpoint**: `GET /issues/ai-summary`
- **Query Params**:
  - `role` (optional): `OPERATOR` | `MAINTENANCE` | `ADMIN` (Supervisor)
- **Response**:
  ```json
  {
    "summary": "Summary of critical risks, watches & repeat occurrences...",
    "bullets": [
      "Line 2 Electrical Panel: Escalating fault codes. High risk of unexpected Line A stoppage.",
      "Conveyor 2 Guide Rail: Under Watch/Monitoring with 8 jams this week.",
      "Line 2 Steam Line: Critical pressure drop currently under maintenance inspection."
    ]
  }
  ```

#### 6. Get Surfaced Recurring Issues
- **Endpoint**: `GET /issues/recurring`
- **Response**: Array of issues currently marked with `isRecurring: true`.

---

## 5. AI Engine & Prompt Guide (For Backend Implementation)

### Next Shift Needs to Know (LLM Generation)
When `GET /issues/ai-summary` is called:
1. Fetch all unresolved issues (`status` $\neq$ `Resolved`) and issues resolved during the current shift.
2. Group them by line/area and category.
3. Pass this structured text to your LLM (e.g. Gemini 1.5 Flash, GPT-4o) using this prompt structure:
   > **System Prompt:**
   > You are an AI manufacturing assistant. Generate a concise, highly specific shift handover brief for the incoming shift team. Do not use generic filler language. Group into bullet points representing:
   > 1. Urgent blockages (P1 Open issues or Escalations)
   > 2. Watch/Monitoring items (temporary fixes that could fail again)
   > 3. Repeat issues that happened multiple times this week.
   > Focus on operational continuation: What does the next shift crew *need to know* to prevent downtime?

### Recurring Issue Detection (Background Cron / Event Trigger)
- Run a lightweight frequency check whenever a new issue is reported.
- If the frequency of matching categories on the same line exceeds a threshold (e.g. 3 times in 48 hours or 5 times in a week):
  1. Set `isRecurring: true` on the issue.
  2. Synthesize a pattern description using a template or LLM: `"{Category} issue reported {Count} times this week on {Line}."`
  3. Mark `isEscalating: true` if the rate of recurrence is increasing.

---

For questions or database design alignment, reach out to the frontend team.
