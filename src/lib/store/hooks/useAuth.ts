// hooks/useAuth.ts
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoadUserQuery } from "../features/api/authApi";
import { userLoggedIn, userLoggedOut } from "../features/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useLoadUserQuery();

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(userLoggedIn(data.data));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(userLoggedOut());
    }
  }, [isError, dispatch]);
};

export default useAuth;