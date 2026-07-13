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
    console.log("Using AUTH_SECRET from environment");
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
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log("Attempting login for:", credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("User not found");
            return null;
          }

          if (!user.password) {
            console.log("User has no password");
            return null;
          }

          // Only allow ADMIN and SUPER_ADMIN roles in the admin panel
          if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
            console.log("Invalid role:", user.role);
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          console.log("Password valid:", isPasswordValid);

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
