import useSWR from "swr";
import { CreatePost,Post } from "@/types";
import fetcher from "@/lib/fether";
import { toast } from "react-toastify";
import api from "@/lib/api";


export const postService = {
  useGetMyPosts: () => {
    const { data, isLoading, error, mutate } = useSWR<Post[]>("/my-posts", fetcher);
    console.log(data);
    return { posts: data, isLoading, error, mutate };
  },

  useGetUserFeed: () => {
    const { data, isLoading, error, mutate } = useSWR<Post[]>("/my-feed", fetcher);
    // console.log(data);
    return { posts: data, isLoading, error, mutate };
  },

  useGetComments: (postId: number) => {
    const { data, error, mutate } = useSWR(postId ? `/posts/${postId}/comments` : null, fetcher);
    return { data, error, mutate };
  },

  createPost: async (postData: CreatePost) => {
    try {
      const response = await api.post("/posts", postData);
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  likePost: async (postId: number) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      toast.error("Error liking post");
      console.error("Error liking post:", error);
      throw error;
    }
  },

  unLikePost: async (id: number) => {
    try {
      const response = await api.post(`/posts/${id}/unlike`);
      return response.data;
    } catch (error) {
      toast.error("Error unliking post");
      console.error("Error unliking post:", error);
      throw error;
    }
  },

  updatePost: async (id: number, postData: { title: string; content: string }) => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  deletePost: async (id: number) => {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },
};
