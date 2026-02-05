import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, MoreVertical, Plus, Calendar, Clock, Repeat, X, Pencil, Loader2, ChevronLeft, Search, Send, Share2 } from "lucide-react";
import todosData from "../data/todos.json";
import { getPosts, likePost, unlikePost, createPost, reportPost, getMyPosts, blockUserPosts } from "../api/posts";
import { getComments, createComment, likeComment, unlikeComment } from "../api/comments";
import { getFriends, searchFriends, sendFriendRequest, cancelFriendRequest, toggleScheduleSharing } from "../api/friends";
import { getNotifications, acceptFriendRequest, rejectFriendRequest } from "../api/notifications";
import type { Post as ApiPost } from "../types/post";
import type { Comment } from "../types/comment";
import type { Friend, FriendSearchResult } from "../types/friend";
import type { Notification } from "../types/notification";
import bell1Svg from "../assets/icons/bell1.svg";
import bell2Svg from "../assets/icons/bell2.svg";

interface TodoItem {
  taskId: string;
  title: string;
  description: string;
  subTasks: string[];
  defaultDurationMin: number;
  repeatRule: string;
  difficulty: number;
  tags: string[];
  template: {
    recommendedTimes: string[];
    minPerSession: number;
  };
  status: string;
}

interface Category {
  categoryKey: string;
  items: TodoItem[];
}

// 시간 포맷팅 함수
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString("ko-KR");
};

