export interface CommentAuthor {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
}

export interface Comment {
  commentId: number;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked?: boolean;
}

export interface CommentsResponse {
  comments: Comment[];
  commentCount: number;
}
