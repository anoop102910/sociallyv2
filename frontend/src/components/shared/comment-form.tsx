"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import UserAvatar from "../ui/user-avatar";
import { Post } from "@/types";
import { commentService } from "@/data/comment.service";
import CommentBox from "./comment-box";
import { postService } from "@/data/post.service";

interface CommentFormProps {
  post: Post;
}

const CommentForm: React.FC<CommentFormProps> = ({ post }) => {
  const [commentVal, setCommentVal] = useState("");
  const { posts, mutate } = postService.useGetUserFeed();

  const handleComment = async () => {
    if (commentVal.trim()) {
      await commentService.addComment({ postId: post.id, content: commentVal });
      if (posts)
        mutate(posts.map(p => (p.id === post.id ? { ...p, comments: p.comments++ } : p)));
      setCommentVal("");
    }
  };

  return (
    <div>
      <div className="flex gap-x-3 mt-4 items-center px-2">
        <UserAvatar name={post.author.name} src={post.author.imageUrl} />
        <Input
          value={commentVal}
          onChange={e => setCommentVal(e.target.value)}
          className="input-primary"
          placeholder="Write some content to post"
          type="text"
        />
        {commentVal.length > 0 && <Button onClick={handleComment}>Post</Button>}
      </div>
    </div>
  );
};

export default CommentForm;
