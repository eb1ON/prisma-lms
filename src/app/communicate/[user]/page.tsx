import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserList from "./UserList";
import MessageItem from "./MessageItem";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export default async function ChatPage({
  params,
}: {
  params: { user?: string };
}) {
  const selectedUserId = params.user ?? "";

  const session = await auth();
  if (!session || !session.user) redirect("/sign-in");

  const email = session.user.email!;
  const currentUser = await prisma.users.findUnique({ where: { email } });
  if (!currentUser) redirect("/sign-in");

  const selectedUser = await prisma.users.findUnique({
    where: { user_id: selectedUserId },
    select: { name: true },
  });

  const messages = await prisma.chat.findMany({
    where: {
      OR: [
        { sender_id: currentUser.user_id, reciever_id: selectedUserId },
        { sender_id: selectedUserId, reciever_id: currentUser.user_id },
      ],
    },
    orderBy: { created_at: "asc" },
  });

  const allUsers = await prisma.users.findMany({
    where: { user_id: { not: currentUser.user_id } },
    select: { user_id: true, name: true },
  });

  return (
    <div className="flex flex-col w-full h-screen bg-background overflow-hidden">
      <div className="flex w-full h-full">
        {/* Chat Section */}
        <div className="w-9/12 flex flex-col bg-muted p-2 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto p-4" id="message-list">
            <div className="bg-gradient-to-br from-[#a0bbdf] from-40% to-[#c68c8c] shadow-xl rounded-md p-3 mb-3 flex items-center space-x-5">
              <img
                src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
                className="w-14 ml-5 h-14 rounded-full border border-primary shadow"
              />
              <h2 className="text-xl font-bold text-white">
                {selectedUser?.name ?? "Хэрэглэгч"}
              </h2>
            </div>

            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center pt-10">
                Мессеж алга байна.
              </p>
            ) : (
              messages.map((msg) => {
                const createdAt = new Date(msg.created_at);
                const time = createdAt.toLocaleTimeString("mn-MN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const isOwn = msg.sender_id === currentUser.user_id;

                return (
                  <MessageItem
                    key={msg.chat_id}
                    chatId={msg.chat_id}
                    message={msg.message}
                    time={time}
                    isOwn={isOwn}
                  />
                );
              })
            )}
          </div>

          {/* Message Input */}
          <form
            action="/api/chat"
            method="POST"
            className="sticky bottom-0 rounded-lg z-10 mt-3 flex items-center mb-0 p-1 bg-card border-t border-border"
          >
            <input type="hidden" name="senderId" value={currentUser.user_id} />
            <input type="hidden" name="receiverId" value={selectedUserId} />
            <input
              name="message"
              placeholder="Мессеж бичих..."
              className="flex-1 p-3 m-3 mb-0 px-9 border border-border bg-muted text-foreground rounded-s-lg"
            />
            <button
              type="submit"
              className="px-4 m-2 ml-0 mb-0 py-3 bg-primary text-primary-foreground font-semibold rounded-e-lg"
            >
              Илгээх
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col bg-card shadow-xl h-full pt-3 pl-10 pr-6 w-[400px] border-l border-border">
          <div className="flex flex-col bg-gradient-to-br from-[#a0bbdf] from-40% to-[#c68c8c] p-6 w-full h-[180px] rounded-xl items-center justify-center">
            <img
              src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
              alt="User Profile"
              className="w-16 h-16 rounded-full mb-4 shadow-md"
            />
            <h1 className="text-xl text-white font-semibold">
              {currentUser.name}
            </h1>
            <p className="text-md text-gray-200">
              {currentUser.role === "teacher" ? "Багш" : "Оюутан"}
            </p>
          </div>

          <UserList users={allUsers} />
        </div>
      </div>
    </div>
  );
}
