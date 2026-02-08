import {
  SCHEDULE_EMOJIS,
  SCHEDULE_EMOJI_BACKGROUND_COLORS,
} from "../../constants/design.ts";
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
  const [tab, setTab] = useState<"color" | "emoji">("color");

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[520px] w-[440px] flex-col items-center rounded-[24px] bg-white px-6 pb-8 pt-10 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 text-gray-400 hover:text-gray-600"
        >
          <span className="text-3xl font-light">✕</span>
        </button>

        <div className="mb-8 flex shrink-0 justify-center">
          <div
            className="flex h-32 w-32 items-center justify-center rounded-full text-5xl transition-colors duration-300"
            style={{ backgroundColor: selectedColor }}
          >
            <span>{selectedEmoji}</span>
          </div>
        </div>

        <div className="mb-8 flex shrink-0 justify-center">
          <div className="flex w-[260px] rounded-full border border-blue-400 p-0.5">
            <button
              onClick={() => setTab("color")}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
                tab === "color"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              배경색
            </button>
            <button
              onClick={() => setTab("emoji")}
              className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
                tab === "emoji"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500"
              }`}
            >
              이모지
            </button>
          </div>
        </div>

        <div className="custom-scrollbar w-full flex-1 overflow-y-auto px-1">
          {tab === "color" && (
            <div className="grid grid-cols-12 gap-x-2 gap-y-4 pt-2">
              {SCHEDULE_EMOJI_BACKGROUND_COLORS.map((color, index) => (
                <div key={`color-${index}`} className="flex justify-center">
                  <button
                    onClick={() => onColorChange(color)}
                    className={`h-6 w-6 rounded-full transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-gray-400 ring-offset-2"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "emoji" && (
            <div className="grid grid-cols-8 gap-x-2 gap-y-4 pt-2">
              {SCHEDULE_EMOJIS.map((emoji, index) => (
                <button
                  key={`emoji-${index}`}
                  onClick={() => onEmojiChange(emoji)}
                  className={`flex aspect-square items-center justify-center rounded-lg text-2xl transition-all ${
                    selectedEmoji === emoji
                      ? "bg-blue-50 ring-1 ring-blue-300"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
