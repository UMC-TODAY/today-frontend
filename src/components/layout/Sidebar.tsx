import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import logoSvg from '../../assets/icons/logo.svg';
import DashboardIcon from '../icons/DashboardIcon';
import CalendarIcon from '../icons/CalendarIcon';
import TodolistIcon from '../icons/TodolistIcon';
import CommunityIcon from '../icons/CommunityIcon';
import AnalyticsIcon from '../icons/AnalyticsIcon';
import { getMyInfo } from '../../api/setting/profile';

export default function Sidebar() {
  const navigate = useNavigate();

  // 사용자 정보 조회
  const { data: userInfo } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
    retry: false,
  });

  const user = userInfo?.data;

  const menuItems = [
    { path: '/dashboard', label: '대시보드', iconType: 'dashboard' },
    { path: '/calendar', label: '캘린더', iconType: 'calendar' },
    { path: '/goal-tracker', label: '할일 목록', iconType: 'todolist' },
    { path: '/community', label: '커뮤니티', iconType: 'community' },
    { path: '/analytics', label: '분석 및 추천', iconType: 'analytics' },
  ];

  return (
    <aside style={{
      width: '240px',
      minWidth: '180px',
      background: '#fff',
      height: '100vh',
      padding: '20px 0',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 로고 - 클릭 시 대시보드로 이동 */}
      <div
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '0 16px 30px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          transition: 'opacity 0.2s'
        }}
      >
        <img src={logoSvg} alt="To:DAY Logo" style={{ width: '24px', height: '24px' }} />
        To:DAY
      </div>

      {/* 메뉴 아이템들 */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              textDecoration: 'none',
              color: isActive ? '#6987D2' : '#8F92A5',
              background: 'transparent',
              fontFamily: 'Pretendard',
              fontWeight: 350,
              fontStyle: 'regular',
              fontSize: '20px',
              lineHeight: '150%',
              letterSpacing: '0%',
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

      {/* 하단 영역 */}
      <div style={{
        width: "230px",
        height: "180px",
        padding: '0 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {/* 요금제 업그레이드 카드 */}
        <div style={{
          backgroundColor: '#F8F9FC',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <p style={{
            fontFamily: 'Pretendard',
            fontSize: '12px',
            color: '#6B7280',
            margin: '0 0 4px 0',
            textAlign: 'left',
          }}>
            더 높은 수준에서 더 빠르게
          </p>
          <p style={{
            fontFamily: 'Pretendard',
            fontSize: '12px',
            color: '#6B7280',
            margin: '0 0 12px 0',
            textAlign: 'left',
          }}>
            더 많은 서비스를 이용해보세요.
          </p>
          <button
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: '#6987D2',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'Pretendard',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() => {/* TODO: 결제 페이지 연결 */}}
          >
            결제하기
          </button>
        </div>

        {/* 유저 정보 버튼 */}
        <button
          onClick={() => {/* TODO: 프로필 설정 모달 열기 */}}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 0',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {/* 프로필 이미지 */}
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="프로필"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#DDD6FE', // 연보라
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }} />
          )}

          {/* 닉네임 & 이메일 */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{
              fontFamily: 'Pretendard',
              fontWeight: 500,
              fontSize: '14px',
              color: user?.nickname ? '#111827' : '#9CA3AF',
            }}>
              {user?.nickname || '닉네임을 설정해주세요'}
            </div>
            <div style={{
              fontFamily: 'Pretendard',
              fontSize: '12px',
              color: '#6B7280',
            }}>
              {user?.email || ''}
            </div>
          </div>

          {/* 화살표 */}
          <ChevronRight size={18} color="#9CA3AF" />
        </button>
      </div>
    </aside>
  );
}
