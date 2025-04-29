import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET: Roadmap хичээлүүдийг авах
export async function GET() {
  try {
    const roadmaps = await db.roadmap.findMany();
    return NextResponse.json(roadmaps);
  } catch (error) {
    console.error("Error fetching roadmap lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    );
  }
}

// POST: Roadmap хичээл нэмэх
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lesson_code, lesson_name, credits, type, semester, school_year } =
      body;

    const roadmap = await db.roadmap.create({
      data: {
        lesson_code,
        lesson_name,
        credits,
        type,
        semester,
        school_year,
      },
    });

    return NextResponse.json(roadmap, { status: 201 });
  } catch (error) {
    console.error("Error creating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to create roadmap" },
      { status: 500 }
    );
  }
}

// PUT: Roadmap засах
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      lesson_code,
      lesson_name,
      credits,
      type,
      semester,
      school_year,
    } = body;

    const roadmap = await db.roadmap.update({
      where: { id },
      data: {
        lesson_code,
        lesson_name,
        credits,
        type,
        semester,
        school_year,
      },
    });

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}

// DELETE: Roadmap устгах
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const deleted = await db.roadmap.delete({
      where: { id },
    });

    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error deleting roadmap:", error);
    return NextResponse.json(
      { error: "Failed to delete roadmap" },
      { status: 500 }
    );
  }
}
