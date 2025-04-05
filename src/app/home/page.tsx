import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const Home = async () => {
  const session = await auth();

  // 🔐 Redirect if no session
  if (!session) redirect("/sign-in");

  // 👤 Get user info
  const user = await prisma.users.findUnique({
    where: { email: session.user?.email },
  });

  // Redirect if user not found
 

  // 📚 Get timetable
  const timetableData = await prisma.timetable.findMany({
    where:
      user.role === "teacher"
        ? { teacher_id: user.user_id }
        : { school_year: user.school_year || undefined },
    include: {
      lesson: true,
    },
  });

  // 🕒 Time slots and weekdays
  const weekdays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];
  const timeSlots = [
    "8:50 - 10:10",
    "10:20 - 11:40",
    "11:50 - 13:10",
    "14:00 - 15:20",
  ];

  // 📝 Get lessons for each slot
  const getLessonForTimeSlot = (day, slot) => {
    const startTime = slot.split(" - ")[0];
    const entry = timetableData.find(
      (entry) => entry.weekdays === day && entry.start_time === startTime
    );
    return entry ? entry.lesson.lesson_name : "Хичээл байхгүй";
  };

  return (
    <div className="p-8 min-h-screen w-full ">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
        {/* 🎉 Profile Section */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <img
            src={user.image || "/images/default-avatar.png"}
            alt="User Profile"
            className="w-28 h-28 rounded-full border-4 border-purple-500"
          />
          <h1 className="text-2xl font-semibold mt-4 text-gray-800">
            {user.name}
          </h1>
          <p className="text-gray-500 mt-1">
            {user.role === "teacher" ? "Багш" : "Оюутан"}
          </p>
        </div>

        {/* 📅 Timetable */}
        <div className="col-span-2 p-6 bg-white shadow-md rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {user.role === "teacher"
              ? "Багшийн Хуваарь"
              : `Оюутны Хуваарь (Курс ${user.school_year})`}
          </h2>
          {timetableData.length === 0 ? (
            <p className="text-center text-red-500">Мэдээлэл олдсонгүй</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-gray-600">
                  <th className="px-4 py-3 text-left">Цаг</th>
                  {weekdays.map((day) => (
                    <th
                      key={day}
                      className="px-4 py-3 text-left border-l border-gray-200"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 font-semibold">
                      {slot}
                    </td>
                    {weekdays.map((day) => (
                      <td
                        key={`${day}-${slot}`}
                        className="px-4 py-3 text-center border-l border-gray-200"
                      >
                        {getLessonForTimeSlot(day, slot)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 📚 Course and Role Info */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">Хичээлүүд</h2>
            <p className="text-gray-500 mt-1">
              Та нийт {timetableData.length} хичээлтэй байна.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">Эрх</h2>
            <p className="text-gray-500 mt-1">
              {user.role === "teacher" ? "Багш" : "Оюутан"}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">Курс</h2>
            <p className="text-gray-500 mt-1">{user.school_year || "Хоосон"}</p>
          </div>
        </div>

        {/* 📝 Recent Activity */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📚 Сүүлийн үйл ажиллагаа
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-blue-500 text-xl">📘</div>
              <div>
                <p className="text-gray-600 font-medium">
                  Хичээл AI-д шинэ материал нэмэгдсэн.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-green-500 text-xl">✅</div>
              <div>
                <p className="text-gray-600 font-medium">
                  Системд амжилттай нэвтэрсэн.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-purple-500 text-xl">📅</div>
              <div>
                <p className="text-gray-600 font-medium">
                  Багшийн хуваарь шинэчлэгдсэн.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
