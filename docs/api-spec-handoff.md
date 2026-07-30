# Shyfty - Backend API Specification Handoff (Phase 1 MVP)

This document specifies the complete REST API interface required for the **Shyfty Shift Continuity & Plant Memory Layer**. The backend developer should implement these endpoints to match the frontend Redux Toolkit (RTK) Query queries and mutations.

---

## 1. Global Specifications

- **Base URL:** `http://<server-ip>:<port>/api/v1` (Resolvable via `process.env.NEXT_PUBLIC_BASE_URL` on the frontend).
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <accessToken>` (Must be read from HTTP cookies or headers).
- **Credentials:** Cookies should be configured as `include` (with `SameSite=None` or `Lax` as appropriate).

---

## 2. Authentication & Profile Flow

### 2.2 First-Time Login (Set/Setup Password) when admin invite

Invited users use this endpoint to set their password via the link sent to their email.

- **Route:** `POST /auth/setup-password`
- **Request Body:**
  ```json
  {
    "token": "invitation-jwt-token-string",
    "password": "secureNewPassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Password setup successful"
  }
  ```

### 2.5 Reset Password

Apply the new password using the reset token.

- **Route:** `POST /auth/reset-password`
- **Request Body:**
  ```json
  {
    "email": "user@shyfty.com",
    "token": "otp-verification-token",
    "password": "brandNewPassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Password reset successful"
  }
  ```

### 2.7 Update User Profile (Self Update)

Allows users to modify their name or profile pictures.

- **Route:** `PATCH /users/update-profile`
- **Content-Type:** `multipart/form-data`
- **Payload:**
  - `fullName` (string): "Jane Doe Updated"
  - `file` (binary, optional): Profile photo file
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Profile updated successfully"
  }
  ```

---

## 3. Plant Configuration APIs (Shifts & Lines & Departments)

### 3.1 Shifts Management

- **Get Shifts:** `GET /shifts`
  - _Response:_ Array of shifts with properties `id`, `name`, `start`, `end`.
- **Add Shift:** `POST /shifts`
  - _Request Body:_
    ```json
    {
      "name": "1st Shift",
      "start": "06:00",
      "end": "14:00"
    }
    ```
- **Delete Shift:** `DELETE /shifts/:id`

### 3.2 Lines Management

- **Get Lines:** `GET /lines`
  - _Response:_ Array of lines with properties `id`, `name`, `status`, `area`.
- **Add Line:** `POST /lines`
  - _Request Body:_
    ```json
    {
      "name": "Line 5",
      "area": "Plant B"
    }
    ```
- **Update Line Status:** `PATCH /lines/:id/status`
  - _Request Body:_
    ```json
    {
      "status": "Active" | "Inactive"
    }
    ```
- **Delete Line:** `DELETE /lines/:id`

### 3.3 Departments Management (⚠️ New Entity Added for Factory Alignment)

- **Get Departments:** `GET /departments`
- **Add Department:** `POST /departments`
  - _Request Body:_
    ```json
    {
      "name": "Maintenance"
    }
    ```
- **Delete Department:** `DELETE /departments/:id`

---

## 4. User Invitation & Staff Management APIs

When adding users, the UI currently asks for `name`, `email`, `role`, `staffRole`, and `line`.

> [!IMPORTANT]
> **Shift Selection Added:** For shop-floor routing, a user must also be associated with a **Shift** during creation. The backend payload has been extended to support `shift` (Shift ID or Name).

### 4.1 Create/Invite User

Admin invites a user to the system. The backend must trigger an email containing a link to `/setup-password?token=<invitationToken>`.

- **Route:** `POST /users/create-user` (or `POST /auth/invite-staff`)
- **Request Body:**
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@shyfty.com",
    "role": "SUPERVISOR" | "OPERATOR" | "STAFF",
    "staffRole": "Maintenance" | "Safety" | "Production" | "Quality",
    "line": "Line 2",
    "shift": "1st Shift"
  }
  ```
  _(Note: `staffRole` is optional, required only if `role === 'STAFF'`)_
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User invited successfully. Invitation email sent."
  }
  ```

