import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: '대시보드' },
    { path: '/calendar', icon: '📅', label: '캘린더' },
    { path: '/goal-tracker', icon: '✓', label: '할일 목록' },
    { path: '/community', icon: '👥', label: '커뮤니티' },
    { path: '/analytics', icon: '📊', label: '분석 및 추천' },
  ];

  return (
    <aside style={{
      width: '220px',
      minWidth: '220px',
      background: '#fff',
      borderRight: '1px solid #e5e7eb',
      height: '100vh',
      padding: '20px 0',
      flexShrink: 0
    }}>
      {/* 로고 */}
      <div style={{
        padding: '0 20px 30px',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#000'
      }}>
        To:DAY
      </div>

      {/* 메뉴 아이템들 */}
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              textDecoration: 'none',
              color: isActive ? '#4f46e5' : '#6b7280',
              background: isActive ? '#eef2ff' : 'transparent',
              borderLeft: isActive ? '3px solid #4f46e5' : '3px solid transparent',
              fontWeight: isActive ? '600' : '400',
            })}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* 하단 유저 정보 */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          👤
        </div>
        <div>
          <div style={{ fontWeight: '500', color: '#111827' }}>로그인 정보</div>
          <div style={{ fontSize: '12px' }}>@000000@naver.com</div>
        </div>
      </div>
    </aside>
  );
}
