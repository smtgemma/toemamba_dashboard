# 📘 Shyfty Phase 1 MVP - Frontend API Integration Guide

This documentation provides the complete API specification, payloads, response schemas, and code integration examples for frontend developers (React / Next.js / RTK Query / Axios).

---

## 🛠️ 1. Global Setup & Configurations

- **Base URL:** `http://<server-ip>:<port>/api/v1` (or via `process.env.NEXT_PUBLIC_BASE_URL`)
- **Default Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <accessToken>`
- **Swagger Documentation:** `http://<server-ip>:<port>/api/docs`

---

## 🔐 2. Authentication & Profile Flow

### 2.1 First-Time Login Password Setup (Admin Invitation)
When an invited user clicks their invitation link (`/setup-password?token=<token>`).

- **Endpoint:** `POST /api/v1/auth/setup-password`
- **Request Body:**
  ```json
  {
    "token": "invitation-jwt-token-string",
    "password": "secureNewPassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password setup successful"
  }
  ```

### 2.2 Reset Password
- **Endpoint:** `POST /api/v1/auth/reset-password`
- **Request Body:**
  ```json
  {
    "email": "user@shyfty.com",
    "token": "otp-token",
    "password": "brandNewPassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password reset successful"
  }
  ```

### 2.3 Update Self Profile
- **Endpoint:** `PATCH /api/v1/users/update-profile`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `fullName` (string): `"Jane Doe"`
  - `file` (binary, optional): Profile photo (PNG/JPG)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "id": "u123",
      "name": "Jane Doe",
      "email": "jane@shyfty.com",
      "profilePic": "https://s3.aws..."
    }
  }
  ```

---

## 🏭 3. Plant Configuration APIs (Shifts, Lines & Departments)

### 3.1 Production Lines Management

#### Get All Lines
- **Endpoint:** `GET /api/v1/lines`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "line-1",
        "name": "Line 5",
        "area": "Plant B",
        "status": "Active"
      }
    ]
  }
  ```

#### Create Line
- **Endpoint:** `POST /api/v1/lines`
- **Body:**
  ```json
  {
    "name": "Line 5",
    "area": "Plant B"
  }
  ```

#### Update Line Status
- **Endpoint:** `PATCH /api/v1/lines/:id/status`
- **Body:**
  ```json
  {
    "status": "Active" // or "Inactive"
  }
  ```

#### Delete Line
- **Endpoint:** `DELETE /api/v1/lines/:id`

---

### 3.2 Shifts Management

- **Get Shifts:** `GET /api/v1/shifts`
  - _Response:_ `[ { "id": "s1", "name": "1st Shift", "start": "06:00", "end": "14:00" } ]`
- **Add Shift:** `POST /api/v1/shifts`
  - _Body:_ `{ "name": "1st Shift", "start": "06:00", "end": "14:00" }`
- **Delete Shift:** `DELETE /api/v1/shifts/:id`

---

### 3.3 Departments Management

- **Get Departments:** `GET /api/v1/departments`
  - _Response:_ `[ { "id": "d1", "name": "Maintenance" } ]`
- **Add Department:** `POST /api/v1/departments`
  - _Body:_ `{ "name": "Maintenance" }`
- **Delete Department:** `DELETE /api/v1/departments/:id`

---

## 👥 4. User Invitation & Staff Management APIs

### 4.1 Invite / Create User (Admin)
- **Endpoint:** `POST /api/v1/users/create-user` (or `POST /api/v1/auth/invite-staff`)
- **Request Body:**
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@shyfty.com",
    "role": "SUPERVISOR", // "SUPERVISOR" | "OPERATOR" | "STAFF"
    "staffRole": "Maintenance", // "Maintenance" | "Safety" | "Production" | "Quality"
    "line": "Line 2",
    "shift": "1st Shift"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User invited successfully. Invitation email sent."
  }
  ```

### 4.2 Get All Users
- **Endpoint:** `GET /api/v1/users`
- **Query Params (Optional):** `?role=STAFF&search=Alex&page=1&limit=10`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": [
      {
        "id": "u3",
        "name": "Cody Fisher",
        "email": "cody@shyfty.com",
        "role": "STAFF",
        "staffRole": "Maintenance",
        "line": "Line 3",
        "shift": "2nd Shift",
        "status": "Active"
      }
    ]
  }
  ```

