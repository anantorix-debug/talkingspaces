import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isPublicAdminRoute = isLoginRoute || pathname === "/admin/forgot-password";
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute && !isPublicAdminRoute && !isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
