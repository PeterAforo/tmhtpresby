import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Get token - use the correct cookie name for production
  const token = await getToken({ 
    req, 
    secret: process.env.AUTH_SECRET,
    cookieName: process.env.NODE_ENV === "production" 
      ? "__Secure-authjs.session-token" 
      : "authjs.session-token",
  });
  
  const role = token?.role as string | undefined;

  // Protect admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!role || !ADMIN_ROLES.includes(role)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  // Protect community/directory routes (require any authenticated user)
  if (pathname.startsWith("/community") || pathname.startsWith("/directory")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect community API routes
  if (pathname.startsWith("/api/community")) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Protect profile page
  if (pathname.startsWith("/profile")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Add pathname header for layout detection
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/community/:path*",
    "/directory/:path*",
    "/api/community/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
