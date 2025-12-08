import { CommentItem, CommentForm } from "@/features/comment";
import { useCreateComment } from "@/features/create-comment";
import { useSessionUser } from "@/entities/session";
import { Card, CardContent } from "@/shared/ui/card";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { getInitials, formatCommentCount } from "@/shared/services";
import { UI_TEXT } from "@/shared/constants";
import type { Comment } from "@/entities/comment";

interface CommentSectionWidgetProps {
  postId: string;
  comments: Comment[];
}

export const CommentSectionWidget = ({
  postId,
  comments,
}: CommentSectionWidgetProps) => {
  const user = useSessionUser();
  const { createComment, isPending, error } = useCreateComment(postId);

  const handleCommentSubmit = async (content: string, parentId?: string) => {
    try {
      await createComment(content, parentId);
    } catch {}
  };

  return (
    <div className="space-y-4">
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{user.username}</div>
            </div>
            <CommentForm onSubmit={handleCommentSubmit} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {formatCommentCount(comments.length)}
        </h2>
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {UI_TEXT.COMMENT.NO_COMMENTS}
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(parentId, content) =>
                handleCommentSubmit(content, parentId)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};
