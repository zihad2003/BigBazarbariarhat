import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@bigbazar/db";
import { authConfig } from "./auth.config";

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn("⚠️ AUTH_SECRET / NEXTAUTH_SECRET not set — using placeholder for build.");
    process.env.AUTH_SECRET = "placeholder-secret-for-build-purposes-only";
  } else {
    throw new Error("AUTH_SECRET environment variable is not set.");
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) return null;

          // Only allow ADMIN and SUPER_ADMIN roles in the admin panel
          if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? "Admin",
            role: user.role,
          };
        } catch (error) {
          console.error("Admin auth error:", error);
          return null;
        }
      },
    }),
  ],
});
