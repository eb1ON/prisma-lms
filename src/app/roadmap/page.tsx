import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RoadmapPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const courses = [
    { school_year: "1", name: "1-р курс", color: "bg-[#5584c6]" },
    { school_year: "2", name: "2-р курс", color: "bg-[#5584c6]" },
    { school_year: "3", name: "3-р курс", color: "bg-[#5584c6]" },
    { school_year: "4", name: "4-р курс", color: "bg-[#5584c6]" },
    { school_year: "5", name: "5-р курс", color: "bg-[#5584c6]" },
  ];

  const yTranslations = [
    "translate-y-[-30px]",
    "translate-y-[-10px]",
    "translate-y-[20px]",
    "translate-y-[-25px]",
    "translate-y-[-1px]",
  ];

  const subjectStats = [
    { year: "1-р курс", general: 80, professional: 20 },
    { year: "2-р курс", general: 60, professional: 40 },
    { year: "3-р курс", general: 40, professional: 60 },
    { year: "4-р курс", general: 30, professional: 70 },
    { year: "5-р курс", general: 10, professional: 90 },
  ];

  return (
    <div className="w-full h-screen bg-white dark:bg-[#0f181e] text-gray-700 dark:text-gray-200 px-1 pt-0">
      {/* Title */}
      <div className="text-center bg-gray-100 dark:bg-[#13272e] shadow-md max-w-5xl mx-auto rounded-md p-4">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-white mb-1">
          Сургалтын агуулга
        </h1>
        <p className="text-[#5584c6] text-md">
          Курсээ сонгоод тухайн жилийн сургалтын агуулгатай танилцана уу
        </p>
      </div>

      {/* Milestones */}
      <div className="w-full bg-white dark:bg-[#13272e] rounded-xl mb-6 p-6 pt-0 max-w-6xl mx-auto">
        <div className="w-full relative h-[200px]">
          <svg
            viewBox="0 0 1100 140"
            className="w-full h-full absolute top-0 left-0 z-0"
          >
            <path
              d="M 0 90 Q 150 0, 300 90 T 600 110 T 900 100 T 1100 100"
              stroke="#B0B0B4"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 0 90 Q 150 0, 300 90 T 600 110 T 900 100 T 1100 100"
              stroke="#fff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="15,10"
            />
          </svg>

          <div className="relative flex justify-between items-end z-10 h-full">
            {courses.map((course, index) => (
              <div
                key={course.school_year}
                className={`flex flex-col items-center w-20 ${yTranslations[index]}`}
              >
                <Link
                  href={`/roadmap/${course.school_year}`}
                  className="w-14 h-14 rounded-full bg-white dark:bg-[#0f181e] hover:bg-[#5584c6] hover:text-white flex items-center justify-center text-[#5584c6] font-bold text-xl border-2 border-[#5584c6] shadow-md"
                >
                  {course.school_year}
                </Link>
                <p className="text-xs text-[#5584c6] mt-3">{course.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Donut Chart */}
        <div className="bg-gray-100 dark:bg-[#13272e] rounded-md shadow-md p-6 flex flex-col items-center justify-center border border-gray-200 dark:border-[#264144]">
          <h2 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-6">
            Ерөнхий болон мэргэжлийн хичээлийн харьцаа
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {subjectStats.map((stat) => (
              <div
                key={stat.year}
                className="relative flex flex-col items-center"
              >
                <svg
                  viewBox="0 0 36 36"
                  className="w-16 h-16 transform -rotate-90"
                >
                  <circle
                    className="text-gray-300 dark:text-gray-600"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    r="13.9155"
                    cx="18"
                    cy="18"
                  />
                  <circle
                    className="text-[#5584c6]"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeDasharray={`${stat.professional} ${
                      100 - stat.professional
                    }`}
                    fill="none"
                    r="13.9155"
                    cx="18"
                    cy="18"
                  />
                </svg>
                <div className="absolute top-7 text-sm font-bold text-gray-600 dark:text-white">
                  {stat.professional}%
                </div>
                <span className="mt-6 text-xs text-gray-700 dark:text-gray-300">
                  {stat.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-gray-100 dark:bg-[#13272e] rounded-md shadow-md p-6 flex flex-col items-center border border-gray-200 dark:border-[#264144]">
          <h2 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-4">
            Мэргэжлийн хичээлийн өсөлт
          </h2>

          <svg viewBox="0 0 300 100" className="w-full h-32">
            <polyline
              fill="none"
              stroke="#5584c6"
              strokeWidth="3"
              points="0,80 60,70 120,60 180,45 240,30 300,20"
            />
            {subjectStats.map((stat, index) => (
              <g key={index}>
                <circle
                  cx={index * 60}
                  cy={100 - stat.professional}
                  r="4"
                  fill="#5584c6"
                />
                <text
                  x={index * 60}
                  y={100 - stat.professional - 10}
                  fill="#333"
                  className="dark:fill-gray-300"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {stat.professional}%
                </text>
              </g>
            ))}
          </svg>

          <div className="flex justify-between w-full text-xs text-gray-700 dark:text-gray-300 mt-2">
            {subjectStats.map((stat) => (
              <span key={stat.year}>{stat.year}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
