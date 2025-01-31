import { useDispatch } from "react-redux";
import { useLoadUserQuery } from "../features/api/authApi";
import { useEffect, useState } from "react";
import { userLoggedIn } from "../features/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const { data, isSuccess } = useLoadUserQuery();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isSuccess && isHydrated && data?.data) {
      dispatch(userLoggedIn(data.data)); // Ensure data.data is not undefined
    }
  }, [isSuccess, isHydrated, dispatch, data]);

  return isHydrated;
};

export default useAuth;
