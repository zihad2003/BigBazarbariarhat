import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/admin(.*)",
    "/account(.*)",
    "/checkout(.*)"
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    // Protect routes that require authentication
    if (isProtectedRoute(req)) {
        if (!userId) {
            return redirectToSignIn();
        }
    }

    // Protect admin routes with role check
    if (isAdminRoute(req)) {
        // Check if user has admin role in publicMetadata
        // Note: You must configure Clerk to include public_metadata in the session token
        const role = (sessionClaims?.metadata as any)?.role;

        if (role !== 'admin') {
            // If user is logged in but not admin, redirect to home
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
