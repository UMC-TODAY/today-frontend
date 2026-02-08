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
import {
  useGetWeeklyTodo,
  useUpdateScheduleStatus,
} from "../../hooks/queries/useSchedule";
import TodoEditModal from "../Modals/TodoEditModal";

export default function WeeklyTodoView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = addDays(startDate, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const { data: response, isLoading } = useGetWeeklyTodo({
    from: format(startDate, "yyyy-MM-dd"),
    to: format(endDate, "yyyy-MM-dd"),
    filter: "ALL",
  });
  const { mutate: updateStatus } = useUpdateScheduleStatus();
  const todoList = response?.data?.todos || [];
  const handleToggleTodo = (todo: any) => {
    const isDone = todo.isDone ?? todo._done ?? todo.is_done;
    updateStatus({
      id: todo.id,
      data: { is_done: !isDone },
    });
  };
  return (
    <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            ◀
          </button>
          <span className="text-xl font-bold text-gray-800">
            {format(startDate, "MM.dd")} - {format(endDate, "MM.dd")}
          </span>
          <button
            onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            ▶
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-lg transition"
          >
            + 할일 등록하기
          </button>
        </div>
      </div>
      {isModalOpen && <TodoEditModal onClose={() => setIsModalOpen(false)} />}
      <div className="flex-grow grid grid-cols-7 h-full border-t border-gray-100 min-h-0">
        {weekDays.map((day, index) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const isToday = isSameDay(day, new Date());
          const dayTodos = todoList.filter(
            (todo: any) => todo.date === dateKey,
          );
          return (
            <div
              key={dateKey}
              className={`flex flex-col pt-4 px-2 min-w-0 ${
                index !== 6 ? "border-r border-gray-100" : ""
              }`}
            >
              <div className="text-center mb-6 flex flex-col items-center gap-2">
                <span
                  className={`text-[11px] font-medium ${
                    index === 0
                      ? "text-red-400"
                      : index === 6
                        ? "text-blue-400"
                        : "text-gray-400"
                  }`}
                >
                  {format(day, "EEE", { locale: ko })}
                </span>
                <span
                  className={`
                    text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday ? "bg-slate-800 text-white" : "text-gray-700"}
                `}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto h-full scrollbar-hide pb-4">
                {isLoading ? (
                  <div className="text-[10px] text-gray-300 text-center">
                    ...
                  </div>
                ) : (
                  dayTodos.map((todo: any) => {
                    const isDone = todo.isDone ?? todo._done ?? todo.is_done;
                    return (
                      <div
                        key={todo.id}
                        className={`p-1.5 rounded-xl transition-all flex items-center gap-2 border cursor-pointer ${
                          isDone
                            ? "bg-slate-50 border-transparent opacity-60"
                            : "bg-white border-slate-100 shadow-sm hover:border-slate-300"
                        }`}
                        onClick={() => handleToggleTodo(todo)}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] transition-colors ${
                            isDone ? "bg-slate-200" : ""
                          }`}
                          style={{
                            backgroundColor: !isDone
                              ? `${todo.color}33`
                              : undefined,
                          }}
                        >
                          {todo.emoji || "📝"}
                        </div>
                        <span
                          className={`truncate text-[11px] flex-1 ${
                            isDone
                              ? "line-through text-slate-400"
                              : "text-slate-700 font-semibold"
                          }`}
                        >
                          {todo.title}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
