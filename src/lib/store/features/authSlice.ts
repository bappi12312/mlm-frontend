import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

interface UserState {
  user: User | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

interface UserLoggedInPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<UserLoggedInPayload>) => {
      const { user, accessToken, refreshToken } = action.payload;
      
      // Only persist to cookies on client side
      if (typeof window !== 'undefined') {
        if (accessToken) Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
        if (refreshToken) Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" });
        if (user) Cookies.set("user", JSON.stringify(user), { secure: true, sameSite: "strict" });
      }

      return {
        ...state,
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true
      };
    },
    userLoggedOut: (state) => {
      // Clear state
      
      // Clear cookies only on client side
      if (typeof window !== 'undefined') {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
      }
      
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false
      }
    },
    // ... other reducers
  },
});

// Hydrate state on client side only
export const hydrateAuth = () => {
  if (typeof window === 'undefined') return initialState;
  
  return {
    user: Cookies.get("user") ? JSON.parse(Cookies.get("user")!) : null,
    accessToken: Cookies.get("accessToken") || null,
    refreshToken: Cookies.get("refreshToken") || null,
    loading: false,
    error: null,
    isAuthenticated: !!Cookies.get("accessToken")
  };
};

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;