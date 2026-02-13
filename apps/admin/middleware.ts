import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    publicRoutes: ["/sign-in", "/sign-up", "/unauthorized"],
    afterAuth(auth, req) {
        // Handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        // Role-Based Access Control (RBAC)
        // We assume the user role is stored in publicMetadata or sessionClaims
        const sessionClaims = auth.sessionClaims as any;
        const role = sessionClaims?.metadata?.role || "CUSTOMER";

        // Allow Zihad (Development Bypass)
        if (auth.userId === "user_39dQDx77kTzGuAUpGyq59o1RTvP") {
            return NextResponse.next();
        }

        // If user is authenticated but not an ADMIN, and trying to access any non-public admin route
        if (auth.userId && !auth.isPublicRoute && role !== "ADMIN" && role !== "SUPER_ADMIN") {
            const unauthorizedUrl = new URL("/unauthorized", req.url);
            return NextResponse.redirect(unauthorizedUrl);
        }

        return NextResponse.next();
    },
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