### 4.3 Update User Properties (Admin)
- **Endpoint:** `PATCH /api/v1/users/update-user/:id`
- **Body:** `{ "name": "Cody Fisher Updated", "line": "Line 4", "staffRole": "Safety" }`

### 4.4 Toggle User Active Status
- **Endpoint:** `PATCH /api/v1/users/update-status/:id`
- **Body:** `{ "status": "Active" }` // or `"Inactive"`

### 4.5 Delete User
- **Endpoint:** `DELETE /api/v1/users/:id`

---

## 🤖 5. Issue Management & Gemini AI Engine (Operational Heartbeat)

Issue creation is designed as a **Two-step Workflow**:

### Step 1: AI Handoff Preview & Analysis (No DB Write)
Process raw text, audio voice clips, or image OCR through Gemini 2.5 Flash AI to generate preview structure before saving.

- **Endpoint:** `POST /api/v1/issues/analyze`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `type` (string, required): `"text"` | `"voice"` | `"image"`
  - `content` (string, required if type="text"): `"Conveyor belt Line 2 is making a loud grinding noise..."`
  - `file` (binary, required if type="voice" or "image"): Audio WAV/MP3 or Image JPG/PNG file
  - `line` (string, required): `"Line 2"`
  - `shift` (string, required): `"1st Shift"`

