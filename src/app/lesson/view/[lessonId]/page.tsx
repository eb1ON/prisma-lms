import BackButton from "@/components/BackButton";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

const LessonView = async ({ params }: { params: { lessonId: string } }) => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const { lessonId } = await params;

  const addLesson = await prisma.lesson_list.findUnique({
    where: { lesson_code: lessonId },
  });

  const TeacherlessonList = await prisma.lesson.findMany({
    where: {
      lessonCode: lessonId,
      teacherId: session?.user.user_id,
    },
  });

  const StudentlessonList = await prisma.lesson.findMany({
    where: {
      lessonCode: lessonId,
      school_year: session?.user.school_year,
    },
  });

  const lessonsToShow =
    session.user.role === "teacher" ? TeacherlessonList : StudentlessonList;
  const isTeacher = session.user.role === "teacher";

  return (
    <div className="p-8 min-h-screen w-full space-y-6 bg-[#283131]">
      <div className="relative flex items-center justify-center">
        <div className="absolute left-0">
          <BackButton />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wide">Хичээлүүд</h1>
          <div className="w-50 mx-auto mt-4 border-t-2 border-[#65d8ba]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {lessonsToShow.length > 0 ? (
          lessonsToShow.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lesson/view/${lesson.lessonCode}/${lesson.id}`}
              className="group block bg-[#313f40] rounded-xl border border-[#3ef4cb] p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#3ef4cb]">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {lesson.description || "No description available"}
                  </p>
                  <div className="text-sm text-[#3ef4cb] mt-2">
                    {lesson.teacherName && `Багшийн нэр: ${lesson.teacherName}`}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {lesson.pdfUrl && (
                      <span className="inline-block text-xs text-[#90cdf4] border border-[#90cdf4] px-2 py-0.5 rounded-full">
                        📄 PDF хавсралттай
                      </span>
                    )}
                    {lesson.videoUrl && (
                      <span className="inline-block text-xs text-[#68d391] border border-[#68d391] px-2 py-0.5 rounded-full">
                        🎬 Видео хавсралттай
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[#3ef4cb] text-xl">→</div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">
            Хичээл олдоогүй.
          </p>
        )}
      </div>

      {isTeacher && (
        <div className="mt-10 text-center">
          <Link
            href={`/lesson/view/add/${addLesson?.lesson_code}`}
            className="inline-block bg-[#3ef4cb] hover:bg-[#2dc2bd] text-black font-semibold px-6 py-3 rounded-xl transition"
          >
            ➕ Хичээл нэмэх
          </Link>
        </div>
      )}
    </div>
  );
};

export default LessonView;
