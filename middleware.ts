import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Redirect authenticated users away from login page
    if (req.nextUrl.pathname === "/login" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true to allow access; withAuth handles redirect to signIn page
      // when token is absent on protected routes
      authorized: ({ req, token }) => {
        // Allow unauthenticated access to /login
        if (req.nextUrl.pathname === "/login") {
          return true;
        }
        // All other matched routes require a valid session token
        return token !== null;
      },
    },
    pages: {
      signIn: "/login",
    },
  },
);

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/balls/:path*",
    "/stocklist/:path*",
    "/transfers/:path*",
    "/stock-out/:path*",
    "/movements/:path*",
    "/master-data/:path*",
  ],
};
