import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Use the server-side signIn from auth config
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // If we get here, authentication was successful
    // The signIn function will have set the session cookie
    return NextResponse.json({
      success: true,
      redirectTo: "/admin",
    });
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof AuthError) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    // Check if it's a redirect (which means success in NextAuth)
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      return NextResponse.json({
        success: true,
        redirectTo: "/admin",
      });
    }
    
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
