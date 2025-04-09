"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LessonsPage = () => {
  const router = useRouter();
  const [lessons, setLessons] = useState<any[]>([]);
  const [newLesson, setNewLesson] = useState({
    lesson_code: "",
    lesson_name: "",
    credits: 0,
    description: "",
    teacher_id: "",
  });
  const [editLesson, setEditLesson] = useState<any | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      const res = await fetch("/api/lessons");
      const data = await res.json();
      setLessons(data);
    };
    fetchLessons();
  }, []);

  const handleAddLesson = async () => {
    const res = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLesson),
    });

    const data = await res.json();
    setLessons((prevLessons) => [...prevLessons, data]);
    setNewLesson({
      lesson_code: "",
      lesson_name: "",
      credits: 0,
      description: "",
      teacher_id: "",
    });
  };

  const handleEditLesson = async () => {
    const res = await fetch("/api/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editLesson),
    });

    const data = await res.json();
    setLessons((prevLessons) =>
      prevLessons.map((lesson) => (lesson.id === data.id ? data : lesson))
    );
    setEditLesson(null);
  };

  const handleDeleteLesson = async (id: string) => {
    const res = await fetch(`/api/lessons?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data) {
      setLessons((prevLessons) =>
        prevLessons.filter((lesson) => lesson.id !== id)
      );
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0f181e] py-10 px-6 text-[#e3fef3] font-sans">
      <div className="w-full max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-[#0f181e] border-[#6be4b9] hover:bg-[#13272e] active:bg-[#6be4b9] active:text-[#0f181e]"
          >
            ← Буцах
          </Button>
          <h1 className="text-3xl font-bold text-white text-center w-full border-b border-[#6be4b9] pb-4 mb-6">
            Хичээлийн жагсаалт
          </h1>
          <div className="w-24" />
        </div>

        {/* Table */}
        <div className="bg-[#13272e] p-6 rounded-xl shadow-2xl max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm divide-y divide-[#6be4b920]">
            <thead className="bg-[#6be4b9] text-[#0f181e]">
              <tr>
                <th className="py-3 px-4 text-left">Код</th>
                <th className="py-3 px-4 text-left">Нэр</th>
                <th className="py-3 px-4 text-center">Кредит</th>
                <th className="py-3 px-4 text-left">Багш</th>
                <th className="py-3 px-4 text-center">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="hover:bg-[#0f181e] transition duration-200"
                >
                  <td className="px-4 py-2 text-[#6be4b9] font-semibold">
                    {lesson.lesson_code}
                  </td>
                  <td className="px-4 py-2">{lesson.lesson_name}</td>
                  <td className="px-4 py-2 text-center">{lesson.credits}</td>
                  <td className="px-4 py-2">{lesson.teacher?.name}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-[#6be4b9] hover:bg-[#0f181e] active:bg-[#6be4b9] active:text-[#0f181e] text-[#0f181e] font-semibold"
                      onClick={() => setEditLesson(lesson)}
                    >
                      Засах
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="active:bg-red-800 active:text-white"
                      onClick={() => handleDeleteLesson(lesson.id)}
                    >
                      Устгах
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Form */}
        <div className="bg-[#13272e] p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#6be4b9] text-center mb-6">
            ➕ Шинэ хичээл нэмэх
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newLesson.lesson_code}
              onChange={(e) =>
                setNewLesson({ ...newLesson, lesson_code: e.target.value })
              }
              placeholder="Хичээлийн код"
            />
            <Input
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newLesson.lesson_name}
              onChange={(e) =>
                setNewLesson({ ...newLesson, lesson_name: e.target.value })
              }
              placeholder="Хичээлийн нэр"
            />
            <Input
              type="number"
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newLesson.credits}
              onChange={(e) =>
                setNewLesson({
                  ...newLesson,
                  credits: parseInt(e.target.value),
                })
              }
              placeholder="Кредит"
            />
            <Input
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newLesson.teacher_id}
              onChange={(e) =>
                setNewLesson({ ...newLesson, teacher_id: e.target.value })
              }
              placeholder="Багшийн ID"
            />
            <div className="md:col-span-2">
              <Input
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={newLesson.description}
                onChange={(e) =>
                  setNewLesson({ ...newLesson, description: e.target.value })
                }
                placeholder="Тайлбар"
              />
            </div>
            <div className="md:col-span-2">
              <Button
                onClick={handleAddLesson}
                className="w-full bg-[#6be4b9] hover:bg-[#0f181e] active:bg-[#6be4b9] active:text-[#0f181e] text-[#0f181e] font-semibold"
              >
                Хичээл нэмэх
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editLesson && (
          <div className="bg-[#13272e] fixed inset-0 z-50 m-auto max-w-screen-md p-6 shadow-xl rounded-xl overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#6be4b9] text-center">
              ✏️ Хичээл засах
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editLesson.lesson_code}
                onChange={(e) =>
                  setEditLesson({ ...editLesson, lesson_code: e.target.value })
                }
                placeholder="Хичээлийн код"
              />
              <Input
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editLesson.lesson_name}
                onChange={(e) =>
                  setEditLesson({ ...editLesson, lesson_name: e.target.value })
                }
                placeholder="Хичээлийн нэр"
              />
              <Input
                type="number"
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editLesson.credits}
                onChange={(e) =>
                  setEditLesson({
                    ...editLesson,
                    credits: parseInt(e.target.value),
                  })
                }
                placeholder="Кредит"
              />
              <Input
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editLesson.teacher_id}
                onChange={(e) =>
                  setEditLesson({ ...editLesson, teacher_id: e.target.value })
                }
                placeholder="Багшийн ID"
              />
              <div className="md:col-span-2">
                <Input
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                  value={editLesson.description}
                  onChange={(e) =>
                    setEditLesson({
                      ...editLesson,
                      description: e.target.value,
                    })
                  }
                  placeholder="Тайлбар"
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button
                  onClick={handleEditLesson}
                  className="w-full bg-[#6be4b9] hover:bg-[#0f181e] active:bg-[#6be4b9] active:text-[#0f181e] text-[#0f181e] font-semibold"
                >
                  Хадгалах
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditLesson(null)}
                  className="w-full border-[#6be4b9] text-[#6be4b9] hover:bg-[#0f181e] active:bg-[#6be4b9] active:text-[#0f181e]"
                >
                  Болих
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsPage;
