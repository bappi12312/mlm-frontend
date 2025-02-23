import { clearAuthCookies, setAuthCookies } from "@/lib/utils/cookieUtils";
import { Link } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

interface UserLoggedInPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState, // Use static initial state
  reducers: {
    userLoggedIn: (state, action: PayloadAction<UserLoggedInPayload>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;

      // if (process.env.NODE_ENV === 'development') {
      //   console.log('Auth update:', { accessToken, refreshToken, user });
      // }
      setAuthCookies(user, accessToken, refreshToken);
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      clearAuthCookies();
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
