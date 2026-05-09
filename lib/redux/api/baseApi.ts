import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypesList } from "../tagTypes";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "baseApi",

  tagTypes: tagTypesList,
  baseQuery: fetchBaseQuery({
    // baseUrl: 'https://a11809b32fe6.ngrok-free.app/api/v1',
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: () => ({}),
});
