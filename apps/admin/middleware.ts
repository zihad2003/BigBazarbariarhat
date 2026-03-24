import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isUnauthorizedPage = req.nextUrl.pathname.startsWith("/unauthorized");

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (!isLoggedIn && !isAuthPage && !isUnauthorizedPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && !isAuthPage && !isUnauthorizedPage) {
    const role = (req.auth.user as any)?.role;
    if (role !== "SUPER_ADMIN" && role !== "MANAGER") {
        return NextResponse.redirect(new URL("/unauthorized", req.nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
