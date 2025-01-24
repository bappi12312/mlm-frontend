import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    name: string;
    email: string;
    role: string;
    referalCode: string;
    referredBy: string | null;
    earnings: number;
    directRecruit: number;
    status: string;
    photo: string;
    downline: string[];
    _id: string;
    transactions?: string[];
    createdAt: string;
    updatedAt: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}


const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};
export interface AuthState {
  isAuthenticated: boolean;
  user: any;
}

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<any>) => {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { userLoggedIn, userLoggedOut,setError,setLoading } = authSlice.actions;
export default authSlice.reducer;
