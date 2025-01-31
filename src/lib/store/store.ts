// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/api/authApi";
import rootReducer from "./rootReducer";

// Explicitly define store type
export const makeStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};


export type RootState = ReturnType<typeof rootReducer>;
// First define the type aliases
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

// Then declare the store variable
export const store = makeStore();