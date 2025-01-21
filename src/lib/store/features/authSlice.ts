import {createSlice} from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  user: any;
}

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    userLoggedIn: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const {userLoggedIn, userLoggedOut} = authSlice.actions;
export default authSlice.reducer;