export const getAuthFromCookies = async () => {
  if (typeof window === "undefined") return { user: null, accessToken: null, refreshToken: null };

  const cookieStore = document.cookie; // Read client-side cookies
  const cookiesObj = Object.fromEntries(
    cookieStore.split("; ").map((c) => c.split("="))
  );

  return {
    user: cookiesObj.user ? JSON.parse(decodeURIComponent(cookiesObj.user)) : null,
    accessToken: cookiesObj.accessToken || null,
    refreshToken: cookiesObj.refreshToken || null,
  };
};
