export interface User {
  id: number;
  name: string;
  image?: string;
  isFollowed?: boolean;
  followers?: number;
  followee?: number;
}

export interface Post {
  id: number;
  content: string;
  mediaUrl?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  author: { id: number; name: string; imageUrl?: string };
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  content: string;
  authorId: number;
  author: { id: number; name: string; imageUrl: string };
  createdAt: string;
  updatedAt: string;
}
export interface CreatePost {
  content: string;
  mediaFile?: File | null;
}
