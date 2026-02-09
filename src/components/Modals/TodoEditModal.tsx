import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import TodoDesignPicker from "./TodoDesignPicker.tsx";
import EmojiCircle from "./EmojiCircle.tsx";
import {
  useCreateSchedule,
  useUpdateSchedule,
} from "../../hooks/queries/useSchedule.ts";
import {
  DatePickerModal,
  DurationPickerModal,
  RepeatPickerModal,
  TimePickerModal,
} from "./Modals.tsx";
import {
  TaskCustomInput,
  TaskAnytimeInput,
  EventCustomInput,
} from "./DynamicInputs.tsx";

const inputStyle = {
  width: "100%",
  padding: "12px 0",
  marginTop: "5px",
  marginBottom: "10px",
  border: "none",
  borderBottom: "1px solid #eee",
  borderRadius: "0",
  boxSizing: "border-box" as const,
  outline: "none",
  fontSize: "16px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "12px",
  display: "block",
};

const addNewButtonStyle = {
  width: "100%",
  padding: "16px",
  backgroundColor: "#f8faff",
  border: "1px dashed #dbeafe",
  borderRadius: "16px",
  color: "#3b82f6",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  marginTop: "8px",
  textAlign: "center" as const,
};

const subTaskItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 0",
  backgroundColor: "transparent",
  borderBottom: "1px solid #f2f2f2",
  fontSize: "14px",
};

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
  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const [editingTarget, setEditingTarget] = useState<"MAIN" | number>("MAIN");
  const todayStr = new Date().toISOString().split("T")[0];

  const [inputs, setInputs] = useState({
    title: initialData?.title || "",
    date: initialData?.date || todayStr,
    duration: String(initialData?.duration || "60"),
    repeat:
      initialData?.repeatType === "NONE" ? "" : initialData?.repeatType || "",
    subTasks: initialData?.subSchedules || [],
    memo: initialData?.memo || "",
    emoji: initialData?.emoji || "📹",
    bgColor: initialData?.bgColor || "#F0EFC4",
    startDate: initialData?.startAt?.split(" ")[0] || todayStr,
    endDate: initialData?.endAt?.split(" ")[0] || todayStr,
    startTime: initialData?.startAt?.split(" ")[1]?.substring(0, 5) || "09:00",
    endTime: initialData?.endAt?.split(" ")[1]?.substring(0, 5) || "10:00",
  });

  useEffect(() => {
    if (initialData) {
      setSelectedType(initialData.scheduleType || "TASK");
      setSelectedMode(initialData.mode || "CUSTOM");
      setInputs({
        title: initialData.title || "",
        date: initialData.date || todayStr,
        duration: String(initialData.duration || "60"),
        repeat:
          initialData.repeatType === "NONE" ? "" : initialData.repeatType || "",
        subTasks: initialData.subSchedules || [],
        memo: initialData.memo || "",
        emoji: initialData.emoji || "📹",
        bgColor: initialData.bgColor || "#F0EFC4",
        startDate: initialData.startAt?.split(" ")[0] || todayStr,
        endDate: initialData.endAt?.split(" ")[0] || todayStr,
        startTime:
          initialData.startAt?.split(" ")[1]?.substring(0, 5) || "09:00",
        endTime: initialData.endAt?.split(" ")[1]?.substring(0, 5) || "10:00",
      });
    }
  }, [initialData]);

  const toggleModal = () => setIsWorkTypeModalOpen(!isWorkTypeModalOpen);
  const handleClick = (type: string, mode: string) => {
    setSelectedType(type);
    setSelectedMode(mode);
    setIsWorkTypeModalOpen(false);
  };

  const handleAddSubTask = () => {
    if (!subTaskInput.trim()) {
      setIsAddingSubTask(false);
      return;
    }
    setInputs({
      ...inputs,
      subTasks: [
        ...inputs.subTasks,
        { subTitle: subTaskInput, subColor: inputs.bgColor, subEmoji: "📹" },
      ],
    });
    setSubTaskInput("");
    setIsAddingSubTask(false);
  };

  const removeSubTask = (indexToRemove: number) => {
    setInputs({
      ...inputs,
      subTasks: inputs.subTasks.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleEmojiChange = (newEmoji: string) => {
    if (editingTarget === "MAIN") setInputs({ ...inputs, emoji: newEmoji });
    else {
      const newSubTasks = [...inputs.subTasks];
      newSubTasks[editingTarget as number] = {
        ...newSubTasks[editingTarget as number],
        subEmoji: newEmoji,
      };
      setInputs({ ...inputs, subTasks: newSubTasks });
    }
  };

  const handleColorChange = (newColor: string) => {
    if (editingTarget === "MAIN") setInputs({ ...inputs, bgColor: newColor });
    else {
      const newSubTasks = [...inputs.subTasks];
      newSubTasks[editingTarget as number] = {
        ...newSubTasks[editingTarget as number],
        subColor: newColor,
      };
      setInputs({ ...inputs, subTasks: newSubTasks });
    }
  };

  const handleChange = (e: any) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  const handlePickerChange = (name: string, value: string) => {
    setInputs({ ...inputs, [name]: value });
    setActivePicker(null);
  };

  const handleSubmit = () => {
    if (isPending || !inputs.title.trim()) return;
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
    const mutation = mode === "UPDATE" ? updateSchedule : createSchedule;
    mutation(requestData, {
      onSuccess: () => {
        alert(`일정이 ${mode === "UPDATE" ? "수정" : "등록"}되었습니다.`);
        onClose();
      },
    });
  };

  const renderDynamicInputs = () => {
    if (selectedType === "EVENT")
      return (
        <EventCustomInput inputs={inputs} setActivePicker={setActivePicker} />
      );
    if (selectedType === "TASK" && selectedMode === "CUSTOM")
      return (
        <TaskCustomInput inputs={inputs} setActivePicker={setActivePicker} />
      );
    return (
      <TaskAnytimeInput inputs={inputs} setActivePicker={setActivePicker} />
    );
  };

  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
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
          padding: "32px",
          borderRadius: "24px",
          width: "480px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
            {mode === "UPDATE" ? "일정 수정하기" : "일정 등록하기"}
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#666",
              }}
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              style={{
                padding: "8px 20px",
                cursor: "pointer",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
              }}
            >
              {mode === "UPDATE" ? "수정" : "등록"}
            </button>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
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
          <input
            name="title"
            value={inputs.title}
            onChange={handleChange}
            placeholder="일정 제목 입력"
            style={inputStyle}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={toggleModal}
            style={{
              padding: "10px 16px",
              borderRadius: "12px",
              border: "1px solid #eee",
              backgroundColor: "#fff",
              cursor: "pointer",
              fontSize: "14px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {selectedType === "TASK" ? "할 일" : "이벤트"} -{" "}
            {selectedMode === "CUSTOM" ? "사용자 지정" : "언제든지"}
            <span style={{ fontSize: "10px", color: "#999" }}>▼</span>
          </button>

          {isWorkTypeModalOpen && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: 0,
                width: "220px",
                backgroundColor: "#fff",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                border: "1px solid #f0f0f0",
                zIndex: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "16px 16px 8px 16px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#1a1a1a",
                }}
              >
                작업 유형
              </div>

              <div
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color:
                    selectedType === "TASK" && selectedMode === "CUSTOM"
                      ? "#1a1a1a"
                      : "#1a1a1a",
                  backgroundColor:
                    selectedType === "TASK" && selectedMode === "CUSTOM"
                      ? "#f8faff"
                      : "transparent",
                }}
                onClick={() => handleClick("TASK", "CUSTOM")}
              >
                할 일(사용자 지정)
                {selectedType === "TASK" && selectedMode === "CUSTOM" && (
                  <span style={{ color: "#3b82f6" }}>✓</span>
                )}
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color:
                    selectedType === "TASK" && selectedMode === "ANYTIME"
                      ? "#1a1a1a"
                      : "#1a1a1a",
                  backgroundColor:
                    selectedType === "TASK" && selectedMode === "ANYTIME"
                      ? "#f8faff"
                      : "transparent",
                  borderBottom: "1px solid #f2f2f2",
                }}
                onClick={() => handleClick("TASK", "ANYTIME")}
              >
                할 일 (언제든지)
                {selectedType === "TASK" && selectedMode === "ANYTIME" && (
                  <span style={{ color: "#3b82f6" }}>✓</span>
                )}
              </div>

              <div
                style={{
                  padding: "16px",
                  cursor: "pointer",
                  fontSize: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor:
                    selectedType === "EVENT" ? "#f8faff" : "transparent",
                }}
                onClick={() => handleClick("EVENT", "CUSTOM")}
              >
                <span style={{ flex: 1 }}>이벤트</span>
                {selectedType === "EVENT" && (
                  <span style={{ color: "#3b82f6" }}>✓</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: "24px" }}>{renderDynamicInputs()}</div>

        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>하위 작업</label>
          {inputs.subTasks.map((sub: any, index: number) => (
            <div key={index} style={subTaskItemStyle}>
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
              <span style={{ flex: 1, fontSize: "14px" }}>{sub.subTitle}</span>
              <button
                onClick={() => removeSubTask(index)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "#ccc",
                }}
              >
                ✕
              </button>
            </div>
          ))}

          {isAddingSubTask ? (
            <div style={subTaskItemStyle}>
              <EmojiCircle
                emoji="📹"
                color={inputs.bgColor}
                size="28px"
                fontSize="14px"
                onClick={() => {}}
              />
              <input
                autoFocus
                value={subTaskInput}
                onChange={(e) => setSubTaskInput(e.target.value)}
                onBlur={handleAddSubTask}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
                style={{
                  border: "none",
                  outline: "none",
                  width: "100%",
                  fontSize: "14px",
                }}
              />
            </div>
          ) : (
            <button
              style={addNewButtonStyle}
              onClick={() => setIsAddingSubTask(true)}
            >
              새로 추가 +
            </button>
          )}
        </div>

        <div>
          <label style={labelStyle}>메모</label>
          <textarea
            name="memo"
            value={inputs.memo}
            onChange={handleChange}
            placeholder="한 번에 한 번의 클릭으로 개인 이메일 수신함을 깔끔하고, 체계적으로 스트레스 없이 관리해보세요."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "12px",
              marginTop: "5px",
              marginBottom: "10px",
              border: "1px solid #eee",
              borderRadius: "12px",
              boxSizing: "border-box",
              outline: "none",
              fontSize: "14px",
              resize: "none",
              lineHeight: "1.5",
              color: "#333",
            }}
          />
        </div>
      </div>

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
