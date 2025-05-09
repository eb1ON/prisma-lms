"use client";

interface Schedule {
  id: string;
  title: string;
  date: string;
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

  const upcomingEvents = events
    .map((event) => ({
      ...event,
      dateObj: new Date(event.date),
    }))
    .filter((event) => event.dateObj >= today)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-4 bg-card dark:bg-[#13272e] flex flex-col items-center justify-center rounded-xl">
      {/* Calendar */}
      <div className="w-[240px] rounded-xl text-center space-y-1 flex flex-col p-2">
        <h2 className="text-xl font-bold text-[#5584c6]">
          {monthNames[currentMonth - 1]}
        </h2>

        <div className="grid grid-cols-7 text-gray-400 dark:text-gray-500 text-sm">
          {weekdays.map((day) => (
            <div key={day} className="font-normal">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-sm">
          {[...Array(firstWeekDay)].map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const hasEvent = !!isEventDay(day);
            const isToday = day === todayDate;

            return (
              <div
                key={day}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition
                  ${isToday ? "bg-[#5584c6] text-white font-bold" : ""}
                  ${
                    hasEvent && !isToday
                      ? "bg-[#d4ebf9] text-black font-semibold"
                      : ""
                  }
                  ${
                    !hasEvent && !isToday
                      ? "text-gray-500 dark:text-gray-400"
                      : ""
                  }
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-[#5584c6] w-[200px] flex flex-col items-center text-center p-3 rounded-xl space-y-2 border border-gray-200 dark:border-[#264144] shadow-sm">
        <h3 className="text-sm font-bold text-white">🗓️ Тун удахгүй болох</h3>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-100 text-sm">Ойрын үйл явдал алга байна.</p>
        ) : (
          <ul className="space-y-2 w-full">
            {upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="bg-white dark:bg-[#1a2a31] rounded-md p-2 text-center text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-[#264144]"
              >
                {event.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
