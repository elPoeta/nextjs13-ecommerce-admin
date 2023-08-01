import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = number | string;

const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
} as const;

type ObjectValues<T> = T[keyof T];

type UserRole = ObjectValues<typeof USER_ROLE>;
declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: UserRole;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      role: UserRole;
    };
  }
}

/*
const USER_ROLE = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

type UserRole = typeof USER_ROLE<typeof USER_ROLE>;
*/
