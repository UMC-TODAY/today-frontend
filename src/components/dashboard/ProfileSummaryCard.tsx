import { useMyInfo } from "../../hooks/queries/useSchedule.ts";
import { useBadgeStatus } from "../../hooks/queries/useSchedule.ts";
import { BadgeIcon } from "../icons/BadgeIcon.tsx";
import { CompletedIcon } from "../icons/CompletedIcon.tsx";
import { RiseIcon } from "../icons/RiseIcon.tsx";

export default function ProfileSummaryCard() {
  const { data: userData, isLoading: userLoading } = useMyInfo();
  const { data: statsData, isLoading: statsLoading } = useBadgeStatus();

  if (userLoading || statsLoading) {
    return (
      <div className="w-full bg-white rounded-[24px] flex items-center justify-center min-h-[400px]">
        로딩 중...
      </div>
    );
  }

  const user = userData?.data;
  const stats = statsData?.data;

  return (
    <div className="relative flex flex-col items-center w-full bg-white rounded-[24px] pt-12 px-6 pb-8 ">
      {/* 프로필 이미지 (중앙 큰 원) */}
      <div className="w-48 h-48 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden mb-12">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-[13px] text-gray-400 text-center leading-tight">
            프로필 사진
            <br />
            들어갈 예정
          </p>
        )}
      </div>

      <div className="w-full flex justify-between px-2">
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-1.5 mb-3">
            <BadgeIcon />
            <span className="text-[16px] font-bold text-[#444]">얻은 뱃지</span>
          </div>
          <div className="text-[28px] font-extrabold text-black mb-2">
            + {stats?.badge.totalCount.toLocaleString() || 0}
          </div>
          <div className="text-[14px] text-[#6c9eff] flex items-center gap-1">
            상위 {stats?.badge.rankingPercent || 0}%
            <RiseIcon />
          </div>
        </div>

        {/* 완료한 일정 */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center gap-1.5 mb-3">
            <CompletedIcon />
            <span className="text-[16px] font-bold text-[#444]">
              완료한 일정
            </span>
          </div>
          <div className="text-[28px] font-extrabold text-black mb-2">
            + {stats?.completedSchedule.totalCount.toLocaleString() || 0}
          </div>
          <div className="text-[14px] text-[#6c9eff] flex items-center gap-1">
            상위 {stats?.completedSchedule.rankingPercent || 0}%
            <RiseIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
