import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/authSlice";
import { getAuthFromCookies } from "@/lib/utils/cookieUtils";

export function useHydrateAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrateAuth = async () => {
      const authState = getAuthFromCookies(); // Fetch cookies on client-side


      if (authState.user) {
        dispatch(
          userLoggedIn({
            user: authState.user,
            accessToken: authState.accessToken || "",
            refreshToken: authState.refreshToken || "",
          })
        );
      }
    };

    hydrateAuth();
  }, [dispatch]);
}
