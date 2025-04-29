import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const school_year = formData.get("school_year") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    if (!title || !school_year || !body) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Get the current session and user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "User is not authenticated" },
        { status: 401 }
      );
    }

    const email = session.user.email ?? undefined;
    if (!email) {
      throw new Error("Email is required");
    }

    const currentUser = await prisma.users.findUnique({
      where: { email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const parsedSchoolYear = parseInt(school_year, 10);
    if (isNaN(parsedSchoolYear)) {
      return NextResponse.json(
        { error: "Invalid school_year format" },
        { status: 400 }
      );
    }

    // Create a new post with the current user's user_id as teacher_id
    await prisma.post.create({
      data: {
        teacher_id: currentUser.user_id, // Use the user_id of the logged-in user
        title,
        body,
        school_year: parsedSchoolYear, // Store directly in the Post model
      },
    });

    await prisma.post.findMany({
      where: { teacher_id: currentUser.user_id, school_year: parsedSchoolYear },
      select: { title: true, body: true, teacher_id: true },
      orderBy: { created_at: "asc" },
    });

    return NextResponse.redirect(new URL("/communicate/teacher_post", req.url));
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error saving post" }, { status: 500 });
  }
}
