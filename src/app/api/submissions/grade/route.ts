// app/api/submissions/grade/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { submissionId, score } = body;

  if (!submissionId || score == null || score < 0 || score > 10) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { score },
  });

  return NextResponse.json(updated);
}
