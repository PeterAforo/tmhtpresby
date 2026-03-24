import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// Determine the correct base URL for auth
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  return "http://localhost:3000";
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  trustHost: true, // Trust the host header on Vercel
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Auth: Missing credentials");
            return null;
          }

          console.log("Auth: Looking up user:", credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("Auth: User not found");
            return null;
          }

          if (!user.hashedPassword) {
            console.log("Auth: User has no password");
            return null;
          }

          console.log("Auth: Comparing password");
          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (!passwordMatch) {
            console.log("Auth: Password mismatch");
            return null;
          }

          console.log("Auth: Success for user:", user.id);
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      try {
        if (user) {
          token.id = user.id;
          // Fetch role on initial sign-in
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id as string },
            select: { role: true, firstName: true, lastName: true, image: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.name = `${dbUser.firstName} ${dbUser.lastName}`;
            token.picture = dbUser.image;
          }
        }
        // Only refresh from DB on explicit update trigger, not every request
        if (trigger === "update" && token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, firstName: true, lastName: true, image: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
            token.name = `${dbUser.firstName} ${dbUser.lastName}`;
            token.picture = dbUser.image;
          }
        }
      } catch (error) {
        console.error("JWT callback error:", error);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
});
