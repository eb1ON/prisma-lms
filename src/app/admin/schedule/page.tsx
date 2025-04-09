// This file contains the AdminSchedulePage component with updated styles
// using the preferred color palette: bg-[#0f181e], bg-[#13272e], border-[#6be4b920], bg-[#6be4b9]

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Schedule {
  id: string;
  event: string;
  date: string;
}

interface GroupedSchedule {
  month: number;
  schedules: Schedule[];
}

const monthNames = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];

const AdminSchedulePage = () => {
  const router = useRouter();
  const [schedules, setSchedules] = useState<GroupedSchedule[]>([]);
  const [newSchedule, setNewSchedule] = useState({ event: "", date: "" });
  const [editSchedule, setEditSchedule] = useState<Schedule>({
    id: "",
    event: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      const res = await fetch("/api/schedule");
      const data = await res.json();
      setSchedules(data);
      setLoading(false);
    };
    fetchSchedules();
  }, []);

  const handleAdd = async () => {
    if (!newSchedule.event || !newSchedule.date) {
      alert("Үйл явдал болон огноо шаардлагатай.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSchedule),
    });

    const result = await res.json();
    if (res.ok) {
      const month = new Date(result.date).getMonth();
      setSchedules((prev) => {
        const updated = [...prev];
        if (!updated[month]) {
          updated[month] = { month: month + 1, schedules: [] };
        }
        updated[month].schedules.push(result);
        return updated;
      });
      setNewSchedule({ event: "", date: "" });
    } else {
      alert(result.error || "Нэмэхэд алдаа гарлаа.");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const res = await fetch("/api/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSchedule),
    });

    const result = await res.json();
    if (res.ok) {
      setSchedules((prev) =>
        prev.map((group) =>
          group.month === new Date(result.date).getMonth() + 1
            ? {
                ...group,
                schedules: group.schedules.map((item) =>
                  item.id === result.id ? result : item
                ),
              }
            : group
        )
      );
      setEditSchedule({ id: "", event: "", date: "" });
    } else {
      alert(result.error || "Засахад алдаа гарлаа.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Устгахдаа итгэлтэй байна уу?")) return;
    setLoading(true);
    const res = await fetch(`/api/schedule?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSchedules((prev) =>
        prev.map((group) => ({
          ...group,
          schedules: group.schedules.filter((s) => s.id !== id),
        }))
      );
    } else {
      alert("Устгахад алдаа гарлаа.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0f181e] text-white py-10 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 gap-4">
          <button
            onClick={() => router.back()}
            className="bg-[#13272e] border border-[#6be4b920] px-4 py-2 rounded-md hover:bg-[#1b383f]"
          >
            ← Буцах
          </button>
          <h1 className="text-3xl font-bold text-white text-center w-full border-b border-[#6be4b9] pb-4 mb-6">
            📅 Админ хуваарь удирдлага
          </h1>
          <div className="w-24" />
        </div>

        {/* Add Schedule */}
        <div className="bg-[#13272e] p-6 shadow-xl rounded-xl mb-12 w-full">
          <h2 className="text-2xl font-semibold text-[#6be4b9] text-center mb-4">
            ➕ Хуваарь нэмэх
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Үйл явдлын нэр"
              value={newSchedule.event}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, event: e.target.value })
              }
              className="w-full border border-[#6be4b920] rounded-md p-2 bg-[#0f181e] text-white"
            />
            <input
              type="date"
              value={newSchedule.date}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, date: e.target.value })
              }
              className="w-full border border-[#6be4b920] rounded-md p-2 bg-[#0f181e] text-white"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full mt-4 bg-[#6be4b9] hover:bg-[#53dab0] text-[#0f181e] py-2 rounded-md font-semibold"
          >
            {loading ? "Нэмж байна..." : "Хуваарь нэмэх"}
          </button>
        </div>

        {/* Edit Schedule */}
        {editSchedule.id && (
          <div className="bg-[#13272e] p-6 shadow-xl rounded-xl mb-12 w-full">
            <h2 className="text-2xl font-semibold text-yellow-400 text-center mb-4">
              ✏️ Хуваарь засах
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                value={editSchedule.event}
                onChange={(e) =>
                  setEditSchedule({ ...editSchedule, event: e.target.value })
                }
                className="w-full border border-[#6be4b920] rounded-md p-2 bg-[#0f181e] text-white"
              />
              <input
                type="date"
                value={editSchedule.date}
                onChange={(e) =>
                  setEditSchedule({ ...editSchedule, date: e.target.value })
                }
                className="w-full border border-[#6be4b920] rounded-md p-2 bg-[#0f181e] text-white"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleUpdate}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-[#0f181e] py-2 rounded-md font-semibold"
              >
                {loading ? "Шинэчлэх..." : "Хадгалах"}
              </button>
              <button
                onClick={() => setEditSchedule({ id: "", event: "", date: "" })}
                className="w-full border border-[#6be4b920] text-white hover:bg-[#0f181e] rounded-md py-2"
              >
                Цуцлах
              </button>
            </div>
          </div>
        )}

        {/* Schedule List */}
        <div className="space-y-8">
          {schedules.map((group) => (
            <div key={group.month}>
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-[#6be4b920] pb-2">
                {monthNames[group.month - 1]}
              </h2>
              <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {group.schedules.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center bg-[#13272e] p-4 rounded-lg shadow-sm hover:shadow-md transition border border-[#6be4b920]"
                  >
                    <div>
                      <p className="font-medium text-white">{s.event}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(s.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditSchedule(s)}
                        className="bg-[#6be4b9] hover:bg-[#53dab0] text-[#0f181e] px-3 py-1 rounded-md"
                      >
                        Засах
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                      >
                        Устгах
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSchedulePage;
