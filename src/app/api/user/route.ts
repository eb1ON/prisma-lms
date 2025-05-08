import { NextResponse } from "next/server";
import { PrismaClient, Role } from "@prisma/client"; // 👈 Role-г зөв газраас импортолсон
import path from "path";
import { writeFile } from "fs/promises";

const db = new PrismaClient();

// GET: Бүх хэрэглэгч авах
export async function GET(request: Request) {
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

// POST: Хэрэглэгч нэмэх (FormData, зураг upload)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const user_id = formData.get("user_id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as Role; // ✅ Role enum ашигласан
    const school_year = Number(formData.get("school_year"));
    const file = formData.get("image") as File;

    let filePath = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(uploadPath, buffer);
      filePath = `/uploads/${filename}`;
    }

    const user = await db.users.create({
      data: {
        user_id,
        name,
        email,
        password,
        role,
        school_year,
        image: filePath,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

// PUT: Хэрэглэгч засах (FormData, зураг шинэчлэх боломжтой)
export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const user_id = formData.get("user_id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as Role; // ✅ Role enum ашигласан
    const school_year = Number(formData.get("school_year"));
    const currentImage = formData.get("currentImage") as string;
    const file = formData.get("image") as File;

    let filePath = currentImage;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const filename = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(uploadPath, buffer);
      filePath = `/uploads/${filename}`;
    }

    const user = await db.users.update({
      where: { id },
      data: {
        user_id,
        name,
        email,
        role,
        school_year,
        image: filePath,
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

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const user = await db.users.delete({
      where: { id },
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
