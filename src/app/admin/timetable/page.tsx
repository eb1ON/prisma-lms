"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const courseYears = [1, 2, 3, 4, 5];
const weekdays = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];

const pairTimes = [
  { label: "1-р цаг (08:50-10:10)", start: "08:50", end: "10:10" },
  { label: "2-р цаг (10:20-11:40)", start: "10:20", end: "11:40" },
  { label: "3-р цаг (11:50-13:10)", start: "11:50", end: "13:10" },
  { label: "4-р цаг (14:00-15:20)", start: "14:00", end: "15:20" },
  { label: "5-р цаг (15:30-16:50)", start: "15:30", end: "16:50" },
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
  const [errorMessage, setErrorMessage] = useState("");
  const [editErrorMessage, setEditErrorMessage] = useState("");

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
    return found
      ? { start_time: found.start, end_time: found.end }
      : { start_time: "", end_time: "" };
  };

  const handleAddTimetable = async () => {
    if (
      !newTimetable.lesson_code ||
      !newTimetable.weekdays ||
      !newTimetable.pair ||
      !newTimetable.school_year
    ) {
      setErrorMessage("Бүх талбарыг бөглөнө үү!");
      return;
    }

    const times = getTimesFromPair(newTimetable.pair);

    if (!times.start_time || !times.end_time) {
      setErrorMessage("Цаг зөв сонгоно уу!");
      return;
    }

    const duplicate = timetable.find(
      (item) =>
        item.weekdays === newTimetable.weekdays &&
        item.pair === newTimetable.pair &&
        item.school_year === newTimetable.school_year
    );

    if (duplicate) {
      setErrorMessage(
        "Тухайн өдөр, тухайн цагт энэ курст хичээл орж байгаа тул дахин нэмэх боломжгүй!"
      );
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
      pair: newTimetable.pair,
    };

    const res = await fetch("/api/timetable", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      setErrorMessage(error.error || "Алдаа гарлаа.");
      return;
    }

    await fetchTimetable();
    setNewTimetable({
      lesson_code: "",
      teacher_id: "",
      weekdays: "",
      pair: "",
      school_year: 1,
    });
    setIsAddOpen(false);
    setErrorMessage("");
  };

  const handleEditTimetable = async () => {
    if (
      !editTimetable.lesson_code ||
      !editTimetable.weekdays ||
      !editTimetable.pair ||
      !editTimetable.school_year
    ) {
      setEditErrorMessage("Бүх талбарыг бөглөнө үү!");
      return;
    }

    const times = getTimesFromPair(editTimetable.pair);

    const duplicate = timetable.find(
      (item) =>
        item.weekdays === editTimetable.weekdays &&
        item.pair === editTimetable.pair &&
        item.school_year === editTimetable.school_year &&
        item.id !== editTimetable.id
    );

    if (duplicate) {
      setEditErrorMessage(
        "Тухайн өдөр, цагт энэ курст хичээл аль хэдийн орж байгаа тул дахин засах боломжгүй!"
      );
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

    const res = await fetch("/api/timetable", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      setEditErrorMessage(error.error || "Алдаа гарлаа.");
      return;
    }

    await fetchTimetable();
    setEditTimetable(null);
    setEditErrorMessage("");
  };

  const handleDeleteTimetable = async (id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;

    const res = await fetch(`/api/timetable?id=${id}`, { method: "DELETE" });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || "Устгах үед алдаа гарлаа");
      return;
    }

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
    <div className=" bg-white fixed inset-0 overflow-y-auto bg- text-[#e3fef3] py-12 px-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/sign-up")}
            className="text-gray-800 bg-[#e9ebee] border shadow-sm hover:bg-[#5584c6] active:bg-[#5584c6]/50 active:text-gray-800"
          >
            ← Буцах
          </Button>
          <h1 className="text-3xl font-bold text-black text-center w-full border-b border-[#5584c6] pb-4 mb-6">
            🗓️ Хичээлийн хуваарь
          </h1>
          <div className="w-24" />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <Input
            placeholder="Хичээлийн нэр эсвэл кодоор хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] mb-8"
          />
          <select
            value={filterYear}
            onChange={(e) =>
              setFilterYear(
                e.target.value === "" ? "" : parseInt(e.target.value)
              )
            }
            className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] px-4 py-2 rounded-lg w-full md:w-1/4 mb-8"
          >
            <option value="">Бүх курсууд</option>
            {courseYears.map((year) => (
              <option key={year} value={year}>
                {year} курс
              </option>
            ))}
          </select>
        </div>

        {/* Add Button */}
        <div className="text-center mb-6">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#e9ebee] hover:bg-[#5584c6] text-gray-800 font-semibold px-6 py-2 rounded-lg"
          >
            ➕ Шинэ хичээл нэмэх
          </Button>
        </div>

        {/* Timetable List */}
        <div className="bg-white border shadow-2xl p-6 rounded-xl mb-12 w-full max-h-[500px] overflow-y-auto">
          {Object.entries(grouped).map(([lessonName, entries]) => (
            <div key={lessonName} className="mb-4">
              <div
                onClick={() =>
                  setExpandedLesson(
                    expandedLesson === lessonName ? null : lessonName
                  )
                }
                className="cursor-pointer text-[#5584c6] font-bold py-2 border-b border-[#6be4b920] hover:bg-[#e9ebee] px-4"
              >
                {lessonName} {expandedLesson === lessonName ? "▲" : "▼"}
              </div>
              {expandedLesson === lessonName && (
                <table className="text-gray-800 w-full text-sm divide-y divide-[#6be4b920] mt-2">
                  <thead>
                    <tr className="text-black">
                      <th className="text-left px-4 py-2">Багш</th>
                      <th className="text-left px-4 py-2">Өдөр</th>
                      <th className="text-center px-4 py-2">Эхлэх</th>
                      <th className="text-center px-4 py-2">Дуусах</th>
                      <th className="text-center px-4 py-2">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="">
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
                            className="bg-[#e9ebee] text-gray-800 hover:bg-[#5584c6]"
                            onClick={() => setEditTimetable(entry)}
                          >
                            Засах
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#e9ebee] text-gray-800 hover:bg-red-500"
                            variant="destructive"
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
          <div className="bg-white/70 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border p-6 rounded-2xl shadow-lg w-full max-w-2xl space-y-6">
              <h2 className="text-2xl font-bold text-center text-black mb-6">
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
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920]"
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
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920]"
                />
                <select
                  value={newTimetable.weekdays}
                  onChange={(e) =>
                    setNewTimetable({
                      ...newTimetable,
                      weekdays: e.target.value,
                    })
                  }
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg"
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
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Цаг сонгох</option>
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
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Курс сонгох</option>
                  {courseYears.map((year) => (
                    <option key={year} value={year}>
                      {year} курс
                    </option>
                  ))}
                </select>
              </div>
              {errorMessage && <p className="text-red-400">{errorMessage}</p>}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleAddTimetable}
                  className="w-full bg-[#e9ebee] border border-[#5584c6] text-gray-800 hover:bg-[#5584c6] font-semibold"
                >
                  Хадгалах
                </Button>
                <Button
                  onClick={() => {
                    setIsAddOpen(false);
                    setErrorMessage("");
                  }}
                  variant="outline"
                  className="w-full bg-[#e9ebee] text-gray-800 hover:bg-red-500"
                >
                  Болих
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ✏️ Edit Modal */}
        {editTimetable && (
          <div className="bg-white/70 fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl space-y-4 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-bold text-center text-black mb-6">
                ✏️ Хичээлийн хуваарь засах
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  disabled
                  value={editTimetable.lesson_code}
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg"
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
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg"
                />
                <select
                  value={editTimetable.weekdays}
                  onChange={(e) =>
                    setEditTimetable({
                      ...editTimetable,
                      weekdays: e.target.value,
                    })
                  }
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg"
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
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg"
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
                  className="bg-[#e9ebee] text-gray-800 border border-[#6be4b920] rounded-lg"
                >
                  <option value="">Курс сонгох</option>
                  {courseYears.map((year) => (
                    <option key={year} value={year}>
                      {year} курс
                    </option>
                  ))}
                </select>
              </div>
              {editErrorMessage && (
                <p className="text-red-400">{editErrorMessage}</p>
              )}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleEditTimetable}
                  className="w-full bg-[#e9ebee] border border-[#5584c6] text-gray-800 hover:bg-[#5584c6] font-semibold"
                >
                  Хадгалах
                </Button>
                <Button
                  onClick={() => setEditTimetable(null)}
                  variant="outline"
                  className="w-full bg-[#e9ebee] text-gray-800 hover:bg-red-500"
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
