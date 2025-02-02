// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./features/api/authApi";
import rootReducer from "./rootReducer";

// Server-safe store creation
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];



// // store.ts
// import { configureStore, Middleware } from "@reduxjs/toolkit";
// import { authApi } from "./features/api/authApi";
// import rootReducer from "./rootReducer";
// import { userLoggedIn, userLoggedOut } from "./features/authSlice";
// import { clearAuthCookies, setAuthCookies } from "../utils/cookieUtils";

// const authMiddleware: Middleware = store => next => action => {
//   if (userLoggedIn.match(action)) {
//     setAuthCookies(
//       action.payload.user,
//       action.payload.accessToken,
//       action.payload.refreshToken
//     );
//   }
  
//   if (userLoggedOut.match(action)) {
//     clearAuthCookies();
//   }
  
//   return next(action);
// };

// // Server-safe store creation
// export const makeStore = () => {
//   return configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware().concat(authApi.middleware, authMiddleware),
//     devTools: process.env.NODE_ENV !== "production",
//   });
// };

// export type RootState = ReturnType<typeof rootReducer>;
// export type AppStore = ReturnType<typeof makeStore>;
// export type AppDispatch = AppStore["dispatch"];