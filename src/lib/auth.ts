import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "./db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { schema } from "./schema";

export const { auth, handlers, signIn } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt", // JWT ашиглана
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validated = schema.parse(credentials);

        const user = await db.users.findFirst({
          where: {
            email: validated.email,
            password: validated.password, // Хаш хийж байгаа бол bcrypt.compare ашиглана
          },
          select: {
            id: true,
            user_id: true,
            name: true,
            role: true,
            school_year: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!user) throw new Error("Нэвтрэх мэдээлэл буруу байна");
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Login үед хэрэглэгчийн мэдээллийг токен руу дамжуулна
      if (account?.provider === "credentials" && user) {
        token.user_id = user.user_id;
        token.role = user.role;
        token.school_year = user.school_year;
      }
      return token;
    },
    async session({ session, token }) {
      // Токенээс session-д дамжуулах
      session.user.user_id = token.user_id as string;
      session.user.role = token.role as string;
      session.user.school_year = token.school_year as number;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; // Login хийсний дараа '/' руу шилжүүлнэ
    },
  },
  pages: {
    signIn: "/sign-in", // Custom login page
  },
});
