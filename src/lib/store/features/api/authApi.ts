import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";
import { RootState } from "../../store";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";

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

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const state = api.getState() as RootState;
  const accessToken = state.auth.accessToken || Cookies.get("accessToken");
  console.log(accessToken);
  

  // Check if the access token exists
  if (accessToken) {
    args.headers = args.headers || new Headers();
    args.headers.set("authorization", `Bearer ${accessToken}`);
    const decoded: any = jwtDecode(accessToken);
    
    const currentTime = Math.floor(Date.now() / 1000);
    

    // If token expires within 5 minutes, refresh it
    if (decoded.exp - currentTime < 300) {
      const refreshToken = Cookies.get("refreshToken");
      console.log(refreshToken);
      

      if (refreshToken) {
        try {
          const refreshResult = await fetchBaseQuery({
            baseUrl: "https://mlm-sebsite-backend.onrender.com/api/v1/users/",
          })(
            {
              url: "refresh-token",
              method: "POST",
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
              (refreshResult.data as LoginResponse).data || {};

            // Update state and cookies with new tokens
            api.dispatch(
              userLoggedIn({
                user: state.auth.user,
                accessToken: newAccessToken || "",
                refreshToken: newRefreshToken || "",
              })
            );

            Cookies.set("accessToken", newAccessToken || "", { secure: true, sameSite: "strict" });
            Cookies.set("refreshToken", newRefreshToken || "", { secure: true, sameSite: "strict" });

            args.headers = args.headers || new Headers();
            args.headers.set("authorization", `Bearer ${newAccessToken}`);
          } else {
            throw new Error("Token refresh failed");
          }
        } catch (error) {
          api.dispatch(userLoggedOut());
          console.error("Token refresh error:", error);
          api.dispatch(userLoggedOut());
          return { error: { status: 401, message: "Unauthorized" } };
        }
      } else {
        api.dispatch(userLoggedOut());
        return { error: { status: 401, message: "No refresh token available" } };
      }
    }
  }

  // If the access token is not expired, add it to the headers

  // Perform the original request with the (possibly updated) headers
  const response = await fetchBaseQuery({
    baseUrl: "https://mlm-sebsite-backend.onrender.com/api/v1/users/",
  })(args, api, extraOptions);

  if (response.error && response.error.status === 401) {
    console.error("Unauthorized request:", response.error.data);
    api.dispatch(userLoggedOut());
  }

  return response;
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
        } catch (error: any) {
          console.error("Login error:", error.message || error.data);
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
        } catch (error: any) {
          console.error("Logout error:", error.message || error.data);
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
        } catch (error: any) {
          console.error("Load user error:", error.message || error.data);
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
    paymentCreation: builder.mutation <
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
    distributeCommission: builder.mutation({
      query: (body) => ({
        url: "distribute-commision",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    requestPayment: builder.mutation({
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
