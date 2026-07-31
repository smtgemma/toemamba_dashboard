import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const issuesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIssues: builder.query({
      query: (params) => ({
        url: "/issues",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.issue],
    }),

    getIssueById: builder.query({
      query: (id) => ({
        url: `/issues/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.issue],
    }),

    submitIssue: builder.mutation({
      query: (data) => ({
        url: "/issues",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.issue],
    }),

    updateIssue: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/issues/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.issue],
    }),

    getAiSummary: builder.query({
      query: (params) => ({
        url: "/issues/ai-summary",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.issue],
    }),

    getRecurringIssues: builder.query({
      query: () => ({
        url: "/issues/recurring",
        method: "GET",
      }),
      providesTags: [tagTypes.issue],
    }),

    analyzeIssue: builder.mutation({
      query: (data) => ({
        url: "/issues/analyze",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.issue],
    }),

    assignIssue: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/issues/${id}/assign`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.issue],
    }),

    updateIssueStatus: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/issues/${id}/status-update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.issue],
    }),

    verifyIssue: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/issues/${id}/verify`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.issue],
    }),

    getAnalytics: builder.query({
      query: () => ({
        url: "/issues/analytics",
        method: "GET",
      }),
      providesTags: [tagTypes.issue],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useSubmitIssueMutation,
  useUpdateIssueMutation,
  useGetAiSummaryQuery,
  useGetRecurringIssuesQuery,
  useAnalyzeIssueMutation,
  useAssignIssueMutation,
  useUpdateIssueStatusMutation,
  useVerifyIssueMutation,
  useGetAnalyticsQuery,
} = issuesApi;
