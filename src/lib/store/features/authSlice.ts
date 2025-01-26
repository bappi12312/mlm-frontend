import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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

const initialState: UserState = {
  user: null,
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

interface userLoggedInPayload {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}
// export interface AuthState {
//   isAuthenticated: boolean;
//   user: any;
// }

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<userLoggedInPayload>) => {
      state.user = action.payload.user || null;
      state.accessToken = action.payload.accessToken || null;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;

      Cookies.set("accessToken", action.payload.accessToken || "");
      Cookies.set("refreshToken", action.payload.refreshToken || "");
    },
    userLoggedOut: (state) => {
      Object.assign(state, initialState);

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");

      // redirect to login page
      const navigate = useRouter()
      navigate.push("/login")
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { userLoggedIn, userLoggedOut,setError,setLoading,resetState } = authSlice.actions;
export default authSlice.reducer;
