import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

const LessonDetailView = async ({
  params,
}: {
  params: { lessonView: string };
}) => {
  const { lessonView } = await params;
  const parsedLessonId = parseInt(lessonView, 10);
  const lesson = await prisma.lesson.findUnique({
    where: { id: parsedLessonId },
  });

  if (!lesson) return notFound();

  return (
    <div className="p-6 md:p-10 min-h-screen bg-[#283131] text-white">
      <div className="max-w-4xl mx-auto space-y-6 bg-[#313f40] border border-[#3ef4cb] rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-[#3ef4cb] text-center">
          {lesson.title}
        </h1>

        {lesson.description && (
          <p className="text-gray-300 text-center">{lesson.description}</p>
        )}

        {lesson.videoUrl ? (
          <video
            controls
            src={lesson.videoUrl}
            className="w-full rounded-lg border border-[#68d391] shadow-md"
          />
        ) : (
          <p className="text-red-400 text-center">🎬 Видео байхгүй</p>
        )}

        {lesson.pdfUrl ? (
          <div className="mt-4">
            <embed
              src={lesson.pdfUrl}
              type="application/pdf"
              width="100%"
              height="600px"
              className="rounded-md border border-[#90cdf4] shadow"
            />
          </div>
        ) : (
          <p className="text-red-400 text-center">📄 PDF файл байхгүй</p>
        )}
      </div>
    </div>
  );
};

export default LessonDetailView;
