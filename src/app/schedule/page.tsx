"use client";

import { useEffect, useState } from "react";

interface Schedule {
  id: string;
  event: string;
  date: string;
}

const weekDays = ["Дав", "Мяг", "Лха", "Пү", "Ба", "Бя", "Ням"];
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

const UserSchedulePage = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDay, setSelectedDay] = useState<Schedule | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<{
    year: number;
    month: number;
  } | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      const res = await fetch("/api/schedule");
      const data = await res.json();
      setSchedules(data.flatMap((group: any) => group.schedules));
    };
    fetchSchedules();
  }, []);

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month, 0).getDate();
  const getFirstWeekDay = (month: number, year: number) =>
    (new Date(year, month - 1, 1).getDay() + 6) % 7;

  const isEventDay = (day: number, month: number, year: number) =>
    schedules.some((s) => {
      const date = new Date(s.date);
      return (
        date.getDate() === day &&
        date.getMonth() + 1 === month &&
        date.getFullYear() === year
      );
    });

  const findEvent = (day: number, month: number, year: number) =>
    schedules.find((s) => {
      const date = new Date(s.date);
      return (
        date.getDate() === day &&
        date.getMonth() + 1 === month &&
        date.getFullYear() === year
      );
    });

  const getMonthEvents = (month: number, year: number) =>
    schedules.filter((s) => {
      const date = new Date(s.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });

  const renderCalendarBlock = (year: number, months: number[]) => (
    <div key={year} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6">
        📆 {year} он
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month) => {
          const days = getDaysInMonth(month, year);
          const firstWeekday = getFirstWeekDay(month, year);

          return (
            <div
              key={`${year}-${month}`}
              className="bg-gray-100 dark:bg-[#13272e] rounded-xl p-4 shadow border border-[#6be4b920] dark:border-[#264144]"
            >
              <button
                onClick={() => setSelectedMonth({ year, month })}
                className="block w-full text-lg font-bold text-center text-[#5584c6] dark:text-[#6be4b9] mb-4 hover:underline"
              >
                {monthNames[month - 1]}
              </button>

              <div className="grid grid-cols-7 gap-1 text-sm mb-1 text-center text-gray-700 dark:text-gray-400">
                {weekDays.map((day) => (
                  <div key={day} className="font-medium">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 text-sm">
                {[...Array(firstWeekday)].map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {[...Array(days)].map((_, index) => {
                  const day = index + 1;
                  const hasEvent = isEventDay(day, month, year);

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const event = findEvent(day, month, year);
                        if (event) setSelectedDay(event);
                      }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                        hasEvent
                          ? "bg-gray-300 dark:bg-[#264144] text-gray-700 dark:text-white font-bold hover:bg-[#5584c6] dark:hover:bg-[#6be4b9]"
                          : "text-gray-700 dark:text-gray-400 hover:text-[#5584c6] dark:hover:text-[#6be4b9]"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#0f181e] min-h-screen py-10 px-4 md:px-10 text-[#d6faff] font-sans">
      <h1 className="text-3xl font-bold text-center text-black dark:text-white mb-8">
        📅 Жилийн хуанли
      </h1>

      {renderCalendarBlock(2024, [9, 10, 11, 12])}
      {renderCalendarBlock(2025, [1, 2, 3, 4, 5, 6, 7, 8])}

      {/* Day Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#13272e] border p-6 rounded-xl shadow-md max-w-md w-full">
            <h3 className="text-2xl font-bold text-[#5584c6] dark:text-[#6be4b9] mb-4">
              📌 Үйл ажиллагаа
            </h3>
            <p className="mb-2 text-gray-700 dark:text-gray-300">
              <strong>Огноо:</strong>{" "}
              {new Date(selectedDay.date).toLocaleDateString("mn-MN")}
            </p>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              <strong>Үйл явдал:</strong> {selectedDay.event}
            </p>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-full bg-[#e9ebee] dark:bg-[#264144] text-gray-700 dark:text-gray-200 font-semibold py-2 rounded hover:bg-[#5584c6] dark:hover:bg-[#6be4b9]"
            >
              Хаах
            </button>
          </div>
        </div>
      )}

      {/* Full Month Modal */}
      {selectedMonth && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#13272e] p-6 rounded-xl shadow-md max-w-xl w-full">
            <h3 className="text-2xl font-bold text-[#5584c6] dark:text-[#6be4b9] mb-4">
              📆 {monthNames[selectedMonth.month - 1]} {selectedMonth.year} -
              Үйл явдлууд
            </h3>
            {getMonthEvents(selectedMonth.month, selectedMonth.year).length >
            0 ? (
              <ul className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2">
                {getMonthEvents(selectedMonth.month, selectedMonth.year).map(
                  (ev) => (
                    <li
                      key={ev.id}
                      className="bg-gray-100 dark:bg-[#1a2a31] p-3 rounded-lg shadow-md border dark:border-[#264144]"
                    >
                      <p className="text-gray-700 dark:text-white font-medium">
                        {ev.event}
                      </p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs">
                        {new Date(ev.date).toLocaleDateString("mn-MN")}
                      </p>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="italic text-gray-400 dark:text-gray-500 text-center">
                Энэ сард үйл явдал байхгүй.
              </p>
            )}
            <button
              onClick={() => setSelectedMonth(null)}
              className="w-full mt-4 bg-[#e9ebee] dark:bg-[#264144] text-gray-700 dark:text-gray-200 font-semibold py-2 rounded hover:bg-[#5584c6] dark:hover:bg-[#6be4b9]"
            >
              Хаах
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSchedulePage;
