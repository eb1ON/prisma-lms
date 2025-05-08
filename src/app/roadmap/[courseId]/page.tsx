import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import DescriptionPanel from "@/components/DescriptionPanel";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const { courseId } = await params;

  const roadmapData = await prisma.roadmap.findMany({
    where: {
      school_year: parseInt(courseId),
    },
    select: {
      lesson_name: true,
      credits: true,
      type: true,
      semester: true,
      school_year: true,
      Description: true,
    },
  });

  if (!roadmapData || roadmapData.length === 0) {
    return (
      <div className="flex items-center justify-center bg-white min-h-screen">
        <h1 className="text-3xl font-bold text-red-500">
          Roadmap олоогүй байна!
        </h1>
      </div>
    );
  }

  const groupedBySemester = roadmapData.reduce((acc, roadmap) => {
    const semester = roadmap.semester || "Unknown";
    if (!acc[semester]) {
      acc[semester] = [];
    }
    acc[semester].push(roadmap);
    return acc;
  }, {} as { [key: string]: typeof roadmapData });

  const eventsByCourse: { [key: string]: string[] } = {
    "1": ["🎯 Мэргэжил сонголт", "👋 Сургуульд дасан зохицох"],
    "2": ["🏭 Үйлдвэртэй танилцах дадлага", "🧑‍💼 Багаар ажиллах чадвар"],
    "3": ["📝 Улсын шалгалт", "📚 Судалгааны бичиг баримт"],
    "4": ["👷‍♂️ Мэргэжлийн дадлага", "📖 Судалгааны ажил үргэлжлүүлэх"],
    "5": ["💼 Ажлын ярилцлага", "🎓 Төгсөлтийн ажил, хамгаалалт"],
  };

  const total = roadmapData.length;
  const proCount = roadmapData.filter((x) => x.type === "Pro").length;
  const genCount = roadmapData.filter((x) => x.type === "Gen").length;
  const proPercent = Math.round((proCount / total) * 100);
  const genPercent = 100 - proPercent;

  return (
    <div className="bg-white py-4 ml-20 gap-5 overflow-hidden min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 overflow-hidden h-full">
        {/* Зүүн тал */}
        <div className="lg:col-span-2 w-[900px] p-8 space-y-8 overflow-hidden">
          <h2 className="text-4xl font-bold text-center text-gray-600 mb-6">
            {courseId}-р курсын агуулга
          </h2>

          <div className="space-y-8 overflow-hidden">
            {["Намар", "Хавар"].map((semester) => {
              const items = groupedBySemester[semester] ?? [];
              const bgImage =
                semester === "Намар"
                  ? "/images/autumn.png"
                  : "/images/spring.png";

              return (
                <div
                  key={semester}
                  className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Арын зураг */}
                  <div
                    className="absolute inset-0 z-0 pointer-events-none h-full"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.25,
                    }}
                  ></div>

                  {/* Контент */}
                  <div className="relative z-10 p-6 space-y-6">
                    <h3 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center space-x-2">
                      <span>{semester === "Намар" ? "🍁" : "🌸"}</span>
                      <span>{semester}</span>
                    </h3>

                    <div className="space-y-6">
                      {/* Мэргэжлийн хичээлүүд */}
                      <details className="group bg-white/80 rounded-lg border border-gray-300 shadow">
                        <summary className="cursor-pointer p-4 text-xl font-semibold text-gray-700 select-none hover:bg-white rounded-lg">
                          Мэргэжлийн хичээлүүд
                        </summary>
                        <div className="p-4 border-t border-gray-200 space-y-3 max-h-[300px] overflow-y-auto">
                          {items
                            .filter((item) => item.type === "Pro")
                            .map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-3 rounded-lg shadow hover:bg-gray-50 relative"
                              >
                                <h5 className="font-bold text-gray-800">
                                  {item.lesson_name}
                                </h5>
                                <p className="text-sm text-gray-500">
                                  Кредит: {item.credits}
                                </p>

                                <Link
                                  href={`?description=${encodeURIComponent(
                                    item.Description || ""
                                  )}`}
                                  scroll={false}
                                >
                                  <p className="absolute top-3 right-10 text-sm text-white bg-[#5584c6] px-4 py-2 rounded-md cursor-pointer hover:bg-[#2444c1] transition">
                                    Агуулга харах
                                  </p>
                                </Link>
                              </div>
                            ))}
                        </div>
                      </details>

                      {/* Ерөнхий хичээлүүд */}
                      <details className="group bg-white/80 rounded-lg border border-gray-300 shadow">
                        <summary className="cursor-pointer p-4 text-lg font-semibold text-gray-700 select-none hover:bg-white rounded-lg">
                          Ерөнхий хичээлүүд
                        </summary>
                        <div className="p-4 border-t border-gray-200 space-y-3 max-h-[300px] overflow-y-auto">
                          {items
                            .filter((item) => item.type === "Gen")
                            .map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-3 rounded-lg shadow hover:bg-gray-50 relative"
                              >
                                <h5 className="font-bold text-gray-800">
                                  {item.lesson_name}
                                </h5>
                                <p className="text-sm text-gray-500">
                                  Кредит: {item.credits}
                                </p>

                                <Link
                                  href={`?description=${encodeURIComponent(
                                    item.Description || ""
                                  )}`}
                                  scroll={false}
                                >
                                  <p className="absolute top-3 right-10 text-sm text-white bg-[#5584c6] px-4 py-2 rounded-md cursor-pointer hover:bg-[#2444c1] transition">
                                    Агуулга харах
                                  </p>
                                </Link>
                              </div>
                            ))}
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* ⬇️ Description гарч ирэх modal/panel */}

        <DescriptionPanel />

        {/* Баруун тал */}
        <div className="bg-gray-100 w-[400px] p-4 ml-10 pr-8 pt-4 space-y-2 overflow-hidden">
          <div className="flex justify-center flex-col rounded-lg h-[400px] border border-gray-200 p-8 shadow text-center">
            <h2 className="text-xl font-bold text-gray-700 mb-6">
              Хичээлийн харьцаа
            </h2>
            <div className="flex justify-center">
              <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                <circle
                  className="text-[#b2cef5]"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  r="16"
                  cx="18"
                  cy="18"
                />
                <circle
                  className="text-[#5584c6]"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${proPercent}, ${100 - proPercent}`}
                  r="16"
                  cx="18"
                  cy="18"
                />
              </svg>
            </div>
            <p className="text-gray-700 mt-4">
              Мэргэжлийн {proPercent}% | Ерөнхий {genPercent}%
            </p>
          </div>

          <div className="h-[270px] rounded-lg border border-gray-200 p-8 shadow space-y-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Онцгой үйл явдлууд
            </h2>
            <ul className="space-y-3">
              {(eventsByCourse[courseId] ?? []).map((event, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-3 text-gray-600 text-lg"
                >
                  <span className="text-2xl">{event.split(" ")[0]}</span>
                  <span>{event.substring(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
