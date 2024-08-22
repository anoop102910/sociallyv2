import { useAuthContext } from "@/context/authContext";
import { postService } from "@/data/post.service";
import { userService } from "@/data/user.service";
import React, { useState } from "react";
import UserAvatar from "@/components/ui/user-avatar";
import { useParams } from "next/navigation";
import ImageUploader from "@/components/shared/upload-image";
import UserSkeleton from "@/components/shared/user-skeleton";
import { DialogBox } from "@/components/ui/dialog";
import PostCard from "@/components/shared/post-card";

export default function Page() {
  const { posts, isLoading: postIsLoading } = postService.useGetMyPosts();
  const { user: currUser } = useAuthContext();
  const { id } = useParams();
  const userId = Array.isArray(id) ? parseInt(id[0], 10) : parseInt(id, 10);
  const isAuthUser = currUser.id === userId;
  const bgOptions = ["red", "orange", "yellow", "green", "blue", "indigo", "purple", "pink"];
  const [bg, setBg] = useState(bgOptions[0]);
  const [upload, setUpload] = useState(false);
  const [hidden, setHidden] = useState(true);
  const { user, isLoading, error } = userService.useUser(userId);

  const toggleUpload = () => setUpload(!upload);
  const toggle = () => setHidden(!hidden);
  const handleFollow = () => {
  };

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
          {isAuthUser && upload && <ImageUploader onClose={toggleUpload}/>}
          {isAuthUser && (
            <DialogBox>
              <ImageUploader onClose={toggleUpload} />
            </DialogBox>
          )}
          <div id="user-user" className="mr-10 mb-20 relative appear-animation">
            <div
              className={`w-full h-[45vh] bg-${bg}-600 rounded-md flex items-center justify-center text-3xl font-bold`}
            >
              {isAuthUser && "Upload Image"}
            </div>
            <div className="absolute top-56 left-3">
              {isAuthUser && (
                <>
                  <i
                    onClick={toggle}
                    className="fas fa-cloud-upload-alt text-white text-2xl cursor-pointer absolute bottom-1 right-4"
                  ></i>
                  <div
                    className={`dropdown px-3 py-2 bg-white space-y-4 rounded-md tex-sm text-center absolute -bottom-3 -right-28 ${!hidden && "hidden"}`}
                  >
                    <div onClick={toggleUpload} className="flex w-max">
                      <i className="fas fa-upload text-gray-600 mr-3"></i>
                      <button className="text-sm text-gray-600 animate-scale">Upload Image</button>
                    </div>
                  </div>
                </>
              )}
              {isAuthUser ? (
                <div>User</div>
              ) : (
                <UserAvatar
                  src={user.image}
                  name={`${user.firstName} ${user.lastName}`}
                />
              )}
            </div>
          </div>
        </div>
        {!isAuthUser && user && (
          <div className="flex items-center justify-center gap-10 -mt-16">
            <button
              onClick={user.isFollowed ? () => handleFollow() : handleFollow}
              className="px-4 py-2 rounded-md bg-green-500"
            >
              {user.isFollowed ? "Unfollow" : "Follow"}
            </button>
            <div className="text-black">
              Followers: <span className="text-xl text-violet-500"> {user.followersCount}</span>
            </div>
            <div className="text-black">
              Following: <span className="text-xl text-violet-500"> {user.followingCount}</span>
            </div>
          </div>
        )}
        <div className="space-y-3 mt-16">
          {posts && posts.length > 0 && posts.map((post) => (
            <PostCard className={"max-w-[33rem]"} key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
