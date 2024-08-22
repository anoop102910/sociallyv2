import useSWR from "swr";
import api from "../lib/api";
import fetcher from "@/lib/fether";

export const conService = {
  followConnection: async (userId: number) => {
    try {
      await api.post(`/followers/follow/${userId}`);
    } catch (error) {
      console.error("Error following connection:", error);
      throw error;
    }
  },

  unfollowConnection: async (userId: number) => {
    try {
      await api.post(`/followers/unfollow/${userId}`);
    } catch (error) {
      console.error("Error unfollowing connection:", error);
      throw error;
    }
  },
};
