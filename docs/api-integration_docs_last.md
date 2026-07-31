# 🤖 Shyfty Phase 1 MVP - Gemini AI Integration Guide for Frontend

This document explains how the frontend developer should integrate the Google Gemini 2.5 Flash AI Engine endpoints for Text, Voice Audio Clips, Image OCR Parsing, Next Shift AI Summaries, and Plant Analytics.

---

## 📌 Overview of AI Capabilities

1. Step 1 AI Analysis Engine (`POST /api/v1/issues/analyze`):
   - Parses raw text, uploaded voice audio clips (.wav/.mp3), or image OCR reports (.jpg/.png).
   - Powered live by Gemini 2.5 Flash.
   - Generates:
     - Summary: Concise high-level alert statement.
     - Detected Issues: Priority-routed failures (P1, P2, P3).
     - Action Checklist: Actionable tasks for incoming technicians/operators.
     - Pending Questions: Critical missing details to ask outgoing shift leads.
   - No Database Write: This is an interactive preview endpoint. The user can review/edit the AI output before submitting.

2. Step 2 Final Issue Submission (`POST /api/v1/issues`):
   - Saves the confirmed issue and AI analysis payload to the PostgreSQL database.

3. Next Shift AI Summary (`GET /api/v1/issues/ai-summary`):
   - Generates role-customized shift summaries (OPERATOR, MAINTENANCE, ADMIN) for incoming shift handovers using Gemini 2.5 Flash.

---

## 🛠 1. Step 1: AI Handoff Preview & Analysis (POST /api/v1/issues/analyze)

- Route: POST /api/v1/issues/analyze
- Headers:
  - Authorization: Bearer <accessToken>
  - Content-Type: multipart/form-data

### Request Body (FormData):

| Field Name | Type   | Description                                 | Required?                           |
| :--------- | :----- | :------------------------------------------ | :---------------------------------- |
| type       | string | "text" \| "voice" \| "image"                | Yes                                 |
| line       | string | e.g. "Line 2"                               | Yes                                 |
| shift      | string | e.g. "1st Shift"                            | Yes                                 |
| content    | string | Text report description                     | Required if type="text"             |
| file       | File   | Audio file (.wav/.mp3) or Image (.jpg/.png) | Required if type="voice" or "image" |

---

### 💻 Frontend React / Axios Upload Snippet:

import axios from 'axios';

// 1. Analyzing Voice Clip / Image OCR / Text
export const analyzeIssueWithAI = async (params: {
type: 'text' | 'voice' | 'image';
line: string;
shift: string;
content?: string;
file?: File;
}) => {
const token = localStorage.getItem('token');
const formData = new FormData();

formData.append('type', params.type);
formData.append('line', params.line);
formData.append('shift', params.shift);

if (params.content) {
formData.append('content', params.content);
}
if (params.file) {
formData.append('file', params.file); // Upload audio or image file
}

const response = await axios.post(
`${process.env.NEXT_PUBLIC_BASE_URL}/issues/analyze`,
formData,
{
headers: {
Authorization: `Bearer ${token}`,
'Content-Type': 'multipart/form-data',
},
}
);

return response.data;
};

---

### 📩 Live Gemini 2.5 Flash Response (200 OK):

{
"success": true,
"statusCode": 200,
"message": "AI analysis completed",
"data": {
"extractedText": "Conveyor belt Line 2 is making a loud grinding noise near motor housing...",
"summary": "2 operational issues detected. 1 critical item requires immediate attention.",
"detectedIssues": [
{
"title": "Line 2 stopped - critical motor housing failure",
"priority": "P1"
},
{
"title": "Material shortage - Line 2",
"priority": "P2"
}
],
"checklist": [
"Maintenance to inspect motor & electrical connections (Line 2)",
"Confirm material delivery ETA & check fluid levels"
],
"pendingQuestions": [
"Was emergency stop triggered or automatic thermal trip?",
"Has material refill arrived for Line 2?"
]
}
}

---

## 💾 2. Step 2: Final Handoff Submission (POST /api/v1/issues)

After the user reviews the AI preview from Step 1, the frontend sends the confirmed payload to be saved in the DB:

- Route: POST /api/v1/issues
- Headers: Content-Type: application/json, Authorization: Bearer <token>
- Request Body:
  ```json
  {
    "content": "Conveyor belt Line 2 is making a loud grinding noise near motor housing...",
    "priority": "P1", // "P1" | "P2" | "P3"
    "category": "Maintenance",
    "line": "Line 2",
    "shift": "1st Shift",
    "date": "2026-07-31",
    "aiAnalysis": {
      "summary": "2 operational issues detected. 1 critical item requires immediate attention.",
      "checklist": [
        "Maintenance to inspect motor & electrical connections (Line 2)"
      ],
      "pendingQuestions": [
        "Was emergency stop triggered or automatic thermal trip?"
      ]
    }
  }
  ```

---

## 📊 3. Next Shift AI Summary (GET /api/v1/issues/ai-summary)

Generates AI summaries tailored for the incoming shift depending on their role.

- Route: GET /api/v1/issues/ai-summary?role=MAINTENANCE
- Roles: OPERATOR | MAINTENANCE | ADMIN
- Response Schema:
  ```json
  {
    "success": true,
    "data": {
      "summary": "Summary of critical risks, watches & repeat occurrences for incoming shift (MAINTENANCE view).",
      "bullets": [
        "Line 2: High priority alert - Conveyor belt motor heating. Shutdown risk high.",
        "Line 2 Guide Rail: Under Watch/Monitoring status. Jammed 8 times this week."
      ]
    }
  }
  ```

---

## 📈 4. Surfaced Recurring Issues & Plant Analytics

### 4.1 Surfaced Recurring Issues

- Route: GET /api/v1/issues/recurring
- Response: Returns P1 stoppage risks & repeat occurrences.

### 4.2 Plant KPIs & Analytics Graphs

- Route: GET /api/v1/issues/analytics
- Response Schema:
  ```json
  {
    "success": true,
    "data": {
      "mttr": [
        { "name": "Mon", "value": 45 },
        { "name": "Tue", "value": 38 }
      ],
      "downtimeCauses": [
        { "name": "Electrical", "value": 400, "color": "#D92D20" },
        { "name": "Mechanical", "value": 280, "color": "#F79009" }
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

## 💻 5. Complete RTK Query Code for AI Endpoints

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aiIssuesApi = createApi({
reducerPath: 'aiIssuesApi',
baseQuery: fetchBaseQuery({
baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1',
prepareHeaders: (headers) => {
const token = localStorage.getItem('token');
if (token) headers.set('authorization', `Bearer ${token}`);
return headers;
},
}),
endpoints: (builder) => ({
// 1. Analyze Input (Multipart FormData for Voice/Image/Text)
analyzeIssue: builder.mutation({
query: (formData) => ({
url: '/issues/analyze',
method: 'POST',
body: formData, // Pass FormData directly
}),
}),

    // 2. Submit Final Issue
    submitIssue: builder.mutation({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
    }),

    // 3. Get Next Shift AI Summary
    getNextShiftAiSummary: builder.query({
      query: (role = 'OPERATOR') => `/issues/ai-summary?role=${role}`,
    }),

    // 4. Get Plant Analytics
    getAnalytics: builder.query({
      query: () => '/issues/analytics',
    }),

}),
});

export const {
useAnalyzeIssueMutation,
useSubmitIssueMutation,
useGetNextShiftAiSummaryQuery,
useGetAnalyticsQuery,
} = aiIssuesApi;
