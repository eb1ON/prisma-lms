import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth"; // Session авах

// 📌 POST - Сурагч даалгавар илгээх
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await req.formData();
  const assignmentId = formData.get("assignmentId") as string;
  const studentId = session.user.user_id;
  const file = formData.get("file") as File;

  if (!assignmentId || !file) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    select: { teacherId: true },
  });

  if (!assignment) {
    return NextResponse.json(
      { error: "Assignment not found" },
      { status: 404 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${uuidv4()}-${file.name}`;
  const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);
  await writeFile(uploadPath, buffer);

  const fileUrl = `/uploads/${fileName}`;

  const submission = await prisma.submission.create({
    data: {
      assignmentId,
      studentId,
      teacherId: assignment.teacherId,
      fileUrl,
    },
  });

  return NextResponse.json(submission);
}

// 📌 GET - Багш өөр рүүгээ ирсэн даалгавруудыг авах
export async function GET(req: NextRequest) {
  const teacherId = req.nextUrl.searchParams.get("teacherId");
  if (!teacherId) {
    return NextResponse.json({ error: "Missing teacherId" }, { status: 400 });
  }

  const submissions = await prisma.submission.findMany({
    where: { teacherId },
    include: {
      student: { select: { name: true, school_year: true } }, // ← school_year нэмсэн
      assignment: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}
