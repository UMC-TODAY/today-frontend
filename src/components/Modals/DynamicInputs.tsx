const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  boxSizing: "border-box" as const,
};
const labelStyle = {
  fontSize: "12px",
  fontWeight: "bold",
  color: "#555",
};
const pickerButtonStyle = {
  ...inputStyle,
  textAlign: "left" as const,
  backgroundColor: "#fff",
  cursor: "pointer",
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

/**
 * 2. 할 일 (사용자 지정) UI
 */
export function TaskCustomInput({
  inputs,
  setActivePicker,
}: DynamicInputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>날짜</label>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("date")}
          >
            {inputs.date}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>소요시간</label>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("duration")}
          >
            {inputs.duration}분
          </div>
        </div>
      </div>
      <div>
        <label style={labelStyle}>반복</label>
        <div
          style={pickerButtonStyle}
          onClick={() => setActivePicker("repeat")}
        >
          {repeatOptions.find((opt) => opt.value === inputs.repeat)?.label ||
            "안함"}
        </div>
      </div>
    </div>
  );
}

/**
 * 3. 할 일 (언제든지) UI
 */
export function TaskAnytimeInput({
  inputs,
  setActivePicker,
}: DynamicInputProps) {
  return (
    <div>
      <label style={labelStyle}>소요시간</label>
      <div
        style={pickerButtonStyle}
        onClick={() => setActivePicker("duration")}
      >
        {inputs.duration}분
      </div>
    </div>
  );
}

/**
 * 4. 이벤트 (사용자 지정) UI
 */
export function EventCustomInput({
  inputs,
  setActivePicker,
}: DynamicInputProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>시작</label>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("startDate")}
          >
            {inputs.startDate}
          </div>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("startTime")}
          >
            {inputs.startTime}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>마감</label>
          <div
            style={pickerButtonStyle}
            onClick={() => setActivePicker("endDate")}
          >
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
      <div>
        <label style={labelStyle}>반복</label>
        <div
          style={pickerButtonStyle}
          onClick={() => setActivePicker("repeat")}
        >
          {repeatOptions.find((opt) => opt.value === inputs.repeat)?.label ||
            "안함"}
        </div>
      </div>
    </div>
  );
}
