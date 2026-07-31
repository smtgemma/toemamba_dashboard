---

## 🔒 2. Role-Based Scopes & Data Leakage Prevention (`GET /api/v1/issues`)

The backend inspects the requesting user's JWT token payload (`userId`, `role`, `staffRole`, `line`) and automatically applies strict industrial data isolation:

### Role Visibility Rules:
1. **`SUPER_ADMIN` & `SUPERVISOR`**:
   - Full visibility across all plant issues, lines, shifts, and departments.
   - Allowed optional query parameters: `status`, `priority`, `line`, `staffCategory`, `assignedUserId`.
2. **`OPERATOR`**:
   - Can only view issues reported by themselves OR belonging to their assigned line.
3. **`MAINTENANCE` (Technicians)**:
   - Cannot view raw unassigned operator logs.
   - Can ONLY view issues assigned to their department (`staffCategory` / `staffRole`) OR directly assigned to their User ID (`assignedUserId`).

### Endpoint:
- **`GET /api/v1/issues`**
- **`GET /api/v1/issues/my-issues`** (Convenience endpoint for logged-in technician's assigned tasks)

#### Optional Query Filters (for Supervisors/Admins):
- `?status=Pending_Verification` (or `Open`, `In Progress`, `Monitoring`, `Resolved`)
- `?priority=P1` (or `P2`, `P3`)
- `?line=Line%202`
- `?staffCategory=Electrical`
- `?assignedUserId=u3_user_uuid` (or `assignedUserId=me`)

---

## 🎯 3. Issue Triage & Assignment (`PATCH /api/v1/issues/:id/assign`)

Supervisors triage raw issues and assign them to a department or specific technician.

- **Endpoint:** `PATCH /api/v1/issues/:id/assign`
- **Authorization:** `SUPERVISOR`, `SUPER_ADMIN`, `ADMIN`
- **Request Body (JSON):**
  ```json
  {
    "staffCategory": "Electrical", // Active Department Name (Mandatory)
    "assignedUserId": "u3_uuid_1234", // Optional: Specific technician ID
    "note": "Assigned to Cody for electrical motor inspection." // Mandatory (400 Bad Request if empty)
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Issue assigned successfully",
    "data": {
      "id": "issue-100",
      "status": "Open",
      "staffCategory": "Electrical",
      "assignedTo": "Cody Fisher"
    }
  }
  ```

---

## ⚙️ 4. Technician Status Update & State Transition Validations

Technicians update task progress as they work, watch, or complete repairs.

- **Endpoint:** `PATCH /api/v1/issues/:id/status-update`
- **Request Body (JSON):**
  ```json
  {
    "status": "In Progress" | "Monitoring" | "Pending_Verification",
    "note": "Temporary wrap applied to leak. Machine put on Watch.", // Mandatory (400 Bad Request if empty)
    "isTemporaryFix": true // Required if status is "Monitoring"
  }
  ```

### Backend Validations:

1. **Validation 1 (Mandatory Note):** `note` must not be empty. Backend rejects with `400 Bad Request` if missing.
2. **Validation 2 (Watch State Control):** If `status === "Monitoring"`, `isTemporaryFix` MUST be `true`. Backend rejects with `400 Bad Request` if `isTemporaryFix` is not true.
3. **Validation 3 (Handoff Reset):** If `status === "Pending_Verification"` (or `"Resolved"`), backend automatically sets `isTemporaryFix = false`.

---

## 🔍 5. Supervisor Verification Sign-off (`PATCH /api/v1/issues/:id/verify`) [NEW!]

To prevent quality gaps on the shop floor, technicians cannot directly close a ticket. They set status to `"Pending_Verification"`. Supervisors/Admins perform floor audit and trigger sign-off:

- **Endpoint:** `PATCH /api/v1/issues/:id/verify`
- **Authorization:** `SUPERVISOR`, `SUPER_ADMIN`, `ADMIN`
- **Request Body (JSON):**
  ```json
  {
    "approved": true, // true = Approve & Resolve, false = Reject & Re-open
    "note": "Checked motor. Temperature is normal. Certified line for production." // Mandatory
  }
  ```

### Scenario A: Supervisor Approves Fix (`approved: true`)

- **Backend Action:** Sets `status = "Resolved"`, records `verifiedBy` & `verificationNote`, appends `"resolution"` timeline log.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Issue fix approved and resolved",
    "data": {
      "id": "issue-100",
      "status": "Resolved",
      "verifiedBy": "Supervisor Name",
      "verificationNote": "Checked motor. Temperature is normal..."
    }
  }
  ```

### Scenario B: Supervisor Rejects Fix (`approved: false`)

- **Backend Action:** Reverts `status = "In Progress"` (or `"Open"`), appends `"rejection"` timeline log detailing failure reasons.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Issue fix rejected and re-opened",
    "data": {
      "id": "issue-100",
      "status": "In Progress",
      "rejectionNote": "Rejected: Motor heating issue still persists."
    }
  }
  ```

