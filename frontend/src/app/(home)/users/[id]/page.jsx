"use client";
import { useAuthContext } from "@/context/authContext";
import { postService } from "@/data/post.service";
import { userService } from "@/data/user.service";
import React, { useEffect, useState } from "react";
import UserAvatar from "@/components/ui/user-avatar";
import { useParams } from "next/navigation";
import ImageUploader from "@/components/shared/upload-image";
import UserSkeleton from "@/components/shared/user-skeleton";
import { DialogBox } from "@/components/ui/dialog";
import PostCard from "@/components/shared/post-card";
import { Image as ImageIcon, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { user: currUser } = useAuthContext();
  const { id } = useParams();
  const userId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
  const isAuthUser = currUser.id === userId;
  const bgOptions = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink"];
  const [bg, setBg] = useState(bgOptions[0]);
  const [upload, setUpload] = useState(false);
  const [hidden, setHidden] = useState(true);
  const { user, isLoading, error } = userService.useUser(userId);
  const { posts, isLoading: postIsLoading } = postService.useGetMyPosts();

  const toggleUpload = () => setUpload(!upload);
  const toggle = () => setHidden(!hidden);
  const handleFollow = () => {
    // Implement follow/unfollow logic
  };

  useEffect(() => {
    setBg(bgOptions[Math.floor(Math.random() * bgOptions.length)]);
  }, []);
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

  return (
    <>
      <div>
        <div>
          {isAuthUser && upload && <ImageUploader onClose={toggleUpload} />}
          {isAuthUser && (
            <DialogBox>
              <ImageUploader onClose={toggleUpload} />
            </DialogBox>
          )}
          <div id="user-user" className="mr-10 mb-20 relative appear-animation">
            <div
              className={`w-full h-[45vh]  bg-green-4000 rounded-md flex items-center justify-center text-3xl font-bold`}
            >
              {isAuthUser && "Upload Image"}
            </div>
            <div className="absolute top-56 left-3">
              {isAuthUser && (
                <>
                  <CloudUpload
                    onClick={toggle}
                    className="text-white text-2xl cursor-pointer absolute bottom-1 right-4"
                  />
                  <div
                    className={`dropdown px-3 py-2 bg-white space-y-4 rounded-md text-sm text-center absolute -bottom-3 -right-28 ${
                      !hidden && "hidden"
                    }`}
                  >
                    <div onClick={toggleUpload} className="flex w-max items-center cursor-pointer">
                      <ImageIcon className="text-gray-600 mr-3" />
                      <button className="text-sm text-gray-600">Upload Image</button>
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-4 items-center">
                <UserAvatar src={user?.image} name={user?.name} />
                <span className=" text-sm">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
        {!isAuthUser && user && (
          <div className="flex items-center justify-center gap-10 -mt-16">
            <Button onClick={handleFollow}>{user.isFollowed ? "Unfollow" : "Follow"}</Button>
            <div className="text-black">
              Followers: <span className="text-xl text-violet-500">{user.followers}</span>
            </div>
            <div className="text-black">
              Following: <span className="text-xl text-violet-500">{user.followee}</span>
            </div>
          </div>
        )}
        <div className="space-y-3 mt-16">
          {posts &&
            posts.length > 0 &&
            posts.map(post => <PostCard className="max-w-[33rem]" key={post.id} post={post} />)}
        </div>
      </div>
    </>
  );
}
