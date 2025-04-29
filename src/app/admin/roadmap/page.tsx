"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const RoadmapPage = () => {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({
    lesson_code: "",
    lesson_name: "",
    credits: 0,
    type: "",
    semester: "",
    school_year: 0,
  });
  const [editItem, setEditItem] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState<number | "">("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/roadmap");
      const data = await res.json();
      setRoadmaps(data);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newItem.lesson_code || !newItem.lesson_name || !newItem.school_year) {
      alert("Бүх заавал талбарыг бөглөнө үү!");
      return;
    }
    const res = await fetch("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    const data = await res.json();
    setRoadmaps([...roadmaps, data]);
    setNewItem({
      lesson_code: "",
      lesson_name: "",
      credits: 0,
      type: "",
      semester: "",
      school_year: 0,
    });
    setIsAddOpen(false);
  };

  const handleUpdate = async () => {
    if (
      !editItem.lesson_code ||
      !editItem.lesson_name ||
      !editItem.school_year
    ) {
      alert("Бүх заавал талбарыг бөглөнө үү!");
      return;
    }
    const res = await fetch("/api/roadmap", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editItem),
    });
    const data = await res.json();
    setRoadmaps(roadmaps.map((item) => (item.id === data.id ? data : item)));
    setEditItem(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    await fetch(`/api/roadmap?id=${id}`, { method: "DELETE" });
    setRoadmaps(roadmaps.filter((item) => item.id !== id));
  };

  const filteredRoadmaps = roadmaps.filter((item) => {
    const matchYear = filterYear === "" || item.school_year === filterYear;
    const matchSearch =
      item.lesson_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lesson_code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchYear && matchSearch;
  });

  const groupBySchoolYear = (items: any[]) => {
    return items.reduce((acc: Record<number, any[]>, item) => {
      const year = item.school_year || 0;
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {});
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0f181e] py-12 px-8 text-[#e3fef3] font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-[#0f181e] border-[#6be4b9] hover:bg-[#13272e] active:bg-[#6be4b9] active:text-[#0f181e]"
          >
            ← Буцах
          </Button>
          <h1 className="text-3xl font-bold text-white text-center w-full border-b border-[#6be4b9] pb-4 mb-6">
            📌 Roadmap Хичээлүүд
          </h1>
          <div className="w-24" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Input
            placeholder="Хичээлийн нэр эсвэл кодоор хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0f181e] text-white border border-[#6be4b920] w-full md:w-1/2"
          />
          <select
            className="bg-[#0f181e] text-white border border-[#6be4b920] px-4 py-2 rounded-lg w-full md:w-1/4"
            value={filterYear}
            onChange={(e) =>
              setFilterYear(
                e.target.value === "" ? "" : parseInt(e.target.value)
              )
            }
          >
            <option value="">Бүх курсууд</option>
            {[1, 2, 3, 4, 5].map((year) => (
              <option key={year} value={year}>
                {year} курс
              </option>
            ))}
          </select>
        </div>

        {/* Add Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#6be4b9] hover:bg-[#53dab0] text-[#0f181e] font-semibold px-6 py-2 rounded-lg"
          >
            ➕ Шинэ хичээл нэмэх
          </Button>
        </div>

        {/* Lesson Table */}
        <div className="space-y-6">
          {Object.entries(groupBySchoolYear(filteredRoadmaps)).map(
            ([year, items]) => (
              <div key={year} className="bg-[#13272e] p-6 rounded-xl shadow-xl">
                <h3 className="text-xl text-[#6be4b9] font-bold mb-4">
                  🎓 {year}-р курс ({items.length} хичээл)
                </h3>
                <table className="w-full text-sm divide-y divide-[#6be4b920]">
                  <thead className="bg-[#6be4b9] text-[#0f181e]">
                    <tr>
                      <th className="py-3 px-4 text-left">Код</th>
                      <th className="py-3 px-4 text-left">Нэр</th>
                      <th className="py-3 px-4 text-left">Кредит</th>
                      <th className="py-3 px-4 text-left">Төрөл</th>
                      <th className="py-3 px-4 text-left">Семестер</th>
                      <th className="py-3 px-4 text-center">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-[#0f181e]">
                        <td className="px-4 py-2 text-[#6be4b9] font-semibold">
                          {item.lesson_code}
                        </td>
                        <td className="px-4 py-2">{item.lesson_name}</td>
                        <td className="px-4 py-2">{item.credits}</td>
                        <td className="px-4 py-2">{item.type}</td>
                        <td className="px-4 py-2">{item.semester}</td>
                        <td className="px-4 py-2 text-center space-x-2">
                          <Button
                            size="sm"
                            className="bg-[#6be4b9] text-[#0f181e]"
                            onClick={() => setEditItem(item)}
                          >
                            Засах
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            Устгах
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* Add Modal */}
        {isAddOpen && (
          <LessonModal
            lesson={newItem}
            setLesson={setNewItem}
            onSave={handleAdd}
            onCancel={() => setIsAddOpen(false)}
            isEditing={false}
          />
        )}

        {/* Edit Modal */}
        {editItem && (
          <LessonModal
            lesson={editItem}
            setLesson={setEditItem}
            onSave={handleUpdate}
            onCancel={() => setEditItem(null)}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

type LessonModalProps = {
  lesson: any;
  setLesson: (lesson: any) => void;
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
    <div className="bg-[#0f181e] p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-center text-[#6be4b9] mb-6">
        {isEditing ? "✏️ Хичээл засах" : "➕ Хичээл нэмэх"}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          value={lesson.lesson_code}
          onChange={(e) =>
            setLesson({ ...lesson, lesson_code: e.target.value })
          }
          placeholder="Код"
          className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg"
        />
        <Input
          value={lesson.lesson_name}
          onChange={(e) =>
            setLesson({ ...lesson, lesson_name: e.target.value })
          }
          placeholder="Нэр"
          className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg"
        />
        <Input
          type="number"
          value={lesson.credits}
          onChange={(e) =>
            setLesson({ ...lesson, credits: parseInt(e.target.value) })
          }
          placeholder="Кредит"
          className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg"
        />
        <Input
          value={lesson.type}
          onChange={(e) => setLesson({ ...lesson, type: e.target.value })}
          placeholder="Төрөл"
          className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg"
        />
        <Input
          value={lesson.semester}
          onChange={(e) => setLesson({ ...lesson, semester: e.target.value })}
          placeholder="Семестер"
          className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg"
        />
        <select
          value={lesson.school_year}
          onChange={(e) =>
            setLesson({ ...lesson, school_year: parseInt(e.target.value) })
          }
          className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg px-3 py-2"
        >
          <option value={0}>Курс сонгох</option>
          {[1, 2, 3, 4, 5].map((y) => (
            <option key={y} value={y}>
              {y}-р курс
            </option>
          ))}
        </select>
      </div>

      {/* Save/Cancel */}
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

export default RoadmapPage;
