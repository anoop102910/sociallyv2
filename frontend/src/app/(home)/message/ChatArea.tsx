"use client";
import React, { useState } from "react";
import SendMessage from "./SendMessage";
import { Message } from "@/types/index";
import MessageCard from "./MessageCard";

const ChatArea: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 1,
      receiverId: 2,
      status: "sent",
      content: "Hello Bob!",
      createdAt: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      senderId: 2,
      receiverId: 1,
      status: "sent",
      content: "Hi Alice! How are you?",
      createdAt: new Date().toLocaleTimeString(),
    },
  ]);

  const handleSendMessage = (messageContent: string) => {
    const newMessage: Message = {
      id: messages.length + 1, 
      senderId: 1, 
      receiverId: 2, 
      status: "sent", 
      content: messageContent,
      createdAt: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="border rounded-lg p-4 h-[90vh] flex flex-col w-3/4">
      <div className="overflow-y-auto flex-grow ">
        {messages.map((msg, index) => (
          <MessageCard key={index} msg={msg} />
        ))}
      </div>
      <SendMessage onSend={handleSendMessage} />
    </div>
  );
};

export default ChatArea;
