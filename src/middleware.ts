import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

const PUBLIC_ROUTES = ["/", "/login", "/register"];

function isValidToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return !!decoded;
  } catch (error) {
    return false;
  }
}

export function middleware(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    console.log(accessToken)
    const isPublicRoute = PUBLIC_ROUTES.includes(req.nextUrl.pathname);

    if (accessToken && !isValidToken(accessToken)) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      return response;
    }

    if (accessToken && ["/login", "/register"].includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!accessToken && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next(); // Fallback to allow the request to proceed
  }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};