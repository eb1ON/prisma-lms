"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TimetablePage = () => {
  const router = useRouter();

  const [timetable, setTimetable] = useState<any[]>([]);
  const [newTimetable, setNewTimetable] = useState({
    lesson_code: "",
    teacher_id: "",
    weekdays: "",
    start_time: "",
    end_time: "",
    school_year: 1,
  });
  const [editTimetable, setEditTimetable] = useState<any | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      const res = await fetch("/api/timetable");
      const data = await res.json();
      setTimetable(data);
    };
    fetchTimetable();
  }, []);

  const handleAddTimetable = async () => {
    const res = await fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTimetable),
    });

    const data = await res.json();
    setTimetable((prev) => [...prev, data]);
    setNewTimetable({
      lesson_code: "",
      teacher_id: "",
      weekdays: "",
      start_time: "",
      end_time: "",
      school_year: 1,
    });
  };

  const handleEditTimetable = async () => {
    const res = await fetch("/api/timetable", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTimetable),
    });

    const data = await res.json();
    setTimetable((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    setEditTimetable(null);
  };

  const handleDeleteTimetable = async (id: string) => {
    await fetch(`/api/timetable?id=${id}`, {
      method: "DELETE",
    });
    setTimetable((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0f181e] text-[#e3fef3] py-12 px-8 font-sans">
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
            🗓️ Хичээлийн хуваарь
          </h1>
          <div className="w-24" />
        </div>

        {/* Table */}
        <div className="bg-[#13272e] p-6 shadow-xl rounded-xl mb-12 w-full max-h-[400px] overflow-y-auto">
          <table className="w-full border-collapse text-sm divide-y divide-[#6be4b920]">
            <thead className="bg-[#6be4b9] text-[#0f181e]">
              <tr>
                <th className="px-4 py-3 text-left">Хичээл</th>
                <th className="px-4 py-3 text-left">Багш</th>
                <th className="px-4 py-3 text-left">Өдөр</th>
                <th className="px-4 py-3 text-center">Эхлэх цаг</th>
                <th className="px-4 py-3 text-center">Дуусах цаг</th>
                <th className="px-4 py-3 text-center">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {timetable.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#0f181e] transition">
                  <td className="px-4 py-3 text-[#6be4b9] font-semibold">
                    {entry.lesson?.lesson_name}
                  </td>
                  <td className="px-4 py-3">{entry.teacher?.name}</td>
                  <td className="px-4 py-3">{entry.weekdays}</td>
                  <td className="px-4 py-3 text-center">{entry.start_time}</td>
                  <td className="px-4 py-3 text-center">{entry.end_time}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-[#6be4b9] hover:bg-[#0f181e] active:bg-[#6be4b9] active:text-[#0f181e] text-[#0f181e] font-semibold"
                      onClick={() => setEditTimetable(entry)}
                    >
                      Засах
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTimetable(entry.id)}
                      className="active:bg-red-800 active:text-white"
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
        <div className="bg-[#13272e] p-6 shadow-lg rounded-xl mb-12 w-full">
          <h2 className="text-2xl font-bold text-[#6be4b9] text-center mb-6">
            ➕ Шинэ хичээл нэмэх
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newTimetable.lesson_code}
              onChange={(e) =>
                setNewTimetable({
                  ...newTimetable,
                  lesson_code: e.target.value,
                })
              }
              placeholder="Хичээлийн код"
            />
            <Input
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newTimetable.teacher_id}
              onChange={(e) =>
                setNewTimetable({ ...newTimetable, teacher_id: e.target.value })
              }
              placeholder="Багшийн ID"
            />
            <Input
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newTimetable.weekdays}
              onChange={(e) =>
                setNewTimetable({ ...newTimetable, weekdays: e.target.value })
              }
              placeholder="Өдөр (ж: Даваа)"
            />
            <Input
              type="time"
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newTimetable.start_time}
              onChange={(e) =>
                setNewTimetable({ ...newTimetable, start_time: e.target.value })
              }
            />
            <Input
              type="time"
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newTimetable.end_time}
              onChange={(e) =>
                setNewTimetable({ ...newTimetable, end_time: e.target.value })
              }
            />
            <Input
              type="number"
              className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
              value={newTimetable.school_year}
              onChange={(e) =>
                setNewTimetable({
                  ...newTimetable,
                  school_year: parseInt(e.target.value),
                })
              }
              placeholder="Төгсөх жил"
            />
            <div className="md:col-span-2">
              <Button
                onClick={handleAddTimetable}
                className="w-full bg-[#6be4b9] hover:bg-[#0f181e] active:bg-[#6be4b9] active:text-[#0f181e] text-[#0f181e] font-semibold"
              >
                Хуваарь нэмэх
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editTimetable && (
          <div className="bg-[#13272e] fixed inset-0 z-50 m-auto max-w-screen-md p-6 shadow-xl rounded-xl overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#6be4b9] text-center">
              ✏️ Хуваарь засах
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editTimetable.lesson_code}
                disabled
              />
              <Input
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editTimetable.teacher_id}
                disabled
              />
              <Input
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editTimetable.weekdays}
                onChange={(e) =>
                  setEditTimetable({
                    ...editTimetable,
                    weekdays: e.target.value,
                  })
                }
                placeholder="Өдөр"
              />
              <Input
                type="time"
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editTimetable.start_time}
                onChange={(e) =>
                  setEditTimetable({
                    ...editTimetable,
                    start_time: e.target.value,
                  })
                }
              />
              <Input
                type="time"
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editTimetable.end_time}
                onChange={(e) =>
                  setEditTimetable({
                    ...editTimetable,
                    end_time: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                value={editTimetable.school_year}
                onChange={(e) =>
                  setEditTimetable({
                    ...editTimetable,
                    school_year: parseInt(e.target.value),
                  })
                }
                placeholder="Төгсөх жил"
              />
              <div className="md:col-span-2 flex gap-2">
                <Button
                  onClick={handleEditTimetable}
                  className="w-full bg-[#6be4b9] hover:bg-[#0f181e] active:bg-[#6be4b9] active:text-[#0f181e] text-[#0f181e] font-semibold"
                >
                  Хадгалах
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditTimetable(null)}
                  className="w-full border-[#6be4b9] text-[#6be4b9] hover:bg-[#0f181e] active:bg-[#6be4b9] active:text-[#0f181e]"
                >
                  Цуцлах
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimetablePage;
