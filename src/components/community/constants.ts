export const categoryColors: Record<string, string[]> = {
  "관리": ["bg-green-100", "bg-red-100", "bg-orange-100", "bg-yellow-100", "bg-purple-100"],
  "업무": ["bg-yellow-100", "bg-purple-100", "bg-green-100", "bg-blue-100", "bg-pink-100"],
  "반려동물": ["bg-yellow-100", "bg-pink-100", "bg-green-100", "bg-blue-100", "bg-purple-100"],
  "출퇴근": ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-orange-100", "bg-red-100"],
  "학습": ["bg-indigo-100", "bg-purple-100", "bg-blue-100", "bg-green-100", "bg-yellow-100"],
  "건강": ["bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-pink-100", "bg-purple-100"],
  "취미": ["bg-pink-100", "bg-purple-100", "bg-yellow-100", "bg-blue-100", "bg-green-100"],
  "소셜": ["bg-purple-100", "bg-indigo-100", "bg-pink-100", "bg-blue-100", "bg-yellow-100"],
  "준비": ["bg-orange-100", "bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-purple-100"]
};

export const itemEmojis: Record<string, string[]> = {
  "관리": ["📧", "🏠", "💰", "📅", "💾"],
  "업무": ["🌟", "🔥", "💼", "✅", "📋"],
  "반려동물": ["🐕", "🍖", "✨", "🧹", "🎾"],
  "출퇴근": ["💳", "💼", "🎧", "🧘", "🗺️"],
  "학습": ["📖", "📝", "🗣️", "💻", "✍️"],
  "건강": ["🏋️", "💧", "🚶", "🧘", "😴"],
  "취미": ["📷", "🍳", "🎨", "🎵", "☕"],
  "소설": ["💡", "👤", "✍️", "💬", "📄"],
  "준비": ["✈️", "🎤", "📄", "🎁", "🛒"]
};

// 오늘 날짜 포맷팅
export const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
};

// 반복 규칙 한글 변환
export const getRepeatLabel = (rule: string) => {
  const labels: Record<string, string> = {
    "DAILY": "매일",
    "WEEKLY": "매주",
    "MONTHLY": "매월",
    "NONE": "반복 없음"
  };
  return labels[rule] || "매주";
};
