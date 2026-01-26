interface EmojoCircleProps {
  emoji: string;
  color: string;
  onClick: () => void;
  size?: string; // 크기 조절
  fontSize?: string; // 글자 크기 조절
}

export default function EmojiCircle({
  emoji,
  color,
  onClick,
  size = "50px",
  fontSize = "24px",
}: EmojoCircleProps) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: fontSize,
        cursor: "pointer",
        flexShrink: 0,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {emoji}
    </div>
  );
}
