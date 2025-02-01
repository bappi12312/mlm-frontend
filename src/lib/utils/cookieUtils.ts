// utils/cookieUtils.ts
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { User } from "../store/features/authSlice";

// ✅ Set cookies on the client side
// lib/utils/cookieUtils.ts
export const setAuthCookies = (
  user: User, 
  accessToken: string, 
  refreshToken: string
) => {
try {
  setCookie("user", JSON.stringify(user), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
  });
  setCookie("accessToken", accessToken, {
    path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  setCookie("refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24 * 40, // 40 days
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  })
} catch (error) {
  console.error("Error setting auth cookies:", error);
}
};

// ✅ Clear cookies on the client side
export const clearAuthCookies = async() => {
 try {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
 } catch (error) {
  
 }
};

// ✅ Get cookies on the client side
export const getAuthFromCookies = () => {
  try {
    return {
      accessToken: getCookie("accessToken")?.toString() || null,
      refreshToken: getCookie("refreshToken")?.toString() || null,
      user: JSON.parse(getCookie("user")?.toString() || "null")
    };
  } catch (error) {
    return {
      accessToken: null,
      refreshToken: null,
      user: null
    };
  }
};
