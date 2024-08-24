import useSWR from "swr";
import api from "../lib/api";
import { User } from "@/types";
import fetcher from "@/lib/fether";
import useSWRMutation from "swr/mutation";

export const userService = {
  // Get all users
  useAllUsers: ({ query = "" }: { query?: string } = {}) => {
    const data = useSWR<User[]>("/users", fetcher);
    return { ...data, users: data.data };
  },

  useSearchUsers: (query:string = "" ) => {
    const data = useSWR<User[]>(query.length > 2 ? `/users?query=${encodeURIComponent(query)}` : null, fetcher);
    return { ...data, users: data.data };
  },

  // Get a single user by ID
  useUser: (id: number) => {
    const { data, ...rest } = useSWR<User>(id ? `/users/${id}` : null, fetcher);
    return { user: data, ...rest };
  },

  // Get profile data
  useProfile: ({ search }: { search: string }) => {
    const { data, error, mutate } = useSWR(`/api/profile?${encodeURIComponent(search)}`, fetcher);
    return { profile: data, error, mutate };
  },

  // Create a new user
  createUser: async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await api.post("/api/users", userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update an existing user
  updateUser: async (
    id: number, // or string, based on your API
    userData: { name?: string; email?: string; password?: string }
  ) => {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (id: number) => {
    // or string, based on your API
    try {
      await api.delete(`/api/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
