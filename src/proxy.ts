import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasClerkEnv = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY
);

// Routes that never require authentication.
const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/login(.*)",
  "/signup(.*)",
  "/api/webhooks(.*)",
]);

// The public marketing / auth surfaces a logged-in user shouldn't land on.
const isMarketingRoute = createRouteMatcher(["/", "/login(.*)"]);

const authMiddleware = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Signed in → never show the landing or login page; go straight to the app.
  if (userId && isMarketingRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Not signed in → protected routes bounce to our own /login page.
  if (!userId && !isPublicRoute(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
});

export default hasClerkEnv ? authMiddleware : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
