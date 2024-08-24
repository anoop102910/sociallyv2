import useSWR from "swr";
import api from "../lib/api";
import fetcher from "@/lib/fether";
import { Comment } from "@/types";
import { toast } from "react-toastify";

export const commentService = {
  useComments: (postId: number) => {
    const data = useSWR<Comment[]>(`/posts/${postId}/comments`, fetcher);
    console.log(data.data);
    return { ...data, comments: data.data };
  },

  addComment: async (comment: { postId: number; content: string }) => {
    try {
      const response = await api.post(`/posts/${comment.postId}/comments`, {
        content: comment.content,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to comment post");
    }
  },

  deleteComment: async (commentId: number) => {
    try {
      await api.delete(`/api/comments/${commentId}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to comment post");
    }
  },

  editComment: async (commentId: number, content: string) => {
    try {
      const response = await api.put(`/api/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error("Failed to comment post");
    }
  },
};