- **Response (200 OK - Generated by Gemini AI):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "AI analysis completed",
    "data": {
      "extractedText": "Conveyor belt Line 2 is making a loud grinding noise. Maintenance was notified at 08:30...",
      "summary": "3 operational issues detected. 1 critical item requires immediate attention.",
      "detectedIssues": [
        {
          "title": "Line 2 stopped - motor failure",
          "priority": "P1"
        },
        {
          "title": "Material shortage - Line 4",
          "priority": "P2"
        },
        {
          "title": "Area cleanup pending",
          "priority": "P3"
        }
      ],
      "checklist": [
        "Maintenance to inspect motor (Line 2)",
        "Confirm material delivery ETA",
        "Complete housekeeping before next shift"
      ],
      "pendingQuestions": [
        "Was motor replacement completed?",
        "Has material arrived for Line 4?"
      ]
    }
  }
  ```

---

### Step 2: Final Handoff Submission (Saves to DB)
Save confirmed issue into the database.

- **Endpoint:** `POST /api/v1/issues`
- **Request Body:**
  ```json
  {
    "content": "Conveyor belt Line 2 is making a loud grinding noise...",
    "priority": "P1", // "P1" | "P2" | "P3"
    "category": "Maintenance",
    "line": "Line 2",
    "shift": "1st Shift",
    "date": "2026-07-30",
    "aiAnalysis": {
      "summary": "3 operational issues detected...",
      "checklist": [
        "Maintenance to inspect motor (Line 2)"
      ],
      "pendingQuestions": [
        "Was motor replacement completed?"
      ]
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Issue submitted successfully",
    "data": {
      "id": "issue-100",
      "content": "Conveyor belt Line 2 is making a loud grinding noise...",
      "line": "Line 2",
      "status": "Open",
      "priority": "P1",
      "carryoverAging": "Open across 1 shift"
    }
  }
  ```

---

### 5.3 Fetch Active Issues
- **Endpoint:** `GET /api/v1/issues`
- **Query Params:** `?status=Open&priority=P1&line=Line%202`
- **Response (200 OK):** Array of issue objects.

---

### 5.4 Fetch Single Issue Details (With Timeline History)
- **Endpoint:** `GET /api/v1/issues/:id`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "data": {
      "id": "issue-100",
      "content": "Conveyor belt Line 2 is making a loud grinding noise...",
      "priority": "P1",
      "status": "Open",
      "line": "Line 2",
      "shift": "1st Shift",
      "isTemporaryFix": false,
      "carryoverAging": "Open across 1 shift",
      "timeline": [
        {
          "id": "tl-1",
          "actorName": "Cody Fisher",
          "type": "handoff", // "assignment" | "status_change" | "temp_fix" | "handoff" | "resolution"
          "note": "Handoff issue submitted for Line 2",
          "createdAt": "2026-07-30T14:40:00.000Z"
        }
      ]
    }
  }
  ```

---

### 5.5 Assign Issue to Maintenance Staff
- **Endpoint:** `PATCH /api/v1/issues/:id/assign`
- **Request Body:**
  ```json
  {
    "staffCategory": "Maintenance",
    "assignedUserId": "u3",
    "note": "Assigned to Cody for guide rail calibration."
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Issue assigned successfully",
    "data": {
      "id": "issue-100",
      "status": "Open",
      "assignedTo": "Cody Fisher"
    }
  }
  ```

---

### 5.6 Update Issue Status & Log Temporary Fix
- **Endpoint:** `PATCH /api/v1/issues/:id/status-update`
- **Request Body:**
  ```json
  {
    "status": "Monitoring", // "Monitoring" | "In Progress" | "Resolved"
    "note": "Adjusted guide rails. Hum is gone, but keeping on Watch.",
    "isTemporaryFix": true
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Issue state updated",
    "data": {
      "id": "issue-100",
      "status": "Monitoring",
      "isTemporaryFix": true
    }
  }
  ```

---

## 📊 6. AI Insights & Plant Analytics APIs

### 6.1 Get Next Shift AI Summary
- **Endpoint:** `GET /api/v1/issues/ai-summary?role=OPERATOR` // OPERATOR | MAINTENANCE | ADMIN
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "summary": "Summary of critical risks, watches & repeat occurrences for incoming shift.",
      "bullets": [
        "Line 2 Electrical Panel: Escalating fault codes. Shutdown risk high.",
        "Conveyor 2 Guide Rail: Under Watch/Monitoring status. Jammed 8 times this week."
      ]
    }
  }
  ```

### 6.2 Get Surfaced Recurring Issues
- **Endpoint:** `GET /api/v1/issues/recurring`
- **Response (200 OK):** Array of recurring issue objects.

### 6.3 Plant KPIs & Analytics Graphs
- **Endpoint:** `GET /api/v1/issues/analytics`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "mttr": [
        { "name": "Mon", "value": 45 },
        { "name": "Tue", "value": 38 }
      ],
      "downtimeCauses": [
        { "name": "Electrical", "value": 400, "color": "#D92D20" }
      ],
      "shiftPerformance": [
        { "shift": "Shift 1", "issues": 12, "completion": 95 }
      ],
      "kpiMetrics": {
        "avgMttr": "32m",
        "avgResponseTime": "8.5m",
        "repeatIssueRate": "14%",
        "handoffCompletion": "91.4%"
      }
    }
  }
  ```

---

## 💻 7. Frontend Integration Code Examples (RTK Query / Axios)

### RTK Query Example (Redux Toolkit)

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shyftyApi = createApi({
  reducerPath: 'shyftyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Analyze Issue AI (Step 1)
    analyzeIssue: builder.mutation({
      query: (formData) => ({
        url: '/issues/analyze',
        method: 'POST',
        body: formData, // Multipart FormData
      }),
    }),

    // 2. Submit Issue (Step 2)
    submitIssue: builder.mutation({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
    }),

    // 3. Fetch Issues
    getIssues: builder.query({
      query: ({ status, priority, line }) => `/issues?status=${status || ''}&priority=${priority || ''}&line=${line || ''}`,
    }),

    // 4. Assign Issue
    assignIssue: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}/assign`,
        method: 'PATCH',
        body,
      }),
    }),

    // 5. Update Status & Temp Fix Log
    updateIssueStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}/status-update`,
        method: 'PATCH',
        body,
      }),
    }),

    // 6. Get Analytics Graph Data
    getAnalytics: builder.query({
      query: () => '/issues/analytics',
    }),
  }),
});

export const {
  useAnalyzeIssueMutation,
  useSubmitIssueMutation,
  useGetIssuesQuery,
  useAssignIssueMutation,
  useUpdateIssueStatusMutation,
  useGetAnalyticsQuery,
} = shyftyApi;
```
