import ClockIcon from "../icons/ClockIcon.tsx";
import Calendar2Icon from "../icons/Calendar2Icon.tsx";
import RepeatIcon from "../icons/RepeatIcon.tsx";

const labelStyle = {
  fontSize: "15px",
  fontWeight: "500",
  color: "#1a1a1a",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #f2f2f2",
};

const pickerButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  color: "#1a1a1a",
  fontWeight: "500",
};

const repeatOptions = [
  { label: "안함", value: "" },
  { label: "매일", value: "DAILY" },
  { label: "매주", value: "WEEKLY" },
  { label: "매달", value: "MONTHLY" },
  { label: "매년", value: "YEARLY" },
];

interface DynamicInputProps {
  inputs: any;
  setActivePicker: (picker: string) => void;
}

export function TaskCustomInput({
  inputs,
  setActivePicker,
}: DynamicInputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={rowStyle}>
        <label style={labelStyle}>날짜</label>
        <div style={pickerButtonStyle} onClick={() => setActivePicker("date")}>
          <Calendar2Icon size={14} />
          {inputs.date}
        </div>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>소요 시간</label>
        <div
          style={pickerButtonStyle}
          onClick={() => setActivePicker("duration")}
        >
          <ClockIcon size={14} />
          {inputs.duration}분
        </div>
      </div>

      <div style={{ ...rowStyle, borderBottom: "none" }}>
        <label style={labelStyle}>반복</label>
        <div
          style={pickerButtonStyle}
          onClick={() => setActivePicker("repeat")}
        >
          <RepeatIcon size={14} />
          {repeatOptions.find((opt) => opt.value === inputs.repeat)?.label ||
            "안함"}
        </div>
      </div>
    </div>
  );
}

export function TaskAnytimeInput({
  inputs,
  setActivePicker,
}: DynamicInputProps) {
  return (
    <div style={{ ...rowStyle, borderBottom: "none" }}>
      <label style={labelStyle}>소요 시간</label>
      <div
        style={pickerButtonStyle}
        onClick={() => setActivePicker("duration")}
      >
        <ClockIcon size={14} />
        {inputs.duration}분
      </div>
    </div>
  );
}

export function EventCustomInput({
  inputs,
  setActivePicker,
}: DynamicInputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* 시작 행: 날짜와 시간 병합 */}
      <div style={rowStyle}>
        <label style={labelStyle}>시작</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("startDate")}
          >
            <Calendar2Icon size={14} />
            {inputs.startDate}
          </div>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("startTime")}
          >
            {inputs.startTime}
          </div>
        </div>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>마감</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("endDate")}
          >
            <Calendar2Icon size={14} />
            {inputs.endDate}
          </div>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("endTime")}
          >
            {inputs.endTime}
          </div>
        </div>
      </div>

      <div style={{ ...rowStyle, borderBottom: "none" }}>
        <label style={labelStyle}>반복</label>
        <div
          style={pickerButtonStyle}
          onClick={() => setActivePicker("repeat")}
        >
          <RepeatIcon size={14} />
          {repeatOptions.find((opt) => opt.value === inputs.repeat)?.label ||
            "안함"}
        </div>
      </div>
    </div>
  );
}
