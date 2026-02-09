interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export default function CalendarIcon({
  size = 13,
  color = "#1E1E1E",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 13 13"
      fill="none"
      className={className}
    >
      <path
        d="M8.66667 1.08301V3.24967M4.33333 1.08301V3.24967M1.625 5.41634H11.375M2.70833 2.16634H10.2917C10.89 2.16634 11.375 2.65137 11.375 3.24967V10.833C11.375 11.4313 10.89 11.9163 10.2917 11.9163H2.70833C2.11002 11.9163 1.625 11.4313 1.625 10.833V3.24967C1.625 2.65137 2.11002 2.16634 2.70833 2.16634Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
