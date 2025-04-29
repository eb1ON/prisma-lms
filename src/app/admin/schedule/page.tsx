"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    const res = await fetch("/api/schedule");
    const data = await res.json();
    setSchedules(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleAdd = async () => {
    if (!newSchedule.event || !newSchedule.date) {
      alert("Үйл явдал болон огноо оруулна уу.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSchedule),
    });
    if (res.ok) {
      await fetchSchedules();
      setNewSchedule({ event: "", date: "" });
      setIsAddOpen(false);
    } else {
      const result = await res.json();
      alert(result.error || "Нэмэхэд алдаа гарлаа.");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!editSchedule) return;
    setLoading(true);
    const res = await fetch("/api/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSchedule),
    });
    if (res.ok) {
      await fetchSchedules();
      setEditSchedule(null);
    } else {
      const result = await res.json();
      alert(result.error || "Засахад алдаа гарлаа.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ хуваарийг устгах уу?")) return;
    setLoading(true);
    const res = await fetch(`/api/schedule?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchSchedules();
    } else {
      alert("Устгах үед алдаа гарлаа.");
    }
    setLoading(false);
  };

  const filteredSchedules = schedules
    .map((group) => ({
      ...group,
      schedules: group.schedules.filter((s) =>
        s.event.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((group) => group.schedules.length > 0);

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0f181e] text-white py-10 px-6">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-[#0f181e] border-[#6be4b9] hover:bg-[#13272e] active:bg-[#6be4b9] active:text-[#0f181e]"
          >
            ← Буцах
          </Button>
          <h1 className="text-3xl font-bold text-white text-center w-full border-b border-[#6be4b9] pb-4 mb-6">
            📅 Админ хуваарь удирдлага
          </h1>
          <div className="w-24" />
        </div>

        {/* Search */}
        <Input
          placeholder="Хуваарийн нэрээр хайх..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#0f181e] text-white border border-[#6be4b920] mb-8"
        />

        {/* Add Button */}
        <div className="text-center mb-8">
          <Button
            onClick={() => setIsAddOpen(true)}
            className="bg-[#6be4b9] hover:bg-[#53dab0] text-[#0f181e] font-semibold px-6 py-2 rounded-lg"
          >
            ➕ Шинэ хуваарь нэмэх
          </Button>
        </div>

        {/* Schedule List */}
        <div className="space-y-8">
          {filteredSchedules.map((group) => (
            <div key={group.month}>
              <h2 className="text-2xl font-semibold mb-4 border-b border-[#6be4b920] pb-2">
                {monthNames[group.month - 1]}
              </h2>
              <ul className="space-y-3">
                {group.schedules.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center bg-[#13272e] p-4 rounded-lg border border-[#6be4b920] hover:shadow-lg"
                  >
                    <div>
                      <p className="font-semibold text-white">{s.event}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(s.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-[#6be4b9] text-[#0f181e]"
                        onClick={() => setEditSchedule(s)}
                      >
                        Засах
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(s.id)}
                      >
                        Устгах
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {isAddOpen && (
          <ScheduleModal
            schedule={newSchedule}
            setSchedule={setNewSchedule}
            onSave={handleAdd}
            onCancel={() => setIsAddOpen(false)}
            isEditing={false}
          />
        )}

        {/* Edit Modal */}
        {editSchedule && (
          <ScheduleModal
            schedule={editSchedule}
            setSchedule={setEditSchedule}
            onSave={handleUpdate}
            onCancel={() => setEditSchedule(null)}
            isEditing={true}
          />
        )}
      </div>
    </div>
  );
};

type ScheduleModalProps = {
  schedule: { event: string; date: string };
  setSchedule: (s: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
};

const ScheduleModal = ({
  schedule,
  setSchedule,
  onSave,
  onCancel,
  isEditing,
}: ScheduleModalProps) => (
  <div className="bg-[#13272e]/90 fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="bg-[#0f181e] p-6 rounded-xl shadow-lg w-full max-w-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-[#6be4b9]">
        {isEditing ? "✏️ Хуваарь засах" : "➕ Хуваарь нэмэх"}
      </h2>
      <div className="space-y-4">
        <Input
          value={schedule.event}
          onChange={(e) => setSchedule({ ...schedule, event: e.target.value })}
          placeholder="Үйл явдлын нэр"
          className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg"
        />
        <Input
          type="date"
          value={schedule.date}
          onChange={(e) => setSchedule({ ...schedule, date: e.target.value })}
          className="bg-[#0f181e] text-white border border-[#6be4b920] rounded-lg"
        />
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

export default AdminSchedulePage;
