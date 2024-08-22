import React, { useState } from "react";
import UserAvatar from "../ui/user-avatar";

interface CommentFormProps {
  onComment: (comment: string) => void;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ onComment, placeholder = "Write some content to post" }) => {
  const [commentVal, setCommentVal] = useState("");

  const handleComment = () => {
    onComment(commentVal);
    setCommentVal("");
  };

  return (
    <div className="flex gap-x-3 mt-4 items-center px-2">
     <UserAvatar name="Anoop Singh"/>
      <input
        value={commentVal}
        onChange={e => setCommentVal(e.target.value)}
        className="input-primary"
        placeholder={placeholder}
        type="text"
      />
      {commentVal.length !== 0 && (
        <button
          onClick={handleComment}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 focus-within:bg-blue-800 text-white rounded-full text-sm"
        >
          Post
        </button>
      )}
    </div>
  );
};

export default CommentForm;
