"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadLessonClient({
  lessonCode,
  teacherId,
}: {
  lessonCode: string;
  teacherId: string;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schoolYear, setSchoolYear] = useState<number>();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPdfFile(file || null);
    setPreviewPdf(file ? URL.createObjectURL(file) : null);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoFile(file || null);
    setPreviewVideo(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacherId) {
      alert("User not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("lessonCode", lessonCode);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("schoolYear", String(schoolYear));
    formData.append("teacherId", teacherId);
    if (pdfFile) formData.append("pdf", pdfFile);
    if (videoFile) formData.append("video", videoFile);

    const res = await fetch(`/lesson/view/add/${lessonCode}/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      router.push(`/lesson/view/${lessonCode}`);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-card border border-border rounded-xl p-8 text-foreground shadow-xl">
      <h1 className="text-2xl font-bold text-center mb-6">Хичээл нэмэх</h1>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Хичээлийн нэр"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-md bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <textarea
          placeholder="Тайлбар"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 rounded-md bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="number"
          placeholder="Курс"
          value={schoolYear ?? ""}
          onChange={(e) => setSchoolYear(Number(e.target.value))}
          className="w-full p-3 rounded-md bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div>
          <label className="block mb-1 text-foreground">PDF хавсралт</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="w-full text-sm text-foreground"
          />
          {previewPdf && (
            <embed
              src={previewPdf}
              type="application/pdf"
              className="mt-2 w-full h-48 rounded border border-border"
            />
          )}
        </div>
        <div>
          <label className="block mb-1 text-foreground">Видео хавсралт</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full text-sm text-foreground"
          />
          {previewVideo && (
            <video
              src={previewVideo}
              controls
              className="mt-2 w-full h-48 rounded border border-border"
            />
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-primary text-primary-foreground font-semibold rounded-lg transition"
        >
          Хичээл нэмэх
        </button>
      </form>
    </div>
  );
}
