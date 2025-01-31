import { NextResponse } from "next/server";
import Cookies from "js-cookie";

export async function GET(request: Request) {
  const accessToken = Cookies.get("accessToken") || null;
  const refreshToken = Cookies.get("refreshToken") || null;
  const user = Cookies.get("user")
    ? JSON.parse(Cookies.get("user")!)
    : null;

  return NextResponse.json({
    user,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
  });
}