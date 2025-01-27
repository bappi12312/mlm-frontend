import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  name: string;
  email: string;
  role: string;
  referalCode?: string; // Optional
  referredBy?: string | null; // Optional
  earnings?: number; // Optional
  directRecruit?: number; // Optional
  status: string;
  photo?: string; // Optional
  downline?: string[]; // Optional
  _id: string;
  transactions?: string[]; // Optional
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: User | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const loadStateFromCookies = (): UserState  => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const user = Cookies.get("user");

  return {
    user: user ? JSON.parse(user) : null,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    loading: false,
    error: null,
    isAuthenticated: !!accessToken,
  };
};

const initialState: UserState = loadStateFromCookies();

interface UserLoggedInPayload {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<UserLoggedInPayload>) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      if (accessToken) {
        Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
      }

      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" });
      }

      if (user) {
        Cookies.set("user", JSON.stringify(user), { secure: true, sameSite: "strict" });
      }
    },
    userLoggedOut: () => {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      return { ...initialState, isAuthenticated: false };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { userLoggedIn, userLoggedOut, setLoading, setError, resetState } = authSlice.actions;
export default authSlice.reducer;
