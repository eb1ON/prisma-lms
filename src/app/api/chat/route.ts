import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // 🌟 Form Data-г зөв задлах
    const formData = await req.formData();
    const senderId = formData.get("senderId") as string;
    const receiverId = formData.get("receiverId") as string;
    const message = formData.get("message") as string;

    if (!senderId || !receiverId || !message) {
      console.error("POST: Missing data for message creation");
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await prisma.chat.create({
      data: {
        sender_id: senderId,
        reciever_id: receiverId,
        message,
      },
    });

    return NextResponse.redirect(new URL("/communicate/[user]", req.url));
  } catch (error) {
    console.error("POST: Error saving message:", error);
    return NextResponse.json(
      { error: "Error saving message" },
      { status: 500 }
    );
  }
}
