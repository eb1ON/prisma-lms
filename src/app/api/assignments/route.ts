import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// GET хэсэг

export async function GET(req: NextRequest) {
  const courseParam = req.nextUrl.searchParams.get("course");

  if (!courseParam) {
    return NextResponse.json({ error: "Missing course" }, { status: 400 });
  }

  const course = parseInt(courseParam);

  const assignments = await prisma.assignment.findMany({
    where: {
      course,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      teacher: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const course = parseInt(formData.get("course")?.toString() || "0");
  const teacherId = formData.get("teacherId")?.toString();
  const file = formData.get("file") as File;

  if (!title || !description || !teacherId || !file) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${uuidv4()}-${file.name}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", filename);
  await writeFile(uploadPath, buffer);

  const assignment = await prisma.assignment.create({
    data: {
      title,
      description,
      course,
      teacherId,
      fileUrl: `/uploads/${filename}`,
    },
  });

  return NextResponse.json(assignment);
}
