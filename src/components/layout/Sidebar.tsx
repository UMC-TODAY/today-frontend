import { NavLink, useLocation } from 'react-router-dom';
import logoSvg from '../../assets/icons/logo.svg';
import DashboardIcon from '../icons/DashboardIcon';
import CalendarIcon from '../icons/CalendarIcon';
import TodolistIcon from '../icons/TodolistIcon';
import CommunityIcon from '../icons/CommunityIcon';
import AnalyticsIcon from '../icons/AnalyticsIcon';

export default function Sidebar() {
  const location = useLocation();
  const menuItems = [
    { path: '/dashboard', label: '대시보드', iconType: 'dashboard' },
    { path: '/calendar', label: '캘린더', iconType: 'calendar' },
    { path: '/goal-tracker', label: '할일 목록', iconType: 'todolist' },
    { path: '/community', label: '커뮤니티', iconType: 'community' },
    { path: '/analytics', label: '분석 및 추천', iconType: 'analytics' },
  ];

  const isAnyMenuActive = menuItems.some(item => location.pathname === item.path);

  return (
    <aside style={{
      width: '220px',
      minWidth: '220px',
      background: '#fff',
      height: '100vh',
      padding: '20px 0',
      flexShrink: 0
    }}>
      {/* 로고 */}
      <div style={{
        padding: '0 20px 30px',
        fontSize: '20px',
        fontWeight: 'bold',
        color: isAnyMenuActive ? '#6987D2' : '#000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'color 0.2s'
      }}>
        <img src={logoSvg} alt="To:DAY Logo" style={{ width: '24px', height: '24px' }} />
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
              color: isActive ? '#111827' : '#6b7280',
              background: 'transparent',
              fontWeight: isActive ? '600' : '400',
            })}
          >
            {({ isActive }) => (
              <>
                <span>
                  {item.iconType === 'dashboard' && <DashboardIcon isActive={isActive} />}
                  {item.iconType === 'calendar' && <CalendarIcon isActive={isActive} />}
                  {item.iconType === 'todolist' && <TodolistIcon isActive={isActive} />}
                  {item.iconType === 'community' && <CommunityIcon isActive={isActive} />}
                  {item.iconType === 'analytics' && <AnalyticsIcon isActive={isActive} />}
                </span>
                <span>{item.label}</span>
              </>
            )}
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
