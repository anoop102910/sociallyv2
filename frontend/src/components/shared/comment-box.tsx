import { commentService } from "@/data/comment.service";
import { Loader } from "lucide-react";
import Error from "@/components/ui/error";
import CommentCard from "./comment-card";

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
        comments.map(comment => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
    </div>
  );
};

export default CommentBox;