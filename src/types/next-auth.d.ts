// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      role: "student" | "teacher" | "admin";
      school_year?: number;
    } & DefaultSession["user"];
  }

  interface User {
    user_id: string;
    role: "student" | "teacher" | "admin";
    school_year?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    role: "student" | "teacher" | "admin";
    school_year?: number;
  }
}
