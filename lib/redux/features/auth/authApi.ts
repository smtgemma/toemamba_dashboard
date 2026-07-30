import Cookies from "js-cookie";
import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";
import { body } from "framer-motion/client";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (data) => ({
        url: "/auth/invite-staff",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],
    }),

    setupPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/setup-password",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],
    }),

    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],

      // set the user in the store after successful login
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          Cookies.set("token", result.data.data.accessToken);
          localStorage.setItem("token", result.data.data.accessToken);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    getMe: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: [tagTypes.artwork],
    }),

    forgetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],
    }),

    verifyResetPassOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-reset-password-otp",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [tagTypes.me],
    }),
  }),
});

export const {
  useAddUserMutation,
  useGetMeQuery,
  useLoginMutation,
  useSetupPasswordMutation,
  useForgetPasswordMutation,
  useVerifyResetPassOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = authApi;
