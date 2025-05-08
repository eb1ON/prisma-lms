import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET: Хичээлийн хуваарийг авах
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacher_id");
    const schoolYear = searchParams.get("school_year");

    const timetable = await db.timetable.findMany({
      where: {
        ...(teacherId && { teacher_id: teacherId }),
        ...(schoolYear && { school_year: parseInt(schoolYear) }),
      },
      include: {
        lesson: true,
        teacher: true,
      },
    });

    return NextResponse.json(timetable);
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetable" },
      { status: 500 }
    );
  }
}

// POST: Хичээлийн хуваарь нэмэх
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      lesson_code,
      teacher_id,
      weekdays,
      start_time,
      end_time,
      school_year,
    } = body;

    // Давхцал шалгах (Өдөр + Курс + Цагийн overlap шалгах)
    const conflicts = await db.timetable.findMany({
      where: {
        weekdays,
        school_year,
        AND: [
          { start_time: { lt: end_time } }, // Эхлэх цаг нь шинэ дуусах цагаас өмнө
          { end_time: { gt: start_time } }, // Дуусах цаг нь шинэ эхлэх цагаас хойш
        ],
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error:
            "Тухайн өдөр, тухайн цагт энэ анги хичээлтэй байгаа учраас нэмэх боломжгүй.",
        },
        { status: 400 }
      );
    }

    const timetable = await db.timetable.create({
      data: {
        lesson_code,
        teacher_id,
        weekdays,
        start_time,
        end_time,
        school_year,
      },
    });

    return NextResponse.json(timetable, { status: 201 });
  } catch (error) {
    console.error("Error adding timetable:", error);
    return NextResponse.json(
      { error: "Failed to add timetable" },
      { status: 500 }
    );
  }
}

// PUT: Хичээлийн хуваарь засах
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      lesson_code,
      teacher_id,
      weekdays,
      start_time,
      end_time,
      school_year,
    } = body;

    // Давхцал шалгах (Өдөр + Курс + Цагийн overlap шалгах, өөрийгөө оруулахгүй)
    const conflicts = await db.timetable.findMany({
      where: {
        weekdays,
        school_year,
        NOT: { id },
        AND: [
          { start_time: { lt: end_time } }, // Эхлэх цаг нь шинэ дуусах цагаас өмнө
          { end_time: { gt: start_time } }, // Дуусах цаг нь шинэ эхлэх цагаас хойш
        ],
      },
    });

    if (conflicts.length > 0) {
      return NextResponse.json(
        {
          error:
            "Тухайн өдөр, тухайн цагт энэ курст хичээл аль хэдийн орж байгаа тул засах боломжгүй.",
        },
        { status: 400 }
      );
    }

    const timetable = await db.timetable.update({
      where: { id },
      data: {
        lesson_code,
        teacher_id,
        weekdays,
        start_time,
        end_time,
        school_year,
      },
    });

    return NextResponse.json(timetable, { status: 200 });
  } catch (error) {
    console.error("Error updating timetable:", error);
    return NextResponse.json(
      { error: "Failed to update timetable" },
      { status: 500 }
    );
  }
}

// DELETE: Хичээлийн хуваарь устгах
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID is required to delete timetable" },
        { status: 400 }
      );
    }

    const timetable = await db.timetable.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(timetable, { status: 200 });
  } catch (error) {
    console.error("Error deleting timetable:", error);
    return NextResponse.json(
      { error: "Failed to delete timetable" },
      { status: 500 }
    );
  }
}