### 4.2 Get All Users

- **Route:** `GET /users`
- **Success Response (200 OK):**
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

### 4.3 Update User (Admin Override)

- **Route:** `PATCH /users/update-user/:id`
- **Request Body:** Same properties as `create-user` (all fields optional).

### 4.4 Toggle User Status

- **Route:** `PATCH /users/update-status/:id`
- **Request Body:**
  ```json
  {
    "status": "Active" | "Inactive"
  }
  ```

### 4.5 Delete User

- **Route:** `DELETE /users/:id`

---

## 5. Issue Management & Workflow Lifecycle

This represents the operational heartbeat of the application.

### 5.1 Create / Report Issue (Operator Flow)

Operators report issues in three ways: **Direct Text input**, **Voice notes** (audio recording), or **Image uploads** (for OCR text extraction).

To match the loading/processing states and structured summaries in the UI, this is designed as a **two-step workflow**:

1. **Analyze:** Parse the input (OCR/Audio transcribing) and run AI extraction to preview the detected issues, checklist, and pending questions.
2. **Submit:** Persist the confirmed data to the database.

#### Step 1: AI Handoff Preview & Analysis (No DB Write)

- **Route:** `POST /issues/analyze`
- **Content-Type:** `multipart/form-data`
- **Payload:**
  - `type` (string, required): `"text"` | `"voice"` | `"image"`
  - `content` (string, optional): Required if type is `"text"`.
  - `file` (binary, optional): Required if type is `"voice"` (audio file WAV/MP3) or `"image"` (photo/document JPG/PNG).
  - `line` (string, required): e.g., `"Line 2"`
  - `shift` (string, required): e.g., `"1st Shift"`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "AI analysis completed",
    "data": {
      "extractedText": "Conveyor belt Line 2 is making a loud grinding noise. Maintenance was notified at 08:30 but no one has arrived yet. Production rate dropped by 15%.",
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

#### Step 2: Final Handoff Submission (Saves to DB)

- **Route:** `POST /issues`
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "content": "Conveyor belt Line 2 is making a loud grinding noise...",
    "priority": "P1",
    "category": "Maintenance",
    "line": "Line 2",
    "shift": "1st Shift",
    "date": "2026-07-30",
    "aiAnalysis": {
      "summary": "3 operational issues detected. 1 critical item...",
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
- **Success Response (201 Created):**
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

### 🧠 5.1.1 AI Engine Prompt & Engine Handoff Guide

To ensure high-accuracy results, the backend developer must configure the AI engine (e.g. Gemini 1.5 Flash or GPT-4o) using the following specifications:

#### A. Pre-Processing (OCR & Transcription)

- **Voice input:** Process the uploaded audio using a Speech-to-Text service (e.g., Google Cloud Speech-to-Text). Ensure transcription captures mechanical terms accurately (e.g., "Conveyor", "PLC", "Hydraulic", "E-03 codes").
- **Image/OCR input:** Process the uploaded image using an OCR service (e.g., Google Cloud Vision API). Run text cleaning algorithms to format handwritten or printed shift notes into structured text.

#### B. LLM System Prompt (The Plant Memory Core)

Feed the extracted text (along with `line` and `shift` context) to the LLM using this strict prompt configuration:

> **System Instructions:**
> You are the Shift Continuity AI Assistant for the factory floor. Your goal is to parse raw shift handover logs and extract clean, structured actions to prevent information loss between shifts and reduce machine downtime.
>
> **Extraction Rules:**
>
> 1. **Extracted Text Summary:** Summarize the overall alert. (e.g., "X issues detected. Y requires immediate attention").
> 2. **Issue Detection & Priority Routing:** Find distinct operational failures and label them as:
>    - `P1`: Machine stopped, safety hazard, or immediate line stoppage risk.
>    - `P2`: Warm machinery, hums, minor leaks, warnings, or material issues.
>    - `P3`: Housekeeping, standard parameter checks, non-blocking items.
> 3. **Action Checklist:** List concrete, actionable tasks for the incoming team (e.g., "Verify sensor E-03 mount", "Confirm hydraulic oil levels").
> 4. **Pending Questions:** List critical details _missing_ from the report that the incoming shift needs to ask the outgoing operators (e.g., "How long was the motor warm?", "Was the belt clean?").
>
> **Response Output (Strict JSON format only):**
>
> ```json
> {
>   "summary": "string",
>   "detectedIssues": [
>     { "title": "string", "priority": "P1" | "P2" | "P3" }
>   ],
>   "checklist": ["string"],
>   "pendingQuestions": ["string"]
> }
> ```

### 5.2 Fetch Active Issues

Retrieve unresolved carryover items, watchlists, or resolved reports.

- **Route:** `GET /issues`
- **Query Parameters:**
  - `status` (optional): `Open` | `Monitoring` | `In Progress` | `Resolved`
  - `priority` (optional): `P1` | `P2` | `P3`
  - `line` (optional): e.g. `Line 2`
- **Response (200 OK):** Array of Issue objects.

### 5.3 Fetch Single Issue Details (With Timeline)

- **Route:** `GET /issues/:id`
- **Response (200 OK):** Single Issue object containing the `timeline` history events.

### 5.4 Assign Issue to Maintenance Staff (Supervisor/Admin Flow)

Supervisors assign open issues to specific technician departments or user IDs.

- **Route:** `PATCH /issues/:id/assign`
- **Request Body:**
  ```json
  {
    "staffCategory": "Maintenance",
    "assignedUserId": "u3",
    "note": "Assigned to Cody for guide rail calibration."
  }
  ```
- **Success Response (200 OK):**
  - _Timeline Action:_ Backend must append an `"assignment"` event to the issue's `timeline` array.
  ```json
  {
    "success": true,
    "message": "Issue assigned successfully",
    "data": {
      "id": "issue-99",
      "status": "Open",
      "assignedTo": "Cody Fisher"
    }
  }
  ```

### 5.5 Update Status & Logs (Staff / Maintenance Action Flow)

Technicians update work states and record handover logs.

- **Route:** `PATCH /issues/:id/status-update`
- **Request Body:**
  ```json
  {
    "status": "Monitoring" | "In Progress" | "Resolved",
    "note": "Adjusted guide rails. Hum is gone, but keeping on Watch.",
    "isTemporaryFix": true
  }
  ```
- **Success Response (200 OK):**
  - _Timeline Action:_ Backend maps `"status"` to appropriate timeline type (`temp_fix`, `handoff`, `resolution`) and logs the note under the actor user's name.
  ```json
  {
    "success": true,
    "message": "Issue state updated",
    "data": {
      "id": "issue-99",
      "status": "Monitoring",
      "isTemporaryFix": true
    }
  }
  ```

---

## 6. AI Insights & Analytics APIs

### 6.1 Get Next Shift AI Summary

- **Route:** `GET /issues/ai-summary`
- **Query Parameters:**
  - `role`: `OPERATOR` | `MAINTENANCE` | `ADMIN` (Supervisor)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "summary": "Summary of critical risks, watches & repeat occurrences...",
      "bullets": [
        "Line 2 Electrical Panel: Escalating fault codes. Shutdown risk high.",
        "Conveyor 2 Guide Rail: Under Watch/Monitoring status. Jammed 8 times this week."
      ]
    }
  }
  ```

### 6.2 Get Surfaced Recurring Issues

- **Route:** `GET /issues/recurring`
- **Success Response (200 OK):** Array of issues where `isRecurring` is calculated as `true`.

### 6.3 Plant KPIs & Analytics Graphs

- **Route:** `GET /issues/analytics`
- **Success Response (200 OK):**
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
