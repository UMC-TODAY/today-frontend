import {
  SCHEDULE_EMOJIS,
  SCHEDULE_EMOJI_BACKGROUND_COLORS,
} from "../../constants/design";
import { useState } from "react";

interface TodoDesignPickerProps {
  selectedEmoji: string;
  selectedColor: string;
  onEmojiChange: (emoji: string) => void;
  onColorChange: (color: string) => void;
  onClose: () => void;
}

export default function TodoDesignPicker({
  selectedEmoji,
  selectedColor,
  onEmojiChange,
  onColorChange,
  onClose,
}: TodoDesignPickerProps) {
  const [isBgColorOpen, setIsBgColorOpen] = useState(true);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  return (
    // 배경
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
    >
      {/* 내용물 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "340px",
          height: "480px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        {/* 닫기 버튼 */}
        <div
          style={{
            padding: "15px 20px 10px",
            display: "flex",
            justifyContent: "flex-end",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <span
            onClick={onClose}
            style={{
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#999",
            }}
          >
            ✕
          </span>
        </div>

        {/* 하단 */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {/* 배경색 섹션 */}
          <div style={{ marginBottom: "25px" }}>
            <button
              onClick={() => setIsBgColorOpen(!isBgColorOpen)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "5px 0",
                cursor: "pointer",
                border: "none",
                background: "none",
                fontWeight: "bold",
                fontSize: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>배경색</span>
              <span style={{ fontSize: "12px", color: "#999" }}></span>
            </button>

            {isBgColorOpen && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                {SCHEDULE_EMOJI_BACKGROUND_COLORS.map((color) => (
                  <div
                    key={color}
                    onClick={() => onColorChange(color)}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      backgroundColor: color,
                      border:
                        selectedColor === color
                          ? "3px solid #333"
                          : "1px solid #eee",
                      boxSizing: "border-box",
                      transition: "all 0.1s",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 이모지 섹션 */}
          <div>
            <button
              onClick={() => setIsEmojiOpen(!isEmojiOpen)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "5px 0",
                cursor: "pointer",
                border: "none",
                background: "none",
                fontWeight: "bold",
                fontSize: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>아이콘</span>
              <span style={{ fontSize: "12px", color: "#999" }}></span>
            </button>

            {isEmojiOpen && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                {SCHEDULE_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onEmojiChange(emoji)}
                    style={{
                      fontSize: "24px",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border:
                        selectedEmoji === emoji
                          ? "2px solid #2196F3"
                          : "1px solid transparent",
                      backgroundColor:
                        selectedEmoji === emoji ? "#E3F2FD" : "#f9f9f9",
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
