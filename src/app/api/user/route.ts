import { NextResponse } from "next/server";
import db from "@/lib/db"; // Prisma client

// GET: Бүх хэрэглэгчийн мэдээллийг авах
export async function GET() {
  try {
    const users = await db.users.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST: Шинэ хэрэглэгч нэмэх
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, name, email, password, role, school_year } = body;

    // Хэрэглэгч нэмэх
    const user = await db.users.create({
      data: {
        user_id,
        name,
        email,
        password, // password-ийг хэшлэх шаардлагатай
        role,
        school_year,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

// PUT: Хэрэглэгчийн мэдээллийг засах
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, user_id, name, email, role, school_year } = body;

    // Хэрэглэгчийн мэдээллийг засах
    const user = await db.users.update({
      where: { id },
      data: {
        user_id,
        name,
        email,
        role,
        school_year,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE: Хэрэглэгч устгах
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // ID-ийг шалгах (ID байхгүй бол алдаа буцаах)
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Хэрэглэгчийн ID-г устгах (UUID эсвэл String ID)
    const user = await db.users.delete({
      where: { id }, // ID-г шууд string болгон өгнө
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
