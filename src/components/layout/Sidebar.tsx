import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import logoSvg from "../../assets/icons/logo.svg";
import DashboardIcon from "../icons/DashboardIcon";
import CalendarIcon from "../icons/CalendarIcon";
import TodolistIcon from "../icons/TodolistIcon";
import CommunityIcon from "../icons/CommunityIcon";
import AnalyticsIcon from "../icons/AnalyticsIcon";
import { getMyInfo } from "../../api/setting/profile";
import { useEffect, useMemo, useState } from "react";
import SettingModal from "../setting/SettingModal";

export default function Sidebar() {
  const navigate = useNavigate();

  // 설정 모달
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const settings = useMemo(() => {
    return new URLSearchParams(location.search).get("settings");
  }, [location.search]);

  const isFullPageSettingRoute = useMemo(() => {
    return location.pathname.startsWith("/setting/");
  }, [location.pathname]);

  useEffect(() => {
    if (isFullPageSettingRoute) {
      setIsOpen(false);
      return;
    }

    if (settings) setIsOpen(true);
  }, [settings, isFullPageSettingRoute]);

  const handleCloseSettingModal = () => {
    setIsOpen(false);

    const qs = new URLSearchParams(location.search);
    qs.delete("settings");

    navigate(
      { pathname: location.pathname, search: qs.toString() ? `?${qs}` : "" },
      { replace: true },
    );
  };

  // 사용자 정보 조회
  const { data: userInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    retry: false,
  });

  const user = userInfo?.data;

  const menuItems = [
    { path: "/dashboard", label: "대시보드", iconType: "dashboard" },
    { path: "/calendar", label: "캘린더", iconType: "calendar" },
    { path: "/goal-tracker", label: "할일 목록", iconType: "todolist" },
    { path: "/community", label: "커뮤니티", iconType: "community" },
    { path: "/analytics", label: "분석 및 추천", iconType: "analytics" },
  ];

  return (
    <aside
      style={{
        width: "280px",
        minWidth: "180px",
        background: "#fff",
        height: "100vh",
        padding: "20px 0",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 로고 - 클릭 시 대시보드로 이동 */}
      <div
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "0 16px 30px",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#000",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          transition: "opacity 0.2s",
        }}
      >
        <img
          src={logoSvg}
          alt="To:DAY Logo"
          style={{ width: "24px", height: "24px" }}
        />
        To:DAY
      </div>

      {/* 메뉴 아이템들 */}
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              textDecoration: "none",
              color: isActive ? "#6d86c6ff" : "#acaeb7ff",
              background: "transparent",
              fontFamily: "Pretendard",
              fontWeight: 350,
              fontStyle: "regular",
              fontSize: "20px",
              lineHeight: "150%",
              letterSpacing: "0%",
            })}
          >
            {({ isActive }) => (
              <>
                <span>
                  {item.iconType === "dashboard" && (
                    <DashboardIcon isActive={isActive} />
                  )}
                  {item.iconType === "calendar" && (
                    <CalendarIcon isActive={isActive} />
                  )}
                  {item.iconType === "todolist" && (
                    <TodolistIcon isActive={isActive} />
                  )}
                  {item.iconType === "community" && (
                    <CommunityIcon isActive={isActive} />
                  )}
                  {item.iconType === "analytics" && (
                    <AnalyticsIcon isActive={isActive} />
                  )}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* 하단 영역 */}
      <div
        style={{
          width: "230px",
          height: "180px",
          padding: "0 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >


        {/* 유저 정보 버튼 */}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0px 0",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            width: "260px",
            height: "60px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#E5E7EB",
            borderRadius: "16px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              height: "100%",
              padding: "8px",
              boxSizing: "border-box",
            }}
          >
            {/* 프로필 이미지 */}
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                boxSizing: "border-box",
                backgroundColor: user?.profileImage ? "transparent" : "#6d86c6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user?.profileImage && (
                <img
                  src={user.profileImage}
                  alt="프로필"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </div>
          {/* 닉네임 & 이메일 */}
          <div style={{ flex: 1, textAlign: "left" }}>
            <div
              style={{
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "13px",
                color: user?.nickname ? "#111827" : "#9CA3AF",
               
              }}
            >
              {user?.nickname || "닉네임을 설정해주세요"}
            </div>
            <div
              style={{
                fontFamily: "Pretendard",
                fontWeight: 400,
                fontSize: "13px",
                color: user?.email ? "#111827" : "#9CA3AF",
                
              }}
            >
              {user?.email || "이메일 정보 없음"}
            </div>
          </div>

          {/* 화살표 */}
          <ChevronRight size={18} color="#9CA3AF" />
        </button>

        <SettingModal
          isOpen={isOpen}
          onClose={handleCloseSettingModal}
          panel={settings}
        />
      </div>
    </aside>
  );
}
