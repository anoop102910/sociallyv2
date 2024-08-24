"use client";
import PostForm from "@/components/shared/post-form";
import { postService } from "@/data/post.service";
import Error from "@/components/ui/error";
import PostCard from "@/components/shared/post-card";
import PostLoader from "@/components/shared/post-skeleton";
import Image from "next/image";
import api from "@/lib/api";
import { useEffect } from "react";

function Post() {
  const { posts, isLoading, error } = postService.useGetUserFeed();

  const postCount = posts?.length ?? 0;

  if (isLoading) return <Loader />;
  if (error) return <Error />;

  return (
    <>
      <div className="max-w-[550px] ">
        <PostForm className={"mb-4"} />
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div>
              {posts?.map(post => (
                <PostCard key={post.id} post={post} className={"mb-4"} />
              ))}
            </div>
            {postCount > 8 && (
              <div className="w-full bg-trasnsparent flex justify-center items-center text-black h-[20vh] mb-10">
                <Image width={50} height={50} src="spinner.svg" alt="" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Loader() {
  return (
    <div className="max-w-[550px] text-black">
      <PostLoader />
      <PostLoader />
      <PostLoader />
    </div>
  );
}
export default Post;
