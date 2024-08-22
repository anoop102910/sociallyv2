"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { conService } from "@/data/connection.service";
import { User } from "@/types/index";
import UserAvatar from "@/components/ui/user-avatar";
import { useSWRConfig } from "swr";
import { Button } from "../ui/button";

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { mutate } = useSWRConfig();
  const [isPending, setIsPending] = useState<boolean>(false);
  const handleFollow = async () => {
    try {
      await conService.followConnection(user.id);
      mutate("/users");
      toast.success("User followed successfully");
    } catch (error) {
      setIsPending(false);
      console.log(error);
    }
  };

  const handleUnFollow = async () => {
    try {
      await conService.unfollowConnection(user.id);
      mutate("/users");
      toast.success("User unfollowed successfully");
    } catch (error) {
      setIsPending(false);
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center">
          <UserAvatar src={user.image} name={user.name} />
          <span className="text-gray-600 test:text-slate-200 ml-6">{`${user.name}`}</span>
        </div>
      </Link>

      <Button
        onClick={user.isFollowed ? handleUnFollow : handleFollow}
        className={`text-[0.775rem] px-4 py-2 rounded-md ${
          user.isFollowed ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {user.isFollowed ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};

export default UserCard;
