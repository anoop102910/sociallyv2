"use client";
import React from "react";
import { Message } from "@/types/index";

interface MessageProps {
  msg: Message;
}

const MessageCard: React.FC<MessageProps> = ({ msg }) => {
  const isSender = msg.senderId === 1;
  return (
    <div
      className={`flex items-start mb-2 p-4 rounded-lg w-80 clear-both  relative ${
        isSender ? "bg-red-600 text-white float-right" : "bg-blue-400 text-white float-left"
      }`}
    >
      <div className="flex flex-col">
        <span className="text-sm ">{msg.content}</span>
        <div className="absolute bottom-1 right-1 flex items-center gap-x-2">
          <span className="text-xs ">{msg.createdAt}</span>
          <MessageStatus status={msg.status} />
        </div>
      </div>
    </div>
  );
};

const MessageStatus = ({ status }: { status: Message["status"] }) => {
  const statusColor = {
    pending: "bg-yellow-500",
    sent: "bg-blue-500",
    delivered: "bg-green-500",
    read: "bg-purple-500",
  };
  return (
    <span className={`text-xs `}>{status}</span>
  );
};

export default MessageCard;
