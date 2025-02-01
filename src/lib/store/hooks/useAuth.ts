"use client"; // Essential for Next.js App Router

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLoadUserQuery } from "../features/api/authApi";
import { userLoggedIn, userLoggedOut } from "../features/authSlice";
import { clearAuthCookies, getAuthFromCookies, setAuthCookies } from "@/lib/utils/cookieUtils";
import { validateToken } from "@/lib/utils/authUtils"; // Add token validation

const useAuth = () => {
  const dispatch = useDispatch();
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // Only fetch after client-side check
  const { data, isSuccess, isError } = useLoadUserQuery(undefined, {
    skip: !shouldFetch,
  });

  useEffect(() => {
    // Client-side only initialization
    if (typeof window === "undefined") return;

    const { accessToken, refreshToken } = getAuthFromCookies();
    
    // Validate tokens before fetching
    if (validateToken(accessToken) && validateToken(refreshToken)) {
      setShouldFetch(true);
    } else {
      dispatch(userLoggedOut());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && data?.data) {
      // Update both store and cookies with fresh tokens
      dispatch(userLoggedIn(data.data));
      setAuthCookies(
        data.data?.user,
        data.data.accessToken, 
        data.data.refreshToken
      );
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(userLoggedOut());
      clearAuthCookies();
    }
  }, [isError, dispatch]);
};

export default useAuth;