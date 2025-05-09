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
      <div className="flex items-center justify-center bg-background min-h-screen">
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
    <div className="bg-background py-2 px-0 md:px-0 min-h-screen text-foreground">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Зүүн тал */}
        <div className="w-full lg:w-8/12 space-y-2">
          <h2 className="text-3xl font-bold text-center mb-4">
            {" "}
            {courseId}-р курсын агуулга{" "}
          </h2>

          <div className="space-y-4">
            {["Намар", "Хавар"].map((semester) => {
              const items = groupedBySemester[semester] ?? [];
              const bgImage =
                semester === "Намар"
                  ? "/images/autumn.png"
                  : "/images/spring.png";

              return (
                <div
                  key={semester}
                  className="relative border border-border rounded-lg overflow-hidden shadow-sm bg-card"
                >
                  <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                      backgroundImage: `url(${bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      opacity: 0.25,
                    }}
                  ></div>

                  <div className="relative z-10 p-6 space-y-6">
                    <h3 className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
                      <span>{semester === "Намар" ? "🍁" : "🌸"}</span>
                      <span>{semester}</span>
                    </h3>

                    <div className="space-y-6">
                      {/* Мэргэжлийн */}
                      <details className="group bg-background rounded-lg border border-border shadow">
                        <summary className="cursor-pointer p-4 text-xl font-semibold select-none hover:bg-muted rounded-lg">
                          Мэргэжлийн хичээлүүд
                        </summary>
                        <div className="p-4 border-t border-border space-y-3 max-h-[400px] overflow-y-auto">
                          {items
                            .filter((item) => item.type === "Pro")
                            .map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-card p-3 rounded-lg shadow hover:bg-muted relative"
                              >
                                <h5 className="font-bold">
                                  {item.lesson_name}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Кредит: {item.credits}
                                </p>
                                <Link
                                  href={`?description=${encodeURIComponent(
                                    item.Description || ""
                                  )}`}
                                  scroll={false}
                                >
                                  <p className="absolute top-3 right-4 text-sm text-white bg-[#5584c6] px-4 py-2 rounded-md cursor-pointer hover:bg-[#2444c1] transition">
                                    Агуулга харах
                                  </p>
                                </Link>
                              </div>
                            ))}
                        </div>
                      </details>

                      {/* Ерөнхий */}
                      <details className="group bg-background rounded-lg border border-border shadow">
                        <summary className="cursor-pointer p-4 text-lg font-semibold select-none hover:bg-muted rounded-lg">
                          Ерөнхий хичээлүүд
                        </summary>
                        <div className="p-4 border-t border-border space-y-3 max-h-[400px] overflow-y-auto">
                          {items
                            .filter((item) => item.type === "Gen")
                            .map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-card p-3 rounded-lg shadow hover:bg-muted relative"
                              >
                                <h5 className="font-bold">
                                  {item.lesson_name}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Кредит: {item.credits}
                                </p>
                                <Link
                                  href={`?description=${encodeURIComponent(
                                    item.Description || ""
                                  )}`}
                                  scroll={false}
                                >
                                  <p className="absolute top-3 right-4 text-sm text-white bg-[#5584c6] px-4 py-2 rounded-md cursor-pointer hover:bg-[#2444c1] transition">
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

        <DescriptionPanel />

        {/* Баруун тал */}
        <div className="w-full h-full shadow lg:w-4/12 space-y-2 pb-10 mt-1 py-5 overflow-y-hidden ">
          <div className="bg-card rounded-lg border border-border m-4 p-6 shadow space-y-4 mt-7 text-center">
            <h2 className="text-xl font-bold">Хичээлийн харьцаа</h2>
            <svg viewBox="0 0 36 36" className="w-32 h-32 mx-auto -rotate-90">
              <circle
                className="text-muted"
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
            <p>Мэргэжлийн {proPercent}%</p>
            <p>Ерөнхий {genPercent}%</p>
          </div>

          <div className="bg-card rounded-lg border border-border m-4 p-6 shadow space-y-4">
            <h2 className="text-xl font-bold">Онцгой үйл явдлууд</h2>
            <ul className="space-y-3">
              {(eventsByCourse[courseId] ?? []).map((event, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-3 text-muted-foreground text-md"
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
