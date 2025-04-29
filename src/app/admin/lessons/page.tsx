"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LessonsPage = () => {
  const router = useRouter();
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);
  const [newLesson, setNewLesson] = useState({
    lesson_code: "",
    lesson_name: "",
    credits: 1,
    description: "",
    teacher_id: "",
  });
  const [editLesson, setEditLesson] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLessons = async () => {
      const res = await fetch("/api/lessons");
      const data = await res.json();
      setLessons(data);
      setFilteredLessons(data);
    };
    fetchLessons();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = lessons.filter(
      (lesson) =>
        lesson.lesson_name.toLowerCase().includes(term) ||
        lesson.lesson_code.toLowerCase().includes(term)
    );
    setFilteredLessons(filtered);
  }, [searchTerm, lessons]);

  const handleAddLesson = async () => {
    if (!newLesson.lesson_code || !newLesson.lesson_name) {
      alert("Бүх заавал талбарыг бөглөнө үү!");
      return;
    }
    const payload = {
      ...newLesson,
      teacher_id:
        newLesson.teacher_id.trim() === "" ? null : newLesson.teacher_id,
    };
    const res = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLessons((prev) => [...prev, data]);
    setNewLesson({
      lesson_code: "",
      lesson_name: "",
      credits: 1,
      description: "",
      teacher_id: "",
    });
    setIsAddOpen(false);
  };

  const handleEditLesson = async () => {
    if (!editLesson.lesson_code || !editLesson.lesson_name) {
      alert("Бүх заавал талбарыг бөглөнө үү!");
      return;
    }
    const payload = {
      ...editLesson,
      teacher_id:
        editLesson.teacher_id?.trim() === "" ? null : editLesson.teacher_id,
    };
    const res = await fetch("/api/lessons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLessons((prev) => prev.map((l) => (l.id === data.id ? data : l)));
    setEditLesson(null);
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Хичээлийг устгах уу?")) return;
    await fetch(`/api/lessons?id=${id}`, { method: "DELETE" });
    setLessons((prev) => prev.filter((l) => l.id !== id));
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
            📘 Хичээлийн жагсаалт
          </h1>
          <div className="w-24" />
        </div>

        {/* Search */}
        <Input
          placeholder="Хичээлийн нэр эсвэл кодоор хайх..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920]"
        />

        {/* Add New Button */}
        <div className="text-center">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#6be4b9] hover:bg-[#53dab0] text-[#0f181e] font-semibold px-6 py-2 rounded-lg"
          >
            ➕ Шинэ хичээл нэмэх
          </Button>
        </div>

        {/* Lessons Table */}
        <div className="bg-[#13272e] p-6 rounded-xl shadow-2xl max-h-[500px] overflow-y-auto">
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
              {filteredLessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="hover:bg-[#0f181e] transition duration-200"
                >
                  <td className="px-4 py-2 text-[#6be4b9] font-semibold">
                    {lesson.lesson_code}
                  </td>
                  <td className="px-4 py-2">{lesson.lesson_name}</td>
                  <td className="px-4 py-2 text-center">{lesson.credits}</td>
                  <td className="px-4 py-2">{lesson.teacher?.name ?? "—"}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-[#6be4b9] text-[#0f181e] font-semibold"
                      onClick={() => setEditLesson(lesson)}
                    >
                      Засах
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="text-white"
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

        {/* Modals */}
        {isAddOpen && (
          <LessonModal
            lesson={newLesson}
            setLesson={setNewLesson}
            onSave={handleAddLesson}
            onCancel={() => setIsAddOpen(false)}
            isEditing={false}
          />
        )}
        {editLesson && (
          <LessonModal
            lesson={editLesson}
            setLesson={setEditLesson}
            onSave={handleEditLesson}
            onCancel={() => setEditLesson(null)}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

type LessonModalProps = {
  lesson: any;
  setLesson: any;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
};

const LessonModal = ({
  lesson,
  setLesson,
  onSave,
  onCancel,
  isEditing,
}: LessonModalProps) => (
  <div className="bg-[#13272e]/90 fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="bg-[#0f181e] p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4 overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold text-center text-[#6be4b9] mb-6">
        {isEditing ? "✏️ Хичээл засах" : "➕ Шинэ хичээл нэмэх"}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          value={lesson.lesson_code}
          onChange={(e) =>
            setLesson({ ...lesson, lesson_code: e.target.value })
          }
          placeholder="Хичээлийн код"
          className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
        />
        <Input
          value={lesson.lesson_name}
          onChange={(e) =>
            setLesson({ ...lesson, lesson_name: e.target.value })
          }
          placeholder="Хичээлийн нэр"
          className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
        />
        <select
          value={lesson.credits}
          onChange={(e) =>
            setLesson({ ...lesson, credits: parseInt(e.target.value) })
          }
          className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg px-3 py-2"
        >
          {[1, 2, 3, 4, 5].map((credit) => (
            <option key={credit} value={credit}>
              {credit} кредит
            </option>
          ))}
        </select>
        <Input
          value={lesson.teacher_id ?? ""}
          onChange={(e) => setLesson({ ...lesson, teacher_id: e.target.value })}
          placeholder="Багшийн ID (заавал биш)"
          className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
        />
        <div className="md:col-span-2">
          <Input
            value={lesson.description}
            onChange={(e) =>
              setLesson({ ...lesson, description: e.target.value })
            }
            placeholder="Тайлбар"
            className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
          />
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <Button
          onClick={onSave}
          className="w-full bg-[#6be4b9] text-[#0f181e] font-semibold"
        >
          Хадгалах
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full border-[#6be4b9] text-[#6be4b9]"
        >
          Болих
        </Button>
      </div>
    </div>
  </div>
);

export default LessonsPage;
