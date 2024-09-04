"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/ui/user-avatar";
import { User } from "@/types/index";

const sampleUsers = [
  { id: 1, name: "Alice", image: "https://via.placeholder.com/40" },
  { id: 2, name: "Bob", image: "https://via.placeholder.com/40" },
  { id: 3, name: "Charlie", image: "https://via.placeholder.com/40" },
  { id: 4, name: "Alice", image: "https://via.placeholder.com/40" },
  { id: 5, name: "Bob", image: "https://via.placeholder.com/40" },
//   { id: 6, name: "Charlie", image: "https://via.placeholder.com/40" },
//   { id: 7, name: "Alice", image: "https://via.placeholder.com/40" },
//   { id: 8, name: "Bob", image: "https://via.placeholder.com/40" },
//   { id: 9, name: "Charlie", image: "https://via.placeholder.com/40" },
//   { id: 10, name: "Alice", image: "https://via.placeholder.com/40" },
//   { id: 11, name: "Bob", image: "https://via.placeholder.com/40" },
//   { id: 12, name: "Charlie", image: "https://via.placeholder.com/40" },
//   { id: 13, name: "Alice", image: "https://via.placeholder.com/40" },
//   { id: 14, name: "Bob", image: "https://via.placeholder.com/40" },
//   { id: 15, name: "Charlie", image: "https://via.placeholder.com/40" },
//   { id: 16, name: "Alice", image: "https://via.placeholder.com/40" },
//   { id: 17, name: "Bob", image: "https://via.placeholder.com/40" },
//   { id: 18, name: "Charlie", image: "https://via.placeholder.com/40" },
//   { id: 19, name: "Alice", image: "https://via.placeholder.com/40" },
//   { id: 20, name: "Bob", image: "https://via.placeholder.com/40" },
//   { id: 21, name: "Charlie", image: "https://via.placeholder.com/40" },
];

const ConvList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(sampleUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredUsers = sampleUsers.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setUsers(filteredUsers);
  };

  const addUser = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="p-4 w-1/4 h-[87vh] rounded-lg bg-slate-50">
      <Input
        type="text"
        value={searchQuery}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Search users..."
        className="mb-4"
      />
      <div>
        <ul className="overflow-y-auto h-[70vh]">
          {users.map(user => (
            <li key={user.id} className="flex items-center cursor-pointer p-2 hover:bg-gray-100">
              <UserAvatar name={user.name} src={user.image} />
              <span className="ml-2">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConvList;
