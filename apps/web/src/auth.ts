import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Mock Admin User
        if (credentials.email === "admin@bigbazar.com" && credentials.password === "admin123") {
            return {
              id: "1",
              email: credentials.email as string,
              name: "Admin",
              role: "ADMIN",
            };
        }

        // Mock Guest User (Allows any other login to succeed for now)
        return {
          id: Math.random().toString(36).substr(2, 9),
          email: credentials.email as string,
          name: (credentials.email as string).split('@')[0],
          role: "USER",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (token.role) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
