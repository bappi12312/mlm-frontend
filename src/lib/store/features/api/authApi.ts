import { userLoggedIn, userLoggedOut } from "../authSlice";
import { RootState } from "../../store";
import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import { clearAuthCookies, setAuthCookies } from "@/lib/utils/cookieUtils";
import { deleteCookie, getCookie } from "cookies-next";
import { Link } from "@/types/types";

export interface User {
  _id: string;
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
  transactions?: string[];
  createdAt: string;
  updatedAt: string;
  isPayForCourse?: boolean;
  isPay: boolean;
  isAffiliate: boolean;
  affiliateBalance: number;
  affiliateSales: [];
  uplines: string[];
  pakageLink: Link[];
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

export const url = "https://mlm-sebsite-backend.onrender.com/api/v1/users";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://mlm-sebsite-backend.onrender.com/api/v1/users/",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    const token =
      (getState() as RootState).auth.accessToken || getCookie("accessToken");
      
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  const state = api.getState() as RootState;
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken =
      (api.getState() as RootState).auth.refreshToken ||
      state.auth.refreshToken ||
      getCookie("refreshToken");

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.error) {
        api.dispatch(userLoggedOut());
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        return refreshResult;
      }

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = (
          refreshResult.data as LoginResponse
        ).data!;

        const userResult = await baseQuery(
          { url: "profile" },
          api,
          extraOptions
        );
        const userData = (userResult.data as LoginResponse).data!.user as User;

        api.dispatch(
          userLoggedIn({
            user: userData || (state.auth.user as User),
            accessToken,
            refreshToken: newRefreshToken,
          })
        );

        setAuthCookies(state.auth.user as User, accessToken, newRefreshToken);

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(userLoggedOut());
        clearAuthCookies();
      }
    } else {
      api.dispatch(userLoggedOut());
      clearAuthCookies();
    }
  }

  return result;
};

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
      invalidatesTags: ["User"]
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
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          if (result.data?.data) {
            if (result.data.success && result.data.data) {
              const { accessToken, refreshToken, user } = result.data.data;
              // Remove non-null assertions
              dispatch(userLoggedIn({ user, accessToken, refreshToken }));
              setAuthCookies(user, accessToken, refreshToken);
            }
          }
        } catch (error) {
          console.error(
            "Login error:",
            error instanceof Error ? error.message : error
          );
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => ({ url: "logout", method: "POST" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
          clearAuthCookies();
        } catch (error) {
          console.error(
            "Logout error:",
            error instanceof Error ? error.message : error
          );
        }
      },
    }),

    loadUser: builder.query<LoginResponse, void>({
      query: () => ({ url: "profile", method: "GET" }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            dispatch(
              userLoggedIn({
                user: data.data.user,
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
          }
        } catch (error) {
          dispatch(userLoggedOut());
          clearAuthCookies();
        }
      },
    }),

    updateUser: builder.mutation<{ message: string }, Partial<User>>({
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
        url: "getAllPayment",
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
