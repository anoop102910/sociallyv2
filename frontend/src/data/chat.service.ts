import useSWR from "swr";
import api from "../lib/api";
import fetcher from "@/lib/fether";
import { Message } from "@/types";
import { tst } from "./utils";
import { Conversation } from "@/types";

export const chatService = {
  useConversations: () => {
    const data = useSWR<Conversation[]>(`/conversations`, fetcher);
    return { ...data, conversations: data.data };
  },
  useMessages: (conversationId: number) => {
    const data = useSWR<Message[]>(`/conversations/${conversationId}/messages`, fetcher);
    console.log(data.data);
    return { ...data, messages: data.data };
  },

  postMessage: async (message: { conversationId: number; content: string }) => {
    try {
      const response = await api.post(`/conversations/${message.conversationId}/messages`, {
        content: message.content,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      tst.error("Failed to send message");
    }
  },

  deleteMessage: async (messageId: number) => {
    try {
      await api.delete(`/api/messages/${messageId}`);
    } catch (error) {
      console.log(error);
      tst.error("Failed to delete message");
    }
  },

  updateMessage: async (messageId: number, content: string) => {
    try {
      const response = await api.put(`/api/messages/${messageId}`, { content });
      return response.data;
    } catch (error) {
      console.log(error);
      tst.error("Failed to update message");
    }
  },
};
