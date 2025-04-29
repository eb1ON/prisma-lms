import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function RoadmapPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const courses = [
    { school_year: "1", name: "1-р курс", color: "bg-[#24ffa5]" },
    { school_year: "2", name: "2-р курс", color: "bg-[#24ffa5]" },
    { school_year: "3", name: "3-р курс", color: "bg-[#24ffa5]" },
    { school_year: "4", name: "4-р курс", color: "bg-[#24ffa5]" },
    { school_year: "5", name: "5-р курс", color: "bg-[#24ffa5]" },
  ];

  // Milestone бүрийн translateY утга
  const yTranslations = [
    "translate-y-[-70px]",
    "translate-y-[-20px]",
    "translate-y-[-10px]",
    "translate-y-[-70px]",
    "translate-y-[+20px]",
  ];

  return (
    <div className="min-h-screen bg-[#283131] px-4 py-16 flex flex-col items-center">
      {/* Title with Gradient Background (Updated with a wider background) */}
      <h1 className="text-3xl font-extrabold text-center bg-[#65d8ba] text-[#293536] border border-[#6be4b9] shadow-md shadow-[#6be4b9] py-4 px-8 w-full rounded-xl mb-8">
        Сургалтын агуулга
      </h1>

      <div className="w-full overflow-x-auto overflow-y-hidden">
        <div className="min-w-[1100px] relative px-8 pb-20 h-[300px]">
          {/* 🛣 Зам */}
          <svg
            viewBox="0 0 1100 200"
            className="w-full h-52 absolute top-14 left-0 z-0"
          >
            <path
              d="M 0 100 Q 150 0, 300 100 T 600 100 T 900 100 T 1100 100"
              stroke="#2b7a78"
              strokeWidth="22"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 0 100 Q 150 0, 300 100 T 600 100 T 900 100 T 1100 100"
              stroke="#ffffff"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="15,10"
            />
          </svg>

          {/* 📍 Milestones */}
          <div className="relative flex justify-between items-end z-10 h-full pt-16">
            {courses.map((course, index) => (
              <div
                key={course.school_year}
                className={`flex flex-col items-center w-24 text-center transition-all duration-300 ${yTranslations[index]}`}
              >
                <p className="text-sm font-medium text-gray-300 mb-2">
                  {course.name}
                </p>
                <Link
                  href={`/roadmap/${course.school_year}`}
                  className={`w-16 h-16 rounded-full ${course.color} flex items-center justify-center
                    text-white font-bold text-lg shadow-xl border-4 border-white
                    hover:scale-110 hover:shadow-2xl hover:shadow-[#24ffa5] transition duration-300 ease-in-out`}
                >
                  {course.school_year}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
