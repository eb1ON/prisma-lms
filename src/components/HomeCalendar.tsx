"use client";

import { useState } from "react";

interface Schedule {
  id: string;
  event: string;
  date: Date;
}

const weekdays = ["Дав", "Мяг", "Лха", "Пү", "Ба", "Бя", "Ням"];
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

export default function Calendar({ events }: { events: Schedule[] }) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const todayDate = today.getDate();

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstWeekDay =
    (new Date(currentYear, currentMonth - 1, 1).getDay() + 6) % 7;

  const isEventDay = (day: number) =>
    events.find((event) => {
      const date = new Date(event.date);
      return (
        date.getFullYear() === currentYear &&
        date.getMonth() + 1 === currentMonth &&
        date.getDate() === day
      );
    });

  return (
    <div className="space-y-3 bg-card dark:bg-[#13272e] flex flex-col items-center justify-center rounded-xl h-[430px]">
      {/* Calendar */}
      <div className="w-[330px] h-[250px] rounded-xl text-center space-y-4 flex flex-col p-2">
        <h2 className="text-xl font-bold text-[#5584c6]">
          {monthNames[currentMonth - 1]}
        </h2>

        <div className="grid grid-cols-7 text-gray-400 dark:text-gray-500 text-sm mb-2">
          {weekdays.map((day) => (
            <div key={day} className="font-normal">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-xs">
          {[...Array(firstWeekDay)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const event = isEventDay(day);
            const isToday = day === todayDate;

            return (
              <div
                key={day}
                className={`w-6 h-6 rounded-md flex flex-col items-center justify-center transition text-xs
                  ${isToday ? "bg-[#5584c6] text-white font-bold" : ""}
                  ${
                    event && !isToday
                      ? "bg-[#e0f7f3] dark:bg-[#264144] text-black dark:text-white font-bold"
                      : ""
                  }
                  ${
                    !event && !isToday ? "text-gray-500 dark:text-gray-400" : ""
                  }
                `}
              >
                {day}
                {event && !isToday && (
                  <span className="text-[4px] text-gray-600 dark:text-gray-400 mt-1">
                    {event.event}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events list */}
      <div className="bg-[#5584c6] w-[280px] justify-center flex flex-col items-center text-center ml-4 p-2 rounded-xl space-y-1 border border-gray-200 dark:border-[#264144] shadow-sm">
        <h3 className="text-lg font-bold text-white">🗓️ Үйл явдлууд</h3>
        {events.length === 0 ? (
          <p className="text-gray-100 text-md">Үйл явдал алга байна.</p>
        ) : (
          <ul className="space-y-2 text-md">
            {events.map((event) => (
              <li
                key={event.id}
                className="bg-gray-50 dark:bg-[#1a2a31] rounded-md p-3 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#264144]"
              >
                <p className="font-semibold text-[#5584c6]">{event.event}</p>
                <p className="text-md text-gray-400 dark:text-gray-500">
                  {new Date(event.date).toLocaleDateString("mn-MN")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
