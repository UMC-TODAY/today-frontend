import { useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  subWeeks,
  addWeeks,
  isSameDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useGetMonthlySchedule } from "../../hooks/queries/useSchedule";
import TodoModal from "../goalTracker/TodoModal";

export default function WeeklyTodoView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  // TODO: 나중에 스케쥴 말고 일정으로 변경
  const { data: response } = useGetMonthlySchedule({
    year: startDate.getFullYear(),
    month: startDate.getMonth() + 1,
    filter: "ALL",
  });
  const events = response?.data?.events || [];
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            ◀
          </button>
          <span className="text-xl font-bold text-gray-800">
            {format(startDate, "MM.dd")} -{" "}
            {format(addDays(startDate, 6), "MM.dd")}
          </span>
          <button
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            ▶
          </button>
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
            <option>모두 보기</option>
            <option>Google 캘린더</option>
            <option>iCloud 캘린더</option>
            <option>CSV파일 업로드</option>
            <option>Notion</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-lg transition"
          >
            + 할일 등록하기
          </button>
        </div>
      </div>
      {isModalOpen && <TodoModal onClose={() => setIsModalOpen(false)} />}
      <div className="flex-grow grid grid-cols-7 h-full border-t border-gray-100">
        {weekDays.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const isToday = isSameDay(day, new Date());
          const dayTodos = events.filter((ev) => {
            const targetDate = ev.startedAt;
            return targetDate.startsWith(dateKey);
          });
          return (
            <div
              key={dateKey}
              className={`
                flex flex-col pt-4 px-2
                ${index !== 6 ? "border-r border-gray-100" : ""}
              `}
            >
              <div className="text-center mb-6 flex flex-col items-center gap-2">
                <span
                  className={`text-xs ${index === 0 ? "text-red-400" : index === 6 ? "text-blue-400" : "text-gray-400"}`}
                >
                  {format(day, "E요일", { locale: ko })}
                </span>
                <span
                  className={`
                    text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday ? "bg-blue-500 text-white" : "text-gray-700"}
                `}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto h-full scrollbar-hide pb-4">
                {dayTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="p-2 rounded-lg text-xs font-medium text-gray-700 cursor-pointer hover:opacity-80 transition flex items-center gap-1.5 shadow-sm border border-gray-50"
                    style={{
                      backgroundColor: todo.color
                        ? `${todo.color}20`
                        : "#F3F4F6",
                    }}
                    onClick={() => alert(todo.title)}
                  >
                    <span>{todo.emoji}</span>
                    <span
                      className={`truncate ${todo.isDone ? "line-through text-gray-400" : ""}`}
                    >
                      {todo.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
