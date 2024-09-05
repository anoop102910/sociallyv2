import useSWR from "swr";
import { CreatePost,Post } from "@/types";
import fetcher from "@/lib/fether";
import api from "@/lib/api";
import { tst } from "./utils";


export const postService = {
  useGetMyPosts: () => {
    const { data, ...rest } = useSWR<Post[]>("/my-posts", fetcher);
    return { ...rest, posts: data };
  },

  useGetUserFeed: () => {
    const { data, ...rest } = useSWR<Post[]>("/my-feed", fetcher);
    return { ...rest, posts: data };
  },

  useUserPosts : (userId: number) => {
    const { data, ...rest } = useSWR<Post[]>(`/users/${userId}/posts`, fetcher);
    return { ...rest, posts: data };
  },

  useSavedPosts: () => {
    const { data, ...rest } = useSWR<Post[]>("/saved-posts", fetcher);
    return { ...rest, posts: data };
  },

  createPost: async (postData: CreatePost) => {
    try {
      const response = await api.post("/posts", postData,{headers: {
        'Content-Type': 'multipart/form-data'
      }});
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
      tst.error("Error liking post");
      console.error("Error liking post:", error);
      throw error;
    }
  },

  unLikePost: async (id: number) => {
    try {
      const response = await api.post(`/posts/${id}/unlike`);
      return response.data;
    } catch (error) {
      tst.error("Error unliking post");
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

  savePost: async (postId: number) => {
    try {
      const response = await api.post(`/posts/${postId}/save`);
      tst.success("Post saved");
      return response.data;
    } catch (error) {
      tst.error("Error saving post");
      console.error("Error saving post:", error);
      throw error;
    }
  },

  unsavePost: async (postId: number) => {
    try {
      const response = await api.delete(`/posts/${postId}/unsave`);
      return response.data;
    } catch (error) {
      console.error("Error unsaving post:", error);
      throw error;
    }
  },
};
