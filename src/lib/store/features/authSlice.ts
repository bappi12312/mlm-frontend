import { clearAuthCookies, setAuthCookies,getAuthFromCookies } from "@/lib/utils/cookieUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
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

const initializeAuthState = () => {
  const { user, accessToken, refreshToken } = getAuthFromCookies();
  return {
    user: user,
    accessToken: accessToken,
    refreshToken: refreshToken,
    isAuthenticated: !!accessToken && !!refreshToken,
  };
};

const initialState: AuthState = initializeAuthState();

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
