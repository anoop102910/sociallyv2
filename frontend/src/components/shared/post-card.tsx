import React, { useState } from "react";
import CommentBox from "@/components/shared/comment-box";
import { postService } from "@/data/post.service";
import { Post } from "@/types/index";
import { useAuthContext } from "@/context/authContext";
import { commentService } from "@/data/comment.service";
import Timestamp from "../ui/timestamp";
import UserAvatar from "../ui/user-avatar";
import {
  Ellipsis,
  Trash,
  Edit,
  Heart,
  HeartOff,
  MessageCircle,
  Share2,
  HeartCrack,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import CommentForm from "./comment-form";

interface PostCardProps {
  className?: string;
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ className, post }) => {
  const [commentVal, setCommentVal] = useState("");
  const { user } = useAuthContext();
  const isUserPost = post.author.id === user.id;
  const { posts, mutate } = postService.useGetUserFeed();
  const [toggle, setToggle] = useState(false);

  const menuItems = [
    {
      label: "Delete",
      icon: <Trash className="text-slate-600" />,
      onClick: () => handlePostDelete(),
    },
    {
      label: "Edit",
      icon: <Edit className="text-slate-600" />,
      // onClick: () => handlePostEdit(),
    },
    {
      label: post.isSaved ? "Unsave" : "Save",
      icon: post.isSaved ? (
        <BookmarkCheck className="text-slate-600" />
      ) : (
        <Bookmark className="text-slate-600" />
      ),
      onClick: () => handlePostSave(),
    },
  ];

  const handlePostSave = async () => {
    if (post.isSaved) {
      await postService.unsavePost(post.id);
    } else {
      await postService.savePost(post.id);
    }
    mutate(
      posts?.map(p => (p.id != post.id ? p : { ...p, isSaved: !p.isSaved })),
      { revalidate: false }
    );
  };

  const handlePostDelete = async () => {
    await postService.deletePost(post.id);
    mutate(
      posts?.filter(p => p.id != post.id),
      { revalidate: false }
    );
  };

  const handlePostLike = async () => {
    await postService.likePost(post.id);
    mutate(
      posts?.map(p => (p.id != post.id ? p : { ...p, isLiked: true, likes: p.likes++ })),
      { revalidate: false }
    );
    mutate();
  };

  const handlePostUnlike = () => {
    postService.likePost(post.id);
    mutate();
    mutate(
      posts?.map(p => (p.id != post.id ? p : { ...p, isLiked: false, likes: p.likes - 1 })),
      { revalidate: false }
    );
  };

  return (
    <div
      className={`bg-white py-4 md:p-4 md:rounded-md text-gray-700 shadow-md test:bg-dark-200 test:text-white ${className}`}
    >
      {/* Post Header */}
      <div className="flex justify-between px-2">
        <div className="flex items-center">
          <UserAvatar name={post.author.name} src={post.author.imageUrl} />
          <div className="flex flex-col ml-3 justify-between gap-y-1">
            <span className="text-sm">{post.author.name}</span>
            <Timestamp date={post.createdAt} className="text-xs text-gray-500 test:text-white" />
          </div>
        </div>
        {isUserPost && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis className="cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 bg-white ring-1 ring-slate-300 rounded-md text-gray-900">
              {menuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.onClick}
                  className="flex items-center gap-x-3 p-2 hover:bg-slate-200 rounded-md transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Post content */}
      <div className="mt-8 test:text-slate-300 text-gray-700 text-[0.89rem]">
        {post.content && <p className="px-2">{post.content}</p>}
        {post.mediaUrl && (
          <img
            src={post.mediaUrl}
            className="w-full object-contain object-center mt-4 md:rounded-lg lazyload"
            alt=""
            loading="lazy"
          />
        )}

        {/* Post footer */}
        <div className="mt-4 flex justify-between items-center px-2">
          <div className="flex gap-x-6">
            <div className="flex">
              {post.isLiked ? (
                <Heart
                  fill="red"
                  onClick={handlePostUnlike}
                  className="text-red-500 cursor-pointer transition-all active:scale-150"
                />
              ) : (
                <Heart
                  onClick={handlePostLike}
                  className="text-red-500 cursor-pointer transition-all active:scale-150"
                />
              )}
              <span className="test:text-white ml-1">{post.likes} Likes</span>
            </div>
            <div
              onClick={() => {
                if (post.comments != 0) setToggle(prev => !prev);
              }}
              className="cursor-pointer hover:underline"
            >
              <MessageCircle className="inline-block" />
              <span className="test:text-white ml-1">{post.comments} Comments</span>
            </div>
          </div>
          <div>
            <Share2 className="inline-block" />
            <span className="test:text-white ml-2">Share</span>
          </div>
        </div>

        {/* Comment form */}
        <CommentForm post={post} />

        {/* Comment Lists */}
        {toggle && <CommentBox postId={post.id} />}
      </div>
    </div>
  );
};

export default PostCard;
