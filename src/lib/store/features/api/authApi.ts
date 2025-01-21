import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8000/api/v1/user/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: USER_API, credentials: "include" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result.data?.user;
          dispatch(userLoggedIn({ user }));
        } catch (error: any) {
          if ("data" in error) {
            console.error("Server error:", error.data); // Server-side error
          } else {
            console.error("Client error:", error.message); // Client-side error
          }
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error:any) {
          if ('data' in error) {
            console.error('Server error:', error.data); // Server-side error
          } else {
            console.error('Client error:', error.message); // Client-side error
          }
        }
      },
    }),
    loadUser: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result.data?.user;
          dispatch(userLoggedIn({ user }));
        } catch (error:any) {
          if ('data' in error) {
            console.error('Server error:', error.data); // Server-side error
          } else {
            console.error('Client error:', error.message); // Client-side error
          }
        }
      },
    }),
    updateUser: builder.mutation({
      query: (credentials) => ({
        url: "profile/update",
        method: "PUT",
        body: credentials,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
} = authApi;
