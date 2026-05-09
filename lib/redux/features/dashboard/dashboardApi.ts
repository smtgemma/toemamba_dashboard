import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShifts: builder.query({
      query: () => ({
        url: "/shifts",
        method: "GET",
      }),
      providesTags: [tagTypes.artwork], // Using available tag or should add new ones
    }),
    addShift: builder.mutation({
      query: (data) => ({
        url: "/shifts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.artwork],
    }),
    deleteShift: builder.mutation({
      query: (id) => ({
        url: `/shifts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.artwork],
    }),
    getLines: builder.query({
      query: () => ({
        url: "/lines",
        method: "GET",
      }),
      providesTags: [tagTypes.artwork],
    }),
    addLine: builder.mutation({
      query: (data) => ({
        url: "/lines",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.artwork],
    }),
    updateLineStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/lines/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [tagTypes.artwork],
    }),
    deleteLine: builder.mutation({
      query: (id) => ({
        url: `/lines/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.artwork],
    }),
  }),
});

export const { 
  useGetShiftsQuery,
  useAddShiftMutation,
  useDeleteShiftMutation,
  useGetLinesQuery,
  useAddLineMutation,
  useUpdateLineStatusMutation,
  useDeleteLineMutation
} = dashboardApi;
