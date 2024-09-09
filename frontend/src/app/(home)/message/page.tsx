"use client";
import ConvList from "./ConvList";
import ChatArea from "./ChatArea";
import { useState } from "react";
import { User } from "@/types/index";
const sampleUsers = [
  { id: 1, name: "Alice", image: "https://via.placeholder.com/40" },
  { id: 2, name: "Bob", image: "https://via.placeholder.com/40" },
  { id: 3, name: "Charlie", image: "https://via.placeholder.com/40" },
  { id: 4, name: "Alice", image: "https://via.placeholder.com/40" },
  { id: 5, name: "Bob", image: "https://via.placeholder.com/40" },
];

const MessagePage = () => {
  const [query, setQuery] = useState<string>("");
  const [queriedUsers, setQueriedUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  return (
    <div className="flex justify-between gap-4">
      <ConvList
        query={query}
        setQuery={setQuery}
        users={users}
        setUsers={setUsers}
        queriedUsers={queriedUsers}
        setQueriedUsers={setQueriedUsers}
      />
      <ChatArea />
    </div>
  );
};

export default MessagePage;
