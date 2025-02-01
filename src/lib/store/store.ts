// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/api/authApi";
import rootReducer from "./rootReducer";
import { getAuthFromCookies } from "@/lib/utils/cookieUtils";

// Server-side compatible store creation
export const makeStore = () => {
  // Get initial state from cookies on client side
  const preloadedState = typeof window !== "undefined" ? {
    auth: {
      ...getAuthFromCookies(),
      isAuthenticated: !!getAuthFromCookies().accessToken
    }
  } : undefined;

  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST'], // If using redux-persist
          ignoredPaths: ['auth.user'] // Ignore non-serializable user data if needed
        }
      }).concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Type declarations
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

// Client-side store instance
export const initializeStore = () => makeStore();

// Server-side store should be created per request
export const serverStore = makeStore();