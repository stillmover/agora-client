import { MoreHorizontal, Bookmark, Eye, Flag, UserX, Share } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { logger } from "@/shared/services/logger";
import { usePostActions } from "@/features/post-actions";
import type { Post } from "@/entities/post";

interface PostMenuProps {
  post: Post;
}

export const PostMenu = ({ post }: PostMenuProps) => {
  const { save, share, saveLabel } = usePostActions(post.id);

  const handleHide = () => {
    logger.debug("Hide post:", post.id);
  };

  const handleReport = () => {
    logger.debug("Report post:", post.id);
  };

  const handleBlockUser = () => {
    logger.debug("Block user:", post.author.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={save}>
          <Bookmark className="mr-2 h-4 w-4" />
          <span>{saveLabel}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleHide}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Hide</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleReport}>
          <Flag className="mr-2 h-4 w-4" />
          <span>Report</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={share}>
          <Share className="mr-2 h-4 w-4" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleBlockUser} className="text-destructive">
          <UserX className="mr-2 h-4 w-4" />
          <span>Block u/{post.author.name}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
