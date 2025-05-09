import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    // -------------------------
    // 📌 УСТГАХ ХҮСЭЛТ
    // -------------------------
    const body = await req.json();
    const chatId = Number(body.chatId); // ✅ string → number хөрвүүлсэн

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    await prisma.chat.delete({
      where: { chat_id: chatId },
    });

    return NextResponse.json({ success: true });
  } else {
    // -------------------------
    // 📌 ИЛГЭЭХ ХҮСЭЛТ (formData ашиглана)
    // -------------------------
    const formData = await req.formData();
    const senderId = formData.get("senderId") as string;
    const receiverId = formData.get("receiverId") as string;
    const message = formData.get("message") as string;

    if (!senderId || !receiverId || !message) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await prisma.chat.create({
      data: {
        sender_id: senderId,
        reciever_id: receiverId,
        message,
      },
    });

    return NextResponse.redirect(
      new URL(`/communicate/${receiverId}?user=${receiverId}`, req.url)
    );
  }
}
