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
    <div className="w-full mr-8 h-screen overflow-hidden bg-white dark:bg-[#0f181e] text-gray-700 dark:text-gray-200 px-0 ml-12 pt-8">
      {/* Title */}
      <div className="text-center bg-gray-100 dark:bg-[#13272e] shadow-md w-[1280px] ml-10 rounded-md p-3">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-white mb-1">
          Сургалтын агуулга
        </h1>
        <p className="text-[#5584c6] text-md">
          Курсээ сонгоод тухайн жилийн сургалтын агуулгатай танилцана уу
        </p>
      </div>

      {/* Milestones */}
      <div className="w-full bg-white dark:bg-[#13272e] rounded-xl mb-8 pr-12 p-6 pt-4">
        <div className="min-w-[1100px] relative h-[220px]">
          <svg
            viewBox="0 0 1190 140"
            className="w-full h-52 absolute top-4 left-8 z-0"
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
                className={`flex flex-col items-center w-24 ${yTranslations[index]}`}
              >
                <Link
                  href={`/roadmap/${course.school_year}`}
                  className="w-16 h-16 rounded-full bg-white dark:bg-[#0f181e] hover:bg-[#5584c6] hover:text-white flex items-center justify-center text-[#5584c6] font-bold text-xl border-2 border-[#5584c6] shadow-md"
                >
                  {course.school_year}
                </Link>
                <p className="text-sm text-[#5584c6] mt-3">{course.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-0 h-[300px] ml-10 mr-12">
        {/* Donut Chart */}
        <div className="bg-gray-100 dark:bg-[#13272e] space-y-0 h-[280px] w-[620px] rounded-md shadow-md flex flex-col items-center justify-center border border-gray-200 dark:border-[#264144]">
          <h2 className="text-lg font-bold text-gray-600 dark:text-gray-300">
            Ерөнхий болон мэргэжлийн хичээлийн харьцаа
          </h2>
          <div className="grid grid-cols-5 pt-10 gap-6">
            {subjectStats.map((stat) => (
              <div
                key={stat.year}
                className="relative flex flex-col items-center"
              >
                <svg
                  viewBox="0 0 36 36"
                  className="w-20 h-20 transform -rotate-90"
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
                <div className="absolute top-8 text-sm font-bold text-gray-600 dark:text-white">
                  {stat.professional}%
                </div>
                <span className="mt-8 text-xs text-gray-700 dark:text-gray-300">
                  {stat.year}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-gray-100 dark:bg-[#13272e] rounded-md p-4 pt-10 shadow-md flex flex-col items-center h-[280px] w-[620px] border border-gray-200 dark:border-[#264144]">
          <h2 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-3">
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
