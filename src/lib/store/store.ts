import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/api/authApi";
import rootReducer from "./rootReducer";

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });
};
const store = makeStore();
const initializeApp = async () => {
  try {
    const result = await store.dispatch(authApi.endpoints.loadUser.initiate());
    if (result.error) {
      console.error("Failed to load user:", result.error);
    }
  } catch (error) {
    console.error("Failed to load user:", error);
  }
};
initializeApp();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
