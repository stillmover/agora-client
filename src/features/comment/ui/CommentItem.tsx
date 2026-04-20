import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type { Comment } from "@/entities/comment";
import { VoteButton } from "@/features/vote";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { formatRelativeTime, getInitials, logger } from "@/shared/services";
import {
  MAX_COMMENT_DEPTH,
  REPLY_FORM_PLACEHOLDER,
  UI_TEXT,
  COMMENT_FORM_ROWS,
} from "@/shared/constants";
import type { VoteDirection } from "@/shared/constants";
import { MessageSquare } from "lucide-react";
import { formatReplyCount } from "../lib/formatters";

interface CommentItemProps {
  comment: Comment;
  onReply?: (parentId: string, content: string) => void;
  depth?: number;
}

export const CommentItem = ({ comment, onReply, depth = 0 }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleVote = (direction: VoteDirection) => {
    logger.debug(`Voted ${direction} on comment ${comment.id}`);
  };

  const handleReply = (content: string) => {
    if (onReply) {
      onReply(comment.id, content);
      setIsReplying(false);
    }
  };

  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-border pl-4" : ""}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <VoteButton votes={comment.votes} onVote={handleVote} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {getInitials(comment.author.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>
              {onReply && depth < MAX_COMMENT_DEPTH && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  className="h-7 text-xs"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {UI_TEXT.COMMENT.REPLY}
                </Button>
              )}
              {isReplying && (
                <CommentForm
                  onSubmit={handleReply}
                  onCancel={() => setIsReplying(false)}
                  placeholder={REPLY_FORM_PLACEHOLDER}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {comment.replies.length > 0 && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReplies(!showReplies)}
            className="h-7 text-xs mb-2"
          >
            {showReplies ? UI_TEXT.COMMENT.HIDE_REPLIES : UI_TEXT.COMMENT.SHOW_REPLIES}{" "}
            {formatReplyCount(comment.replies.length)}
          </Button>
          {showReplies && (
            <div>
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface CommentFormProps {
  onSubmit: (content: string) => void;
  onCancel?: VoidFunction;
  placeholder?: string;
}

export const CommentForm = ({
  onSubmit,
  onCancel,
  placeholder = UI_TEXT.COMMENT.COMMENT_FORM_PLACEHOLDER,
}: CommentFormProps) => {
  const form = useForm({
    defaultValues: {
      content: "",
    },
    onSubmit: ({ value }) => {
      if (!value.content.trim()) {
        return;
      }
      onSubmit(value.content);
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-2 mt-2"
    >
      <form.Field name="content">
        {(field) => (
          <Textarea
            placeholder={placeholder}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            rows={COMMENT_FORM_ROWS}
            className="resize-none"
          />
        )}
      </form.Field>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          {UI_TEXT.COMMENT.SUBMIT}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