// 날짜 포맷팅 (YYYY.MM.DD)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 카테고리 SVG 아이콘 컴포넌트
const CategoryIcon = ({ category }: { category: string }) => {
  const icons: Record<string, JSX.Element> = {
    "관리": (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M6.33165 0.0562493L8.0864 1.44381C8.13252 1.48026 8.18945 1.50006 8.24817 1.50006H13.2391C13.3831 1.50006 13.4998 1.61683 13.4998 1.76083V3.48791C13.4998 3.6319 13.3831 3.74868 13.2391 3.74868H2.79311C2.67882 3.74868 2.57779 3.82315 2.54404 3.93228L0.0528743 11.9809C0.0492744 11.9921 0.0389245 12 0.0269997 12C0.0121498 12 0 11.9879 0 11.973V0.260772C0 0.116774 0.116774 0 0.260772 0H6.1701C6.22882 0 6.28575 0.0197998 6.33187 0.0562493H6.33165ZM3.8992 5.24828H14.9835C15.1585 5.24828 15.2838 5.41748 15.233 5.58488L13.3421 11.8148C13.3088 11.9246 13.2076 11.9998 13.0926 11.9998H1.97075C1.79525 11.9998 1.6697 11.8297 1.72168 11.6621L3.65013 5.43188C3.68388 5.32276 3.7849 5.24828 3.8992 5.24828Z" fill="#6987D2" />
      </svg>
    ),
    "업무": (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 6.95246C1.91902 7.69901 3.94401 8.13685 6.00005 8.25003V9.75009H8.99996V8.25003C11.051 8.12155 13.0722 7.69451 15 6.98261V12.75H0V6.95246ZM9.74988 0L10.4998 0.749921V2.24999H14.9998V6.15754C12.7001 7.01613 10.2694 7.47041 7.81489 7.50011H7.27489C4.78753 7.47333 2.32446 7.00601 0 6.12019V2.24999H4.49998V0.749921L5.2499 0H9.74988ZM8.99996 1.50007H6.00005V2.24999H8.99996V1.50007Z" fill="#6987D2" />
      </svg>
    ),
    "반려동물": (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13" viewBox="0 0 15 13" fill="none">
        <path d="M0.333398 5.37705C-0.213327 5.87933 -0.0729215 6.96395 0.646611 7.8017C1.36614 8.63871 2.39219 8.90968 2.93779 8.40555C3.4834 7.90512 3.34337 6.81864 2.62346 5.98275C1.90393 5.14686 0.877889 4.87477 0.333026 5.37705H0.333398Z" fill="#6987D2" />
        <path d="M12.2833 5.79155C11.6427 6.69639 11.6029 7.79103 12.1932 8.23696C12.7827 8.68141 13.7794 8.31295 14.4188 7.40737C15.0583 6.50438 15.0985 5.41086 14.509 4.96381C13.9194 4.51862 12.922 4.88931 12.2833 5.79155Z" fill="#6987D2" />
        <path d="M5.72499 5.58104C6.68623 5.35085 7.1864 3.92149 6.84116 2.38945C6.49852 0.856665 5.44008 -0.198674 4.47884 0.031521C3.51872 0.26357 3.01929 1.69256 3.36193 3.22497C3.70717 4.75553 4.76487 5.81124 5.72499 5.58067V5.58104Z" fill="#6987D2" />
        <path d="M10.5494 0.0315213C9.58928 -0.198674 8.53158 0.856666 8.18708 2.38908C7.84259 3.92149 8.34202 5.35048 9.304 5.58067C10.2634 5.81087 11.3218 4.75553 11.6663 3.22497C12.0116 1.69256 11.5095 0.26357 10.5494 0.0315213Z" fill="#6987D2" />
        <path d="M7.4626 6.87695C5.17142 6.87695 3.45117 10.5086 3.45117 11.7099C3.45117 14.6643 5.17105 11.6165 7.4626 11.6165C9.75416 11.6165 11.474 14.6643 11.474 11.7099C11.474 10.5086 9.7549 6.87695 7.4626 6.87695Z" fill="#6987D2" />
      </svg>
    ),
    "출퇴근": (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 8.4375C8.01769 8.4375 8.4375 8.01769 8.4375 7.5C8.4375 6.98231 8.01769 6.5625 7.5 6.5625C6.98231 6.5625 6.5625 6.98231 6.5625 7.5C6.5625 8.01769 6.98231 8.4375 7.5 8.4375Z" fill="#6987D2" />
        <path fillRule="evenodd" clipRule="evenodd" d="M15 7.5C15 11.6421 11.6421 15 7.5 15C3.35794 15 0 11.6421 0 7.5C0 3.35794 3.35794 0 7.5 0C11.6421 0 15 3.35794 15 7.5ZM5.625 5.625L3.75 10.3125L4.6875 11.25L9.375 9.375L11.25 4.6875L10.3125 3.75L5.625 5.625Z" fill="#6987D2" />
      </svg>
    ),
    "학습": (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17" fill="none">
        <path d="M13.9462 4.8209C13.9462 4.76451 14 4.70813 14 4.65174V4.31343C14 4.25705 13.9462 4.20066 13.9462 4.14428C13.9103 4.10669 13.8744 4.0691 13.8385 4.03151L7.91538 0.0845771C7.75385 -0.0281924 7.48461 -0.0281924 7.32308 0.0845771L0.323077 5.1592L0.269231 5.21559H0.215385C0.161538 5.27197 0.161538 5.32836 0.107692 5.38474V5.44113C0 5.61028 0 5.66667 0 5.72305V12.4892C0 12.6584 0.107692 12.8839 0.269231 12.9403L6.19231 16.8872C6.3 16.9436 6.40769 17 6.46154 17C6.56923 17 6.67692 16.9436 6.78462 16.8872L13.7846 11.8126C13.8923 11.6998 14 11.5871 14 11.4179C14 11.2488 13.9462 11.0796 13.8385 10.9668C13.3538 10.4594 13.2462 9.72637 13.5692 9.04975L13.9462 8.20398C13.9462 8.1476 14 8.09121 14 8.03483V7.97844C14 7.92206 14 7.80929 13.9462 7.7529V7.69652C13.9462 7.64013 13.8923 7.58375 13.8385 7.52736C13.3538 7.0199 13.2462 6.2869 13.5692 5.61028L13.9462 4.8209ZM12.7077 7.86567L6.46154 12.3765L1.07692 8.82421V6.79436L6.19231 10.1774C6.3 10.2338 6.40769 10.2902 6.46154 10.2902C6.56923 10.2902 6.67692 10.2338 6.78462 10.1774L12.3308 6.17413C12.2769 6.73798 12.3846 7.30182 12.7077 7.86567ZM6.46154 15.7595L1.07692 12.2073V10.1774L6.19231 13.5605C6.3 13.6169 6.40769 13.6733 6.46154 13.6733C6.56923 13.6733 6.67692 13.6169 6.78462 13.5605L12.3308 9.55721C12.2769 10.1774 12.3846 10.7977 12.7077 11.3051L6.46154 15.7595Z" fill="#6987D2" />
      </svg>
    ),
    "건강": (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.4442 0H1.55561C0.699988 0 0.00769987 0.699988 0.00769987 1.55561L0 12.4444C0 13.3 0.699988 14 1.55561 14H12.4444C13.3 14 14 13.3 14 12.4444V1.55561C14 0.699988 13.3 0 12.4444 0H12.4442ZM11.6665 8.55549H8.55549V11.6665H5.44451V8.55549H2.33329V5.44451H5.44428V2.33329H8.55526V5.44428H11.6662V8.55526L11.6665 8.55549Z" fill="#6987D2" />
      </svg>
    ),
    "취미": (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M13.0546 11.9413H13.0023C12.5893 11.9135 12.2772 11.5562 12.3051 11.1436C12.3051 11.1425 12.3051 11.1412 12.3053 11.14L12.5751 7.39484C12.8028 4.35051 10.5183 1.69784 7.47243 1.47021C5.79799 1.34505 4.15728 1.98704 3.01296 3.21529C1.94935 4.33073 1.40529 5.84279 1.5141 7.37978L1.78388 11.125C1.81288 11.5387 1.50084 11.8975 1.08695 11.9265C0.67306 11.9555 0.314027 11.6436 0.285026 11.2299L0.015245 7.48472C-0.238124 3.61257 2.69686 0.268482 6.57069 0.0152375C10.4445 -0.238007 13.7905 2.69554 14.0438 6.56747C14.0638 6.87284 14.0638 7.17912 14.0438 7.48449L13.7741 11.2297C13.7549 11.6173 13.4427 11.9263 13.0546 11.9413Z" fill="#6987D2" />
        <path d="M10.8068 6.69922H10.0575C9.22967 6.69922 8.55859 7.36997 8.55859 8.19734V13.4404C8.55859 14.2678 9.22967 14.9385 10.0575 14.9385H10.8068C12.4623 14.9385 13.8043 13.597 13.8043 11.9425V9.69546C13.8043 8.04072 12.4621 6.69944 10.8068 6.69944V6.69922Z" fill="#6987D2" />
        <path d="M4.06126 6.69749H3.31194C1.65639 6.69749 0.314453 8.03899 0.314453 9.69351V11.9406C0.314453 13.5953 1.65661 14.9366 3.31194 14.9366H4.06126C4.88903 14.9366 5.56011 14.2658 5.56011 13.4385V8.19539C5.56011 7.36802 4.88903 6.69727 4.06126 6.69727V6.69749Z" fill="#6987D2" />
      </svg>
    ),
    "소셜": (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M9.10684 0H1.60709C0.696405 0 0 0.696405 0 1.60709V10.7139C0 10.9282 0.107139 11.0889 0.267848 11.1961C0.374988 11.2496 0.428557 11.2496 0.535697 11.2496C0.642836 11.2496 0.749975 11.1961 0.803545 11.1425L4.82127 8.57114H9.10684C10.0175 8.57114 10.7139 7.87474 10.7139 6.96405V1.60709C10.7139 0.696405 10.0175 0 9.10684 0ZM4.28557 5.89266H3.21418C2.89276 5.89266 2.67848 5.67838 2.67848 5.35696C2.67848 5.03555 2.89276 4.82127 3.21418 4.82127H4.28557C4.60699 4.82127 4.82127 5.03555 4.82127 5.35696C4.82127 5.67838 4.60699 5.89266 4.28557 5.89266ZM5.89266 3.74988H3.21418C2.89276 3.74988 2.67848 3.5356 2.67848 3.21418C2.67848 2.89276 2.89276 2.67848 3.21418 2.67848H5.89266C6.21408 2.67848 6.42836 2.89276 6.42836 3.21418C6.42836 3.5356 6.21408 3.74988 5.89266 3.74988Z" fill="#6987D2" />
        <path d="M13.392 3.75H11.7849V6.96418C11.7849 8.46413 10.6064 9.64266 9.10642 9.64266H5.14227L4.28516 10.1784V10.7141C4.28516 11.6247 4.98156 12.3211 5.89225 12.3211H10.1778L14.1955 14.8925C14.3027 14.9461 14.4098 14.9996 14.4634 14.9996C14.5705 14.9996 14.6241 14.9996 14.7312 14.9461C14.8919 14.8389 14.9991 14.6782 14.9991 14.4639V5.35709C14.9991 4.44641 14.3027 3.75 13.392 3.75Z" fill="#6987D2" />
      </svg>
    ),
    "준비": (
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M11.6822 1.81428L10.1821 1.03104C8.86543 0.34383 8.20708 0 7.49878 0C6.79048 0 6.13212 0.34383 4.81542 1.03127L4.57422 1.15729L11.2664 4.9618L14.2789 3.46337C13.7943 2.9174 13.0124 2.50911 11.682 1.81451L11.6822 1.81428Z" fill="#6987D2" />
        <path d="M14.8114 4.45117L11.8126 5.94289V8.20868C11.8126 8.51781 11.5608 8.76829 11.2501 8.76829C10.9394 8.76829 10.6876 8.51781 10.6876 8.20868V6.50251L8.0625 7.80821V14.8522C8.60093 14.7188 9.2136 14.399 10.1834 13.8926L11.6834 13.1096C13.2971 12.267 14.104 11.8457 14.5522 11.0889C15.0002 10.3319 15.0002 9.38992 15.0002 7.50602V7.41872C15.0002 6.00646 15.0002 5.12361 14.8114 4.45117Z" fill="#6987D2" />
        <path d="M6.93745 14.8525V7.80844L0.188776 4.45117C0 5.12361 0 6.00669 0 7.41872V7.50602C0 9.38992 0 10.3319 0.447976 11.0889C0.895953 11.846 1.70281 12.267 3.31674 13.1096L4.81682 13.8926C5.78657 14.399 6.39925 14.7188 6.93767 14.8522L6.93745 14.8525Z" fill="#6987D2" />
        <path d="M0.71875 3.46237L7.49892 6.83508L10.0574 5.5625L3.39243 1.77344L3.31571 1.81351C1.9855 2.5081 1.2034 2.9164 0.71875 3.46237Z" fill="#6987D2" />
      </svg>
    ),
  };

  return icons[category] || icons["관리"];
};

