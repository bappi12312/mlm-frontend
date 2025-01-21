import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "./features/api/authApi";
import authSlice from "./features/authSlice";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  auth: authSlice,
});

export default rootReducer;