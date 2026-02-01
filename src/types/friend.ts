export interface Friend {
  friendId: number;
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  isSharingSchedule: boolean;
}

export interface FriendsResponse {
  friends: Friend[];
}

export interface FriendSearchResult {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  friendStatus: 'FRIEND' | 'PENDING' | 'NONE';
}

export interface FriendSearchResponse {
  users: FriendSearchResult[];
}
