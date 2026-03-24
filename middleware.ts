import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = (session?.user as { role?: string })?.role;

  // Protect admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!session) {
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
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect community API routes
  if (pathname.startsWith("/api/community")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Protect profile page
  if (pathname.startsWith("/profile")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

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
