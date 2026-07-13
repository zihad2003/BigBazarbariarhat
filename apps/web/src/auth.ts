import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@bigbazar/db";
import { authConfig } from "./auth.config";

if (!process.env.AUTH_SECRET && process.env.NEXTAUTH_SECRET) {
  process.env.AUTH_SECRET = process.env.NEXTAUTH_SECRET;
}

if (!process.env.AUTH_SECRET) {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn("⚠️ AUTH_SECRET not set — using placeholder for build.");
    process.env.AUTH_SECRET = "placeholder-secret-for-build-purposes-only";
  } else {
    throw new Error("AUTH_SECRET environment variable is not set.");
  }
}

if (!process.env.AUTH_URL && process.env.NEXT_PUBLIC_APP_URL) {
  process.env.AUTH_URL = process.env.NEXT_PUBLIC_APP_URL;
}

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? user.email.split("@")[0],
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) return false;

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (existingUser) {
            // seamlessly log them in and update profile image/name if needed
            await prisma.user.update({
              where: { email },
              data: {
                image: user.image || existingUser.image,
                name: user.name || existingUser.name,
              },
            });
          } else {
            // automatically register as a new customer with null password and provider type 'google'
            await prisma.user.create({
              data: {
                email,
                name: user.name || email.split("@")[0],
                password: null,
                provider: "google",
                image: user.image || null,
                role: "USER",
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Google sign in callback error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("JWT user fetch error:", error);
        }
      }
      return token;
    },
  },
});
