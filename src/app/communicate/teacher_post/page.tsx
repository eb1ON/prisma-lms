import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export default async function PostPage({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const { year } = searchParams;

  const session = await auth();
  if (!session || !session.user) {
    redirect("/auth/sign-in");
  }

  const email = session.user.email!;
  const currentUser = await prisma.users.findUnique({ where: { email } });
  if (!currentUser) {
    redirect("/auth/sign-in");
  }

  const schoolYears = [1, 2, 3, 4, 5];
  const selectedYear = year ? parseInt(year) : schoolYears[0];

  const posts = await prisma.post.findMany({
    where: {
      school_year: selectedYear,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <div className="flex flex-col w-full h-screen bg-background overflow-hidden text-foreground">
      <div className="flex w-full h-full">
        {/* Post Section */}
        <div className="w-9/12 flex flex-col bg-background p-4">
          {/* User Info */}
          <div className="bg-gradient-to-br from-[#a0bbdf] from-40% to-[#c68c8c] shadow-xl rounded-md p-4 mb-4 flex items-center space-x-5">
            <img
              src="https://png.pngtree.com/png-vector/20220210/ourmid/pngtree-avatar-bussinesman-man-profile-icon-vector-illustration-png-image_4384273.png"
              className="w-14 h-14 rounded-full border border-primary shadow"
            />
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
          </div>

          {/* Posts */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2">
            {posts.length === 0 ? (
              <p className="text-muted-foreground text-center pt-10">
                Одоогоор пост алга байна.
              </p>
            ) : (
              posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-card border border-border p-4 rounded-lg shadow"
                >
                  <h3 className="font-semibold text-primary text-lg">
                    📌 {post.title}
                  </h3>
                  <p className="text-foreground mt-2">{post.body}</p>
                </div>
              ))
            )}
          </div>

          {/* Post Form */}
          <form
            action="/api/post"
            method="POST"
            className="sticky bottom-0 bg-card rounded-lg shadow mt-4 p-4 space-x-4 flex"
          >
            <input type="hidden" name="school_year" value={selectedYear} />
            <input
              type="text"
              name="title"
              placeholder="Нийтлэлийн гарчиг"
              className="flex-1 p-3 border border-border rounded bg-background text-foreground focus:outline-none"
              required
            />
            <textarea
              name="body"
              placeholder="Нийтлэлийн агуулга..."
              className="flex-1 p-3 border border-border rounded bg-background text-foreground focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded"
            >
              Нийтлэх
            </button>
          </form>
        </div>

        {/* Sidebar (Years) */}
        <div className="w-3/12 bg-card p-6 pt-20 space-y-4 text-center shadow-xl rounded-l-lg border-l border-border">
          <h2 className="text-2xl font-bold text-primary">📚 Нийтлэл</h2>
          <h2 className="text-md font-normal text-muted-foreground mb-20">
            Нийтлэл бичих ангиа сонгоно уу
          </h2>
          <ul className="space-y-3">
            {schoolYears.map((y) => (
              <li key={y} className="mt-10">
                <a
                  href={`/communicate/teacher_post?year=${y}`}
                  className={`block text-center py-5 font-medium rounded-2xl transition ${
                    selectedYear === y
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  МКТК {y}-р курс
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
