"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const courseYears = [1, 2, 3, 4, 5];
const weekdays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];

const pairTimes = [
  { label: "1-р пар (08:50-10:10)", start: "08:50", end: "10:10" },
  { label: "2-р пар (10:20-11:40)", start: "10:20", end: "11:40" },
  { label: "3-р пар (11:50-13:10)", start: "11:50", end: "13:10" },
  { label: "4-р пар (14:00-15:20)", start: "14:00", end: "15:20" },
  { label: "5-р пар (15:30-16:50)", start: "15:30", end: "16:50" },
];

const TimetablePage = () => {
  const router = useRouter();
  const [timetable, setTimetable] = useState<any[]>([]);
  const [newTimetable, setNewTimetable] = useState({
    lesson_code: "",
    teacher_id: "",
    weekdays: "",
    pair: "",
    school_year: 1,
  });
  const [editTimetable, setEditTimetable] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState<number | "">("");
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const fetchTimetable = async () => {
    const res = await fetch("/api/timetable");
    const data = await res.json();
    setTimetable(data);
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  const getTimesFromPair = (pair: string) => {
    const found = pairTimes.find((p) => p.label.startsWith(pair));
    if (found) {
      return { start_time: found.start, end_time: found.end };
    }
    return { start_time: "", end_time: "" };
  };

  const handleAddTimetable = async () => {
    if (
      !newTimetable.lesson_code ||
      !newTimetable.weekdays ||
      !newTimetable.pair ||
      !newTimetable.school_year
    ) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    const times = getTimesFromPair(newTimetable.pair);

    if (!times.start_time || !times.end_time) {
      alert("Паар зөв сонгоно уу!");
      return;
    }

    const payload = {
      lesson_code: newTimetable.lesson_code,
      teacher_id:
        newTimetable.teacher_id.trim() === "" ? null : newTimetable.teacher_id,
      weekdays: newTimetable.weekdays,
      start_time: times.start_time,
      end_time: times.end_time,
      school_year: newTimetable.school_year,
    };

    await fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetchTimetable();
    setNewTimetable({
      lesson_code: "",
      teacher_id: "",
      weekdays: "",
      pair: "",
      school_year: 1,
    });
    setIsAddOpen(false);
  };

  const handleEditTimetable = async () => {
    if (
      !editTimetable.lesson_code ||
      !editTimetable.weekdays ||
      !editTimetable.pair ||
      !editTimetable.school_year
    ) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    const times = getTimesFromPair(editTimetable.pair);

    if (!times.start_time || !times.end_time) {
      alert("Паар зөв сонгоно уу!");
      return;
    }

    const payload = {
      ...editTimetable,
      start_time: times.start_time,
      end_time: times.end_time,
      teacher_id:
        editTimetable.teacher_id?.trim() === ""
          ? null
          : editTimetable.teacher_id,
    };

    await fetch("/api/timetable", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await fetchTimetable();
    setEditTimetable(null);
  };

  const handleDeleteTimetable = async (id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    await fetch(`/api/timetable?id=${id}`, { method: "DELETE" });
    await fetchTimetable();
  };

  const filteredTimetable = timetable.filter((entry) => {
    const matchLesson =
      entry.lesson?.lesson_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      entry.lesson_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchYear = filterYear === "" || entry.school_year === filterYear;
    return matchLesson && matchYear;
  });

  const grouped = filteredTimetable.reduce(
    (acc: Record<string, any[]>, cur: any) => {
      const key = cur.lesson?.lesson_name || "Unknown Lesson";
      if (!acc[key]) acc[key] = [];
      acc[key].push(cur);
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0f181e] text-[#e3fef3] py-12 px-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* --- Header --- */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/sign-up")}
            className="text-[#0f181e] border-[#6be4b9] hover:bg-[#13272e] active:bg-[#6be4b9] active:text-[#0f181e]"
          >
            ← Буцах
          </Button>
          <h1 className="text-3xl font-bold text-white text-center w-full border-b border-[#6be4b9] pb-4 mb-6">
            🗓️ Хичээлийн хуваарь
          </h1>
          <div className="w-24" />
        </div>

        {/* --- Search / Filter --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Input
            placeholder="Хичээлийн нэр эсвэл кодоор хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] w-full md:w-1/2"
          />
          <select
            value={filterYear}
            onChange={(e) =>
              setFilterYear(
                e.target.value === "" ? "" : parseInt(e.target.value)
              )
            }
            className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] px-4 py-2 rounded-lg w-full md:w-1/4"
          >
            <option value="">Бүх курсууд</option>
            {courseYears.map((year) => (
              <option key={year} value={year}>
                {year} курс
              </option>
            ))}
          </select>
        </div>

        {/* --- Add New --- */}
        <div className="text-center mb-6">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#6be4b9] hover:bg-[#53dab0] text-[#0f181e] font-semibold px-6 py-2 rounded-lg"
          >
            ➕ Шинэ хичээл нэмэх
          </Button>
        </div>

        {/* --- Timetable List --- */}
        <div className="bg-[#13272e] p-6 shadow-xl rounded-xl mb-12 w-full max-h-[500px] overflow-y-auto">
          {Object.entries(grouped).map(([lessonName, entries]) => (
            <div key={lessonName} className="mb-4">
              <div
                onClick={() =>
                  setExpandedLesson(
                    expandedLesson === lessonName ? null : lessonName
                  )
                }
                className="cursor-pointer text-[#6be4b9] font-bold py-2 border-b border-[#6be4b920] hover:bg-[#0f181e] px-4"
              >
                {lessonName} {expandedLesson === lessonName ? "▲" : "▼"}
              </div>
              {expandedLesson === lessonName && (
                <table className="w-full text-sm divide-y divide-[#6be4b920] mt-2">
                  <thead>
                    <tr className="text-[#6be4b9]">
                      <th className="text-left px-4 py-2">Багш</th>
                      <th className="text-left px-4 py-2">Өдөр</th>
                      <th className="text-center px-4 py-2">Эхлэх</th>
                      <th className="text-center px-4 py-2">Дуусах</th>
                      <th className="text-center px-4 py-2">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-[#0f181e]">
                        <td className="px-4 py-2">
                          {entry.teacher?.name ?? "—"}
                        </td>
                        <td className="px-4 py-2">{entry.weekdays}</td>
                        <td className="px-4 py-2 text-center">
                          {entry.start_time}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {entry.end_time}
                        </td>
                        <td className="px-4 py-2 text-center space-x-2">
                          <Button
                            size="sm"
                            className="bg-[#6be4b9] text-[#0f181e] font-semibold"
                            onClick={() => setEditTimetable(entry)}
                          >
                            Засах
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="text-white"
                            onClick={() => handleDeleteTimetable(entry.id)}
                          >
                            Устгах
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>

        {/* ➕ Add Modal */}
        {isAddOpen && (
          <div className="bg-[#13272e]/90 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f181e] p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-center text-[#6be4b9] mb-6">
                ➕ Шинэ хичээл нэмэх
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  value={newTimetable.lesson_code}
                  onChange={(e) =>
                    setNewTimetable({
                      ...newTimetable,
                      lesson_code: e.target.value,
                    })
                  }
                  placeholder="Хичээлийн код"
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920]"
                />
                <Input
                  value={newTimetable.teacher_id}
                  onChange={(e) =>
                    setNewTimetable({
                      ...newTimetable,
                      teacher_id: e.target.value,
                    })
                  }
                  placeholder="Багшийн ID"
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920]"
                />
                <select
                  value={newTimetable.weekdays}
                  onChange={(e) =>
                    setNewTimetable({
                      ...newTimetable,
                      weekdays: e.target.value,
                    })
                  }
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Өдөр сонгох</option>
                  {weekdays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  value={newTimetable.pair}
                  onChange={(e) =>
                    setNewTimetable({ ...newTimetable, pair: e.target.value })
                  }
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Паар сонгох</option>
                  {pairTimes.map((pair) => (
                    <option key={pair.label} value={pair.label.split(" ")[0]}>
                      {pair.label}
                    </option>
                  ))}
                </select>
                <select
                  value={newTimetable.school_year}
                  onChange={(e) =>
                    setNewTimetable({
                      ...newTimetable,
                      school_year: parseInt(e.target.value),
                    })
                  }
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Курс сонгох</option>
                  {courseYears.map((year) => (
                    <option key={year} value={year}>
                      {year} курс
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddTimetable}
                  className="w-full bg-[#6be4b9] text-[#0f181e] font-semibold"
                >
                  Хадгалах
                </Button>
                <Button
                  onClick={() => setIsAddOpen(false)}
                  variant="outline"
                  className="w-full border-[#6be4b9] text-[#6be4b9]"
                >
                  Болих
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ✏️ Edit Modal */}
        {editTimetable && (
          <div className="bg-[#13272e]/90 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0f181e] p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-center text-[#6be4b9] mb-6">
                ✏️ Хичээлийн хуваарь засах
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  disabled
                  value={editTimetable.lesson_code}
                  className="bg-[#0f181e] text-[#6be4b9] border border-[#6be4b920]"
                />
                <Input
                  value={editTimetable.teacher_id ?? ""}
                  onChange={(e) =>
                    setEditTimetable({
                      ...editTimetable,
                      teacher_id: e.target.value,
                    })
                  }
                  placeholder="Багшийн ID"
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920]"
                />
                <select
                  value={editTimetable.weekdays}
                  onChange={(e) =>
                    setEditTimetable({
                      ...editTimetable,
                      weekdays: e.target.value,
                    })
                  }
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Өдөр сонгох</option>
                  {weekdays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <select
                  value={editTimetable.pair || ""}
                  onChange={(e) =>
                    setEditTimetable({ ...editTimetable, pair: e.target.value })
                  }
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Паар сонгох</option>
                  {pairTimes.map((pair) => (
                    <option key={pair.label} value={pair.label.split(" ")[0]}>
                      {pair.label}
                    </option>
                  ))}
                </select>
                <select
                  value={editTimetable.school_year || ""}
                  onChange={(e) =>
                    setEditTimetable({
                      ...editTimetable,
                      school_year: parseInt(e.target.value),
                    })
                  }
                  className="bg-[#0f181e] text-[#e3fef3] border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Курс сонгох</option>
                  {courseYears.map((year) => (
                    <option key={year} value={year}>
                      {year} курс
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleEditTimetable}
                  className="w-full bg-[#6be4b9] text-[#0f181e] font-semibold"
                >
                  Хадгалах
                </Button>
                <Button
                  onClick={() => setEditTimetable(null)}
                  variant="outline"
                  className="w-full border-[#6be4b9] text-[#6be4b9]"
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

export default TimetablePage;
