// utils/cookieUtils.ts
import Cookies from "js-cookie";
import { User } from "../store/features/authSlice";

// ✅ Set cookies on the client side
export const setAuthCookies = (user: User, accessToken: string, refreshToken: string) => {
  Cookies.set("user", JSON.stringify(user), { expires: 7 });
  Cookies.set("accessToken", accessToken, { expires: 7 });
  Cookies.set("refreshToken", refreshToken, { expires: 7 });
};

// ✅ Clear cookies on the client side
export const clearAuthCookies = () => {
  Cookies.remove("user");
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

// ✅ Get cookies on the client side
export const getAuthFromCookies = () => {
  const userCookie = Cookies.get("user");
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  return {
    user: userCookie ? JSON.parse(userCookie) : null,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
  };
};
