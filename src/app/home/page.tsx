import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const Home = async () => {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/sign-in");
    return null;
  }

  const user = await prisma.users.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/sign-in");
    return null;
  }

  const timetableData = await prisma.timetable.findMany({
    where:
      user.role === "teacher"
        ? { teacher_id: user.user_id }
        : { school_year: user.school_year || undefined },
    include: { lesson: true },
  });

  const today = new Date();
  const closestSchedule = await prisma.schedule.findFirst({
    where: {
      date: {
        gte: today,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const weekdays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];
  const timeSlots = [
    "08:50 - 10:10",
    "10:20 - 11:40",
    "11:50 - 13:10",
    "14:00 - 15:20",
    "15:30 - 16:50",
  ];

  const getLessonForTimeSlot = (day: string, slot: string) => {
    const startTime = slot.split(" - ")[0];
    const entry = timetableData.find(
      (entry) => entry.weekdays === day && entry.start_time === startTime
    );
    return entry ? entry.lesson.lesson_name : "-";
  };

  return (
    <div className="bg-[#283131] min-h-screen py-10 px-4 md:px-10 font-sans text-[#d6faff]">
      <h1 className="text-3xl font-bold text-center  bg-[#13272e] text-white py-4 rounded-xl shadow-sm">
        Нүүр хуудас
      </h1>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 mt-5">
        {/* Profile and Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#13272e] p-6 rounded-2xl shadow-lg text-center">
            <img
              src={
                user.image ||
                "/images/487781992_1399606614564756_2379153872326703844_n.jpg"
              }
              alt="User"
              className="w-24 h-24 mx-auto rounded-full border-2 border-[#24ffa5] shadow-lg shadow-[#24ffa5]"
            />
            <h2 className="text-xl font-bold mt-4 text-white">{user.name}</h2>
            <p className="text-[#24ffa5] font-medium capitalize">
              {user.role === "teacher"
                ? "Багш"
                : user.role === "student"
                ? `Оюутан`
                : "Админ"}
            </p>
            {session?.user?.role === "student" && (
              <p className="text-gray-400 text-sm mt-1">
                Курс: {session.user.school_year || "-"}
              </p>
            )}
          </div>

          <div className="bg-[#13272e] p-6 rounded-2xl shadow-lg">
            <h3 className="font-semibold text-[#d6faff] mb-2 text-center text-lg">
              Тойм
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-[#d6faff]">
              <div className="bg-[#0f181e] rounded-xl p-4 shadow-inner text-center border border-[#24ffa530]">
                <p className="text-2xl font-bold text-[#24ffa5]">
                  {timetableData.length}
                </p>
                <p className="text-gray-400">Хичээл</p>
              </div>
              <div className="bg-[#0f181e] rounded-xl p-4 shadow-inner text-center border border-[#24ffa530]">
                <p className="text-2xl font-bold text-[#24ffa5]">
                  {new Set(timetableData.map((x) => x.weekdays)).size}
                </p>
                <p className="text-gray-400">Өдөр</p>
              </div>
            </div>
          </div>

          {closestSchedule && (
            <div className="bg-[#13272e] p-6 rounded-2xl shadow-lg">
              <h3 className="font-semibold text-[#d6faff] mb-2 text-center text-lg">
                🗓️ Тун удахгүй болох үйл явдал
              </h3>
              <p className="text-[#24ffa5] text-center font-bold text-md">
                {closestSchedule.event}
              </p>
              <p className="text-center text-gray-400 text-sm mt-1">
                {new Date(closestSchedule.date).toLocaleDateString("mn-MN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div className="lg:col-span-2 bg-[#13272e] p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#24ffa5]">
              {user.role === "teacher"
                ? "Хичээлийн хуваарь (Багш)"
                : `Хичээлийн хуваарь  ${user.school_year}-5`}
            </h2>
            <span className="text-sm text-gray-400">Хичээлүүд</span>
          </div>
          {timetableData.length === 0 ? (
            <p className="text-center text-red-500">Мэдээлэл олдсонгүй</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#24ffa530]">
              <table className="min-w-full text-sm text-[#d6faff]">
                <thead className="bg-[#0f181e]">
                  <tr>
                    <th className="py-3 px-4 text-left border-b border-[#24ffa530]">
                      Цаг
                    </th>
                    {weekdays.map((day) => (
                      <th
                        key={day}
                        className="py-3 px-4 text-center border-b border-[#24ffa530]"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot} className="even:bg-[#0f181e]">
                      <td className="py-2 px-4 font-medium border-t border-[#24ffa530] bg-[#0f181e] text-white">
                        {slot}
                      </td>
                      {weekdays.map((day) => (
                        <td
                          key={`${day}-${slot}`}
                          className="py-2 px-4 text-center border-t border-[#24ffa530]"
                        >
                          {getLessonForTimeSlot(day, slot)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
