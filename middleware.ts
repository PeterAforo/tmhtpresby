import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Debug: Log cookies
  const cookies = req.cookies.getAll();
  console.log("Middleware - Path:", pathname);
  console.log("Middleware - Cookies:", cookies.map(c => c.name));
  
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  console.log("Middleware - Token:", token ? { id: token.id, role: token.role } : null);

  // Protect admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;
    if (!ADMIN_ROLES.includes(role)) {
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

  return NextResponse.next();
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
