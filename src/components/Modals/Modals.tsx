import React, { useState } from "react";
import ClockIcon from "../icons/ClockIcon.tsx";

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10000,
};

const modalContainerStyle: React.CSSProperties = {
  backgroundColor: "white",
  borderRadius: "24px",
  padding: "24px",
  width: "360px",
  position: "relative",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const closeButtonStyle: React.CSSProperties = {
  border: "none",
  background: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#999",
};

export function DatePickerModal({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  const [selectedDate, setSelectedDate] = useState(
    new Date(value || new Date()),
  );
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyStart = Array(firstDayOfMonth).fill(null);
  const handleSave = () => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
    onClose();
  };
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>
            날짜 선택
          </span>
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        </div>
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{ cursor: "pointer", color: "#666", padding: "5px" }}
              onClick={() => changeMonth(-1)}
            >
              ＜
            </span>
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              {year}년 {month + 1}월
            </span>
            <span
              style={{ cursor: "pointer", color: "#666", padding: "5px" }}
              onClick={() => changeMonth(1)}
            >
              ＞
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "10px 0",
            }}
          >
            {days.map((day, i) => (
              <div
                key={day}
                style={{
                  fontSize: "14px",
                  color: i === 0 ? "#E57373" : i === 6 ? "#4A80F1" : "#333",
                  marginBottom: "10px",
                }}
              >
                {day}
              </div>
            ))}
            {[...emptyStart, ...dates].map((date, i) => {
              const isSelected =
                date &&
                selectedDate.getDate() === date &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;
              return (
                <div
                  key={i}
                  onClick={() =>
                    date && setSelectedDate(new Date(year, month, date))
                  }
                  style={{
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "15px",
                    borderRadius: "50%",
                    backgroundColor: isSelected ? "#4A80F1" : "transparent",
                    color: isSelected
                      ? "white"
                      : i % 7 === 0
                        ? "#E57373"
                        : i % 7 === 6
                          ? "#4A80F1"
                          : "#333",
                    cursor: date ? "pointer" : "default",
                  }}
                >
                  {date}
                </div>
              );
            })}
          </div>
        </div>
        <button
          style={{
            width: "100%",
            padding: "18px",
            backgroundColor: "#4A80F1",
            color: "white",
            border: "none",
            borderRadius: "16px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </div>
  );
}

export function DurationPickerModal({
  value,
  onChange,
  onClose,
}: {
  value?: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const options = [
    { label: "15분", value: "15" },
    { label: "30분", value: "30" },
    { label: "45분", value: "45" },
    { label: "1시간", value: "60" },
    { label: "1시간 30분", value: "90" },
    { label: "2시간", value: "120" },
    { label: "3시간", value: "180" },
  ];

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <style>
        {`
          .duration-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .duration-opt {
            padding: 20px;
            border: 1px solid #F2F2F2;
            border-radius: 20px;
            background-color: #FFF;
            color: #BBB;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            outline: none;
          }
          .duration-opt svg path {
            stroke: #BBB;
            transition: stroke 0.2s ease;
          }
          .duration-opt:hover, .duration-opt.selected {
            background-color: #F0F4FF;
            border-color: #4A80F1;
            color: #4A80F1;
          }
          .duration-opt:hover svg path, .duration-opt.selected svg path {
            stroke: #4A80F1;
          }
          .duration-opt span {
            font-size: 16px;
            font-weight: 600;
          }
        `}
      </style>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>
            소요시간
          </span>
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        </div>

        <div className="duration-grid">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`duration-opt ${value === opt.value ? "selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                onClose();
              }}
            >
              <div style={{ marginBottom: "6px" }}>
                <ClockIcon size={20} />
              </div>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RepeatPickerModal({
  currentValue,
  onChange,
  onClose,
}: {
  currentValue: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const options = [
    { label: "안함", value: "" },
    { label: "매일", value: "DAILY" },
    { label: "매주", value: "WEEKLY" },
    { label: "매달", value: "MONTHLY" },
    { label: "매년", value: "YEARLY" },
  ];
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <style>
        {`
          .repeat-option {
            padding: 18px;
            border-radius: 16px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s ease;
            color: #BBB;
            background-color: transparent;
            font-size: 16px;
            font-weight: 500;
          }
          .repeat-option:hover {
            background-color: #F0F4FF;
            color: #4A80F1;
          }
          .repeat-option.selected {
            background-color: #F0F4FF;
            color: #4A80F1;
            font-weight: 600;
          }
        `}
      </style>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={{ fontSize: "18px", fontWeight: "600" }}>반복</span>
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {options.map((opt) => {
            const isSelected = currentValue === opt.value;
            return (
              <div
                key={opt.value}
                className={`repeat-option ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  onClose();
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <span style={{ fontSize: "18px" }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function TimePickerModal({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const initialHour = value ? parseInt(value.split(":")[0]) : 12;
  const initialMinute = value ? parseInt(value.split(":")[1]) : 0;

  const [ampm, setAmpm] = useState(initialHour >= 12 ? "오후" : "오전");
  const [hour, setHour] = useState(
    initialHour % 12 === 0 ? 12 : initialHour % 12,
  );
  const [minute, setMinute] = useState(initialMinute);

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleApply = () => {
    let finalHour = hour % 12;
    if (ampm === "오후") finalHour += 12;
    const formattedTime = `${String(finalHour).padStart(2, "0")}:${String(
      minute,
    ).padStart(2, "0")}`;
    onChange(formattedTime);
    onClose();
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <style>
        {`
          .time-picker-content {
            display: flex;
            justify-content: space-around;
            padding: 20px 0;
            height: 250px;
          }
          .time-column {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .time-column::-webkit-scrollbar {
            display: none;
          }
          .time-picker-item {
            width: 80%;
            padding: 12px 0;
            text-align: center;
            border-radius: 12px;
            font-size: 18px;
            color: #333;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .time-picker-item:hover {
            background-color: #F0F4FF;
          }
          .time-picker-item.selected {
            background-color: #F0F4FF;
            color: #4A80F1;
            font-weight: bold;
          }
          .footer-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #F2F2F2;
          }
          .action-btn {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            font-weight: 500;
          }
          .current-btn {
            color: #999;
          }
          .apply-btn {
            color: #4A80F1;
            font-weight: bold;
          }
        `}
      </style>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>
            시간 선택
          </span>
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        </div>

        <div className="time-picker-content">
          <div className="time-column">
            {["오전", "오후"].map((v) => (
              <div
                key={v}
                className={`time-picker-item ${ampm === v ? "selected" : ""}`}
                onClick={() => setAmpm(v)}
              >
                {v}
              </div>
            ))}
          </div>

          <div className="time-column">
            {hours.map((v) => (
              <div
                key={v}
                className={`time-picker-item ${hour === v ? "selected" : ""}`}
                onClick={() => setHour(v)}
              >
                {v}
              </div>
            ))}
          </div>

          <div className="time-column">
            {minutes.map((v) => (
              <div
                key={v}
                className={`time-picker-item ${minute === v ? "selected" : ""}`}
                onClick={() => setMinute(v)}
              >
                {v}
              </div>
            ))}
          </div>
        </div>

        <div className="footer-actions">
          <button
            className="action-btn current-btn"
            onClick={() => {
              const now = new Date();
              setAmpm(now.getHours() >= 12 ? "오후" : "오전");
              setHour(now.getHours() % 12 === 0 ? 12 : now.getHours() % 12);
              setMinute(Math.floor(now.getMinutes() / 5) * 5);
            }}
          >
            현재
          </button>
          <button className="action-btn apply-btn" onClick={handleApply}>
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
