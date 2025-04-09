import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function PostPage({ searchParams }: { searchParams: { year?: string } }) {
  const session = await auth();
  if (!session || !session.user) redirect("/auth/sign-in");

  const email = session.user.email!;
  const currentUser = await prisma.users.findUnique({ where: { email } });
  if (!currentUser) redirect("/auth/sign-in");

  const schoolYears = [1, 2, 3, 4, 5];
  const selectedYear = parseInt(searchParams.year ?? "0");

  const posts =
    selectedYear > 0
      ? await prisma.post.findMany({
          where: { school_year: selectedYear, teacher_id: currentUser.user_id },
          orderBy: { created_at: "asc" },
        })
      : [];

  const selectedButton =
    currentUser.role === "teacher"
      ? "/communicate/teacher_post"
      : "/communicate/student_post";

  return (
    <div className="flex flex-col mt-3 mb-3 w-full h-screen bg-[#1e2627] overflow-y-hidden">
      {/* Navigation */}
      <div className="flex w-full bg-[#313f40] shadow-sm shadow-[#6be4b9] mb-1 rounded-sm">
        <button className="flex-1 h-12 text-2xl font-bold text-gray-200 hover:bg-[#6be4b9] hover:text-black">
          <a href={selectedButton}>Нийтлэл</a>
        </button>
        <button className="flex-1 h-12 text-2xl font-bold text-gray-200 hover:bg-[#6be4b9] hover:text-black">
          <a href="/communicate/1">Мессеж</a>
        </button>
      </div>

      {/* User Info */}
      <div className="flex justify-start space-x-3 items-center px-8 mb-4 mt-4">
        <img
            src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
            alt="User Profile"
            className="w-10 h-10 rounded-full border border-purple-500 shadow-md"
          />
        <div>
          <h1 className="text-xl font-semibold text-[#6be4b9]">{currentUser.name}</h1>
          <p className="text-sm text-gray-300">{currentUser.role === "teacher" ? "Багш" : "Оюутан"}</p>
        </div>
        
      </div>

      {/* Main Content */}
      <div className="flex w-full h-full rounded-sm shadow-xl shadow-[#6be4b9]">
        {/* Sidebar */}
        <div className="w-2/12 bg-[#313f40] shadow-md shadow-r shadow-[#6be4b9] pt-10">
          <ul className="space-y-2">
            {schoolYears.map((year) => (
              <li key={year}>
                <a
                  href={`/communicate/teacher_post?year=${year}`}
                  className={`text-lg p-3 rounded flex justify-center font-medium ${
                    selectedYear === year
                      ? "bg-[#6be4b9] text-black"
                      : "text-gray-300 hover:bg-[#6be4b9] hover:text-black"
                  }`}
                >
                  МКТК {year}-5 анги
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Posts + Form */}
        <div className="w-10/12 h-full justify-center flex flex-col p-5">
          {/* Scrollable post list */}
          <div className="flex-1 items-center justify-center overflow-y-auto pr-2">
            {selectedYear > 0 && (
              <>
                {posts.length === 0 ? (
                  <p className="text-gray-400 ">Одоогоор пост алга байна.</p>
                ) : (
                  posts.map((post, index) => (
                    <div key={index} className="mb-4 flex flex-col justify-center ml-56 items-center w-2/4 p-4 shadow-[#6be4b9] bg-[#313f40] rounded-md shadow-md">
                      <h3 className="text-lg font-semibold text-white">Нийтлэлийн гарчиг: {post.title}</h3>
                      <p className="text-gray-300">Нийтлэлийн агуулга: {post.body}</p>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Form - always visible */}
          {selectedYear > 0 && (
            <form
              id="post-form"
              className="sticky bottom-0 mt-3 space-y-3 p-1 rounded-md"
            >
              <div className="flex flex-row ">
                <input type="hidden" name="school_year" value={selectedYear} />
                <input
                  type="text"
                  name="title"
                  placeholder="Нийтлэлийн гарчиг"
                  className="w-4/12 h-10 p-2 mr-2 rounded border border-[#6be4b9] bg-[#1e2627] text-white"
                  required
                />
                <textarea
                  name="body"
                  placeholder="Нийтлэлийн агуулга..."
                  className="w-7/12 h-10 p-2 mr-3 rounded border border-[#6be4b9] bg-[#1e2627] text-white"
                  required
                />
                  <button
                  type="submit"
                  className="px-1 w-1/12 p-2 h-10 py-2 bg-[#6be4b9] text-[#1e2627] font-semibold rounded"
                >
                  Нийтлэх
                </button>
              </div>
              
            </form>
          )}
        </div>
      </div>

      {/* Client-side form handler */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener("DOMContentLoaded", function () {
              const form = document.getElementById("post-form");
              if (!form) return;

              form.addEventListener("submit", function (e) {
                e.preventDefault();
                const formData = new FormData(form);
                fetch("/api/post", {
                  method: "POST",
                  body: formData
                }).then(() => {
                  form.reset();               // 🧼 Input-уудыг цэвэрлэнэ
                  window.location.reload();   // 🔁 Хуудсыг дахин ачаална
                });
              });
            });
          `,
        }}
      />
    </div>
  );
}
