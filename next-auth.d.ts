import { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  id: string;
  role: Role;
  emailVerified: Date;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
