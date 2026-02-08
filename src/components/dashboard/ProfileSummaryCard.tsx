import { useMyInfo } from "../../hooks/queries/useSchedule.ts";
import { useBadgeStatus } from "../../hooks/queries/useSchedule.ts";

export default function ProfileSummaryCard() {
  const { data: userData, isLoading: userLoading } = useMyInfo();
  const { data: statsData, isLoading: statsLoading } = useBadgeStatus();

  if (userLoading || statsLoading) {
    return (
      <div className="w-[320px] h-[450px] bg-white rounded-[24px] flex items-center justify-center border border-gray-100 shadow-sm">
        로딩 중...
      </div>
    );
  }

  const user = userData?.data;
  const stats = statsData?.data;

  return (
    <div className="relative flex flex-col items-center w-[320px] bg-white rounded-[24px] pt-10 px-6 pb-6 border border-gray-100 shadow-sm">
      {/* 알림 배지 */}
      <div className="absolute top-[-10px] left-5 bg-[#ff4d4d] text-white text-sm font-bold py-1 px-3 rounded-tr-[12px] rounded-tl-[12px] rounded-br-[12px] rounded-bl-0">
        6
      </div>

      {/* 프로필 이미지 */}
      <div className="w-40 h-40 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden mb-8">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="프로필"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            프로필 사진
            <br />
            들어갈 예정
          </p>
        )}
      </div>

      {/* 통계 섹션 */}
      <div className="w-full flex justify-around">
        {/* 얻은 뱃지 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center text-[15px] font-semibold text-gray-700">
            <span className="mr-1">🏅</span> 얻은 뱃지
          </div>
          <div className="text-2xl font-extrabold text-black">
            + {stats?.badge.totalCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-0.5 text-sm text-[#6c9eff]">
            상위 {stats?.badge.rankingPercent}%
            <span className="text-[#ff4d4d] text-xs">▲</span>
          </div>
        </div>

        {/* 완료한 일정 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center text-[15px] font-semibold text-gray-700">
            <span className="mr-1 text-blue-500">✅</span> 완료한 일정
          </div>
          <div className="text-2xl font-extrabold text-black">
            + {stats?.completedSchedule.totalCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-0.5 text-sm text-[#6c9eff]">
            상위 {stats?.completedSchedule.rankingPercent}%
            <span className="text-[#ff4d4d] text-xs">▲</span>
          </div>
        </div>
      </div>
    </div>
  );
}
