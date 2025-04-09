"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RoadmapPage = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/roadmap");
      const data = await res.json();
      setRoadmaps(data);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
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
  };

  const handleUpdate = async () => {
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
    await fetch(`/api/roadmap?id=${id}`, { method: "DELETE" });
    setRoadmaps(roadmaps.filter((item) => item.id !== id));
  };

  const groupBySchoolYear = (items: any[]) => {
    return items.reduce((acc: Record<number, any[]>, item) => {
      const year = item.school_year || 0;
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {});
  };

  return (
    <div className="min-h-screen w-full py-12 px-4 md:px-8 bg-[#0f181e]">
      <div className="max-w-6xl mx-auto space-y-12">

        <h1 className="text-3xl font-bold text-center text-white border-b border-[#6be4b9] pb-4">
          📌 Roadmap Хичээлүүд
        </h1>

        {/* Шинэ хичээл нэмэх */}
        <div className="bg-[#13272e] p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-[#6be4b9] mb-4 text-center">
            ➕ Шинэ хичээл нэмэх
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Код"
              className="bg-[#0f181e] text-white border border-[#6be4b920]"
              value={newItem.lesson_code}
              onChange={(e) =>
                setNewItem({ ...newItem, lesson_code: e.target.value })
              }
            />
            <Input
              placeholder="Нэр"
              className="bg-[#0f181e] text-white border border-[#6be4b920]"
              value={newItem.lesson_name}
              onChange={(e) =>
                setNewItem({ ...newItem, lesson_name: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Кредит"
              className="bg-[#0f181e] text-white border border-[#6be4b920]"
              value={newItem.credits}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  credits: parseInt(e.target.value),
                })
              }
            />
            <select
              className="bg-[#0f181e] text-white border border-[#6be4b920] px-3 py-2 rounded-md"
              value={newItem.type}
              onChange={(e) =>
                setNewItem({ ...newItem, type: e.target.value })
              }
            >
              <option value="">Төрөл</option>
              <option value="Pro">Pro</option>
              <option value="Gen">Gen</option>
            </select>
            <select
              className="bg-[#0f181e] text-white border border-[#6be4b920] px-3 py-2 rounded-md"
              value={newItem.semester}
              onChange={(e) =>
                setNewItem({ ...newItem, semester: e.target.value })
              }
            >
              <option value="">Семестер</option>
              <option value="Хавар">Хавар</option>
              <option value="Намар">Намар</option>
            </select>
            <select
              className="bg-[#0f181e] text-white border border-[#6be4b920] px-3 py-2 rounded-md"
              value={newItem.school_year}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  school_year: parseInt(e.target.value),
                })
              }
            >
              <option value={0}>Жил сонгох</option>
              {[1, 2, 3, 4, 5].map((year) => (
                <option key={year} value={year}>
                  {year}-р курс
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleAdd}
            className="mt-6 w-full bg-[#6be4b9] hover:bg-[#0f181e] text-[#0f181e] font-semibold"
          >
            Нэмэх
          </Button>
        </div>

        {/* Roadmap list */}
        <div className="space-y-6">
          {Object.entries(groupBySchoolYear(roadmaps)).map(([year, items]) => (
            <details
              key={year}
              className="bg-[#13272e] rounded-xl shadow-md border border-[#6be4b920]"
            >
              <summary className="px-6 py-3 text-lg font-semibold text-[#6be4b9] cursor-pointer select-none">
                🎓 {year}-р курс ({items.length} хичээл)
              </summary>
              <div className="overflow-x-auto mt-2">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#6be4b9] text-[#0f181e]">
                    <tr>
                      <th className="px-4 py-2 text-left">Код</th>
                      <th className="px-4 py-2 text-left">Нэр</th>
                      <th className="px-4 py-2 text-left">Кредит</th>
                      <th className="px-4 py-2 text-left">Төрөл</th>
                      <th className="px-4 py-2 text-left">Семестер</th>
                      <th className="px-4 py-2 text-center">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#0f181e] transition text-white"
                      >
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
                            className="bg-[#6be4b9] text-[#0f181e] hover:bg-[#0f181e] hover:text-white"
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
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
