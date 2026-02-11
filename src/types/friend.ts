export interface Friend {
  friendRecordId: number;
  memberId: number;
  nickname: string;
  profileImageUrl?: string;
  sharingCalendar: boolean;
}

export interface FriendsResponse {
  friends: Friend[];
}

export interface FriendSearchResult {
  memberId: number;
  nickname: string;
  profileImageUrl?: string;
  friendStatus: 'FRIEND' | 'PENDING' | 'NONE';
}

export interface FriendSearchResponse {
  friends: FriendSearchResult[];
  friendCount: number;
}
