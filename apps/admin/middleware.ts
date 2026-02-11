import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    publicRoutes: ["/sign-in", "/sign-up"],
    afterAuth(auth, req) {
        // Handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        // Role-Based Access Control (RBAC)
        // We assume the user role is stored in publicMetadata or sessionClaims
        const sessionClaims = auth.sessionClaims as any;
        const role = sessionClaims?.metadata?.role || "CUSTOMER";

        // If user is authenticated but not an ADMIN, and trying to access any non-public admin route
        if (auth.userId && !auth.isPublicRoute && role !== "ADMIN" && role !== "SUPER_ADMIN") {
            // For now, if not admin, we could redirect to a 403 or just back to sign-in or a custom error page
            // But since this is the ADMIN app, we should probably just deny access.
            const forbiddenUrl = new URL("/", req.url);
            return NextResponse.redirect(forbiddenUrl);
        }

        return NextResponse.next();
    },
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
