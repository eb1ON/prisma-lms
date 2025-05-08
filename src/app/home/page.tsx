import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Calendar from "@/components/HomeCalendar";

const prisma = new PrismaClient();

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in");

  const user = await prisma.users.findUnique({
    where: { email: session.user.email ?? undefined },
  });
  if (!user) redirect("/sign-in");

  const timetableData = await prisma.timetable.findMany({
    where:
      user.role === "teacher"
        ? { teacher_id: user.user_id }
        : { school_year: user.school_year ?? undefined },
    include: { lesson: true },
  });

  const assignments =
    user.role === "student"
      ? await prisma.assignment.findMany({
          where: { course: user.school_year ?? 0 },
          include: { teacher: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        })
      : [];

  const submissions =
    user.role === "teacher"
      ? await prisma.submission.findMany({
          where: { teacherId: user.user_id },
          include: {
            assignment: { select: { title: true } },
            student: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : [];

  const weekdays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];
  const timeSlots = ["08:50", "10:20", "11:50", "14:00", "15:30"];

  const getLessonForTimeSlot = (day: string, slot: string) => {
    const entry = timetableData.find(
      (entry) => entry.weekdays === day && entry.start_time === slot
    );
    return entry ? entry.lesson.lesson_name : "-";
  };

  return (
    <div className="bg-background text-foreground min-h-screen m-0 pl-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Зүүн тал → Хичээлийн хуваарь */}
        <div className="lg:col-span-2 space-y-0 w-[940px]">
          <div className="bg-card p-6 rounded-2xl space-y-6 shadow">
            <div className="shadow bg-gradient-to-br from-[#a0bbdf] to-[#c68c8c] dark:from-[#1a2a31] dark:to-[#1a2a31] p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-black dark:text-white text-center pb-6 pt-2">
                Хичээлийн хуваарь
              </h2>
              <div className="grid grid-cols-[80px_repeat(5,minmax(0,1fr))] gap-2">
                <div className="space-y-3">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className="w-full h-[80px] flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-white"
                    >
                      {slot}
                    </div>
                  ))}
                </div>
                {weekdays.map((day) => (
                  <div key={day} className="space-y-3">
                    {timeSlots.map((slot) => {
                      const lesson = getLessonForTimeSlot(day, slot);
                      const hasLesson = lesson !== "-";
                      return (
                        <div
                          key={day + slot}
                          className={`rounded-lg text-center border border-gray-200 dark:border-[#264144]
                          ${
                            hasLesson
                              ? "bg-white dark:bg-[#0f181e] text-black dark:text-white"
                              : "bg-gray-200 dark:bg-[#1a2a31] text-gray-500 dark:text-gray-400"
                          }
                          w-full h-[80px] flex items-center justify-center text-md`}
                        >
                          {hasLesson && <p>{lesson}</p>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Даалгавар - Student */}
          {user.role === "student" && assignments.length > 0 && (
            <details className="bg-gradient-to-br from-[#a0bbdf] to-[#c68c8c] dark:from-[#13272e] dark:to-[#13272e] w-[890px] ml-6 border p-6 rounded-2xl shadow space-y-4">
              <summary className="cursor-pointer text-lg font-normal text-gray-700 dark:text-white">
                🎒 Даалгавруудыг харах
              </summary>
              <div className="mt-4 space-y-4">
                {assignments.map((a) => (
                  <div
                    key={a.id}
                    className="bg-gray-50 dark:bg-[#1a2a31] p-4 rounded-lg border border-gray-700 dark:border-[#264144]"
                  >
                    <p className="font-semibold text-black dark:text-white">
                      {a.title}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      🧑‍🏫 {a.teacher.name}
                    </p>
                    {a.fileUrl && (
                      <a
                        href={a.fileUrl}
                        target="_blank"
                        className="text-[#5584c6] underline"
                      >
                        📎 Файл татах
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Ирсэн даалгавар - Teacher */}
          {user.role === "teacher" && submissions.length > 0 && (
            <details className="w-[890px] ml-6 border p-6 rounded-2xl dark:bg-[#13272e] space-y-4">
              <summary className="cursor-pointer text-lg font-normal text-gray-700 dark:text-white">
                Ирсэн даалгавруудыг харах
              </summary>
              <div className="mt-4 space-y-4">
                {submissions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-gray-50 dark:bg-[#1a2a31] p-4 rounded-lg border border-gray-700 dark:border-[#264144]"
                  >
                    <p className="text-gray-700 dark:text-white font-bold mb-3">
                      {s.student.name} → 📝 {s.assignment.title}
                    </p>
                    {s.fileUrl && (
                      <a
                        href={s.fileUrl}
                        target="_blank"
                        className="text-[#5584c6] underline"
                      >
                        📎 Файл татах
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Баруун тал → Profile + Calendar */}
        <div className="space-y-6 w-full ml-20 lg:w-[360px]">
          <div className="bg-card dark:bg-[#13272e] border border-gray-200 dark:border-[#264144] p-6 rounded-2xl shadow space-y-4">
            <div className="flex flex-col justify-center items-center space-y-4">
              <img
                src={user.image || "/images/erdenebat.png"}
                alt="User"
                className="w-24 h-24 rounded-full border-2 border-[#5584c6]"
              />
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-700 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Статус:{" "}
                  {user.role === "teacher"
                    ? "Багш"
                    : user.role === "student"
                    ? "Оюутан"
                    : "Админ"}
                </p>
              </div>
            </div>

            <Calendar events={[]} />
          </div>
        </div>
      </div>
    </div>
  );
}
