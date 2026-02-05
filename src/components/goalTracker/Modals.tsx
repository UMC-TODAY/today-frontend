import React, { useState } from "react";

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
  marginBottom: "30px",
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
  onChange,
  onClose,
}: {
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
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={{ fontSize: "18px", fontWeight: "600" }}>소요시간</span>
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                onClose();
              }}
              style={{
                padding: "15px",
                border: "1px solid #EEE",
                borderRadius: "16px",
                backgroundColor: "#FFF",
                color: "#4A80F1",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "18px" }}>🕒</span>
              {opt.label}
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
          /* 호버 시 연하늘색 하이라이팅 + 파란색 글자 */
          .repeat-option:hover {
            background-color: #F0F4FF;
            color: #4A80F1;
          }
          /* 선택된 상태 유지 */
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
  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContainerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            시작 시간 설정
          </span>
          <button onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        </div>
        <div
          style={{
            padding: "40px 20px",
            border: "1px solid #EEE",
            borderRadius: "24px",
            textAlign: "center",
          }}
        >
          <input
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              fontSize: "24px",
              border: "none",
              outline: "none",
              color: "#4A80F1",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
}
