import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format } from "date-fns";
import {
  useGetMonthlySchedule,
  useCsvUpload,
  useUpdateScheduleStatus,
} from "../../hooks/queries/useSchedule";
import TodoEditModal from "../Modals/TodoEditModal.tsx";

export default function CalendarView() {
  const { mutate: uploadCsv } = useCsvUpload();
  const { mutate: updateStatus } = useUpdateScheduleStatus();
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

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const rawData = events.find((ev: any) => ev.id.toString() === eventId);
    if (rawData) {
      const currentStatus = !!(
        rawData.isDone ??
        rawData._done ??
        rawData.is_done
      );
      updateStatus({
        id: rawData.id,
        data: { is_done: !currentStatus },
      });
    }
  };

  const calendarEvents = events.map((ev) => {
    const isDone = !!(ev.isDone ?? ev._done ?? ev.is_done);
    return {
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
        isDone: isDone,
        hasTime:
          ev.startedAt &&
          ev.startedAt.includes(" ") &&
          ev.startedAt.split(" ")[1] !== "00:00:00",
      },
    };
  });

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
      {isModalOpen && (
        <TodoEditModal mode="CREATE" onClose={() => setIsModalOpen(false)} />
      )}
      <div
        className="flex-grow w-full overflow-hidden
        [&_.fc]:font-sans
        [&_.fc-theme-standard_td]:border-gray-100 [&_.fc-theme-standard_th]:border-gray-100
        [&_.fc-col-header-cell-cushion]:text-gray-400 [&_.fc-col-header-cell-cushion]:text-xs [&_.fc-col-header-cell-cushion]:no-underline
        [&_.fc-day-sun_.fc-col-header-cell-cushion]:text-red-500 [&_.fc-day-sun_.fc-daygrid-day-number]:text-red-500
        [&_.fc-day-sat_.fc-col-header-cell-cushion]:text-blue-500 [&_.fc-day-sat_.fc-daygrid-day-number]:text-blue-500
        [&_.fc-daygrid-day-top]:flex-row
        [&_.fc-daygrid-day-number]:text-sm [&_.fc-daygrid-day-number]:text-gray-700 [&_.fc-daygrid-day-number]:no-underline [&_.fc-daygrid-day-number]:p-2
        [&_.fc-day-today]:bg-transparent
        [&_.fc-daygrid-event-dot]:hidden
        [&_.fc-event]:shadow-none [&_.fc-event]:bg-transparent [&_.fc-event]:my-[1px] [&_.fc-event-main]:p-0"
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          headerToolbar={false}
          dayMaxEvents={4}
          events={calendarEvents}
          eventClick={handleEventClick}
          height="100%"
          dayCellContent={(args) => args.dayNumberText.replace("일", "")}
          dayHeaderContent={(args) => {
            const days = [
              "일요일",
              "월요일",
              "화요일",
              "수요일",
              "목요일",
              "금요일",
              "토요일",
            ];
            return days[args.date.getDay()];
          }}
          eventContent={(info) => {
            const { title, extendedProps: props } = info.event;
            const hasTime = props.hasTime;
            const isStart = info.isStart;
            const isEnd = info.isEnd;
            const isDone = props.isDone;
            let timeText = "";
            if (hasTime && isEnd) {
              try {
                const dateObj = new Date(props.endedAt.replace(/-/g, "/"));
                timeText = format(dateObj, "h:mm a");
              } catch (e) {
                console.log(e);
              }
            }
            return (
              <div
                className={`w-full min-h-[20px] px-2 py-[2px] text-[11px] font-medium flex items-center justify-between cursor-pointer transition hover:opacity-80 shadow-md ${
                  isDone ? "opacity-40" : ""
                } ${
                  hasTime
                    ? `bg-white text-gray-800 border-l-[3px] ${isStart ? "rounded-l-sm" : ""} ${isEnd ? "rounded-r-sm" : ""}`
                    : "text-white"
                } ${!hasTime && isStart ? "rounded-l-full pl-3" : ""} ${!hasTime && isEnd ? "rounded-r-full pr-3" : ""} ${!isStart && !isEnd ? "rounded-none" : ""}`}
                style={{
                  borderLeftColor:
                    hasTime && isStart ? props.color : "transparent",
                  backgroundColor: hasTime ? "white" : props.color,
                }}
              >
                <div className="flex items-center gap-1 overflow-hidden">
                  {isStart ? (
                    <span
                      className={`truncate ${isDone ? "line-through" : ""}`}
                    >
                      {title}
                    </span>
                  ) : (
                    <span className="invisible">.</span>
                  )}
                </div>
                {hasTime && isStart && (
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
