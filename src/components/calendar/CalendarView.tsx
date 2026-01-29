import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format } from "date-fns";
import { useGetMonthlySchedule } from "../../hooks/queries/useSchedule";
import TodoModal from "../goalTracker/TodoModal";

export default function CalendarView() {
  const [activeDate, setActiveDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const { data: response } = useGetMonthlySchedule({
    year: activeDate.getFullYear(),
    month: activeDate.getMonth() + 1,
    filter: "ALL",
  });
  const events = response?.data?.events || [];
  const calendarEvents = events.map((ev) => ({
    id: ev.id.toString(),
    title: ev.title,
    start: ev.startedAt,
    end: ev.endedAt,
    backgroundColor: "transparent",
    borderColor: "transparent",
    extendedProps: {
      emoji: ev.emoji,
      color: ev.color || "#4F85F8",
      startedAt: ev.startedAt,
      endedAt: ev.endedAt,
    },
  }));
  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
    setActiveDate(calendarApi?.getDate() || new Date());
  };
  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
    setActiveDate(calendarApi?.getDate() || new Date());
  };
  return (
    <div className="w-full h-full flex flex-col p-5 bg-white rounded-2xl shadow-sm border border-gray-100 relative">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
          >
            ◀
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {format(activeDate, "yyyy년 MM월")}
          </h2>
          <button
            onClick={handleNext}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"
          >
            ▶
          </button>
        </div>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none">
          <option>모두 보기</option>
          <option>Google 캘린더</option>
          <option>iCloud 캘린더</option>
          <option>CSV파일 업로드</option>
          <option>Notion</option>
        </select>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition"
        >
          + 일정 등록
        </button>
      </div>
      {isModalOpen && <TodoModal onClose={() => setIsModalOpen(false)} />}
      <div
        className="flex-grow w-full overflow-hidden

        [&_.fc]:font-sans
        [&_.fc-theme-standard_td]:border-gray-100 [&_.fc-theme-standard_th]:border-gray-100
        [&_.fc-col-header-cell-cushion]:text-gray-400 [&_.fc-col-header-cell-cushion]:text-xs [&_.fc-col-header-cell-cushion]:no-underline
        [&_.fc-daygrid-day-number]:text-sm [&_.fc-daygrid-day-number]:text-gray-700 [&_.fc-daygrid-day-number]:no-underline
        [&_.fc-day-today]:bg-yellow-50/50
        [&_.fc-daygrid-event-dot]:hidden

        [&_.fc-event]:shadow-none [&_.fc-event]:bg-transparent [&_.fc-event]:my-[1px]
      "
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          headerToolbar={false}
          dayMaxEvents={3}
          events={calendarEvents}
          height="100%"
          dayCellContent={(args) => args.dayNumberText.replace("일", "")}
          eventContent={(info) => {
            const props = info.event.extendedProps;
            const title = info.event.title;
            const startStr = props.startedAt || "";
            const endStr = props.endedAt;
            let timeText = "";
            try {
              if (startStr.includes(":") || startStr.includes("T")) {
                timeText = format(new Date(startStr), "h a");
              }
            } catch (e) {}
            const isSingleDay =
              !endStr || startStr.split(" ")[0] === endStr.split(" ")[0];
            return (
              <div
                className={`
                  w-full px-2 py-[2px] text-[11px] font-medium rounded-sm flex items-center justify-between cursor-pointer transition hover:opacity-80
                  ${
                    isSingleDay
                      ? "bg-white text-gray-800 border-l-[3px] shadow-sm"
                      : "text-white rounded shadow-sm"
                  }
                `}
                style={{
                  borderColor: isSingleDay ? props.color : "transparent",
                  backgroundColor: isSingleDay ? "white" : props.color,
                }}
              >
                <div className="flex items-center gap-1 overflow-hidden">
                  <span className="truncate">{title}</span>
                </div>
                {timeText && (
                  <span
                    className={`text-[10px] ml-1 whitespace-nowrap ${isSingleDay ? "text-gray-400" : "text-white/90"}`}
                  >
                    {timeText}
                  </span>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
