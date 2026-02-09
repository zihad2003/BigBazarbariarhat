import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    '/',
    '/men(.*)',
    '/women(.*)',
    '/kids(.*)',
    '/home-decor(.*)',
    '/product/(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware((auth, request) => {
    // Protect admin routes
    if (isAdminRoute(request)) {
        auth().protect()
    }

    // Protect non-public routes
    if (!isPublicRoute(request)) {
        auth().protect()
    }
})

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
