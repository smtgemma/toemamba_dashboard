import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params,
        credentials: "include",
      }),
      providesTags: [tagTypes.user],
    }),

    getSingleUser: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: [tagTypes.user],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.me],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.user],
    }),

    changeStatus: builder.mutation({
      query: (id) => ({
        url: `/users/update-status/${id}`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.user],
    }),

    getCurrentUserCredits: builder.query({
      query: () => ({
        url: "/ListingPackage/user/credits",
        method: "GET",
        credentials: "include",
      }),
    }),
    getSingleArtistProfile: builder.query({
      query: ({ id }) => ({
        url: `/artworks/user/art-work/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getAllOrganization: builder.query({
      query: (params) => ({
        url: "/users/get-all/organizations",
        method: "GET",
        params,
        credentials: "include",
      }),
    }),
    deleteMyAccount: builder.mutation({
      query: (data) => ({
        url: "/users/delete/me",
        method: "DELETE",
        body: data,
        credentials: "include",
      }),
    }),
    applyForFeature: builder.mutation({
      query: (data) => ({
        url: "/new-voices/apply",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useGetAllUserQuery,
  useGetSingleUserQuery,
  useDeleteUserMutation,
  useChangeStatusMutation,
  useGetCurrentUserCreditsQuery,
  useGetSingleArtistProfileQuery,
  useGetAllOrganizationQuery,
  useDeleteMyAccountMutation,
  useApplyForFeatureMutation,
} = userApi;
