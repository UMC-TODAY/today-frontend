import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format } from "date-fns";
import { useGetMonthlySchedule } from "../../hooks/queries/useSchedule";
import TodoModal from "../goalTracker/TodoModal";
import { useCsvUpload } from "../../hooks/queries/useSchedule";

export default function CalendarView() {
  const { mutate: uploadCsv } = useCsvUpload();
  const [activeDate, setActiveDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  const { data: response } = useGetMonthlySchedule({
    year: activeDate.getFullYear(),
    month: activeDate.getMonth() + 1,
    filter: "ALL",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCsv(file);
    }
    e.target.value = "";
  };

  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "CSV파일 업로드") {
      document.getElementById("csv-upload-input")?.click();
    }
  };

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
      hasTime:
        ev.startedAt &&
        ev.startedAt.includes(" ") &&
        ev.startedAt.split(" ")[1] !== "00:00:00",
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
      <input
        id="csv-upload-input"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />
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
        <div className="flex gap-2">
          <select
            onChange={onSelectChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none"
          >
            <option>모두 보기</option>
            <option>Google 캘린더</option>
            <option>iCloud 캘린더</option>
            <option value="CSV파일 업로드">CSV파일 업로드</option>
            <option>Notion</option>
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition"
          >
            + 일정 등록
          </button>
        </div>
      </div>
      {isModalOpen && <TodoModal onClose={() => setIsModalOpen(false)} />}
      <div
        className="flex-grow w-full overflow-hidden
        [&_.fc]:font-sans
        [&_.fc-theme-standard_td]:border-gray-100 [&_.fc-theme-standard_th]:border-gray-100
        [&_.fc-col-header-cell-cushion]:text-gray-400 [&_.fc-col-header-cell-cushion]:text-xs [&_.fc-col-header-cell-cushion]:no-underline
        [&_.fc-daygrid-day-number]:text-sm [&_.fc-daygrid-day-number]:text-gray-700 [&_.fc-daygrid-day-number]:no-underline
        [&_.fc-day-today]:bg-transparent
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
          dayMaxEvents={4}
          events={calendarEvents}
          height="100%"
          dayCellContent={(args) => args.dayNumberText.replace("일", "")}
          eventContent={(info) => {
            const { title, extendedProps: props } = info.event;
            const hasTime = props.hasTime;
            let timeText = "";
            if (hasTime) {
              try {
                const dateObj = new Date(props.startedAt.replace(/-/g, "/"));
                timeText = format(dateObj, "h:mm a");
              } catch (e) {
                console.error("Date parsing error", e);
              }
            }
            return (
              <div
                className={`
                  w-full px-2 py-[2px] text-[11px] font-medium flex items-center justify-between cursor-pointer transition hover:opacity-80
                  ${
                    hasTime
                      ? "bg-white text-gray-800 border-l-[3px] shadow-sm rounded-sm"
                      : "text-white rounded-full px-3"
                  }
                `}
                style={{
                  borderColor: hasTime ? props.color : "transparent",
                  backgroundColor: hasTime ? "white" : props.color,
                }}
              >
                <div className="flex items-center gap-1 overflow-hidden">
                  <span className="truncate">{title}</span>
                </div>
                {hasTime && (
                  <span className="text-[9px] ml-1 text-gray-400 shrink-0 uppercase">
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
