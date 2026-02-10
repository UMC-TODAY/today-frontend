import { useQuery } from "@tanstack/react-query";
import { getPosts, getMyPosts } from "../api/posts";
import { getFriends, searchFriends } from "../api/friends";
import { getNotifications } from "../api/notifications";

interface UseCommunityQueriesParams {
  activeTab: "recent" | "friends" | "activity";
  friendSearchQuery: string;
}

export function useCommunityQueries({
  activeTab,
  friendSearchQuery,
}: UseCommunityQueriesParams) {
  // 피드 목록 조회
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  // 내 피드 조회
  const myPostsQuery = useQuery({
    queryKey: ["myPosts"],
    queryFn: () => getMyPosts(),
    enabled: activeTab === "activity",
  });

  // 알림 목록 조회
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });

  // 친구 목록 조회
  const friendsQuery = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(),
    enabled: activeTab === "friends",
  });

  // 친구 검색
  const friendSearchQuery_ = useQuery({
    queryKey: ["friendSearch", friendSearchQuery],
    queryFn: () => searchFriends(friendSearchQuery),
    enabled: activeTab === "friends" && friendSearchQuery.length > 0,
  });

  return {
    postsQuery,
    myPostsQuery,
    notificationsQuery,
    friendsQuery,
    friendSearchQuery: friendSearchQuery_,
  };
}
