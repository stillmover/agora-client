import { Link } from "@tanstack/react-router";
import {
  MessageSquare,
  Share2,
  Bookmark,
  Gift,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { formatCommentCount } from "@/shared/services";
import { logger } from "@/shared/services/logger";
import { usePostActions } from "../model/usePostActions";
import type { Post } from "@/entities/post";

type PostActionsProps = {
  post: Post;
};

type ActionButtonProps = {
  onClick?: () => void;
  isActive?: boolean;
  activeColor?: string;
  children: React.ReactNode;
  className?: string;
};

const ActionButton = ({
  onClick,
  isActive,
  activeColor = "text-brand",
  children,
  className,
}: ActionButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
      "transition-all duration-150",
      "hover:bg-accent",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "active:scale-95",
      isActive ? activeColor : "text-muted-foreground hover:text-foreground",
      className,
    )}
  >
    {children}
  </button>
);

export const PostActions = ({ post }: PostActionsProps) => {
  const { save, share, isSaved, saveLabel } = usePostActions(post.id);

  const handleAward = () => {
    logger.debug("Award post:", post.id);
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Comments */}
      <Link
        to="/post/$postId"
        params={{ postId: post.id }}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          "transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{formatCommentCount(post.comments)}</span>
      </Link>

      {/* Share */}
      <ActionButton onClick={share}>
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </ActionButton>

      {/* Save */}
      <ActionButton onClick={save} isActive={isSaved} activeColor="text-brand">
        <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
        <span className="hidden sm:inline">{saveLabel}</span>
      </ActionButton>

      {/* Award */}
      <ActionButton onClick={handleAward}>
        <Gift className="h-4 w-4" />
        <span className="hidden sm:inline">Award</span>
      </ActionButton>

      {/* More actions (hidden on mobile, shown on desktop) */}
      <ActionButton className="hidden lg:flex">
        <MoreHorizontal className="h-4 w-4" />
      </ActionButton>
    </div>
  );
};
