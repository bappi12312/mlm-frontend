import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

interface User {
  _id: string;
  name: string;
  email: string;
  referredBy?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  role?: string;
  downline?: string[];
  transactions?: string[];
}

interface RegisterResponse {
  user: User;
  message?: string; // Add the message property
}

interface LoginResponse {
  user: User;
  accessToken: string;
  message?: string; // Add the message property
}

interface UpdateResponse {
  user: User;
  message?: string;
}
const USER_API = "https://mlm-sebsite-backend.onrender.com/api/v1/users/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: USER_API, credentials: "include" }),
  tagTypes: ["User"], // Add the User tag type for caching
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      RegisterResponse,
      { name: string; email: string; password: string; referredBy: string }
    >({
      query: (credentials) => ({
        url: "register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    loginUser: builder.mutation<
      LoginResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result.data?.user;
          if (user) {
            dispatch(userLoggedIn({ user, token: result.data?.accessToken }));
          }
        } catch (error: any) {
          console.error(
            error.data ? "Server error:" : "Client error:",
            error.message || error.data
          );
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
        } catch (error: any) {
          console.error(
            error.data ? "Server error:" : "Client error:",
            error.message || error.data
          );
        }
      },
    }),
    loadUser: builder.query<RegisterResponse, void>({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result.data?.user;
          if (user) {
            dispatch(userLoggedIn({ user }));
          }
        } catch (error: any) {
          console.error(
            error.data ? "Server error:" : "Client error:",
            error.message || error.data
          );
        }
      },
    }),
    updateUser: builder.mutation<UpdateResponse, Partial<User>>({
      query: (credentials) => ({
        url: "profile/update",
        method: "PATCH",
        body: credentials,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoadUserQuery,
  useLoginUserMutation,
  useUpdateUserMutation,
  useLogoutUserMutation,
} = authApi;
