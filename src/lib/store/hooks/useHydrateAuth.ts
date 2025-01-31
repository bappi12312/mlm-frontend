import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/authSlice";
import { getAuthFromCookies } from "./useGetAuthFromCookies";

export function useHydrateAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const hydrateAuth = async () => {
      const authState = await getAuthFromCookies(); // Fetch cookies on client-side

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
