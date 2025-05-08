import BackButton from "@/components/BackButton";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

const prisma = new PrismaClient();

const LessonDetailView = async ({
  params,
}: {
  params: { lessonView: string };
}) => {
  const { lessonView } = await params;
  const session = await auth();
  if (!session) redirect("/sign-in");

  const parsedLessonId = parseInt(lessonView, 10);
  const lesson = await prisma.lesson.findUnique({
    where: { id: parsedLessonId },
  });

  if (!lesson) return notFound();

  return (
    <div className="p-6 md:p-10 min-h-screen bg-background text-foreground">
      <div className="relative flex items-center justify-center">
        <div className="absolute left-0">
          <BackButton />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-wide">{lesson.title}</h1>
          <div className="w-50 mx-auto mt-4 border-t-2 border-primary"></div>
        </div>
      </div>

      <div className="mt-10 max-w-4xl mx-auto space-y-6 bg-card rounded-2xl p-8 shadow-xl border border-border">
        {lesson.description && (
          <p className="text-foreground text-center">{lesson.description}</p>
        )}

        {lesson.videoUrl ? (
          <video
            controls
            src={lesson.videoUrl}
            className="w-full rounded-lg border border-border shadow-md"
          />
        ) : (
          <p className="text-red-500 dark:text-red-400 text-center">
            🎬 Видео байхгүй
          </p>
        )}

        {lesson.pdfUrl ? (
          <div className="mt-4">
            <embed
              src={lesson.pdfUrl}
              type="application/pdf"
              width="100%"
              height="600px"
              className="rounded-md border border-border shadow"
            />
          </div>
        ) : (
          <p className="text-red-500 dark:text-red-400 text-center">
            📄 PDF файл байхгүй
          </p>
        )}
      </div>
    </div>
  );
};

export default LessonDetailView;
