import { userLoggedIn, userLoggedOut } from "../authSlice";
import { RootState } from "../../store";
import Cookies from "js-cookie";
import { createApi, fetchBaseQuery, FetchArgs, BaseQueryApi } from "@reduxjs/toolkit/query/react";
import {jwtDecode,JwtPayload} from "jwt-decode"

interface DecodedToken extends JwtPayload {
  exp?: number;
}

interface User {
  name: string;
  email: string;
  role: string;
  referalCode?: string;
  referredBy?: string | null;
  earnings?: number;
  directRecruit?: number;
  status: string;
  photo?: string;
  downline?: string[];
  _id: string;
  transactions?: string[];
  createdAt: string;
  updatedAt: string;
}

interface LoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  statusCode: number;
  data?: LoginData;
  message: string;
  success: boolean;
}

interface UpdateResponse {
  user: User;
  message?: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: "https://mlm-sebsite-backend.onrender.com/api/v1/users/",
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  const state = api.getState() as RootState;
  const accessToken = state.auth.accessToken || Cookies.get("accessToken");

  // Normalize the request arguments
  const requestArgs: FetchArgs = typeof args === 'string' 
    ? { url: args }
    : { ...args };

  // Convert headers to a plain object if they exist
  const headers = requestArgs.headers 
    ? normalizeHeaders(requestArgs.headers)
    : {};

  if (accessToken) {
    // Set the authorization header
    headers.authorization = `Bearer ${accessToken}`;

    // Decode the token to check expiration
    let decoded: DecodedToken;
    try {
      decoded = jwtDecode<DecodedToken>(accessToken);
    } catch (error) {
      console.error("Invalid token:", error);
      api.dispatch(userLoggedOut());
      return { error: { status: 401, message: "Invalid token" } };
    }

    const currentTime = Math.floor(Date.now() / 1000);

    // If token expires within 5 minutes, refresh it
    if ((decoded.exp || 0) - currentTime < 300) {
      const refreshToken = Cookies.get("refreshToken");

      if (refreshToken) {
        try {
          const refreshResult = await baseQuery(
            {
              url: "refresh-token",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const refreshData = refreshResult.data as LoginResponse;
            const newAccessToken = refreshData.data?.accessToken;
            const newRefreshToken = refreshData.data?.refreshToken;

            if (newAccessToken && newRefreshToken) {
              // Update state and cookies with new tokens
              api.dispatch(
                userLoggedIn({
                  user: state.auth.user || {} as User,
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken,
                })
              );

              Cookies.set("accessToken", newAccessToken, {
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });
              Cookies.set("refreshToken", newRefreshToken, {
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
              });

              // Update the authorization header with the new token
              headers.authorization = `Bearer ${newAccessToken}`;
            } else {
              throw new Error("Token refresh failed: No tokens returned");
            }
          } else {
            throw new Error("Token refresh failed: No data returned");
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          api.dispatch(userLoggedOut());
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          return { error: { status: 401, message: "Session expired" } };
        }
      } else {
        api.dispatch(userLoggedOut());
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        return { error: { status: 401, message: "No refresh token available" } };
      }
    }
  }

  // Assign the normalized headers back to the request
  requestArgs.headers = headers;

  // Perform the original request with the (possibly updated) headers
  const result = await baseQuery(requestArgs, api, extraOptions);

  // Handle 401 errors from API
  if (result.error && result.error.status === 401) {
    console.error("Unauthorized request:", result.error.data);
    api.dispatch(userLoggedOut());
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }

  return result;
};

// Helper function to normalize headers
function normalizeHeaders(headers: Headers | string[][] | Record<string, string | undefined>): Record<string, string> {
  if (headers instanceof Headers) {
    // Convert Headers instance to plain object
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  if (Array.isArray(headers)) {
    // Convert string[][] to plain object
    return headers.reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
  }

  // If it's already a plain object, just return it
  return headers as Record<string, string>;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Payment", "Stats"],
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      { user: User; message: string },
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
          const user = result.data?.data?.user;

          if (user) {
            dispatch(
              userLoggedIn({
                user: {
                  ...user,
                  referalCode: user.referalCode || "",
                  earnings: user.earnings || 0,
                  directRecruit: user.directRecruit || 0,
                  photo: user.photo || "",
                },
                accessToken: result.data.data?.accessToken || "",
                refreshToken: result.data.data?.refreshToken || "",
              })
            );
          }
        } catch (error: unknown) {
          console.error("Load user error:", error instanceof Error ? error.message : error);
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

          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");

          window.location.href = "/login";
        } catch (error: unknown) {
          console.error("Load user error:", error instanceof Error ? error.message : error);
        }
      },
    }),
    loadUser: builder.query<LoginResponse, void>({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result.data?.data?.user;

          if (user) {
            dispatch(
              userLoggedIn({
                user: {
                  ...user,
                  referalCode: user.referalCode || "",
                  earnings: user.earnings || 0,
                  directRecruit: user.directRecruit || 0,
                  photo: user.photo || "",
                },
                accessToken: result.data.data?.accessToken || "",
                refreshToken: result.data.data?.refreshToken || "",
              })
            );
          }
        } catch (error: unknown) {
          console.error("Load user error:", error instanceof Error ? error.message : error);
        }
      },
    }),
    updateUser: builder.mutation<UpdateResponse, Partial<User>>({
      query: (credentials) => ({
        url: "update-user",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    paymentCreation: builder.mutation<
      { message: string },
      { FromNumber: number; ToNumber: number; Amount: number }
    >({
      query: (credentials) => ({
        url: "payment-creation",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Payment"],
    }),
    getAllPayments: builder.query({
      query: () => ({
        url: "payments",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),
    getUserStats: builder.query({
      query: () => ({
        url: "stats",
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
    changePassword: builder.mutation({
      query: (credentials) => ({
        url: "change-password",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "get-all-users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    distributeCommission: builder.mutation<
      { message: string },
      { amount: number }
    >({
      query: (amount) => ({
        url: "distribute-commision",
        method: "PATCH",
        body: { amount: amount.amount },
      }),
      invalidatesTags: ["User"],
    }),
    requestPayment: builder.mutation<
      { message: string },
      { type: string; number: number; confirmNumber: number }
    >({
      query: (body) => ({
        url: "paymentRequest",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    confirmPayment: builder.mutation({
      query: (body) => ({
        url: "payment-confirmation",
        method: "PATCH",
        body,
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
  usePaymentCreationMutation,
  useGetAllPaymentsQuery,
  useGetUserStatsQuery,
  useChangePasswordMutation,
  useGetAllUsersQuery,
  useDistributeCommissionMutation,
  useRequestPaymentMutation,
  useConfirmPaymentMutation,
} = authApi;
