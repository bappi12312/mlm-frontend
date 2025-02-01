import { validateToken } from "../utils/authUtils";
import { getAuthFromCookies } from "../utils/cookieUtils";
import { userLoggedIn } from "./features/authSlice";
import { makeStore } from "./store";

// clientStore.ts
export const initializeClientStore = () => {
  const store = makeStore();
  
  if (typeof window !== "undefined") {
    const { user,accessToken, refreshToken } = getAuthFromCookies();
    
    // Narrow the type after validation
    if (accessToken && refreshToken && 
        validateToken(accessToken) && 
        validateToken(refreshToken)) {
      store.dispatch(userLoggedIn({
        user, // Will be populated via API
        accessToken: accessToken, // Now guaranteed to be string
        refreshToken: refreshToken // Now guaranteed to be string
      }));
    }
  }
  
  return store;
};