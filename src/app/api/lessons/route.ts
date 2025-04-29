// api/lessons/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/db"; // Prisma client

// GET: Хичээлийн жагсаалтыг авах
export async function GET() {
  try {
    const lessons = await db.lesson_list.findMany({
      include: {
        teacher: true, // Хичээлийн багшийн мэдээлэл
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}

// POST: Шинэ хичээл нэмэх
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lesson_code, lesson_name, credits, description, teacher_id } = body;

    // Шинэ хичээл нэмэх
    const lesson = await db.lesson_list.create({
      data: {
        lesson_code,
        lesson_name,
        credits,
        description,
        teacher_id,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Error adding lesson:", error);
    return NextResponse.json(
      { error: "Failed to add lesson" },
      { status: 500 }
    );
  }
}

// PUT: Хичээлийн мэдээллийг засах
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, lesson_code, lesson_name, credits, description, teacher_id } =
      body;

    const lesson = await db.lesson_list.update({
      where: { id: id },
      data: {
        lesson_code,
        lesson_name,
        credits,
        description,
        teacher_id,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error updating lesson:", error);
    return NextResponse.json(
      { error: "Failed to update lesson" },
      { status: 500 }
    );
  }
}

// DELETE: Хичээлийг устгах
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("id");

    if (!lessonId) {
      return NextResponse.json(
        { error: "lesson_id is required" },
        { status: 400 }
      );
    }

    const lesson = await db.lesson_list.delete({
      where: { id: lessonId },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return NextResponse.json(
      { error: "Failed to delete lesson" },
      { status: 500 }
    );
  }
}
