import { commentService } from "@/data/comment.service";
import { Loader } from "lucide-react";
import Error from "@/components/ui/error";
import { Comment } from "@/types";
import { useAuthContext } from "@/context/authContext";
import UserAvatar from "../ui/user-avatar";
import Timestamp from "../ui/timestamp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentBoxProps {
  postId: number;
}

const CommentBox: React.FC<CommentBoxProps> = ({ postId }) => {
  const { comments, isLoading, error } = commentService.useComments(postId);

  if (isLoading) return <Loader />;
  if (error) return <Error />;

  return (
    <div>
      {comments &&
        comments?.map(comment => {
          return <CommentCard key={comment.id} comment={comment} />;
        })}
    </div>
  );
};

interface CommentProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentProps> = ({ comment }) => {
  const { user } = useAuthContext();
  const isUserPost = comment.authorId === user.id;
  const menuItems = [
    {
      icon: <i className="fas fa-trash text-slate-600"></i>,
      label: "Delete",
      onClick: () => console.log("Delete clicked"),
    },
    {
      icon: <i className="fas fa-edit text-slate-600"></i>,
      label: "Edit",
      onClick: () => console.log("Edit clicked"),
    },
  ];
  const handleDeleteComment = () => {
    commentService.deleteComment(comment.id);
  };

  return (
    <div key={comment.id} className="flex w-[26rem] flex-col items-start px-2 py-5 animate-scale">
      <div></div>
      <div className="flex gap-3">
        <UserAvatar src={comment.author.imageUrl} name={comment.author.name} />
        <div
          id="comment-box"
          className="ml-0 max-w-full rounded-b-md rounded-r-md bg-slate-200 px-3 py-2 hover:bg-slate-300 transition-all  hover:ring-1 hover:ring-slate-400 "
        >
          <span id="username" className="text-sm font-bold">
            {comment.author.name}
          </span>
          <span id="comment-text" className="ml-3 text-xs text-slate-500">
            <Timestamp date={comment.createdAt} />
          </span>
          <p className="mt-1 text-sm text-slate-600">{comment.content}</p>
        </div>
        {isUserPost && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <i className="fas fa-ellipsis-h cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 bg-white ring-1 ring-slate-300 rounded-md text-gray-900 absolute top-5 -left-1">
              {menuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    item.onClick();
                  }}
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
    </div>
  );
};

export default CommentBox;
