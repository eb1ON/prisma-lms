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
    <div className="p-8 min-h-screen w-full space-y-6 bg-background text-foreground">
      <div className="relative flex items-center justify-center">
        <div className="absolute left-0">
          <BackButton />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wide">Хичээлүүд</h1>
          <div className="w-24 mx-auto mt-4 border-t-2 border-primary"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {lessonsToShow.length > 0 ? (
          lessonsToShow.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lesson/view/${lesson.lessonCode}/${lesson.id}`}
              className="group block bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all h-full"
            >
              <div className="flex flex-col h-full">
                <div className="flex flex-col items-center text-center space-y-4 flex-grow">
                  <div className="text-5xl">📚</div>

                  <h3 className="text-xl font-semibold text-foreground">
                    {lesson.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {lesson.description || "No description available"}
                  </p>

                  <div className="text-sm text-muted-foreground">
                    {lesson.teacherName && `Багшийн нэр: ${lesson.teacherName}`}
                  </div>

                  <div className="flex gap-2 mt-2 flex-wrap justify-center">
                    {lesson.pdfUrl && (
                      <span className="inline-block text-xs text-blue-500 border border-blue-500 px-3 py-0.5 rounded-full">
                        📄 PDF хавсралттай
                      </span>
                    )}
                    {lesson.videoUrl && (
                      <span className="inline-block text-xs text-green-500 border border-green-500 px-3 py-0.5 rounded-full">
                        🎬 Видео хавсралттай
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <span className="inline-block px-4 py-1 text-primary border border-primary rounded-full font-medium group-hover:bg-primary group-hover:text-primary-foreground transition">
                    Үзэх →
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-muted-foreground col-span-full">
            Хичээл олдоогүй.
          </p>
        )}
      </div>

      {isTeacher && (
        <div className="mt-10 text-center">
          <Link
            href={`/lesson/view/add/${addLesson?.lesson_code}`}
            className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl transition"
          >
            Хичээл нэмэх
          </Link>
        </div>
      )}
    </div>
  );
};

export default LessonView;
