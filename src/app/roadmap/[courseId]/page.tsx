import { prisma } from "../../../lib/prisma";

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
    },
  });

  if (!roadmapData || roadmapData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1c1f23]">
        <h1 className="text-3xl font-bold text-red-500">
          Roadmap олоогүй байна!{" "}
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

  return (
    <div className="min-h-screen bg-[#283131] px-4 py-16 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-center bg-[#313f40] text-[#6be4b9] border border-[#6be4b9] shadow-md shadow-[#6be4b9] py-4 px-8 w-full rounded-xl mb-8">
        {courseId}-р курсийн сургалтын агуулга
      </h1>

      <div className="space-y-8 bg-[#283131]">
        {Object.entries(groupedBySemester).map(([semester, items], index) => (
          <div key={index} className="border p-4 rounded-lg bg-[#1c1f23]">
            <h2
              className="semester-header mb-4 text-2xl font-bold text-center py-4"
              style={{
                backgroundColor:
                  semester === "Намар"
                    ? "#24ffa5" // Намрын улиралд алтлаг өнгө
                    : semester === "Хавар"
                    ? "#24ffa5" // Хаврын улиралд ногоон өнгө
                    : "#2e3d3e", // Мэдээлэл байхгүй үед илүү харанхуй өнгө
              }}
            >
              <span className="text-shadow">
                {semester === "Хавар"
                  ? " Хаврын улиралд"
                  : semester === "Намар"
                  ? " Намрын улиралд"
                  : "📚 Unknown Semester"}
              </span>
            </h2>

            <div className="space-y-4">
              {["Pro", "Gen"].map((type, idx) => {
                const filteredItems = items.filter(
                  (item) => item.type === type
                );

                if (filteredItems.length > 0) {
                  return (
                    <details
                      key={idx}
                      className=" rounded-lg bg-[#1c1f23] open:shadow-md transition-all duration-300"
                    >
                      <summary className="cursor-pointer font-semibold text-xl p-4 select-none text-gray-300 hover:text-[#24ffa5]">
                        {type === "Pro"
                          ? "Мэргэжлийн хичээлүүд"
                          : "Ерөнхий эрдмийн хичээлүүд"}
                      </summary>

                      <div className="grid grid-cols-2 gap-4 p-4">
                        {filteredItems.map((roadmap, idx) => (
                          <div
                            key={idx}
                            className="lesson-card p-4 boder-[#6be4b9] shadow-md shadow-[#24ffa5] rounded-lg bg-[#1c1f23]"
                          >
                            <h4 className="text-lg font-bold text-[#24ffa5]">
                              {roadmap.lesson_name}
                            </h4>
                            <p className="text-sm text-[#a8a8a8]">
                              Кредит: {roadmap.credits}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
