// src/components/ProfileSummaryCard.tsx
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
      <div className="w-full bg-white rounded-[24px] flex items-center justify-center min-h-[300px] px-4">
        로딩 중...
      </div>
    );
  }

  const user = userData?.data;
  const stats = statsData?.data;

  return (
    <div className="relative flex flex-col items-center w-full max-w-full overflow-hidden bg-white rounded-[24px] pt-8 px-4 sm:px-6 pb-8">
      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden mb-8">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-[12px] sm:text-[13px] text-gray-400 text-center leading-tight break-words">
            프로필 사진
            <br />
            들어갈 예정
          </p>
        )}
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap justify-center text-center">
            <BadgeIcon />
            <span className="text-[14px] sm:text-[16px] font-bold text-[#444] break-words">
              얻은 뱃지
            </span>
          </div>
          <div className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-black mb-1 break-all text-center">
            + {stats?.badge.totalCount?.toLocaleString() || 0}
          </div>
          <div className="text-[12px] sm:text-[14px] text-[#6c9eff] flex items-center gap-1 flex-wrap justify-center text-center">
            상위 {stats?.badge.rankingPercent || 0}%
            <RiseIcon />
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-2 flex-wrap justify-center text-center">
            <CompletedIcon />
            <span className="text-[14px] sm:text-[16px] font-bold text-[#444] break-words">
              완료한 일정
            </span>
          </div>
          <div className="text-[22px] sm:text-[26px] md:text-[28px] font-extrabold text-black mb-1 break-all text-center">
            + {stats?.completedSchedule.totalCount?.toLocaleString() || 0}
          </div>
          <div className="text-[12px] sm:text-[14px] text-[#6c9eff] flex items-center gap-1 flex-wrap justify-center text-center">
            상위 {stats?.completedSchedule.rankingPercent || 0}%
            <RiseIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