const categoryColors: Record<string, string[]> = {
  "관리": ["bg-green-100", "bg-red-100", "bg-orange-100", "bg-yellow-100", "bg-purple-100"],
  "업무": ["bg-yellow-100", "bg-purple-100", "bg-green-100", "bg-blue-100", "bg-pink-100"],
  "반려동물": ["bg-yellow-100", "bg-pink-100", "bg-green-100", "bg-blue-100", "bg-purple-100"],
  "출퇴근": ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-orange-100", "bg-red-100"],
  "학습": ["bg-indigo-100", "bg-purple-100", "bg-blue-100", "bg-green-100", "bg-yellow-100"],
  "건강": ["bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-pink-100", "bg-purple-100"],
  "취미": ["bg-pink-100", "bg-purple-100", "bg-yellow-100", "bg-blue-100", "bg-green-100"],
  "소셜": ["bg-purple-100", "bg-indigo-100", "bg-pink-100", "bg-blue-100", "bg-yellow-100"],
  "준비": ["bg-orange-100", "bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-purple-100"]
};

const itemEmojis: Record<string, string[]> = {
  "관리": ["📧", "🏠", "💰", "📅", "💾"],
  "업무": ["🌟", "🔥", "💼", "✅", "📋"],
  "반려동물": ["🐕", "🍖", "✨", "🧹", "🎾"],
  "출퇴근": ["💳", "💼", "🎧", "🧘", "🗺️"],
  "학습": ["📖", "📝", "🗣️", "💻", "✍️"],
  "건강": ["🏋️", "💧", "🚶", "🧘", "😴"],
  "취미": ["📷", "🍳", "🎨", "🎵", "☕"],
  "소설": ["💡", "👤", "✍️", "💬", "📄"],
  "준비": ["✈️", "🎤", "📄", "🎁", "🛒"]
};

// 오늘 날짜 포맷팅
const getTodayDate = () => {
  const today = new Date();
  return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
};

