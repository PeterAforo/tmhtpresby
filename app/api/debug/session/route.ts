import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Get token using next-auth/jwt
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  
  // Get session using auth()
  const session = await auth();
  
  // Get all cookies
  const cookies = req.cookies.getAll();
  
  return NextResponse.json({
    token: token ? {
      id: token.id,
      email: token.email,
      role: token.role,
      name: token.name,
      exp: token.exp,
    } : null,
    session: session ? {
      user: session.user,
      expires: session.expires,
    } : null,
    cookies: cookies.map(c => ({ name: c.name, valueLength: c.value.length })),
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      authSecretLength: process.env.AUTH_SECRET?.length,
      nodeEnv: process.env.NODE_ENV,
    }
  });
}
