interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export default function RepeatIcon({
  size = 10,
  color = "#1E1E1E",
  className,
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 10 11"
      fill="none"
      className={className}
    >
      <path
        d="M6.78281 0.449219L8.5779 2.24431M8.5779 2.24431L6.78281 4.0394M8.5779 2.24431H2.29509C1.819 2.24431 1.36241 2.43343 1.02577 2.77008C0.689125 3.10672 0.5 3.56331 0.5 4.0394V4.93694M2.29509 10.3222L0.5 8.52712M0.5 8.52712L2.29509 6.73203M0.5 8.52712H6.78281C7.2589 8.52712 7.71548 8.33799 8.05213 8.00135C8.38877 7.6647 8.5779 7.20811 8.5779 6.73203V5.83448"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