---

## 🤖 6. Two-Step AI Issue Creation Workflow

### Step 1: AI Analysis & Extraction (No DB Write)

- **Endpoint:** `POST /api/v1/issues/analyze`
- **Content-Type:** `multipart/form-data`
- **Payload:**
  - `type`: `"text"` | `"voice"` | `"image"`
  - `content`: Raw text (if type="text")
  - `file`: Audio WAV/MP3 or Photo JPG/PNG (if type="voice" or "image")
  - `line`: `"Line 2"`
  - `shift`: `"1st Shift"`
- **Response (200 OK - Gemini 2.5 Flash Powered):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "AI analysis completed",
    "data": {
      "extractedText": "Conveyor belt Line 2 is making a loud grinding noise...",
      "summary": "3 operational issues detected. 1 critical item requires immediate attention.",
      "detectedIssues": [
        { "title": "Line 2 stopped - motor failure", "priority": "P1" },
        { "title": "Material shortage - Line 4", "priority": "P2" }
      ],
      "checklist": ["Maintenance to inspect motor (Line 2)"],
      "pendingQuestions": ["Was motor replacement completed?"]
    }
  }
  ```

### Step 2: Final Handoff Submission (Saves to DB)

- **Endpoint:** `POST /api/v1/issues`
- **Payload:**
  ```json
  {
    "content": "Conveyor belt Line 2 is making a loud grinding noise...",
    "priority": "P1",
    "category": "Maintenance",
    "line": "Line 2",
    "shift": "1st Shift",
    "date": "2026-07-31",
    "aiAnalysis": {
      "summary": "3 operational issues detected...",
      "checklist": ["Maintenance to inspect motor (Line 2)"],
      "pendingQuestions": ["Was motor replacement completed?"]
    }
  }
  ```

---

## 🏭 7. Plant Configuration & Staff Management APIs

### 7.1 Plant Lines

- `GET /api/v1/lines`
- `POST /api/v1/lines` -> `{ "name": "Line 5", "area": "Plant B" }`
- `PATCH /api/v1/lines/:id/status` -> `{ "status": "Active" | "Inactive" }`
- `DELETE /api/v1/lines/:id`

### 7.2 Shifts

- `GET /api/v1/shifts` -> Returns `[ { "id": "s1", "name": "1st Shift", "start": "06:00", "end": "14:00" } ]`
- `POST /api/v1/shifts` -> `{ "name": "1st Shift", "start": "06:00", "end": "14:00" }`
- `DELETE /api/v1/shifts/:id`

### 7.3 Departments

- `GET /api/v1/departments` -> Returns `[ { "id": "d1", "name": "Maintenance" } ]`
- `POST /api/v1/departments` -> `{ "name": "Maintenance" }`
- `DELETE /api/v1/departments/:id`

### 7.4 Invite / Create Staff (Admin)

- `POST /api/v1/users/create-user` (Sends invitation email with token)
- **Payload:**
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@shyfty.com",
    "role": "SUPERVISOR", // "SUPERVISOR" | "OPERATOR" | "MAINTENANCE"
    "staffRole": "Maintenance",
    "line": "Line 2",
    "shift": "1st Shift"
  }
  ```

### 7.5 Setup Password (Invited User First Login)

- `POST /api/v1/auth/setup-password` -> `{ "token": "jwt-token-string", "password": "newSecurePassword123" }`

---

## 💻 8. RTK Query Frontend Integration Code Snippet

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const shyftyApi = createApi({
  reducerPath: "shyftyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Fetch Issues with Role Scoping
    getIssues: builder.query({
      query: (params) => ({
        url: "/issues",
        params, // { status, priority, line, staffCategory, assignedUserId }
      }),
    }),

    // 2. Fetch My Assigned Issues
    getMyIssues: builder.query({
      query: () => "/issues/my-issues",
    }),

    // 3. Triage / Assign Issue (Supervisor)
    assignIssue: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}/assign`,
        method: "PATCH",
        body,
      }),
    }),

    // 4. Update Status (Technician)
    updateStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}/status-update`,
        method: "PATCH",
        body,
      }),
    }),

    // 5. Verify Sign-off (Supervisor Approve/Reject) [NEW]
    verifyIssueFix: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}/verify`,
        method: "PATCH",
        body, // { approved: true|false, note: "..." }
      }),
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetMyIssuesQuery,
  useAssignIssueMutation,
  useUpdateStatusMutation,
  useVerifyIssueFixMutation,
} = shyftyApi;
```
