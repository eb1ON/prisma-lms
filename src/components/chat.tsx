
import { auth } from "@/lib/auth";
import  prisma  from "@/lib/db";
import { redirect } from "next/navigation";
 
 
type User = {
  user_id: string;
  name: string;
};
 
type Message = {
  chat_id: number;
  sender_id: string;
  reciever_id: string;
  message: string;
};
 
async function getChatData(userId: string, selectedUserId: string) {
  const messages = await prisma.chat.findMany({
    where: {
      OR: [
        { sender_id: userId, reciever_id: selectedUserId },
        { sender_id: selectedUserId, reciever_id: userId },
      ],
    },
    orderBy: { created_at: "asc" },
  });
  return messages;
}
 
export default async function ChatPage({ params }: { params: { user: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/sign-in");
  }
 
  const email = session.user.email ?? undefined;
  if (!email) {
    throw new Error("Email is required");
  }
 
  const currentUser = await prisma.users.findUnique({
    where: { email },
  });

  
  if (!currentUser) {
    redirect("/auth/sign-in");
  }
 
  // 🌟 Route Segment ашиглан хэрэглэгчийн ID авах
  const selectedUserId = await Promise.resolve(params.user) || "";
  const messages = await getChatData(currentUser.user_id, selectedUserId);
 
  const allUsers = await prisma.users.findMany({
    where: { user_id: { not: currentUser.user_id } },
    select: { user_id: true, name: true },
  });
  const selectedButton = currentUser.role === 'teacher'
  ? '/communicate/teacher_post'
  : '/communicate/student_post';
  return (
    <div className="flex">
      <div className="flex flex-col w-screen h-screen p-4 space-y-4">
      <div className="flex space-x-4 mb-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          <a href={selectedButton}>POST</a>
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          <a href={`/communicate/[user]`}>CHAT</a>
        </button>
      </div>
      <div className="flex flex-row w-screen h-screen">
        <div className="flex flex-col p-4 space-y-4 w-1/3 border-r">
          <h2 className="text-xl font-bold">Тавтай морил, {currentUser.name}</h2>
          <h3 className="font-semibold">Хэнд мессеж илгээх вэ?</h3>
          <ul className="space-y-2">
            {allUsers.map((user) => (
              <li key={user.user_id} className="p-2 border rounded">
                <a href={`/communicate/${user.user_id}`} className="text-blue-500">{user.name}</a>
              </li>
            ))}
          </ul>
        </div>
  
        <div className="flex-1 p-4">
          <div className="h-80 overflow-y-auto border rounded p-3 bg-white">
            {messages.length === 0 ? (
              <p className="text-gray-400">Мессеж алга байна.</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.chat_id} className={msg.sender_id === currentUser.user_id ? "text-right" : "text-left"}>
                  <span className="inline-block bg-gray-100 px-3 py-1 rounded mb-2">{msg.message}</span>
                </div>
              ))
            )}
          </div>
          <form action="/api/chat" method="POST" className="mt-4">
            <input type="hidden" name="senderId" value={currentUser.user_id} />
            <input type="hidden" name="receiverId" value={selectedUserId} />
            <input
              name="message"
              placeholder="Мессеж бичих..."
              className="border rounded p-2 w-full"
            />
            <button type="submit" className="mt-2 px-4 py-1 bg-blue-500 text-white rounded">Илгээх</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
 