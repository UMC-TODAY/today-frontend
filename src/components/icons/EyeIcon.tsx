interface EyeIconProps {
  isOn: boolean;
}

export default function EyeIcon({ isOn }: EyeIconProps) {
  const fillColor = isOn ? "#3182F6" : "#9C9C9C";

  return (
    <span style={{ display: "inline-flex" }}>
      <svg
        width="22"
        height="12"
        viewBox="0 0 22 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 0C3.7829 0 0 5.17714 0 6C0 6.82286 3.7829 12 11 12C18.2171 12 22 6.82071 22 6C22 5.17929 18.216 0 11 0ZM11 10.6146C8.2995 10.6146 6.1105 8.54893 6.1105 6C6.1105 3.45107 8.2995 1.38321 11 1.38321C13.7005 1.38321 15.8884 3.45107 15.8884 6C15.8884 8.54893 13.7005 10.6146 11 10.6146ZM11 6C10.5523 5.52107 11.7293 3.69214 11 3.69214C9.6492 3.69214 8.5547 4.72607 8.5547 6C8.5547 7.27393 9.6492 8.30786 11 8.30786C12.3508 8.30786 13.4453 7.27393 13.4453 6C13.4453 5.41393 11.3806 6.40607 11 6Z"
          fill={fillColor}
        />
      </svg>
    </span>
  );
}
