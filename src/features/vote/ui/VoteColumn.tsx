import { ChevronUp, ChevronDown } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { logger } from "@/shared/services/logger";
import { useVote } from "../model/useVote";
import type { VoteDirection } from "@/shared/constants";

type VoteColumnProps = {
  postId: string;
  score: number;
  userVote?: -1 | 0 | 1;
};

export const VoteColumn = ({ postId, score }: VoteColumnProps) => {
  const { vote, currentVote, hasUpvoted, hasDownvoted } = useVote(postId);

  const handleVote = async (direction: VoteDirection) => {
    try {
      await vote(direction);
    } catch (error) {
      // Error is already handled by the hook with optimistic updates
      logger.error("Failed to vote:", error);
    }
  };

  // Calculate optimistic score
  const optimisticScore = score + currentVote;

  return (
    <div
      className="flex flex-col items-center gap-1 py-2 px-1 min-w-[40px]"
      role="group"
      aria-label={`Vote on post with ${optimisticScore} points`}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote("up")}
        className={cn(
          "h-6 w-6 hover:bg-muted focus-visible:ring-2 focus-visible:ring-orange-500",
          hasUpvoted && "text-orange-500 hover:text-orange-600",
        )}
        aria-label={`Upvote post (${optimisticScore} points)`}
        aria-pressed={hasUpvoted}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      <span
        className={cn(
          "text-xs font-medium min-w-[24px] text-center leading-none",
          optimisticScore > 0 && "text-orange-500",
          optimisticScore < 0 && "text-blue-500",
        )}
        aria-label={`${optimisticScore} vote${Math.abs(optimisticScore) !== 1 ? "s" : ""}`}
      >
        {optimisticScore}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote("down")}
        className={cn(
          "h-6 w-6 hover:bg-muted focus-visible:ring-2 focus-visible:ring-blue-500",
          hasDownvoted && "text-blue-500 hover:text-blue-600",
        )}
        aria-label={`Downvote post (${optimisticScore} points)`}
        aria-pressed={hasDownvoted}
      >
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
};
