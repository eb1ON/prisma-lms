import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StudentPostPage({
  params,
}: {
  params: { teacher_id?: string };
}) {
  const session = await auth();
  if (!session || !session.user) redirect("/sign-in");

  const email = session.user.email!;
  const currentUser = await prisma.users.findUnique({ where: { email } });
  if (!currentUser) redirect("/sign-in");

  const schoolYear = currentUser.school_year;
  const teachers = await prisma.users.findMany({
    where: { role: "teacher" },
    select: { user_id: true, name: true },
  });

  const selectedTeacherId = params.teacher_id || teachers[0]?.user_id;

  const posts = await prisma.post.findMany({
    where: { school_year: schoolYear, teacher_id: selectedTeacherId },
    select: { title: true, body: true, teacher_id: true },
    orderBy: { created_at: "asc" },
  });

  return (
    <div className="flex flex-col w-full h-screen bg-background overflow-hidden text-foreground">
      <div className="flex w-full bg-background h-full">
        {/* Posts Section */}
        <div className="w-9/12 flex flex-col bg-background p-2 m-0 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="bg-gradient-to-br from-[#a0bbdf] from-40% to-[#c68c8c] shadow-xl rounded-md p-3 mb-3 flex items-center space-x-5">
              <img
                src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
                className="w-14 ml-5 h-14 rounded-full border border-primary shadow"
              />
              <h2 className="text-xl font-bold text-white">
                {currentUser.name}
              </h2>
            </div>

            {posts.length === 0 ? (
              <p className="text-muted-foreground text-center pt-10">
                Одоогоор пост алга байна.
              </p>
            ) : (
              posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-card border border-border p-4 mb-3 rounded-lg shadow"
                >
                  <h3 className="font-semibold text-primary text-lg">
                    {post.title}
                  </h3>
                  <p className="text-foreground mt-2">{post.body}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Багшийн ID: {post.teacher_id}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar → Teachers */}
        <div className="flex flex-col justify-center items-center bg-card shadow-xl h-full pt-3 pl-10 ml-0 pr-6 border-l border-border">
          <div className="flex flex-col bg-gradient-to-br from-[#a0bbdf] from-40% to-[#c68c8c] p-6 w-[350px] h-[180px] rounded-xl items-center justify-center">
            <img
              src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
              alt="User Profile"
              className="w-16 h-16 rounded-full mb-4 shadow-md"
            />
            <div className="text-center">
              <h1 className="text-xl text-white font-semibold">
                {currentUser.name}
              </h1>
              <p className="text-md text-gray-200">
                {currentUser.role === "teacher" ? "Багш" : "Оюутан"}
              </p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-primary mt-8">📚 Багш нар</h2>
          <div className="bg-card rounded-xl overflow-y-auto pt-4 mt-4 mb-4">
            <ul className="space-y-5">
              {teachers.map((teacher) => (
                <li
                  key={teacher.user_id}
                  className={`flex items-center w-[330px] shadow space-x-3 p-2 ml-0 hover:bg-primary rounded-full transition ${
                    selectedTeacherId === teacher.user_id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  <img
                    src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
                    className="w-10 h-10 rounded-full shadow"
                  />
                  <Link
                    href={`/communicate/${teacher.user_id}`}
                    className="text-lg font-semibold"
                  >
                    {teacher.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
