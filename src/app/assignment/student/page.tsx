"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Assignment {
  id: string;
  title: string;
  fileUrl: string | null;
  createdAt: string;
  teacher: {
    name: string;
    image: string | null;
  };
}

export default function StudentPage() {
  const { data: session } = useSession();
  const studentId = session?.user?.user_id;
  const schoolYear = session?.user?.school_year;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [fileMap, setFileMap] = useState<{ [key: string]: File | null }>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!schoolYear) return;
    const fetchAssignments = async () => {
      const res = await fetch(`/api/assignments?course=${schoolYear}`);
      const data = await res.json();
      setAssignments(data);
      setLoading(false);
    };
    fetchAssignments();
  }, [schoolYear]);

  const handleFileChange = (assignmentId: string, file: File | null) => {
    setFileMap((prev) => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmit = async (assignmentId: string) => {
    const file = fileMap[assignmentId];
    if (!file || !studentId) return alert("Файл эсвэл хэрэглэгч алга!");

    setUploading(true);

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", studentId);
    formData.append("file", file);

    const res = await fetch("/api/submissions", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (res.ok) {
      alert("Амжилттай илгээлээ!");
      setFileMap((prev) => ({ ...prev, [assignmentId]: null }));
    } else {
      alert("Алдаа гарлаа");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f181e] px-4 md:px-6 py-10 text-gray-700 dark:text-gray-200">
      {loading ? (
        <p className="text-gray-400 dark:text-gray-500">⏳ Уншиж байна...</p>
      ) : assignments.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500">
          Одоогоор даалгавар алга байна.
        </p>
      ) : (
        <div className="space-y-6">
          {assignments.map((a) => (
            <div
              key={a.id}
              className="bg-gray-100 dark:bg-[#13272e] p-5 md:p-6 rounded-[20px] shadow-md flex flex-col md:flex-row justify-between gap-6 md:gap-4 hover:shadow-[0_0_15px_#5584c6] dark:hover:shadow-[0_0_20px_#6be4b9] transition-all border dark:border-[#264144]"
            >
              {/* Багш болон даалгавар */}
              <div className="flex gap-4 items-start">
                <Image
                  src={a.teacher?.image || "/default-avatar.png"}
                  alt="Багш"
                  width={56}
                  height={56}
                  className="rounded-full object-cover border border-white dark:border-gray-600 shadow"
                />
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-gray-700 dark:text-white mb-1">
                    {a.title}
                  </h2>
                  {a.fileUrl && (
                    <a
                      href={a.fileUrl}
                      download
                      className="text-[#5584c6] dark:text-[#6be4b9] underline text-sm inline-block mb-1"
                    >
                      Файл татах
                    </a>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Файл илгээх */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="relative cursor-pointer">
                  <div className="bg-white dark:bg-[#264144] text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md shadow hover:bg-gray-200 dark:hover:bg-[#355264] transition text-sm font-medium">
                    Файл сонгох
                  </div>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(a.id, e.target.files?.[0] || null)
                    }
                    className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
                <button
                  onClick={() => handleSubmit(a.id)}
                  disabled={uploading}
                  className="bg-white dark:bg-[#264144] hover:bg-[#5584c6] dark:hover:bg-[#6be4b9] text-gray-700 dark:text-gray-200 hover:text-white px-4 py-2 rounded-md transition text-sm font-medium shadow"
                >
                  Илгээх
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
