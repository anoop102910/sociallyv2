"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/ui/user-avatar";
import { User } from "@/types/index";
import { chatService } from "@/data/chat.service";
import { userService } from "@/data/user.service";
interface ConvListProps {
  query: string;
  setQuery: (query: string) => void;
  queriedUsers: User[];
  setQueriedUsers: (users: User[]) => void;
}
const ConvList = ({ query, setQuery, queriedUsers, setQueriedUsers }: ConvListProps) => {
  const { conversations, isLoading: isLoadingConversations } = chatService.useConversations();
  const { users, isLoading, isValidating } = userService.useAllUsers({ query });
  if (isLoading || isValidating || isLoadingConversations) return <div>Loading...</div>;

  const handleSearch = (query: string) => {
    setQuery(query);
  };

  const addUser = (user: User) => {
    conversations!.push({
      id: conversations!.length + 1,
      user1Id: user.id,
      user2Id: user.id,
      user1Name: user.name,
      user2Name: user.name,
    });
  };

  return (
    <div className="p-4 w-1/4 h-[87vh] rounded-lg bg-slate-50">
      <Input
        type="text"
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search users..."
        className="mb-4"
      />
      <div>
        <ul className="overflow-y-auto h-[70vh]">
          {queriedUsers.length > 0 ? (
            queriedUsers.map(user => (
              <li key={user.id} onClick={() => addUser(user)}>
                <UserAvatar username={user.username} />
                <span>{user.name}</span>
              </li>
            ))
          ) : (
            <li>No users found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ConvList;
