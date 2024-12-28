import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import LinkedinProvider from "next-auth/providers/linkedin";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { Role } from "@prisma/client";
import { verifyPassword } from "@/lib/password";
import requestIp from "request-ip";
import { NextApiRequest, NextApiResponse } from "next";
import useragent from "useragent";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const clientIp = requestIp.getClientIp(req);
  const ip = clientIp === "::1" ? "127.0.0.1" : clientIp;
  const userAgent = req.headers["user-agent"] || "";
  const deviceInfo = useragent.parse(userAgent);
  return await NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    callbacks: {
      async signIn({ account, user }) {
        if (!user) return false;

        if (account?.providerAccountId) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });
          if (!existingAccount) {
            await prisma.account.create({
              data: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                ip,
                device: deviceInfo.toString(),
                signInTimestamp: new Date(),
                type: account.type,
                user: {
                  connect: { id: user.id },
                },
              },
            });
          } else {
            await prisma.account.update({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              data: {
                ip,
                device: deviceInfo.toString(),
                signInTimestamp: new Date(),
              },
            });
          }
        }
        return true;
      },
      async jwt({ token }) {
        if (!token.sub) return token;
        const existingUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (!existingUser) return token;
        token.role = existingUser.role;
        token.emailVerified = existingUser.emailVerified;
        return token;
      },
      session({ session, token }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
          session.user.role = token.role as Role;
          session.user.emailVerified = token.emailVerified as Date;
        }
        return session;
      },
    },
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: {
            label: "Email",
            type: "text",
            placeholder: "Johndoe@gmail.com",
          },
          password: {
            label: "Password",
            type: "password",
            placeholder: "*******",
          },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials.password) {
            throw new Error("Email and password are required");
          }
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user || !user.password) {
            throw new Error("Invalid email or password");
          }
          const isMatch = await verifyPassword(
            credentials.password,
            user.password
          );
          if (!isMatch) {
            throw new Error("Invalid email or password");
          }
          return user;
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
      LinkedinProvider({
        clientId: process.env.LINKEDIN_CLIENT_ID!,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
    ],
    pages: {
      signIn: "/login",
      error: "/",
    },
    session: {
      strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
  });
}
