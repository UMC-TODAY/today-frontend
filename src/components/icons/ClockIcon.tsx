interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export default function ClockIcon({
  size = 12,
  color = "#1E1E1E",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      className={className}
    >
      <g clipPath="url(#clip0_1918_1230)">
        <path
          d="M5.86628 2.93265V5.8653L7.82139 6.84286M10.754 5.8653C10.754 8.56474 8.56572 10.7531 5.86628 10.7531C3.16684 10.7531 0.978516 8.56474 0.978516 5.8653C0.978516 3.16587 3.16684 0.977539 5.86628 0.977539C8.56572 0.977539 10.754 3.16587 10.754 5.8653Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1918_1230">
          <rect width="11.7306" height="11.7306" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
