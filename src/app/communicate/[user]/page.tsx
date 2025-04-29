// src/app/communicate/[user]/page.tsx

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: { user: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/sign-in");

  const email = session.user.email!;
  const currentUser = await prisma.users.findUnique({ where: { email } });
  if (!currentUser) redirect("/sign-in");

  const selectedUserId = params.user;

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

  const selectedButton =
    currentUser.role === "teacher"
      ? "/communicate/teacher_post"
      : "/communicate/student_post";

  return (
    <div className="flex flex-col w-full h-screen mt-2 bg-[#1e2627] overflow-hidden">
      {/* Top Navigation */}
      <div className="flex w-full h-12 bg-[#313f40] border border-[#6be4b9] mb-1 rounded-sm">
        <Link
          href={selectedButton}
          className="flex-1 text-2xl font-bold h-12 text-gray-200 hover:bg-[#6be4b9] hover:text-black flex justify-center items-center"
        >
          Нийтлэл
        </Link>
        <Link
          href={`/communicate/${selectedUserId}`}
          className="flex-1 text-2xl font-bold h-12 text-gray-200 hover:bg-[#6be4b9] hover:text-black flex justify-center items-center"
        >
          Мессеж
        </Link>
      </div>

      {/* User Info */}
      <div className="flex justify-start space-x-4 items-center px-8 mt-3">
        <img
          src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
          alt="User Profile"
          className="w-10 h-10 rounded-full border border-purple-500 shadow-md"
        />
        <div>
          <h1 className="text-xl font-semibold text-[#6be4b9]">
            {currentUser.name}
          </h1>
          <p className="text-sm text-gray-300">
            {currentUser.role === "teacher" ? "Багш" : "Оюутан"}
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex w-full h-full">
        {/* Sidebar */}
        <div className="w-3/12 bg-[#313f40] border-r border-[#6be4b9] shadow-md rounded-md shadow-[#6be4b9] overflow-y-auto pt-10 mt-5 mb-5">
          <ul className="space-y-5">
            {allUsers.map((user) => (
              <li
                key={user.user_id}
                className="flex items-center space-x-3 p-2 pl-5 hover:bg-[#6be4b9] rounded"
              >
                <img
                  src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
                  className="w-8 h-8 rounded-full border border-purple-500 shadow"
                />
                <Link
                  href={`/communicate/${user.user_id}`}
                  className="text-gray-300 hover:text-black text-lg font-semibold"
                >
                  {user.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Section */}
        <div className="w-9/12 flex flex-col p-5 min-h-0">
          {/* Scrollable Chat Box */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-[#1e2627] p-4 shadow-md shadow-[#6be4b9] rounded-md border-[#6be4b9]">
            <div className="bg-[#6be4b9] rounded-md p-3 mb-3 flex items-center space-x-3">
              <img
                src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
                className="w-10 h-10 rounded-full border border-purple-500 shadow"
              />
              <h2 className="text-xl font-bold text-[#1e2627]">
                {selectedUser?.name ?? "Хэрэглэгч"}
              </h2>
            </div>
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center pt-10">
                Мессеж алга байна.
              </p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.chat_id}
                  className={`mb-2 ${
                    msg.sender_id === currentUser.user_id
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <span className="inline-block bg-[#313f40] text-white px-3 py-2 rounded">
                    {msg.message}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <form
            action="/api/chat"
            method="POST"
            className="sticky bottom-0 bg-[#1e2627] z-10 mt-3 flex items-center mb-0 p-1"
          >
            <input type="hidden" name="senderId" value={currentUser.user_id} />
            <input type="hidden" name="receiverId" value={selectedUserId} />
            <input
              name="message"
              placeholder="Мессеж бичих..."
              className="flex-1 p-2 rounded bg-[#313f40] text-white border mr-3 border-[#6be4b9]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#6be4b9] text-[#1e2627] font-semibold rounded"
            >
              Илгээх
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
