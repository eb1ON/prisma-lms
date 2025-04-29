import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Хэрэглэгчийн сессийг шалгах
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Хэрэглэгч нэвтрээгүй байна" },
        { status: 401 }
      );
    }

    // Хэрэглэгчийн мэдээллийг авах
    const email = session.user.email ?? undefined;
    if (!email) {
      throw new Error("Email is required");
    }

    const currentUser = await prisma.users.findUnique({
      where: { email },
    });

    if (!currentUser || currentUser.role !== "student") {
      return NextResponse.json(
        { error: "Хэрэглэгч сурагч биш байна" },
        { status: 403 }
      );
    }

    // Сургалтын жилд таарсан постуудыг татах

    return NextResponse.redirect(new URL("/communicate/student_post", req.url));
  } catch (error) {
    console.error("Алдаа гарлаа:", error);
    return NextResponse.json({ error: "Серверийн алдаа" }, { status: 500 });
  }
}
