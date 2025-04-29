import { NextResponse } from "next/server";
import db from "@/lib/db"; // Changed to default import
import { Schedule } from "@prisma/client";

// Сарын дагуу бүлэглэсэн бүтэц
type GroupedSchedule = {
  month: number;
  schedules: Schedule[];
};

export async function GET() {
  try {
    const allSchedules = await db.schedule.findMany({
      orderBy: { date: "asc" },
    });

    const grouped: GroupedSchedule[] = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      schedules: [],
    }));

    for (const schedule of allSchedules) {
      const month = new Date(schedule.date).getMonth(); // 0-based index
      grouped[month].schedules.push(schedule);
    }

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedules" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, date } = body;

    if (!event || !date) {
      return NextResponse.json(
        { error: "Missing event or date" },
        { status: 400 }
      );
    }

    const schedule = await db.schedule.create({
      data: {
        event,
        date: new Date(date),
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, event, date } = body;

    if (!id || !event || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const schedule = await db.schedule.update({
      where: { id },
      data: {
        event,
        date: new Date(date),
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing schedule ID" },
        { status: 400 }
      );
    }

    await db.schedule.delete({ where: { id } });

    return NextResponse.json({ message: "Schedule deleted" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    );
  }
}
