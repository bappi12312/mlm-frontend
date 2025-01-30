import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/api/authApi";
import rootReducer from "./rootReducer";
import { userLoggedIn } from "./features/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};
const store = makeStore();
const initializeApp = async () => {
  try {
    const state = store.getState()
    if(!state.auth.isAuthenticated) {
      const result = await store.dispatch(authApi.endpoints.loadUser.initiate())

      if(result.data?.data?.user) {
        const user = result.data.data.user
        const accessToken = result.data.data.accessToken
        const refreshToken = result.data.data.refreshToken
        store.dispatch(
          userLoggedIn(
            {
              user,
              accessToken,
              refreshToken,
            }
          )
        )
      }
    }
  } catch (error) {
    console.error("Failed to load user:", error);
  }
};
initializeApp();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

