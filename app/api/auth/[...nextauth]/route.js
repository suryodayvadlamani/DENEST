import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/prisma";
export const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          const user = await prisma.user.findFirst({ where: { email } });

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      if (user) {
        try {
          const userRole = await prisma.userRoles.findFirst({
            where: {
              userId: user.id,
              isActive: true,
            },
            include: {
              role: true,
            },
          });

          return {
            ...token,
            roleId: userRole?.roleId,
            userId: user.id,
            hostelId: userRole?.hostelId,
            vendorId: userRole?.vendorId,
            role: userRole?.role?.name,
          };
        } catch (err) {
          console.log(err);
          return token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.role = token.role;
      return {
        ...session,
        user: {
          ...session.user,
          userId: token.userId,
          roleId: token.roleId,
          hostelId: token.hostelId,
          vendorId: token.vendorId,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
