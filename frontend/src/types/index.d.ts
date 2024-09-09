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
  isSaved: boolean;
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

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
  sentAt?: string | null;
}

export interface Conversation {
  id: number;
  user1Id: number;
  user2Id: number;
  user1Name: string;
  user2Name: string;
}

