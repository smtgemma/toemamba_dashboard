import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Define public paths (authentication pages)
  const isAuthPage =
    pathname.startsWith("/signin") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-otp");

  // Define protected paths
  const isProtectedRoute =
    pathname === "/" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/operator") ||
    pathname.startsWith("/project");

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to signin, passing current path as redirect query param
      const signinUrl = new URL("/signin", request.url);
      if (pathname !== "/") {
        signinUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(signinUrl);
    }

    // Role-based route guard checks
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = JSON.parse(atob(base64));
      const role = (jsonPayload.role || jsonPayload.user?.role)?.toUpperCase();

      const isAdminRoute = pathname.startsWith("/dashboard");
      const isOperatorRoute = pathname.startsWith("/operator");
      const isStaffRoute = pathname.startsWith("/staff");

      const isUserAdminGroup = role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPERVISOR";
      const isUserStaffGroup = role === "STAFF" || role === "MAINTENANCE";
      const isUserOperator = role === "OPERATOR";

      // If root page "/", redirect to respective home boards
      if (pathname === "/") {
        if (isUserAdminGroup) return NextResponse.redirect(new URL("/dashboard", request.url));
        if (isUserStaffGroup) return NextResponse.redirect(new URL("/staff", request.url));
        if (isUserOperator) return NextResponse.redirect(new URL("/operator", request.url));
      }

      // Check route authorizations
      if (isAdminRoute && !isUserAdminGroup) {
        if (isUserStaffGroup) return NextResponse.redirect(new URL("/staff", request.url));
        if (isUserOperator) return NextResponse.redirect(new URL("/operator", request.url));
      }

      if (isOperatorRoute && !isUserOperator) {
        if (isUserAdminGroup) return NextResponse.redirect(new URL("/dashboard", request.url));
        if (isUserStaffGroup) return NextResponse.redirect(new URL("/staff", request.url));
      }

      if (isStaffRoute && !isUserStaffGroup) {
        if (isUserAdminGroup) return NextResponse.redirect(new URL("/dashboard", request.url));
        if (isUserOperator) return NextResponse.redirect(new URL("/operator", request.url));
      }
    } catch (e) {
      // If decoding fails, clear token and force signin redirect
      const response = NextResponse.redirect(new URL("/signin", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  if (isAuthPage && token) {
    // If user is already logged in, redirect them away from auth pages to their dashboard
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = JSON.parse(atob(base64));
      const role = (jsonPayload.role || jsonPayload.user?.role)?.toUpperCase();

      if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "SUPERVISOR") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else if (role === "MAINTENANCE" || role === "STAFF") {
        return NextResponse.redirect(new URL("/staff", request.url));
      } else if (role === "OPERATOR") {
        return NextResponse.redirect(new URL("/operator", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware runs on
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/staff/:path*",
    "/operator/:path*",
    "/project/:path*",
    "/signin",
    "/reset-password",
    "/verify-otp",
  ],
};
