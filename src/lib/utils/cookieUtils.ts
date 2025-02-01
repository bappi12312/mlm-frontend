// utils/cookieUtils.ts
import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import { User } from "../store/features/authSlice";

// ✅ Set cookies on the client side
// lib/utils/cookieUtils.ts
export const setAuthCookies = async(
  user: User, 
  accessToken: string, 
  refreshToken: string
) => {
await  setCookie("user", JSON.stringify(user),{
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  console.log(accessToken,"access token cookie set");
  
await  setCookie("accessToken", accessToken, { 
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  await setCookie("refreshToken", refreshToken, { 
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
};

// ✅ Clear cookies on the client side
export const clearAuthCookies = async() => {
 await deleteCookie("user");
  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");
};

// ✅ Get cookies on the client side
export const getAuthFromCookies = async() => {
  const userCookie = await getCookie("user");
  const accessToken = await getCookie("accessToken");
  const refreshToken = await getCookie("refreshToken");

  return {
    user: userCookie ? JSON.parse(userCookie) : null,
    accessToken: accessToken?.toString() || null,
    refreshToken: refreshToken?.toString() || null,
  };
};
