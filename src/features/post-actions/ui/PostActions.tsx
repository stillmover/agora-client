import { Link } from "@tanstack/react-router";
import { MessageSquare, Share, Bookmark, Award } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { formatCommentCount } from "@/shared/services";
import { logger } from "@/shared/services/logger";
import { usePostActions } from "../model/usePostActions";
import type { Post } from "@/entities/post";

type PostActionsProps = {
  post: Post;
};

export const PostActions = ({ post }: PostActionsProps) => {
  const { save, share, isSaved, saveLabel } = usePostActions(post.id);

  const handleAward = () => {
    // TODO: Implement award functionality
    logger.debug("Award post:", post.id);
  };

  return (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <Link
        to="/post/$postId"
        params={{ postId: post.id }}
        className="flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <MessageSquare className="h-4 w-4" />
        <span>{formatCommentCount(post.comments)}</span>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={share}
        className="h-auto p-0 text-muted-foreground hover:text-foreground"
      >
        <Share className="h-4 w-4 mr-1" />
        <span>Share</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={save}
        className={cn(
          "h-auto p-0 text-muted-foreground hover:text-foreground",
          isSaved && "text-orange-500",
        )}
      >
        <Bookmark className="h-4 w-4 mr-1" />
        <span>{saveLabel}</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleAward}
        className="h-auto p-0 text-muted-foreground hover:text-foreground"
      >
        <Award className="h-4 w-4 mr-1" />
        <span>Award</span>
      </Button>
    </div>
  );
};
