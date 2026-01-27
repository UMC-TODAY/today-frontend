export interface PostAuthor {
  id: number;
  nickname: string;
  profileImage?: string;
}

export interface Post {
  postId: number;
  author: PostAuthor;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface PostsResponse {
  posts: Post[];
  hasNext: boolean;
  nextCursor?: number;
}
