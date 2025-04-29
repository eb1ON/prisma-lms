"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Submission {
  id: string;
  fileUrl: string;
  createdAt: string;
  score: number | null;
  student: {
    name: string;
    school_year: number | null;
  };
}

export default function TeacherPage() {
  const { data: session, status } = useSession();

  const teacherId = session?.user?.user_id;

  const [form, setForm] = useState({
    title: "",
    description: "",
    course: "4",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [scoreMap, setScoreMap] = useState<{ [key: string]: string }>({});

  // useEffect(() => {
  //   if (status === "loading") return; // Эхлээд session-ээ бүрэн дуустал хүлээнэ

  //   if (status === "unauthenticated" || session?.user.role !== "teacher") {
  //     router.push("/not-authorized");
  //   }
  // }, [session, status]);

  // Хариулт татах
  useEffect(() => {
    if (!teacherId) return;
    const fetchSubmissions = async () => {
      const res = await fetch(`/api/submissions?teacherId=${teacherId}`);
      const data = await res.json();
      setSubmissions(data);
    };
    fetchSubmissions();
  }, [teacherId]);

  // Даалгавар үүсгэх
  const handleAssignmentSubmit = async (e: any) => {
    e.preventDefault();
    if (!teacherId) return alert("Session алга байна");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("course", form.course);
    formData.append("teacherId", teacherId);
    if (file) formData.append("file", file);

    const res = await fetch("/api/assignments", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Амжилттай нэмэгдлээ!");
      setForm({ title: "", description: "", course: "4" });
      setFile(null);
    } else {
      alert("Алдаа гарлаа");
    }
  };

  // Оноо илгээх
  const handleScoreSubmit = async (submissionId: string) => {
    const score = parseInt(scoreMap[submissionId]);
    if (isNaN(score) || score < 0 || score > 10) {
      alert("Оноо 0-10 хооронд байх ёстой!");
      return;
    }

    const res = await fetch("/api/submissions/grade", {
      method: "POST",
      body: JSON.stringify({ submissionId, score }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      alert("Оноо амжилттай өгөгдлөө!");
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, score } : s))
      );
      setScoreMap((prev) => ({ ...prev, [submissionId]: "" }));
    } else {
      alert("Оноо илгээхэд алдаа гарлаа");
    }
  };

  if (status === "loading") {
    return <div className="p-6 text-xl text-white">Уншиж байна...</div>;
  }

  return (
    <div className="min-h-screen bg-[#283131] px-6 py-10 text-white flex flex-col lg:flex-row gap-10">
      {/* Зүүн тал - Даалгавар үүсгэх хэсэг */}
      <div className="flex-1 bg-[#2e3d3e] p-8 rounded-xl border border-[#30e3ca] shadow-md hover:shadow-[0_0_15px_#30e3ca] transition-all">
        <h2 className="text-2xl font-bold mb-6">Даалгавар нэмэх</h2>
        <form onSubmit={handleAssignmentSubmit} className="space-y-4 text-base">
          <div>
            <label className="block mb-1 font-semibold">Хичээлийн нэр</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-[#374848] border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none"
              placeholder="Жишээ: Програмчлал"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Тайлбар</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 rounded-md bg-[#374848] border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none"
              placeholder="Тайлбар бичнэ үү"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Курс</label>
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-[#374848] border border-gray-600 text-white"
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <option key={i} value={i}>
                  {i}-р курс
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Файл хавсаргах</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-white"
            />
          </div>

          <button className="w-full py-2 bg-green-600 hover:bg-green-700 transition rounded text-white font-semibold">
            Илгээх
          </button>
        </form>
      </div>

      {/* Баруун тал - Ирсэн хариултууд */}
      <div className="w-full lg:w-[400px] bg-[#2e3d3e] rounded-xl border border-[#30e3ca] p-6 shadow-md">
        <h3 className="text-xl font-bold mb-6">Ирсэн хариултууд</h3>
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <p className="text-gray-400">Хариулт ирээгүй байна.</p>
          ) : (
            submissions.map((s) => (
              <div
                key={s.id}
                className="bg-[#374848] p-4 rounded-md border border-[#30e3ca] shadow"
              >
                <p className="text-sm font-medium mb-1">
                  {s.student.school_year ?? "?"}-5 {s.student.name}
                </p>
                <a
                  href={s.fileUrl}
                  target="_blank"
                  className="text-blue-400 underline text-sm"
                >
                  Файл татах
                </a>
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(s.createdAt).toLocaleString()}
                </p>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={scoreMap[s.id] || ""}
                    onChange={(e) =>
                      setScoreMap((prev) => ({
                        ...prev,
                        [s.id]: e.target.value,
                      }))
                    }
                    className="w-16 px-2 py-1 bg-[#1e2627] border border-gray-600 rounded text-white text-sm"
                    placeholder="Оноо"
                  />
                  <button
                    onClick={() => handleScoreSubmit(s.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition"
                  >
                    Үнэлэх
                  </button>
                </div>
                {s.score !== null && (
                  <p className="text-xs mt-1 text-green-400">
                    Өгсөн оноо: {s.score}/10
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
