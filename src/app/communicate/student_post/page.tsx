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
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const email = session.user.email!;
  const currentUser = await prisma.users.findUnique({ where: { email } });
  if (!currentUser) {
    redirect("/sign-in");
  }

  const selectedButton =
    currentUser.role === "teacher"
      ? "/communicate/teacher_post"
      : "/communicate/student_post";

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
    <div className="flex flex-col mt-3 mb-5 w-full h-screen border-b rounded-md border-[#6be4b9] bg-[#1e2627] overflow-hidden">
      {/* Top Navigation */}
      <div className="flex w-full h-12 bg-[#313f40] border border-[#6be4b9] mb-1 rounded-sm">
        <Link
          href={selectedButton}
          className="flex-1 h-12 text-2xl font-bold text-gray-200 hover:bg-[#6be4b9] hover:text-black flex items-center justify-center"
        >
          Нийтлэл
        </Link>
        <Link
          href={`/communicate/${selectedTeacherId}`}
          className="flex-1 h-12 text-2xl font-bold text-gray-200 hover:bg-[#6be4b9] hover:text-black flex items-center justify-center"
        >
          Мессеж
        </Link>
      </div>

      {/* User Info */}
      <div className="mt-3 flex justify-start space-x-3 items-center px-8">
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

      {/* Main Section */}
      <div className="flex w-full overflow-y-auto h-full">
        {/* Sidebar - багш нарын жагсаалт */}
        <div className="w-3/12 bg-[#313f40] mt-5 rounded-md shadow-lg shadow-[#6be4b9] border-r border-[#6be4b9] pt-16 mr-5 overflow-y-auto">
          <ul className="space-y-2">
            {teachers.map((teacher) => (
              <li key={teacher.user_id}>
                <a
                  href={`/communicate/${teacher.user_id}`}
                  className={`p-3 flex justify-center text-lg font-semibold rounded ${
                    selectedTeacherId === teacher.user_id
                      ? "bg-[#6be4b9] text-black"
                      : "text-gray-300 hover:bg-[#6be4b9] hover:text-black"
                  }`}
                >
                  {teacher.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Posts */}
        <div className="shadow-md shadow-[#6be4b9] border border-[#6be4b9] w-9/12 h-full flex flex-col rounded-lg mt-5 ml-2">
          {/* Header area */}
          <div className="m-3 p-2 w-auto rounded-lg mb-4 flex items-center bg-[#6be4b9] space-x-4">
            <img
              src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
              alt="User Profile"
              className="w-10 h-10 rounded-full border border-purple-500 shadow-md"
            />
            <h1 className="font-bold text-gray-800 text-xl">
              {currentUser.name}
            </h1>
          </div>

          {/* Scrollable posts */}
          <div className="flex-1 items-center ml-56 overflow-y-auto pr-2">
            {posts.length === 0 ? (
              <p className="text-gray-400 pt-10 text-center">
                Одоогоор пост алга байна.
              </p>
            ) : (
              posts.map((post, index) => (
                <div
                  key={index}
                  className="mb-4 w-96 p-4 bg-[#313f40] rounded-md shadow-md shadow-[#6be4b9]"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {post.title}
                  </h3>
                  <p className="text-gray-300">{post.body}</p>
                  <p className="text-sm text-gray-500">
                    Багшийн ID: {post.teacher_id}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
