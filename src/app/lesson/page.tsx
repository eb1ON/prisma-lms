import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TypesGP } from "@prisma/client";

const prisma = new PrismaClient();

const Lesson = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const Teacherlessonlist = await prisma.lesson_list.findMany({
    where: { teacher_id: session?.user.user_id },
  });
  const Studentlessonlist = await prisma.lesson_list.findMany({
    where: { school_year: session?.user.school_year, type: TypesGP.Pro },
    include: {
      teacher: true,
    },
  });

  return (
    <div className="p-8 min-h-screen w-full space-y-6 bg-[#283131]">
      <h1 className="text-3xl font-bold text-center bg-[#65d8ba] shadow-md text-[#293536] py-4 rounded-xl shadow-sm">
        Хичээлүүд
      </h1>

      {session.user.role === "teacher" && Teacherlessonlist.length > 0 ? (
        Teacherlessonlist.map((lesson) => (
          <div key={lesson.lesson_code}>
            <Link
              href={`/lesson/view/${lesson.lesson_code}`}
              className="border border-[#6be4b9]  bg-[#313f40] flex items-center justify-between p-6  rounded-2xl shadow-xl hover:shadow-lg transition-all duration-300 w-full max-w-2xl mx-auto"
            >
              <div className="flex items-center space-x-4">
                <img
                  src="/images/lesson-thumbnail.svg"
                  alt="Lesson"
                  className="w-16 h-16"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {lesson.lesson_name}
                  </h3>
                  <p className="text-sm text-white mt-2">
                    Курс:{" "}
                    <span className="font-medium text-[#6be4b9]">
                      {lesson.school_year}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-[#6be4b9] text-2xl">➜</div>
            </Link>
          </div>
        ))
      ) : session.user.role === "student" && Studentlessonlist.length > 0 ? (
        Studentlessonlist.map((lesson) => (
          <div key={lesson.lesson_code}>
            <Link
              href={`/lesson/view/${lesson.lesson_code}`}
              className="border border-[#6be4b9]  bg-[#313f40] flex items-center justify-between p-6  rounded-2xl shadow-xl hover:shadow-lg transition-all duration-300 w-full max-w-2xl mx-auto"
            >
              <div className="flex items-center space-x-4">
                <img
                  src="/images/lesson-thumbnail.svg"
                  alt="Lesson"
                  className="w-16 h-16"
                />
                <div>
                  <h3 className="text-2xl font-semibold text-white">
                    {lesson.lesson_name}
                  </h3>
                  <p className="text-white text-l">{lesson.description}</p>
                  <p className="text-sm text-white mt-2">
                    Багшийн нэр:{" "}
                    <span className="font-medium text-[#6be4b9]">
                      {lesson.teacher?.name}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-[#6be4b9] text-2xl">➜</div>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No lessons found.</p>
      )}
    </div>
  );
};

export default Lesson;
