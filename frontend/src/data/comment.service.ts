import useSWR from "swr";
import api from "../lib/api";
import fetcher from "@/lib/fether";
import { Comment } from "@/types";

export const commentService = {
  useComments: (postId: number) => {
    const data = useSWR<Comment[]>(`/api/posts/${postId}/comments`, fetcher);
    return { ...data, comments: data.data };
  },

  addComment: async (comment: { postId: number; text: string }) => {
    const response = await api.post(`/comments`, {
      text: comment.text,
    });
    return response.data;
  },

  deleteComment: async (commentId: number) => {
    await api.delete(`/api/comments/${commentId}`);
  },

  editComment: async (commentId: number, content: string) => {
    const response = await api.put(`/api/comments/${commentId}`, { content });
    return response.data;
  },
};