// 반복 규칙 한글 변환
const getRepeatLabel = (rule: string) => {
  const labels: Record<string, string> = {
    "DAILY": "매일",
    "WEEKLY": "매주",
    "MONTHLY": "매월",
    "NONE": "반복 없음"
  };
  return labels[rule] || "매주";
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"recent" | "friends" | "activity">("recent");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openTodoId, setOpenTodoId] = useState<string | null>(null);
  const [modalTodo, setModalTodo] = useState<TodoItem | null>(null);

  // Feed states
  const [selectedPost, setSelectedPost] = useState<ApiPost | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportPostId, setReportPostId] = useState<number | null>(null);

  // Notification states
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Friend states
  const [friendSearchQuery, setFriendSearchQuery] = useState("");

  const queryClient = useQueryClient();
  const categories = todosData.categories as Category[];

  // 피드 목록 조회
  const { data: postsData, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  });

  // 내 피드 조회
  const { data: myPostsData, isLoading: isMyPostsLoading } = useQuery({
    queryKey: ["myPosts"],
    queryFn: () => getMyPosts(),
    enabled: activeTab === "activity",
  });

  // 댓글 목록 조회
  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", selectedPost?.postId],
    queryFn: () => getComments(selectedPost!.postId),
    enabled: !!selectedPost,
  });

  // 알림 목록 조회
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });

  // 친구 목록 조회
  const { data: friendsData, isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: () => getFriends(),
    enabled: activeTab === "friends",
  });

  // 친구 검색
  const { data: friendSearchData, isLoading: isFriendSearchLoading } = useQuery({
    queryKey: ["friendSearch", friendSearchQuery],
    queryFn: () => searchFriends(friendSearchQuery),
    enabled: activeTab === "friends" && friendSearchQuery.length > 0,
  });

  // 좋아요 mutation
  const likeMutation = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: number; isLiked: boolean }) => {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
    },
  });

  // 댓글 좋아요 mutation
  const commentLikeMutation = useMutation({
    mutationFn: async ({ commentId, isLiked }: { commentId: number; isLiked: boolean }) => {
      if (isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", selectedPost?.postId] });
    },
  });

  // 피드 작성 mutation
  const createPostMutation = useMutation({
    mutationFn: (content: string) => createPost(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["myPosts"] });
      setNewPostContent("");
      setShowPostModal(false);
    },
  });

  // 댓글 작성 mutation
  const createCommentMutation = useMutation({
    mutationFn: ({ postId, content }: { postId: number; content: string }) =>
      createComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", selectedPost?.postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewCommentContent("");
    },
  });

  // 신고 mutation
  const reportMutation = useMutation({
    mutationFn: ({ postId, reason }: { postId: number; reason: string }) =>
      reportPost(postId, reason),
    onSuccess: () => {
      setShowReportModal(false);
      setReportPostId(null);
      alert("신고가 정상적으로 접수되었습니다.\n운영진이 빠르게 확인하여 조치를 취하도록 하겠습니다. 감사합니다.");
    },
  });

  // 차단 mutation
  const blockMutation = useMutation({
    mutationFn: (userId: number) => blockUserPosts(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setShowMoreMenu(null);
    },
  });

  // 친구 요청 수락 mutation
  const acceptFriendMutation = useMutation({
    mutationFn: (notificationId: number) => acceptFriendRequest(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  // 친구 요청 거절 mutation
  const rejectFriendMutation = useMutation({
    mutationFn: (notificationId: number) => rejectFriendRequest(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // 친구 요청 보내기 mutation
  const sendFriendRequestMutation = useMutation({
    mutationFn: (userId: number) => sendFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendSearch", friendSearchQuery] });
    },
  });

  // 친구 요청 취소 mutation
  const cancelFriendRequestMutation = useMutation({
    mutationFn: (userId: number) => cancelFriendRequest(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendSearch", friendSearchQuery] });
    },
  });

  // 일정 공유 토글 mutation
  const toggleSharingMutation = useMutation({
    mutationFn: ({ friendId, sharing }: { friendId: number; sharing: boolean }) =>
      toggleScheduleSharing(friendId, sharing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const handleLike = (postId: number, isLiked: boolean) => {
    likeMutation.mutate({ postId, isLiked });
  };

  const handleCommentLike = (commentId: number, isLiked: boolean) => {
    commentLikeMutation.mutate({ commentId, isLiked });
  };

  const handleCreatePost = () => {
    if (newPostContent.trim().length >= 5) {
      createPostMutation.mutate(newPostContent);
    }
  };

  const handleCreateComment = () => {
    if (selectedPost && newCommentContent.trim()) {
      createCommentMutation.mutate({
        postId: selectedPost.postId,
        content: newCommentContent
      });
    }
  };

  const handleReport = (postId: number) => {
    setReportPostId(postId);
    setShowReportModal(true);
    setShowMoreMenu(null);
  };

  const handleBlock = (userId: number) => {
    blockMutation.mutate(userId);
  };

  // 모달 열기
  const handleOpenModal = (todo: TodoItem) => {
    setModalTodo(todo);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalTodo(null);
  };

  // 키워드 버튼 클릭 핸들러
  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(selectedCategory === categoryKey ? null : categoryKey);
  };

  // 카테고리 정렬 로직
  const sortedCategories = selectedCategory
    ? [
      categories.find(cat => cat.categoryKey === selectedCategory)!,
      ...categories.filter(cat => cat.categoryKey !== selectedCategory)
    ]
    : categories;

  // 할일 아이템 클릭 핸들러
  const handleTodoClick = (taskId: string) => {
    setOpenTodoId(openTodoId === taskId ? null : taskId);
  };

  const hasUnreadNotifications = notificationsData?.hasUnread ?? false;

  return (
    <>
      <div className="flex gap-4 h-full overflow-hidden">
        {/* Left Card - 할일 찾기 */}
          <div
            className="bg-white rounded-2xl shadow-sm border p-6 overflow-y-auto scrollbar-hide flex-1 min-w-0"
          >
            {/* Header */}
            <h1 className="text-left mb-4 text-[#0F1724]" style={{ fontFamily: 'Pretendard', fontSize: '24px', fontWeight: 500, lineHeight: '100%', letterSpacing: '0%' }}>할일 찾기</h1>

            {/* Filter Buttons - 2x4 그리드 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.slice(0, 8).map((category) => (
                <button
                  key={category.categoryKey}
                  onClick={() => handleCategoryClick(category.categoryKey)}
                  className={`
                      flex items-center justify-center gap-1
                      text-[12px] font-medium
                      transition
                      shadow-[0_0_1px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.12)]
                      ${selectedCategory === category.categoryKey
                      ? "bg-blue-100 text-blue-700"
                      : "bg-white text-[#0F1724]"
                    }
      `}
                  style={{ fontFamily: "Pretendard", width: '75px', height: '25px', borderRadius: '12px' }}
                >
                  <CategoryIcon category={category.categoryKey} />
                  <span className="leading-none">{category.categoryKey}</span>
                </button>
              ))}
            </div>

            {/* Category Sections */}
            {sortedCategories.map((category, categoryIndex) => (
              <div key={category.categoryKey} className={categoryIndex > 0 ? "mt-6" : ""}>
                {/* 카테고리 키워드 - 왼쪽 상단 */}
                <h2
                  className="text-base font-semibold text-left mb-3 text-[#0F1724]"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  {category.categoryKey}
                </h2>

                <div className="space-y-2">
                  {category.items.map((todo, index) => {
                    const isOpen = openTodoId === todo.taskId;
                    const colors = categoryColors[category.categoryKey] || categoryColors["관리"];
                    const emojis = itemEmojis[category.categoryKey] || itemEmojis["관리"];
                    const color = colors[index % colors.length];
                    const emoji = emojis[index % emojis.length];

                    return (
                      <div
                        key={todo.taskId}
                        className={`transition overflow-hidden ${isOpen ? "" : ""}`}
                        style={{
                          minHeight: isOpen ? 'auto' : '48px',
                          borderRadius: '12px',
                          backgroundColor: isOpen ? '#EDF3FD' : '#FFFFFF',
                          boxShadow: '0 0 1px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.08)'
                        }}
                      >
                        {/* Todo Header */}
                        <div
                          className="flex items-center justify-between px-4 cursor-pointer"
                          style={{ height: '48px' }}
                          onClick={() => handleTodoClick(todo.taskId)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-sm flex-shrink-0`}
                            >
                              {emoji}
                            </div>
                            <p
                              style={{
                                color: '#0F1724',
                                fontFamily: 'Pretendard',
                                fontSize: '14px',
                                fontStyle: 'normal',
                                fontWeight: 500,
                                lineHeight: 'normal',
                                textAlign: 'left'
                              }}
                            >
                              {todo.title}
                            </p>
                          </div>
                          {isOpen ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleOpenModal(todo); }}
                              className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-1.5 bg-white"
                              style={{ fontFamily: 'Pretendard' }}
                            >
                              <Plus className="w-4 h-4" />
                              내 할일에 추가하기
                            </button>
                          ) : (
                            <span
                              className="text-blue-500 flex-shrink-0"
                              style={{ fontFamily: 'Pretendard', fontSize: '10px', fontWeight: 400 }}
                            >
                              {(todo as any).usageCount ? `${(todo as any).usageCount.toLocaleString()}명이 활용했어요.` : `${Math.floor(Math.random() * 3000) + 500}명이 활용했어요.`}
                            </span>
                          )}
                        </div>

                        {/* Todo Detail - 토글로 표시 */}
                        {isOpen && (
                          <div className="px-4 pb-4">
                            <div className="rounded-xl p-5" style={{ backgroundColor: '#F6F9FE' }}>
                              <div className="flex gap-6">
                                {/* 왼쪽: 하위작업 */}
                                <div className="flex-1">
                                  <p
                                    className="text-sm font-semibold text-[#0F1724] mb-3 text-left"
                                    style={{ fontFamily: 'Pretendard' }}
                                  >
                                    하위 작업
                                  </p>
                                  {todo.subTasks && todo.subTasks.length > 0 && (
                                    <div className="space-y-2">
                                      {todo.subTasks.map((subTask, subIndex) => (
                                        <div
                                          key={subIndex}
                                          className="flex gap-3 items-start bg-white rounded-lg px-4 py-3"
                                        >
                                          <div className={`w-6 h-6 ${color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs`}>
                                            {emoji}
                                          </div>
                                          <p
                                            className="text-[#0F1724] flex-1 text-left"
                                            style={{ fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                                          >
                                            {subTask}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* 오른쪽: 키워드, 설명, 날짜, 소요시간, 반복 */}
                                <div className="w-72 bg-white rounded-xl p-5 border border-gray-100">
                                  {/* 상단: 키워드 + 드롭다운 */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                                      <CategoryIcon category={category.categoryKey} />
                                      <span
                                        className="text-[#0F1724] font-medium"
                                        style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                                      >
                                        {category.categoryKey}
                                      </span>
                                    </div>
                                    <select
                                      className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
                                      style={{ fontFamily: 'Pretendard' }}
                                    >
                                      <option>사용자 지정</option>
                                    </select>
                                  </div>

                                  {/* 키워드 설명 */}
                                  <p
                                    className="text-gray-600 text-sm mb-5 leading-relaxed"
                                    style={{ fontFamily: 'Pretendard' }}
                                  >
                                    {todo.description}
                                  </p>

                                  {/* 날짜, 소요시간, 반복 */}
                                  <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                      <span
                                        className="text-gray-500 text-sm"
                                        style={{ fontFamily: 'Pretendard' }}
                                      >
                                        날짜
                                      </span>
                                      <div className="flex items-center gap-1.5 text-[#0F1724]">
                                        <Calendar className="w-4 h-4" />
                                        <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                          {getTodayDate()}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span
                                        className="text-gray-500 text-sm"
                                        style={{ fontFamily: 'Pretendard' }}
                                      >
                                        소요 시간
                                      </span>
                                      <div className="flex items-center gap-1.5 text-[#0F1724]">
                                        <Clock className="w-4 h-4" />
                                        <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                          {todo.defaultDurationMin}분
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span
                                        className="text-gray-500 text-sm"
                                        style={{ fontFamily: 'Pretendard' }}
                                      >
                                        반복
                                      </span>
                                      <div className="flex items-center gap-1.5 text-[#0F1724]">
                                        <Repeat className="w-4 h-4" />
                                        <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                                          {getRepeatLabel(todo.repeatRule)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right Card - 오늘 피드 */}
          <div className="flex-shrink-0 bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col relative" style={{ width: '480px' }}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 flex-shrink-0">
              {showPostModal ? (
                /* 게시글 작성 모드 헤더 */
                <div className="flex items-center justify-between p-5">
                  <button onClick={() => setShowPostModal(false)} className="text-gray-500 hover:text-gray-700">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-base font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>게시글</h3>
                  <button
                    onClick={handleCreatePost}
                    disabled={newPostContent.trim().length < 5}
                    className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    style={{ fontFamily: 'Pretendard' }}
                  >
                    작성
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <h2
                        className="text-[#0F1724]"
                        style={{ fontFamily: 'Pretendard', fontSize: '24px', fontWeight: 500, lineHeight: '100%', letterSpacing: '0%' }}
                      >
                        오늘
                      </h2>
                      <p
                        className="text-[#0F1724]"
                        style={{ fontFamily: 'Pretendard', fontSize: '24px', fontWeight: 500, lineHeight: '100%', letterSpacing: '0%' }}
                      >
                        피드
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNotificationModal(true)}
                      className="relative"
                    >
                      <img
                        src={hasUnreadNotifications ? bell2Svg : bell1Svg}
                        alt="알림"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex justify-between px-5">
                    <button
                      onClick={() => setActiveTab("recent")}
                      className={`flex-1 pb-3 text-sm font-medium text-center ${activeTab === "recent"
                          ? "border-b-2 border-blue-500 text-blue-500"
                          : "text-gray-400 hover:text-gray-600"
                        }`}
                      style={{ fontFamily: 'Pretendard' }}
                    >
                      최신
                    </button>
                    <button
                      onClick={() => setActiveTab("friends")}
                      className={`flex-1 pb-3 text-sm font-medium text-center ${activeTab === "friends"
                          ? "border-b-2 border-blue-500 text-blue-500"
                          : "text-gray-400 hover:text-gray-600"
                        }`}
                      style={{ fontFamily: 'Pretendard' }}
                    >
                      친구 관리
                    </button>
                    <button
                      onClick={() => setActiveTab("activity")}
                      className={`flex-1 pb-3 text-sm font-medium text-center ${activeTab === "activity"
                          ? "border-b-2 border-blue-500 text-blue-500"
                          : "text-gray-400 hover:text-gray-600"
                        }`}
                      style={{ fontFamily: 'Pretendard' }}
                    >
                      내 활동
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0 overflow-y-auto relative">
              {/* 게시글 상세 뷰 (카드 내부) */}
              {selectedPost && !showPostModal ? (
                <div className="flex flex-col h-full">
                  {/* 상세 헤더 */}
                  <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 flex-shrink-0">
                    <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-gray-700">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-base font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>게시글</span>
                  </div>

                  {/* 게시글 내용 */}
                  <div className="flex-1 overflow-y-auto p-5">
                    {/* 원본 게시글 */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {selectedPost.author?.profileImage ? (
                            <img
                              src={selectedPost.author.profileImage}
                              alt={selectedPost.author?.nickname || "사용자"}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                              {selectedPost.author?.nickname || "익명"}
                            </p>
                            <p className="text-xs text-gray-400" style={{ fontFamily: 'Pretendard' }}>
                              {formatTime(selectedPost.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setShowMoreMenu(showMoreMenu === selectedPost.postId ? null : selectedPost.postId)}
                            className="text-gray-300 hover:text-gray-500"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showMoreMenu === selectedPost.postId && (
                            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                              <button
                                onClick={() => handleReport(selectedPost.postId)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                style={{ fontFamily: 'Pretendard' }}
                              >
                                신고
                              </button>
                              <button
                                onClick={() => handleBlock(selectedPost.author.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                style={{ fontFamily: 'Pretendard' }}
                              >
                                이 친구의 모든 글 차단
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[#0F1724] mb-3 whitespace-pre-line" style={{ fontFamily: 'Pretendard', fontSize: '14px', lineHeight: '1.6' }}>
                        {selectedPost.content}
                      </p>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(selectedPost.postId, selectedPost.isLiked)}
                          className={`flex items-center gap-1 ${selectedPost.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                        >
                          <Heart className={`w-4 h-4 ${selectedPost.isLiked ? "fill-current" : ""}`} />
                          <span className="text-xs font-medium">{selectedPost.likeCount}</span>
                        </button>
                        <span className="flex items-center gap-1 text-gray-400">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">{selectedPost.commentCount}</span>
                        </span>
                      </div>
                    </div>

                    {/* 댓글 목록 */}
                    <div className="space-y-4">
                      {isCommentsLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        </div>
                      ) : commentsData?.comments && commentsData.comments.length > 0 ? (
                        commentsData.comments.map((comment: Comment) => (
                          <div key={comment.commentId} className="border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {comment.author?.profileImageUrl ? (
                                  <img
                                    src={comment.author.profileImageUrl}
                                    alt={comment.author?.nickname || "사용자"}
                                    className="w-7 h-7 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                                )}
                                <div>
                                  <p className="text-sm font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                                    {comment.author?.nickname || "익명"}
                                  </p>
                                  <p className="text-xs text-gray-400" style={{ fontFamily: 'Pretendard' }}>
                                    {formatTime(comment.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <button className="text-gray-300 hover:text-gray-500">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[#0F1724] text-sm mb-2" style={{ fontFamily: 'Pretendard', lineHeight: '1.5' }}>
                              {comment.content}
                            </p>
                            <button
                              onClick={() => handleCommentLike(comment.commentId, comment.isLiked ?? false)}
                              className={`flex items-center gap-1 ${comment.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? "fill-current" : ""}`} />
                              <span className="text-xs">{comment.likeCount}</span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-gray-400 text-sm" style={{ fontFamily: 'Pretendard' }}>
                          아직 댓글이 없습니다.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 댓글 입력 */}
                  <div className="border-t border-gray-100 p-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="댓글 작성하기"
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateComment()}
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-300"
                        style={{ fontFamily: 'Pretendard' }}
                      />
                      <button
                        onClick={handleCreateComment}
                        disabled={!newCommentContent.trim()}
                        className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : showPostModal ? (
                /* 게시글 작성 모드 */
                <div className="p-5 h-full">
                  <textarea
                    placeholder="최소 5자 이상 입력해주세요. 연락처 교환 등 부적절한 글은 삭제될 수 있으며, 등록한 글은 수정과 삭제가 어려우니 참고해주세요."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full h-full resize-none focus:outline-none text-sm p-0"
                    style={{ fontFamily: 'Pretendard', color: newPostContent ? '#0F1724' : '#9CA3AF' }}
                  />
                </div>
              ) : (
              <>
              {/* 최신 탭 */}
              {activeTab === "recent" && (
                <div className="p-4 space-y-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : isError ? (
                    <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Pretendard' }}>
                      피드를 불러오는데 실패했습니다.
                    </div>
                  ) : postsData?.posts && postsData.posts.length > 0 ? (
                    postsData.posts.map((post: ApiPost) => (
                      <div
                        key={post.postId}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                      >
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {post.author?.profileImage ? (
                              <img
                                src={post.author.profileImage}
                                alt={post.author?.nickname || "사용자"}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            )}
                            <div>
                              <p
                                className="text-sm font-medium text-[#0F1724]"
                                style={{ fontFamily: 'Pretendard' }}
                              >
                                {post.author?.nickname || "익명"}
                              </p>
                              <p
                                className="text-xs text-gray-400"
                                style={{ fontFamily: 'Pretendard' }}
                              >
                                {formatTime(post.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowMoreMenu(showMoreMenu === post.postId ? null : post.postId); }}
                              className="text-gray-300 hover:text-gray-500"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {showMoreMenu === post.postId && (
                              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleReport(post.postId); }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  신고
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleBlock(post.author.id); }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  이 친구의 모든 글 차단
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Post Content */}
                        <p
                          className="text-[#0F1724] mb-3 whitespace-pre-line"
                          style={{ fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                        >
                          {post.content}
                        </p>

                        {/* Post Actions */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleLike(post.postId, post.isLiked); }}
                            className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                              }`}
                          >
                            <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                            <span className="text-xs font-medium">{post.likeCount}</span>
                          </button>
                          <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">{post.commentCount}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Pretendard' }}>
                      아직 작성된 피드가 없습니다.
                    </div>
                  )}
                </div>
              )}

              {/* 친구 관리 탭 */}
              {activeTab === "friends" && (
                <div className="p-4">
                  {/* 검색창 */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="친구 프로필 이름으로 검색..."
                      value={friendSearchQuery}
                      onChange={(e) => setFriendSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-300"
                      style={{ fontFamily: 'Pretendard' }}
                    />
                  </div>

                  {/* 친구 목록 */}
                  <div className="space-y-3">
                    {isFriendsLoading || isFriendSearchLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                      </div>
                    ) : friendSearchQuery.length > 0 ? (
                      // 검색 결과
                      friendSearchData?.users && friendSearchData.users.length > 0 ? (
                        friendSearchData.users.map((user: FriendSearchResult) => (
                          <div
                            key={user.userId}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {user.profileImageUrl ? (
                                <img
                                  src={user.profileImageUrl}
                                  alt={user.nickname}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                              )}
                              <span className="text-sm font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                                {user.nickname}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {user.friendStatus === 'FRIEND' ? (
                                <div className="flex items-center gap-2">
                                  <Share2 className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs text-gray-500" style={{ fontFamily: 'Pretendard' }}>일정 공유</span>
                                  <div className="w-10 h-5 bg-gray-800 rounded-full relative cursor-pointer">
                                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                                  </div>
                                </div>
                              ) : user.friendStatus === 'PENDING' ? (
                                <div className="flex items-center gap-2">
                                  <span className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg" style={{ fontFamily: 'Pretendard' }}>
                                    친구 요청 중
                                  </span>
                                  <button
                                    onClick={() => cancelFriendRequestMutation.mutate(user.userId)}
                                    className="px-4 py-2 border border-blue-500 text-blue-500 text-sm rounded-lg hover:bg-blue-50"
                                    style={{ fontFamily: 'Pretendard' }}
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => sendFriendRequestMutation.mutate(user.userId)}
                                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  친구 요청
                                </button>
                              )}
                              <button className="text-gray-400">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Pretendard' }}>
                          검색 결과가 없습니다.
                        </div>
                      )
                    ) : (
                      // 친구 목록
                      friendsData?.friends && friendsData.friends.length > 0 ? (
                        friendsData.friends.map((friend: Friend) => (
                          <div
                            key={friend.friendId}
                            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {friend.profileImageUrl ? (
                                <img
                                  src={friend.profileImageUrl}
                                  alt={friend.nickname}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                              )}
                              <span className="text-sm font-medium text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>
                                {friend.nickname}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Share2 className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500" style={{ fontFamily: 'Pretendard' }}>일정 공유</span>
                              <button
                                onClick={() => toggleSharingMutation.mutate({ friendId: friend.friendId, sharing: !friend.isSharingSchedule })}
                                className={`w-10 h-5 rounded-full relative transition ${friend.isSharingSchedule ? 'bg-gray-800' : 'bg-gray-300'}`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition ${friend.isSharingSchedule ? 'right-0.5' : 'left-0.5'}`}></div>
                              </button>
                              <button className="text-gray-400">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Pretendard' }}>
                          아직 친구가 없습니다.
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* 내 활동 탭 */}
              {activeTab === "activity" && (
                <div className="p-4 pb-20">
                  {/* 통계 */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600" style={{ fontFamily: 'Pretendard' }}>
                    <span>게시글 <span className="font-medium text-[#0F1724]">{myPostsData?.stats?.totalPosts ?? 0}</span></span>
                    <span>누적 반응</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-gray-400" />
                      {myPostsData?.stats?.totalLikes ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-gray-400" />
                      {myPostsData?.stats?.totalComments ?? 0}
                    </span>
                  </div>

                  {/* 내 게시글 목록 */}
                  <div className="space-y-3">
                    {isMyPostsLoading ? (
                      <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                      </div>
                    ) : myPostsData?.posts && myPostsData.posts.length > 0 ? (
                      myPostsData.posts.map((post: ApiPost) => (
                        <div
                          key={post.postId}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition cursor-pointer"
                          onClick={() => setSelectedPost(post)}
                        >
                          {/* Post Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {post.author?.profileImage ? (
                                <img
                                  src={post.author.profileImage}
                                  alt={post.author?.nickname || "사용자"}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                              )}
                              <div>
                                <p
                                  className="text-sm font-medium text-[#0F1724]"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  {post.author?.nickname || "익명"}
                                </p>
                                <p
                                  className="text-xs text-gray-400"
                                  style={{ fontFamily: 'Pretendard' }}
                                >
                                  {formatDate(post.createdAt)}
                                </p>
                              </div>
                            </div>
                            <button className="text-gray-300 hover:text-gray-500">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Post Content */}
                          <p
                            className="text-[#0F1724] mb-3 whitespace-pre-line"
                            style={{ fontFamily: 'Pretendard', fontSize: '14px', fontWeight: 400, lineHeight: '1.5' }}
                          >
                            {post.content}
                          </p>

                          {/* Post Actions */}
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleLike(post.postId, post.isLiked); }}
                              className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                                }`}
                            >
                              <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                              <span className="text-xs font-medium">{post.likeCount}</span>
                            </button>
                            <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">{post.commentCount}</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-500" style={{ fontFamily: 'Pretendard' }}>
                        아직 작성한 피드가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              )}
              </>
              )}
            </div>

            {/* 글쓰기 버튼 - 플로팅 */}
            {!showPostModal && !selectedPost && (activeTab === "recent" || activeTab === "activity") && (
              <button
                onClick={() => setShowPostModal(true)}
                className="absolute bottom-6 right-6 px-5 py-2.5 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition shadow-lg flex items-center gap-2 z-10"
                style={{ fontFamily: 'Pretendard', borderRadius: '8px' }}
              >
                <Pencil className="w-4 h-4" />
                글쓰기
              </button>
            )}
          </div>
        </div>

      {/* 게시글 상세는 이제 카드 내부에서 표시됨 */}

      {/* 알림 패널 - 오른쪽 */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50" onClick={() => setShowNotificationModal(false)}>
          <div
            className="bg-white shadow-xl overflow-hidden flex flex-col"
            style={{ width: '649px', height: '1006px', borderRadius: '16px', margin: '20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-[#0F1724]" style={{ fontFamily: 'Pretendard' }}>알림</h3>
              <button onClick={() => setShowNotificationModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 알림 목록 */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {notificationsData?.notifications && notificationsData.notifications.length > 0 ? (
                notificationsData.notifications.map((notification: Notification) => (
                  <div
                    key={notification.notificationId}
                    className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {notification.type === 'HASHTAG_COMMENT' || notification.type === 'HASHTAG_LIKE' ? (
                        <div className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold text-lg">#</div>
                      ) : notification.senderProfileImageUrl ? (
                        <img
                          src={notification.senderProfileImageUrl}
                          alt={notification.senderNickname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      )}
                      <p className="text-sm text-[#0F1724] flex-1" style={{ fontFamily: 'Pretendard' }}>
                        {notification.message}
                      </p>
                    </div>

                    {notification.type === 'FRIEND_REQUEST' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => acceptFriendMutation.mutate(notification.notificationId)}
                          className="px-5 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                          style={{ fontFamily: 'Pretendard' }}
                        >
                          수락
                        </button>
                        <button
                          onClick={() => rejectFriendMutation.mutate(notification.notificationId)}
                          className="px-5 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
                          style={{ fontFamily: 'Pretendard' }}
                        >
                          거절
                        </button>
                      </div>
                    ) : (
                      <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400 text-base" style={{ fontFamily: 'Pretendard' }}>
                  알림이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 신고 확인 모달 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-[#0F1724] mb-3" style={{ fontFamily: 'Pretendard' }}>
              신고가 정상적으로<br />접수되었습니다.
            </h3>
            <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: 'Pretendard' }}>
              운영진이 빠르게 확인하여 조치를 취하도록 하겠습니다.<br />감사합니다.
            </p>
            <button
              onClick={() => {
                if (reportPostId) {
                  reportMutation.mutate({ postId: reportPostId, reason: "신고" });
                }
              }}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"
              style={{ fontFamily: 'Pretendard' }}
            >
              확인하기
            </button>
          </div>
        </div>
      )}

      {/* 일정 등록하기 모달 */}
      {modalTodo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-[580px] max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2
                className="text-xl font-bold text-[#0F1724]"
                style={{ fontFamily: 'Pretendard' }}
              >
                일정 등록하기
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  등록하기
                </button>
              </div>
            </div>

            {/* 모달 내용 */}
            <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* 할일 제목 */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
                <input
                  type="text"
                  defaultValue={modalTodo.title}
                  className="flex-1 bg-transparent text-[#0F1724] font-medium outline-none"
                  style={{ fontFamily: 'Pretendard', fontSize: '15px' }}
                />
              </div>

              {/* 언제든지 드롭다운 */}
              <div className="flex justify-end mb-4">
                <select
                  className="text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 bg-white"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  <option>언제든지</option>
                  <option>오늘</option>
                  <option>내일</option>
                  <option>이번 주</option>
                </select>
              </div>

              {/* 소요 시간 */}
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span
                  className="text-[#0F1724] font-medium"
                  style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                >
                  소요 시간
                </span>
                <div className="flex items-center gap-1.5 text-[#0F1724]">
                  <Clock className="w-4 h-4" />
                  <span style={{ fontFamily: 'Pretendard', fontSize: '14px' }}>
                    {modalTodo.defaultDurationMin}분
                  </span>
                </div>
              </div>

              {/* 하위 작업 */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[#0F1724] font-medium"
                    style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                  >
                    하위 작업
                  </span>
                  <button
                    className="flex items-center gap-1.5 text-gray-500 text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50"
                    style={{ fontFamily: 'Pretendard' }}
                  >
                    하위 항목 제안 받기
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {modalTodo.subTasks.map((subTask, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                    >
                      <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xs">📋</span>
                      </div>
                      <span
                        className="text-[#0F1724] flex-1"
                        style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                      >
                        {subTask}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 새로 추가 버튼 */}
                <button
                  className="w-full mt-3 py-3 bg-blue-50 text-blue-500 rounded-xl text-sm font-medium hover:bg-blue-100 transition"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  새로 추가 +
                </button>
              </div>

              {/* 메모 */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <span
                  className="text-[#0F1724] font-medium block mb-3"
                  style={{ fontFamily: 'Pretendard', fontSize: '14px' }}
                >
                  메모
                </span>
                <p
                  className="text-gray-500 text-sm leading-relaxed"
                  style={{ fontFamily: 'Pretendard' }}
                >
                  {modalTodo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 스크롤바 숨기기 스타일 */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
