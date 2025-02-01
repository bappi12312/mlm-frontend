"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../features/authSlice";
import { getAuthFromCookies } from "@/lib/utils/cookieUtils";


export function useHydrateAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const { accessToken, refreshToken, user } = getAuthFromCookies();
    
    if (accessToken && refreshToken) {
      dispatch(userLoggedIn({
        user: user || null,
        accessToken,
        refreshToken
      }));
    }
  }, [dispatch]);
}