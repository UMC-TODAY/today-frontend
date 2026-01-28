// TODO: 코드 분리하기

import { createPortal } from "react-dom";
import { useState } from "react";
import TodoDesignPicker from "./TodoDesignPicker";
import EmojiCircle from "./EmojiCircle";
import { useCreateSchedule } from "../../hooks/queries/useSchedule";
import type { CreateScheduleRequest } from "../../types/event.ts";

// 스타일
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

interface TodoModalProps {
  onClose: () => void;
}

export default function TodoModal({ onClose }: TodoModalProps) {
  const { mutate: createSchedule, isPending } = useCreateSchedule();

  // 모달 상태
  const [isWorkTypeModalOpen, setIsWorkTypeModalOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);

  // 선택 상태
  const [selectedType, setSelectedType] = useState("TASK");
  const [selectedMode, setSelectedMode] = useState("CUSTOM");

  // 하위 작업 입력용 상태
  const [subTaskInput, setSubTaskInput] = useState("");

  // EmojiCircle 컴포넌트 title / subTask 누구 수정중인지 식별 위한 상태
  const [editingTarget, setEditingTarget] = useState<"MAIN" | number>("MAIN");

  // 폼 입력 상태
  const [inputs, setInputs] = useState({
    title: "",
    date: "2026-01-01",
    duration: "60",
    repeat: "",
    subTasks: [] as { subTitle: string; subColor: string; subEmoji: string }[],
    memo: "",
    emoji: "📹",
    bgColor: "#F0EFC4",

    // 이벤트 용
    startDate: "2026-01-01",
    endDate: "2026-01-02",
    startTime: "09:00",
    endTime: "10:00",
  });

  // 핸들러들
  const toggleModal = () => setIsWorkTypeModalOpen(!isWorkTypeModalOpen);

  const handleClick = (type: string, mode: string) => {
    setSelectedType(type);
    setSelectedMode(mode);
    setIsWorkTypeModalOpen(false);
  };

  // 하위 작업 추가 함수
  const handleAddSubTask = () => {
    if (!subTaskInput.trim()) return;

    const newSubTask = {
      subTitle: subTaskInput,
      subColor: inputs.bgColor,
      subEmoji: "📹",
    };

    setInputs({
      ...inputs,
      subTasks: [...inputs.subTasks, newSubTask],
    });
    setSubTaskInput(""); // 입력창 비우기
  };

  // 하위 작업 삭제 함수
  const removeSubTask = (indexToRemove: number) => {
    setInputs({
      ...inputs,
      subTasks: inputs.subTasks.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleEmojiChange = (newEmoji: string) => {
    if (editingTarget === "MAIN") {
      // title 수정일 떄
      setInputs({ ...inputs, emoji: newEmoji });
    } else {
      // subTask 수정일 때
      const index = editingTarget;
      const newSubTasks = [...inputs.subTasks];
      newSubTasks[index] = { ...newSubTasks[index], subEmoji: newEmoji };
      setInputs({ ...inputs, subTasks: newSubTasks });
    }
  };

  const handleColorChange = (newColor: string) => {
    if (editingTarget === "MAIN") {
      // title 수정일 때
      setInputs({
        ...inputs,
        bgColor: newColor,
      });
    } else {
      // subTask 수정일 떄
      const index = editingTarget;
      const newSubTasks = [...inputs.subTasks];
      newSubTasks[index] = { ...newSubTasks[index], subColor: newColor };
      setInputs({ ...inputs, subTasks: newSubTasks });
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  // 등록 로직
  const handleRegister = () => {
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

    let requestData: CreateScheduleRequest;

    // CASE A: 일정 (EVENT)
    if (selectedType === "EVENT") {
      requestData = {
        ...baseFields,
        scheduleType: "EVENT",
        mode: "CUSTOM",
        startAt: `${inputs.startDate} ${inputs.startTime}`, // "2026-01-10 14:00"
        endAt: `${inputs.endDate} ${inputs.endTime}`,
        repeatType: (inputs.repeat || "NONE") as
          | "NONE"
          | "DAILY"
          | "WEEKLY"
          | "MONTHLY"
          | "YEARLY",
      };
    }
    // CASE B: 할 일 - 사용자 지정
    else if (selectedType === "TASK" && selectedMode === "CUSTOM") {
      requestData = {
        ...baseFields,
        scheduleType: "TASK",
        mode: "CUSTOM",
        date: inputs.date,
        duration: Number(inputs.duration) || 0,
        repeatType: (inputs.repeat || "NONE") as
          | "NONE"
          | "DAILY"
          | "WEEKLY"
          | "MONTHLY"
          | "YEARLY",
      };
    }
    // CASE C: 할 일 - 언제든지
    else {
      requestData = {
        ...baseFields,
        scheduleType: "TASK",
        mode: "ANYTIME",
        duration: Number(inputs.duration) || 0,
      };
    }

    createSchedule(requestData, {
      onSuccess: () => {
        alert("일정이 등록되었습니다.");
        onClose();
      },
      onError: (error: any) => {
        console.log("등록 실패: ", error);
        alert(
          error.response?.data?.message ||
            "등록에 실패했습니다. 입력값을 확인해주세요.",
        );
      },
    });
  };

  // 조건부 렌더링 함수
  const renderDynamicInputs = () => {
    // 1. 이벤트 (EVENT)
    if (selectedType === "EVENT") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>시작</label>
              <input
                type="date"
                name="startDate"
                value={inputs.startDate}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="time"
                name="startTime"
                value={inputs.startTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>마감</label>
              <input
                type="date"
                name="endDate"
                value={inputs.endDate}
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                type="time"
                name="endTime"
                value={inputs.endTime}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>반복</label>
            <select
              name="repeat"
              value={inputs.repeat}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">반복 없음</option>
              <option value="WEEKLY">매주</option>
              <option value="MONTHLY">매월</option>
              <option value="YEARLY">매년</option>
            </select>
          </div>
        </div>
      );
    }

    // 2. 할 일 (TASK) - 사용자 지정
    if (selectedType === "TASK" && selectedMode === "CUSTOM") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>날짜</label>
              <input
                type="date"
                name="date"
                value={inputs.date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>소요시간(분)</label>
              <input
                type="number"
                name="duration"
                value={inputs.duration}
                onChange={handleChange}
                placeholder="60"
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label style={labelStyle}>반복</label>
            <select
              name="repeat"
              value={inputs.repeat}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">반복 없음</option>
              <option value="DAILY">매일</option>
              <option value="WEEKLY">매주</option>
              <option value="MONTHLY">매월</option>
            </select>
          </div>
        </div>
      );
    }

    // 3. 할 일 (TASK) - 언제든지
    if (selectedType === "TASK" && selectedMode === "ANYTIME") {
      return (
        <div>
          <label style={labelStyle}>소요시간(분)</label>
          <input
            type="number"
            name="duration"
            value={inputs.duration}
            onChange={handleChange}
            placeholder="예상 소요시간"
            style={inputStyle}
          />
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
          <h3>일정 등록하기</h3>
          <button
            onClick={handleRegister}
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
            등록
          </button>
        </div>

        {/* 1. 이모지 & 제목 */}
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
                  : inputs.subTasks[editingTarget]?.subEmoji
              }
              selectedColor={
                editingTarget === "MAIN"
                  ? inputs.bgColor
                  : inputs.subTasks[editingTarget]?.subColor
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

        {/* 2. 작업 유형 선택 버튼 */}
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

        {/* 3. 동적 입력창 */}
        <div style={{ marginBottom: "20px" }}>{renderDynamicInputs()}</div>

        {/* 4. ★ 하위작업 */}
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

          {/* 입력창 & 버튼 */}
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
              새로 추가
            </button>
          </div>
        </div>

        {/* 5. 메모 */}
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
    </div>
  );

  return createPortal(modalContent, document.body);
}
