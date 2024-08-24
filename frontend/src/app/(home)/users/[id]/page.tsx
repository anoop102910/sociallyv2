"use client";
import { useAuthContext } from "@/context/authContext";
import { postService } from "@/data/post.service";
import { userService } from "@/data/user.service";
import React from "react";
import UserAvatar from "@/components/ui/user-avatar";
import { useParams } from "next/navigation";
import ImageUploader from "@/components/shared/upload-image";
import UserSkeleton from "@/components/shared/user-skeleton";
import PostCard from "@/components/shared/post-card";
import { Button } from "@/components/ui/button";
import { conService } from "@/data/connection.service";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function Page() {
  const { user: currUser } = useAuthContext();
  const { id } = useParams();
  const userId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
  const isAuthUser = currUser.id === userId;
  const { user, isLoading, error } = userService.useUser(userId);

  if (isLoading) {
    return (
      <div className="text-black text-3xl">
        <UserSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-3xl">{error}</div>;
  }
  if (!user) return;

  const handleFollow = () => {
    user.isFollowed ? conService.followConnection(user.id) : conService.unfollowConnection(user.id);
  };

  return (
    <>
      <div>
        <div>
          {/* Profile Header */}
          <div id="user-user" className="mr-10 mb-20 relative appear-animation">
            <div
              className={`w-full h-[45vh]  bg-green-400 rounded-md flex items-center justify-center text-3xl font-bold`}
            >
              {isAuthUser && "Upload Image"}
            </div>
            <div className="absolute top-56 left-3">
              {isAuthUser && <></>}
              <div className="flex gap-4 items-center">
                <Dialog>
                  <DialogTrigger>
                    <UserAvatar src={user?.image} name={user?.name} />
                    {/* <CloudUpload className="text-white text-2xl cursor-pointer absolute bottom-1 right-4" /> */}
                  </DialogTrigger>
                  <DialogContent>
                    <ImageUploader />
                  </DialogContent>
                </Dialog>
                <span className=" text-sm">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Interactions */}
          <div className="flex items-center justify-center gap-10 -mt-16">
            {!isAuthUser && (
              <Button onClick={handleFollow}>{user.isFollowed ? "Unfollow" : "Follow"}</Button>
            )}
            <div className="text-black">
              Followers: <span className="text-xl text-violet-500">{user.followers}</span>
            </div>
            <div className="text-black">
              Following: <span className="text-xl text-violet-500">{user.followee}</span>
            </div>
          </div>

        {/* Users Posts */}
        <UserPosts userId={user.id} />
      </div>
    </>
  );
}
const UserPosts = ({ userId }: { userId: number }) => {
  const { posts, isLoading, error } = postService.useUserPosts(userId);
  if (isLoading) return <div>Loading...</div>;
  if (error || !posts) return <div>{"Something went wrong"}</div>;

  return (
    <>
      <div className="space-y-3 mt-8">
        {posts.map(post => (
          <PostCard className="max-w-[33rem]" key={post.id} post={post} />
        ))}
      </div>
    </>
  );
};
