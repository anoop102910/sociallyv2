import api from "../lib/api";

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
