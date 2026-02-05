import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import TodoDesignPicker from "./TodoDesignPicker";
import EmojiCircle from "./EmojiCircle";
import {
  useCreateSchedule,
  useUpdateSchedule,
} from "../../hooks/queries/useSchedule";
import {
  DatePickerModal,
  DurationPickerModal,
  RepeatPickerModal,
  TimePickerModal,
} from "./Modals.tsx";

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

interface TodoEditModalProps {
  onClose: () => void;
  mode?: "CREATE" | "UPDATE";
  scheduleId?: number;
  initialData?: any;
}

export default function TodoEditModal({
  onClose,
  mode = "CREATE",
  scheduleId,
  initialData,
}: TodoEditModalProps) {
  const { mutate: createSchedule, isPending: isCreatePending } =
    useCreateSchedule();
  const { mutate: updateSchedule, isPending: isUpdatePending } =
    useUpdateSchedule(scheduleId || 0);
  const isPending = isCreatePending || isUpdatePending;
  const [isWorkTypeModalOpen, setIsWorkTypeModalOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(
    initialData?.scheduleType || "TASK",
  );
  const [selectedMode, setSelectedMode] = useState(
    initialData?.mode || "CUSTOM",
  );
  const [subTaskInput, setSubTaskInput] = useState("");
  const [editingTarget, setEditingTarget] = useState<"MAIN" | number>("MAIN");
  const todayStr = new Date().toISOString().split("T")[0];
  const [inputs, setInputs] = useState({
    title: initialData?.title || "",
    date: initialData?.date || todayStr,
    duration: String(initialData?.duration || "60"),
    repeat:
      initialData?.repeatType === "NONE" ? "" : initialData?.repeatType || "",
    subTasks:
      initialData?.subSchedules ||
      ([] as { subTitle: string; subColor: string; subEmoji: string }[]),
    memo: initialData?.memo || "",
    emoji: initialData?.emoji || "📹",
    bgColor: initialData?.bgColor || "#F0EFC4",
    startDate: initialData?.startAt?.split(" ")[0] || todayStr,
    endDate: initialData?.endAt?.split(" ")[0] || todayStr,
    startTime: initialData?.startAt?.split(" ")[1] || "09:00",
    endTime: initialData?.endAt?.split(" ")[1] || "10:00",
  });
  const toggleModal = () => setIsWorkTypeModalOpen(!isWorkTypeModalOpen);
  const handleClick = (type: string, mode: string) => {
    setSelectedType(type);
    setSelectedMode(mode);
    setIsWorkTypeModalOpen(false);
  };
  const handleAddSubTask = () => {
    if (!subTaskInput.trim()) return;
    const newSubTask = {
      subTitle: subTaskInput,
      subColor: inputs.bgColor,
      subEmoji: "📹",
    };
    setInputs({ ...inputs, subTasks: [...inputs.subTasks, newSubTask] });
    setSubTaskInput("");
  };
  const removeSubTask = (indexToRemove: number) => {
    setInputs({
      ...inputs,
      subTasks: inputs.subTasks.filter((_, index) => index !== indexToRemove),
    });
  };
  const handleEmojiChange = (newEmoji: string) => {
    if (editingTarget === "MAIN") {
      setInputs({ ...inputs, emoji: newEmoji });
    } else {
      const index = editingTarget as number;
      const newSubTasks = [...inputs.subTasks];
      newSubTasks[index] = { ...newSubTasks[index], subEmoji: newEmoji };
      setInputs({ ...inputs, subTasks: newSubTasks });
    }
  };
  const handleColorChange = (newColor: string) => {
    if (editingTarget === "MAIN") {
      setInputs({ ...inputs, bgColor: newColor });
    } else {
      const index = editingTarget as number;
      const newSubTasks = [...inputs.subTasks];
      newSubTasks[index] = { ...newSubTasks[index], subColor: newColor };
      setInputs({ ...inputs, subTasks: newSubTasks });
    }
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };
  const handlePickerChange = (name: string, value: string) => {
    setInputs({ ...inputs, [name]: value });
    setActivePicker(null);
  };
  const handleSubmit = () => {
    if (isPending) return;
    if (!inputs.title.trim()) {
      alert("일정 제목을 입력해주세요.");
      return;
    }
    const baseFields = {
      title: inputs.title,
      memo: inputs.memo,
      emoji: inputs.emoji,
      bgColor: inputs.bgColor,
      subSchedules: inputs.subTasks,
    };
    let requestData: any;
    if (selectedType === "EVENT") {
      requestData = {
        ...baseFields,
        scheduleType: "EVENT",
        mode: "CUSTOM",
        startAt: `${inputs.startDate} ${inputs.startTime}`,
        endAt: `${inputs.endDate} ${inputs.endTime}`,
        repeatType: inputs.repeat || "NONE",
      };
    } else if (selectedType === "TASK" && selectedMode === "CUSTOM") {
      requestData = {
        ...baseFields,
        scheduleType: "TASK",
        mode: "CUSTOM",
        date: inputs.date,
        duration: Number(inputs.duration) || 0,
        repeatType: inputs.repeat || "NONE",
      };
    } else {
      requestData = {
        ...baseFields,
        scheduleType: "TASK",
        mode: "ANYTIME",
        duration: Number(inputs.duration) || 0,
      };
    }
    if (mode === "UPDATE" && scheduleId) {
      updateSchedule(requestData, {
        onSuccess: () => {
          alert("일정이 수정되었습니다.");
          onClose();
        },
      });
    } else {
      createSchedule(requestData, {
        onSuccess: () => {
          alert("일정이 등록되었습니다.");
          onClose();
        },
      });
    }
  };
  const renderDynamicInputs = () => {
    if (selectedType === "EVENT") {
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
              {repeatOptions.find((opt) => opt.value === inputs.repeat)
                ?.label || "안함"}
            </div>
          </div>
        </div>
      );
    }
    if (selectedType === "TASK" && selectedMode === "CUSTOM") {
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
              {repeatOptions.find((opt) => opt.value === inputs.repeat)
                ?.label || "안함"}
            </div>
          </div>
        </div>
      );
    }
    if (selectedType === "TASK" && selectedMode === "ANYTIME") {
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
  };
  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <h3>{mode === "UPDATE" ? "일정 수정하기" : "일정 등록하기"}</h3>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            style={{
              padding: "6px 12px",
              cursor: "pointer",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            {mode === "UPDATE" ? "수정" : "등록"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <EmojiCircle
            emoji={inputs.emoji}
            color={inputs.bgColor}
            onClick={() => {
              setEditingTarget("MAIN");
              setIsDesignModalOpen(true);
            }}
          />
          {isDesignModalOpen && (
            <TodoDesignPicker
              selectedEmoji={
                editingTarget === "MAIN"
                  ? inputs.emoji
                  : inputs.subTasks[editingTarget as number]?.subEmoji
              }
              selectedColor={
                editingTarget === "MAIN"
                  ? inputs.bgColor
                  : inputs.subTasks[editingTarget as number]?.subColor
              }
              onEmojiChange={handleEmojiChange}
              onColorChange={handleColorChange}
              onClose={() => setIsDesignModalOpen(false)}
            />
          )}
          <input
            name="title"
            value={inputs.title}
            onChange={handleChange}
            placeholder="일정 제목 입력"
            style={{
              ...inputStyle,
              marginBottom: 0,
              border: "none",
              borderBottom: "1px solid #ddd",
              borderRadius: 0,
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={toggleModal}
            style={{
              padding: "6px 12px",
              borderRadius: "16px",
              border: "1px solid #ddd",
              backgroundColor: "#f9f9f9",
              cursor: "pointer",
            }}
          >
            {selectedType === "TASK" ? "할 일" : "일정"} -{" "}
            {selectedMode === "CUSTOM" ? "사용자 지정" : "언제든지"} ▼
          </button>
        </div>
        {isWorkTypeModalOpen && (
          <div
            style={{
              border: "1px solid #eee",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "8px",
              backgroundColor: "#fafafa",
            }}
          >
            <div
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => handleClick("TASK", "CUSTOM")}
            >
              할 일 (사용자 지정)
            </div>
            <div
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => handleClick("TASK", "ANYTIME")}
            >
              할 일 (언제든지)
            </div>
            <div
              style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => handleClick("EVENT", "CUSTOM")}
            >
              이벤트 (사용자 지정)
            </div>
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>{renderDynamicInputs()}</div>
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>하위 작업</label>
          {inputs.subTasks.map((sub: any, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "5px",
                padding: "5px",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px",
              }}
            >
              <EmojiCircle
                emoji={sub.subEmoji}
                color={sub.subColor}
                onClick={() => {
                  setEditingTarget(index);
                  setIsDesignModalOpen(true);
                }}
                size="28px"
                fontSize="14px"
              />
              <span>{sub.subTitle}</span>
              <button
                onClick={() => removeSubTask(index)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
            <input
              value={subTaskInput}
              onChange={(e) => setSubTaskInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
              placeholder="하위 작업 입력"
              style={{ ...inputStyle, marginBottom: 0 }}
            />
            <button
              onClick={handleAddSubTask}
              style={{
                padding: "0 12px",
                backgroundColor: "#eee",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              추가
            </button>
          </div>
        </div>
        <div>
          <label style={labelStyle}>메모</label>
          <input
            name="memo"
            value={inputs.memo}
            onChange={handleChange}
            placeholder="메모 입력"
            style={inputStyle}
          />
        </div>
      </div>
      {activePicker === "date" && (
        <DatePickerModal
          value={inputs.date}
          onChange={(v) => handlePickerChange("date", v)}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "startDate" && (
        <DatePickerModal
          value={inputs.startDate}
          onChange={(v) => handlePickerChange("startDate", v)}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "endDate" && (
        <DatePickerModal
          value={inputs.endDate}
          onChange={(v) => handlePickerChange("endDate", v)}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "startTime" && (
        <TimePickerModal
          value={inputs.startTime}
          onChange={(v) => handlePickerChange("startTime", v)}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "endTime" && (
        <TimePickerModal
          value={inputs.endTime}
          onChange={(v) => handlePickerChange("endTime", v)}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "duration" && (
        <DurationPickerModal
          onChange={(v) => handlePickerChange("duration", v)}
          onClose={() => setActivePicker(null)}
        />
      )}
      {activePicker === "repeat" && (
        <RepeatPickerModal
          currentValue={inputs.repeat}
          onChange={(v) => handlePickerChange("repeat", v)}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  );
  return createPortal(modalContent, document.body);
}
