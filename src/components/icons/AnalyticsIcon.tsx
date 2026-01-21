interface AnalyticsIconProps {
  isActive?: boolean;
}

export default function AnalyticsIcon({ isActive = false }: AnalyticsIconProps) {
  const fillColor = isActive ? '#4f46e5' : '#6b7280';

  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect y="10.5605" width="6.16049" height="11.4405" fill={fillColor} />
      <rect x="7.92383" width="6.16049" height="22.0009" fill={fillColor} />
      <rect x="15.8398" y="6.16016" width="6.16049" height="15.8407" fill={fillColor} />
    </svg>
  );
}
