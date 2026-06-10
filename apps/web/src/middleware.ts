import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isAccountPage = req.nextUrl.pathname.startsWith("/account");
  const isCheckoutPage = req.nextUrl.pathname.startsWith("/checkout");

  // Redirect logged in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Protect sensitive routes
  if (isAccountPage && !isLoggedIn) {
     let callbackUrl = req.nextUrl.pathname;
     if (req.nextUrl.search) {
       callbackUrl += req.nextUrl.search;
     }
     return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.nextUrl));
  }
  
  // Admin pages are handled by their own middleware or layout usually, 
  // but if we handle them here:
  if (isAdminPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`, req.nextUrl));
    }
    const role = (req.auth as any)?.user?.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
